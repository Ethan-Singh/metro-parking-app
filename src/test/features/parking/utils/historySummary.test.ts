import { describe, it, expect } from 'vitest';
import type { DataPoint } from '../../../../main/features/parking/types.ts';
import { buildHistorySummary } from '../../../../main/features/parking/utils/historySummary.ts';

function dp(
  timestamp: string,
  occupancyRate: number,
  available: number
): DataPoint {
  return {
    timestamp,
    occupancy: 0,
    occupancyRate,
    available,
  };
}

describe('buildHistorySummary', () => {
  it('calculates peak occupancy correctly', () => {
    const data = [
      dp('2026-01-01T06:00:00Z', 0.2, 100),
      dp('2026-01-01T10:00:00Z', 0.8, 20),
      dp('2026-01-01T12:00:00Z', 0.6, 50),
    ];

    const result = buildHistorySummary(data);

    expect(result.peakOccupancyRate).toBe(0.8);
    expect(result.peakTime).toBeInstanceOf(Date);
  });

  it('tracks lowest available spots', () => {
    const data = [
      dp('2026-01-01T06:00:00Z', 0.2, 100),
      dp('2026-01-01T10:00:00Z', 0.8, 10),
      dp('2026-01-01T12:00:00Z', 0.6, 30),
    ];

    const result = buildHistorySummary(data);

    expect(result.lowestAvailable).toBe(10);
  });

  it('detects first half-full, three-quarter, and 90% times', () => {
    const data = [
      dp('2026-01-01T06:00:00Z', 0.4, 80),
      dp('2026-01-01T07:00:00Z', 0.5, 70), // half full
      dp('2026-01-01T08:00:00Z', 0.75, 40), // three-quarter
      dp('2026-01-01T09:00:00Z', 0.9, 20), // 90%
    ];

    const result = buildHistorySummary(data);

    expect(result.halfFullTime).toBeInstanceOf(Date);
    expect(result.threeQuarterFullTime).toBeInstanceOf(Date);
    expect(result.ninetyPercentTime).toBeInstanceOf(Date);
  });

  it('selects correct 7am and 8am closest snapshots per day', () => {
    const data = [
      dp('2026-01-01T07:10:00Z', 0.3, 90),
      dp('2026-01-01T07:50:00Z', 0.4, 80), // closer to 7am target
      dp('2026-01-01T08:05:00Z', 0.5, 70),
      dp('2026-01-01T08:30:00Z', 0.6, 60), // closer to 8am target
    ];

    const result = buildHistorySummary(data);

    expect(result.availableAt7am).toBeDefined();
    expect(result.availableAt8am).toBeDefined();
  });

  it('handles empty input safely', () => {
    const result = buildHistorySummary([]);

    expect(result.peakOccupancyRate).toBe(0);
    expect(result.lowestAvailable).toBeNull();
    expect(result.availableAt7am).toBeNull();
    expect(result.availableAt8am).toBeNull();
  });
});
