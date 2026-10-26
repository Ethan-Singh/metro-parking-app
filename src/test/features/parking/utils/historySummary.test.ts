import { describe, it, expect } from 'vitest';
import { buildDailyHistoryMetrics } from '../../../../main/features/parking/utils/historySummary.ts';

describe('buildDailyHistoryMetrics', () => {
  it('keeps expected free counts and threshold crossings separate by Sydney day', () => {
    const monday7am = Date.parse('2026-10-25T20:00:00Z');
    const monday8am = Date.parse('2026-10-25T21:00:00Z');
    const mondayHalf = Date.parse('2026-10-25T22:51:00Z');
    const monday90 = Date.parse('2026-10-26T02:00:00Z');
    const mondayFull = Date.parse('2026-10-26T02:30:00Z');
    const tuesday7am = Date.parse('2026-10-26T20:00:00Z');
    const tuesday8am = Date.parse('2026-10-26T21:00:00Z');
    const tuesdayHalf = Date.parse('2026-10-26T23:00:00Z');

    const [monday, tuesday] = buildDailyHistoryMetrics([
      [monday7am, 0.2, 179],
      [monday8am, 0.3, 136],
      [mondayHalf, 0.5, 100],
      [monday90, 0.9, 50],
      [mondayFull, 1, 0],
      [tuesday7am, 0.2, 163],
      [tuesday8am, 0.3, 121],
      [tuesdayHalf, 0.5, 80],
    ]);

    expect(monday).toMatchObject({
      date: '2026-10-26',
      expectedFreeAt7am: 179,
      expectedFreeAt8am: 136,
      crossed50AtMs: mondayHalf,
      crossed90AtMs: monday90,
      fullAtMs: mondayFull,
    });
    expect(tuesday).toMatchObject({
      date: '2026-10-27',
      expectedFreeAt7am: 163,
      expectedFreeAt8am: 121,
      crossed50AtMs: tuesdayHalf,
      crossed90AtMs: null,
      fullAtMs: null,
    });
  });

  it('returns no commuter metrics for an empty range', () => {
    expect(buildDailyHistoryMetrics([])).toEqual([]);
  });

  it('keeps requested dates visible when a day has no samples', () => {
    const metrics = buildDailyHistoryMetrics([], '2026-10-25', '2026-10-27');
    expect(metrics.map(({ date, fullAtMs }) => ({ date, fullAtMs }))).toEqual([
      { date: '2026-10-25', fullAtMs: null },
      { date: '2026-10-26', fullAtMs: null },
      { date: '2026-10-27', fullAtMs: null },
    ]);
  });
});
