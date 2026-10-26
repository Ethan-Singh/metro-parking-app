import type { HistoryRangeDays, RequestedHistoryResolution } from '../types.ts';

export const MAX_HISTORY_POINTS = 200;

const SAMPLES_PER_DAY: Record<Exclude<RequestedHistoryResolution, 'AUTO'>, number> = {
  TEN_MINUTE: 144,
  ONE_HOUR: 24,
  SIX_HOUR: 4,
  TWELVE_HOUR: 2,
  TWENTY_FOUR_HOUR: 1,
};

const FINE_TO_COARSE: readonly Exclude<RequestedHistoryResolution, 'AUTO'>[] = [
  'TEN_MINUTE',
  'ONE_HOUR',
  'SIX_HOUR',
  'TWELVE_HOUR',
  'TWENTY_FOUR_HOUR',
];

export function supportsHistoryResolution(days: HistoryRangeDays, resolution: RequestedHistoryResolution) {
  return resolution === 'AUTO' || days * SAMPLES_PER_DAY[resolution] <= MAX_HISTORY_POINTS;
}

export function finestSupportedHistoryResolution(days: HistoryRangeDays): RequestedHistoryResolution {
  return FINE_TO_COARSE.find((resolution) => supportsHistoryResolution(days, resolution)) ?? 'AUTO';
}

export function supportedHistoryResolutionOrFallback(
  days: HistoryRangeDays,
  resolution: RequestedHistoryResolution,
) {
  return supportsHistoryResolution(days, resolution) ? resolution : finestSupportedHistoryResolution(days);
}
