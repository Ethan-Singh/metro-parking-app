import type { DataPoint } from '../types';

export interface HistorySummary {
  availableAt7am: number | null;
  availableAt8am: number | null;

  halfFullTime: Date | null;
  threeQuarterFullTime: Date | null;
  ninetyPercentTime: Date | null;

  peakOccupancyRate: number;
  peakTime: Date | null;

  lowestAvailable: number | null;
}

function getDateParts(ts: string) {
  const d = new Date(ts);
  return {
    dateKey: d.toISOString().slice(0, 10),
    hour: d.getHours(),
    minute: d.getMinutes(),
    date: d,
  };
}

function isBetter(
  current: DataPoint | undefined,
  candidate: DataPoint,
  targetMinutes: number
) {
  if (!current) return true;

  const c = new Date(current.timestamp);
  const cMinutes = c.getHours() * 60 + c.getMinutes();

  const n = new Date(candidate.timestamp);
  const nMinutes = n.getHours() * 60 + n.getMinutes();

  return (
    Math.abs(nMinutes - targetMinutes) < Math.abs(cMinutes - targetMinutes)
  );
}

export function buildHistorySummary(
  dataPoints: readonly DataPoint[]
): HistorySummary {
  let halfFullTime: Date | null = null;
  let threeQuarterFullTime: Date | null = null;
  let ninetyPercentTime: Date | null = null;

  let peakOccupancyRate = -Infinity;
  let peakTime: Date | null = null;

  let lowestAvailable = Infinity;

  const best7am: Record<string, DataPoint> = {};
  const best8am: Record<string, DataPoint> = {};

  for (const point of dataPoints) {
    const { dateKey, hour, date } = getDateParts(point.timestamp);

    const target7 = 7 * 60;
    const target8 = 8 * 60;

    // 7AM closest snapshot per day
    if (hour >= 7 && isBetter(best7am[dateKey], point, target7)) {
      best7am[dateKey] = point;
    }

    // 8AM closest snapshot per day
    if (hour >= 8 && isBetter(best8am[dateKey], point, target8)) {
      best8am[dateKey] = point;
    }

    // thresholds
    if (halfFullTime === null && point.occupancyRate >= 0.5) {
      halfFullTime = date;
    }

    if (threeQuarterFullTime === null && point.occupancyRate >= 0.75) {
      threeQuarterFullTime = date;
    }

    if (ninetyPercentTime === null && point.occupancyRate >= 0.9) {
      ninetyPercentTime = date;
    }

    // peak
    if (point.occupancyRate > peakOccupancyRate) {
      peakOccupancyRate = point.occupancyRate;
      peakTime = date;
    }

    // lowest availability
    lowestAvailable = Math.min(lowestAvailable, point.available);
  }

  const first7am = Object.values(best7am)[0] ?? null;
  const first8am = Object.values(best8am)[0] ?? null;

  return {
    availableAt7am: first7am?.available ?? null,
    availableAt8am: first8am?.available ?? null,

    halfFullTime,
    threeQuarterFullTime,
    ninetyPercentTime,

    peakOccupancyRate: peakOccupancyRate === -Infinity ? 0 : peakOccupancyRate,

    peakTime,

    lowestAvailable: lowestAvailable === Infinity ? null : lowestAvailable,
  };
}
