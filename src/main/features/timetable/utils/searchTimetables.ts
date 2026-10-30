import type {
  RealtimeOverlay,
  TimetablePackage,
  TimetableTrip,
} from '../api/types.ts';

export interface TimetableOption {
  trip: TimetableTrip;
  calls: TimetablePackage['calls'];
  departure: string;
  arrival: string;
  transfers: number;
  alertCount: number;
}

export function callsForTrip(pkg: TimetablePackage, trip: TimetableTrip) {
  const start = trip.stopCallStart ?? 0;
  const count = trip.stopCallCount ?? 0;
  return pkg.calls
    .slice(start, start + count)
    .filter((call) => call.tripId === trip.id);
}

function matchedAlertCount(
  trip: TimetableTrip,
  routeId: string,
  overlay?: RealtimeOverlay
) {
  if (!overlay) return 0;
  return overlay.alerts.filter((alert) =>
    alert.informedEntities.some(
      (target) =>
        target.matchStatus === 'MATCHED' &&
        target.feedKey === trip.id.split(':')[0] &&
        (target.tripId === trip.providerId ||
          target.tripId === trip.id ||
          target.routeId === routeId)
    )
  ).length;
}

export function findTimetableOptions(
  pkg: TimetablePackage,
  fromId: string,
  toId: string,
  after: string,
  minTransferSeconds: number,
  overlay?: RealtimeOverlay
): TimetableOption[] {
  const stops = new Map(pkg.stops.map((stop) => [stop.id, stop]));
  const requestedFrom = stops.get(fromId);
  const requestedTo = stops.get(toId);
  if (!requestedFrom || !requestedTo || fromId === toId) return [];
  const interchangeStops = (id: string) =>
    (pkg.interchanges ?? []).flatMap((link) => {
      if (link.fromStopId === id) return [link.toStopId];
      if (link.toStopId === id && link.bidirectional) return [link.fromStopId];
      return [];
    });
  const stopGroup = (id: string) => {
    const stop = stops.get(id);
    return pkg.stops
      .filter(
        (candidate) =>
          candidate.id === id ||
          candidate.parentStopId === id ||
          (stop?.parentStopId && candidate.parentStopId === stop.parentStopId)
      )
      .map((candidate) => candidate.id);
  };
  const fromMatches = new Set([
    requestedFrom.id,
    ...stopGroup(requestedFrom.id),
    ...interchangeStops(requestedFrom.id).flatMap(stopGroup),
  ]);
  const toMatches = new Set([
    requestedTo.id,
    ...stopGroup(requestedTo.id),
    ...interchangeStops(requestedTo.id).flatMap(stopGroup),
  ]);
  const routeById = new Map(pkg.routes.map((route) => [route.id, route]));
  const trips = pkg.trips
    .map((trip) => ({ trip, calls: callsForTrip(pkg, trip) }))
    .filter(({ trip, calls }) => {
      const route = routeById.get(trip.routeId);
      const description = `${trip.headsign} ${route?.shortName ?? ''} ${route?.name ?? ''}`;
      return (
        calls.length > 1 &&
        !/empty train|\bET\b|non[\s-]?revenue|\bNR\b|out[\s-]?of[\s-]?service|not[\s-]?in[\s-]?service|\bOOS\b/i.test(
          description
        )
      );
    });
  const departuresByStop = new Map<
    string,
    {
      trip: TimetableTrip;
      calls: TimetablePackage['calls'];
      index: number;
      time: number;
    }[]
  >();
  for (const entry of trips) {
    entry.calls.forEach((call, index) => {
      const departures = departuresByStop.get(call.stopId) ?? [];
      departures.push({
        ...entry,
        index,
        time: new Date(call.departure).getTime(),
      });
      departuresByStop.set(call.stopId, departures);
    });
  }
  for (const departures of departuresByStop.values()) {
    departures.sort((a, b) => a.time - b.time);
  }
  const options: TimetableOption[] = [];
  const addOption = (
    trip: TimetableTrip,
    calls: TimetablePackage['calls'],
    transfers: number
  ) => {
    const first = calls[0];
    const last = calls[calls.length - 1];
    if (!first || !last || first.departure < after) return;
    options.push({
      trip,
      calls,
      departure: first.departure,
      arrival: last.arrival,
      transfers,
      alertCount: matchedAlertCount(trip, trip.routeId, overlay),
    });
  };
  for (const { trip, calls } of trips) {
    for (let i = 0; i < calls.length - 1; i++) {
      if (!fromMatches.has(calls[i]!.stopId)) continue;
      const destination = calls.findIndex(
        (call, j) => j > i && toMatches.has(call.stopId)
      );
      if (destination > i) addOption(trip, calls.slice(i, destination + 1), 0);
    }
  }
  if (minTransferSeconds >= 0 && options.length < 12) {
    // Index departures by stop so the transfer search only inspects plausible connections.
    const maxTransferChecks = 40_000;
    const maxTransferOptions = 128;
    let transferChecks = 0;
    const directKeys = new Set(
      options.map(
        (o) => `${o.trip.id}:${o.calls[0]?.stopId}:${o.calls.at(-1)?.stopId}`
      )
    );
    transferSearch: for (const firstEntry of trips) {
      const firstCalls = firstEntry.calls;
      for (let i = 0; i < firstCalls.length - 1; i++) {
        if (
          !fromMatches.has(firstCalls[i]!.stopId) ||
          firstCalls[i]!.departure < after
        )
          continue;
        for (let j = i + 1; j < firstCalls.length; j++) {
          const transferStop = firstCalls[j]!.stopId;
          const equivalentStops = new Set([
            transferStop,
            ...stopGroup(transferStop),
            ...interchangeStops(transferStop),
          ]);
          const interchange = (pkg.interchanges ?? []).find(
            (link) =>
              (link.fromStopId === transferStop &&
                equivalentStops.has(link.toStopId)) ||
              (link.toStopId === transferStop &&
                (link.bidirectional || equivalentStops.has(link.fromStopId)))
          );
          const safeBuffer = Math.max(
            minTransferSeconds,
            interchange?.minimumTransferSeconds ?? 0
          );
          const earliestDeparture =
            new Date(firstCalls[j]!.arrival).getTime() + safeBuffer * 1000;
          const candidates: NonNullable<
            ReturnType<typeof departuresByStop.get>
          > = [];
          const remainingChecks = maxTransferChecks - transferChecks;
          for (const stopId of equivalentStops) {
            const departures = departuresByStop.get(stopId) ?? [];
            let low = 0;
            let high = departures.length;
            while (low < high) {
              const middle = (low + high) >>> 1;
              if (departures[middle]!.time < earliestDeparture)
                low = middle + 1;
              else high = middle;
            }
            candidates.push(...departures.slice(low, low + remainingChecks));
          }
          candidates.sort((a, b) => a.time - b.time);
          const seenCandidates = new Set<string>();
          for (const candidate of candidates) {
            if (transferChecks++ >= maxTransferChecks) break transferSearch;
            if (candidate.trip.id === firstEntry.trip.id) continue;
            const candidateKey = `${candidate.trip.id}:${candidate.index}`;
            if (seenCandidates.has(candidateKey)) continue;
            seenCandidates.add(candidateKey);
            const end = candidate.calls.findIndex(
              (call, index) =>
                index > candidate.index && toMatches.has(call.stopId)
            );
            if (end < 0) continue;
            const combined = [
              ...firstCalls.slice(i, j + 1),
              ...candidate.calls.slice(candidate.index + 1, end + 1),
            ];
            const key = `${firstEntry.trip.id}:${combined[0]?.stopId}:${combined.at(-1)?.stopId}`;
            if (directKeys.has(key)) continue;
            options.push({
              trip: firstEntry.trip,
              calls: combined,
              departure: combined[0]!.departure,
              arrival: combined.at(-1)!.arrival,
              transfers: 1,
              alertCount:
                matchedAlertCount(
                  firstEntry.trip,
                  firstEntry.trip.routeId,
                  overlay
                ) +
                matchedAlertCount(
                  candidate.trip,
                  candidate.trip.routeId,
                  overlay
                ),
            });
            if (options.length >= maxTransferOptions) break transferSearch;
          }
        }
      }
    }
  }
  return options
    .sort(
      (a, b) =>
        a.alertCount - b.alertCount ||
        a.departure.localeCompare(b.departure) ||
        a.arrival.localeCompare(b.arrival)
    )
    .slice(0, 8)
    .map((option) => ({
      ...option,
      trip: {
        ...option.trip,
        headsign: `${routeById.get(option.trip.routeId)?.shortName || routeById.get(option.trip.routeId)?.name || option.trip.headsign}`,
      },
    }));
}
