import { describe, expect, it } from 'vitest';
import {
  formatSydneyTime,
  sydneyDate,
  sydneyDateDaysAgo,
} from '../../../../main/features/parking/utils/sydneyTime.ts';

describe('Sydney time utilities', () => {
  it('uses the Sydney calendar day when UTC is still on the previous date', () => {
    expect(sydneyDate(Date.parse('2026-01-01T13:30:00Z'))).toBe('2026-01-02');
  });

  it('subtracts calendar days across month and leap-day boundaries', () => {
    expect(sydneyDateDaysAgo(1, Date.parse('2024-03-01T12:00:00Z'))).toBe('2024-02-29');
  });

  it('formats times in Sydney regardless of the host timezone', () => {
    expect(
      formatSydneyTime(Date.parse('2026-01-01T13:05:00Z'), {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      })
    ).toBe('00:05');
  });
});
