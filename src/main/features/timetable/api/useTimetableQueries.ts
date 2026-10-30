import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { timetableApi } from './timetableApi.ts';
import type { TimetableOfferingKey } from './types.ts';

export const timetableKeys = {
  manifest: ['timetable', 'manifest'] as const,
  package: (date: string, offering: TimetableOfferingKey) =>
    ['timetable', 'package', date, offering] as const,
  realtime: (offering: TimetableOfferingKey) =>
    ['timetable', 'realtime', offering] as const,
};

export function useTimetableManifest() {
  return useQuery({
    queryKey: timetableKeys.manifest,
    queryFn: timetableApi.getManifest,
    staleTime: 5 * 60_000,
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });
}

export function useTimetablePackage(
  date: string,
  offering: TimetableOfferingKey
) {
  return useQuery({
    queryKey: timetableKeys.package(date, offering),
    queryFn: () => timetableApi.getPackage(date, offering),
    enabled: Boolean(date),
    staleTime: 30 * 60_000,
    refetchInterval: false,
    refetchOnWindowFocus: true,
  });
}

function mergePackages(
  trains: ReturnType<typeof useTimetablePackage>['data'],
  metro: ReturnType<typeof useTimetablePackage>['data']
) {
  if (!trains) return metro;
  if (!metro) return trains;
  return {
    ...trains,
    availability:
      trains.availability === 'AVAILABLE' || metro.availability === 'AVAILABLE'
        ? ('AVAILABLE' as const)
        : ('PARTIAL' as const),
    offerings: [...trains.offerings, ...metro.offerings],
    offeringStatuses: [...trains.offeringStatuses, ...metro.offeringStatuses],
    sources: [...(trains.sources ?? []), ...(metro.sources ?? [])],
    stops: [...trains.stops, ...metro.stops],
    routes: [...trains.routes, ...metro.routes],
    trips: [...trains.trips, ...metro.trips],
    calls: [...trains.calls, ...metro.calls],
    interchanges: [
      ...(trains.interchanges ?? []),
      ...(metro.interchanges ?? []),
    ],
  };
}

export function useSydneyNetworkPackages(dates: string[]) {
  const results = useQueries({
    queries: dates.flatMap((date) =>
      (['SYDNEY_TRAINS', 'SYDNEY_METRO'] as const).map((offering) => ({
        queryKey: timetableKeys.package(date, offering),
        queryFn: () => timetableApi.getPackage(date, offering),
        enabled: Boolean(date),
        staleTime: 30 * 60_000,
        refetchInterval: false,
        refetchOnWindowFocus: true,
      }))
    ),
  });
  const data = useMemo(
    () =>
      dates.map((date, index) => ({
        date,
        data: mergePackages(
          results[index * 2]?.data,
          results[index * 2 + 1]?.data
        ),
        isLoading:
          results[index * 2]?.isLoading || results[index * 2 + 1]?.isLoading,
        isError: results[index * 2]?.isError && results[index * 2 + 1]?.isError,
      })),
    [dates, results]
  );
  return {
    data,
    isLoading: results.some((result) => result.isLoading),
    isError: results.length > 0 && results.every((result) => result.isError),
  };
}

export function useTimetableRealtime(offering: TimetableOfferingKey) {
  return useQuery({
    queryKey: timetableKeys.realtime(offering),
    queryFn: () => timetableApi.getRealtime(offering),
    staleTime: 60_000,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useSydneyNetworkPackage(date: string) {
  const trains = useTimetablePackage(date, 'SYDNEY_TRAINS');
  const metro = useTimetablePackage(date, 'SYDNEY_METRO');
  const data = useMemo(
    () => mergePackages(trains.data, metro.data),
    [trains.data, metro.data]
  );
  return {
    data,
    isLoading: trains.isLoading || metro.isLoading,
    isError: trains.isError && metro.isError,
  };
}

export function useSydneyNetworkRealtime() {
  const trains = useTimetableRealtime('SYDNEY_TRAINS');
  const metro = useTimetableRealtime('SYDNEY_METRO');
  const data = useMemo(
    () =>
      trains.data && metro.data
        ? {
            ...trains.data,
            overlayVersion: `${trains.data.overlayVersion}+${metro.data.overlayVersion}`,
            sources: [...trains.data.sources, ...metro.data.sources],
            alerts: [...trains.data.alerts, ...metro.data.alerts],
            tripUpdates: [
              ...trains.data.tripUpdates,
              ...metro.data.tripUpdates,
            ],
            vehiclePositions: [
              ...trains.data.vehiclePositions,
              ...metro.data.vehiclePositions,
            ],
          }
        : (trains.data ?? metro.data),
    [trains.data, metro.data]
  );
  return {
    data,
    isLoading: trains.isLoading || metro.isLoading,
    isError: trains.isError && metro.isError,
  };
}
