import { describe, expect, it } from 'vitest';
import { getSydneyWeekDates } from '../../../../main/features/timetable/utils/weekDates.ts';

describe('getSydneyWeekDates', () => {
  it('returns seven consecutive days starting Monday', () => {
    expect(getSydneyWeekDates('2026-10-31')).toEqual([
      '2026-10-26',
      '2026-10-27',
      '2026-10-28',
      '2026-10-29',
      '2026-10-30',
      '2026-10-31',
      '2026-11-01',
    ]);
  });

  it('pages to the next complete week without extending the current strip', () => {
    const current = getSydneyWeekDates('2026-10-31');
    const next = getSydneyWeekDates('2026-10-31', 1);

    expect(next).toHaveLength(7);
    expect(next[0]).toBe('2026-11-02');
    expect(next.at(-1)).toBe('2026-11-08');
    expect(next).not.toContain(current.at(-1));
  });
});
