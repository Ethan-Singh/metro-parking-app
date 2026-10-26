import { describe, expect, it } from 'vitest';
import {
  finestSupportedHistoryResolution,
  supportsHistoryResolution,
  supportedHistoryResolutionOrFallback,
} from '../../../../main/features/parking/utils/historyResolution.ts';

describe('history resolution point limits', () => {
  it('greys out intervals that would exceed the 200-point API cap', () => {
    expect(supportsHistoryResolution(1, 'TEN_MINUTE')).toBe(true);
    expect(supportsHistoryResolution(7, 'TEN_MINUTE')).toBe(false);
    expect(supportsHistoryResolution(7, 'ONE_HOUR')).toBe(true);
    expect(supportsHistoryResolution(14, 'ONE_HOUR')).toBe(false);
    expect(supportsHistoryResolution(14, 'SIX_HOUR')).toBe(true);
    expect(supportsHistoryResolution(31, 'SIX_HOUR')).toBe(true);
    expect(supportsHistoryResolution(31, 'AUTO')).toBe(true);
  });

  it('falls back to the finest supported interval when the range grows', () => {
    expect(supportedHistoryResolutionOrFallback(7, 'TEN_MINUTE')).toBe('ONE_HOUR');
    expect(supportedHistoryResolutionOrFallback(14, 'ONE_HOUR')).toBe('SIX_HOUR');
    expect(supportedHistoryResolutionOrFallback(31, 'TWELVE_HOUR')).toBe('TWELVE_HOUR');
    expect(finestSupportedHistoryResolution(1)).toBe('TEN_MINUTE');
    expect(finestSupportedHistoryResolution(31)).toBe('SIX_HOUR');
  });
});
