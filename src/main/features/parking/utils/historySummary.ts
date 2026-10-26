import type { HistoryPoint } from '../types.ts';
import { sydneyDate } from './sydneyTime.ts';

export interface DailyHistoryMetrics {
  date: string;
  expectedFreeAt7am: number | null;
  expectedFreeAt8am: number | null;
  crossed50AtMs: number | null;
  crossed90AtMs: number | null;
  fullAtMs: number | null;
}

function localMinutes(timeMs: number) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(timeMs);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return get('hour') * 60 + get('minute');
}

function expectedFree(points: readonly HistoryPoint[], targetHour: number) {
  const target = targetHour * 60;
  const nearest = points
    .map(([timeMs, , available]) => ({ available, distance: Math.abs(localMinutes(timeMs) - target) }))
    .filter(({ distance }) => distance <= 20)
    .sort((left, right) => left.distance - right.distance)[0];
  return nearest?.available ?? null;
}

export function buildDailyHistoryMetrics(points: readonly HistoryPoint[], from?: string, to?: string): DailyHistoryMetrics[] {
  const byDate = new Map<string, HistoryPoint[]>();
  for (const point of points) {
    const date = sydneyDate(point[0]);
    const dayPoints = byDate.get(date) ?? [];
    dayPoints.push(point);
    byDate.set(date, dayPoints);
  }

  if (from && to) {
    const date = new Date(`${from}T00:00:00Z`);
    const end = new Date(`${to}T00:00:00Z`);
    while (date <= end) {
      const key = date.toISOString().slice(0, 10);
      if (!byDate.has(key)) byDate.set(key, []);
      date.setUTCDate(date.getUTCDate() + 1);
    }
  }

  return [...byDate.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, dayPoints]) => {
      let crossed50AtMs: number | null = null;
      let crossed90AtMs: number | null = null;
      let fullAtMs: number | null = null;
      for (const [timeMs, rate] of dayPoints.sort(([left], [right]) => left - right)) {
        if (crossed50AtMs === null && rate >= 0.5) crossed50AtMs = timeMs;
        if (crossed90AtMs === null && rate >= 0.9) crossed90AtMs = timeMs;
        if (fullAtMs === null && rate >= 1) fullAtMs = timeMs;
      }

      return {
        date,
        expectedFreeAt7am: expectedFree(dayPoints, 7),
        expectedFreeAt8am: expectedFree(dayPoints, 8),
        crossed50AtMs,
        crossed90AtMs,
        fullAtMs,
      };
    });
}
