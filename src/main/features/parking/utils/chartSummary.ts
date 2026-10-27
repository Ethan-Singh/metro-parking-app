import type { HistoryPoint } from '../types.ts';
import { formatSydneyTime } from './sydneyTime.ts';

export function summarizeOccupancyHistory(points: readonly HistoryPoint[]) {
  if (points.length === 0) return 'No occupancy samples are available.';

  const percentages = points.map(([, rate]) => rate * 100);
  const latest = points[points.length - 1];
  const lastTime = formatSydneyTime(latest[0], {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${points.length} samples. Occupancy ranged from ${Math.min(...percentages).toFixed(1)}% to ${Math.max(...percentages).toFixed(1)}%. The latest sample was ${(latest[1] * 100).toFixed(1)}% occupied at ${lastTime}.`;
}
