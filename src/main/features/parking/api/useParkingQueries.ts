import { parkingApi } from './parkingApi.ts';
import { queryDefaults } from './queryDefaults.ts';
import type { FacilitySlug, HistoryRangeDays, ParkingHistory, RequestedHistoryResolution } from '../types.ts';
import { useQuery } from '@tanstack/react-query';
import { sydneyDateDaysAgo } from '../utils/sydneyTime.ts';

export const parkingKeys = {
  all: () => ['parking'] as const,
  list: () => [...parkingKeys.all(), 'list'] as const,
  live: (slug: FacilitySlug) => [...parkingKeys.all(), 'live', slug] as const,
  history: (slug: FacilitySlug, from: string, to: string, rangeDays: HistoryRangeDays, resolution: RequestedHistoryResolution) =>
    [...parkingKeys.all(), 'history', slug, from, to, rangeDays, resolution] as const,
};

export function useParkingQueries(enabled = true) {
  return useQuery({
    queryKey: parkingKeys.list(),
    queryFn: parkingApi.getAll,
    enabled,
    ...queryDefaults.live,
  });
}

export function useFacilityLive(slug: FacilitySlug | undefined) {
  return useQuery({
    queryKey: parkingKeys.live(slug ?? ''),
    queryFn: () => parkingApi.getLive(slug!),
    enabled: Boolean(slug),
    ...queryDefaults.live,
  });
}

export function useFacilityHistory(
  slug: FacilitySlug | undefined,
  rangeDays: HistoryRangeDays,
  resolution: RequestedHistoryResolution
) {
  const from = sydneyDateDaysAgo(rangeDays - 1);
  const to = sydneyDateDaysAgo(0);

  return useQuery<ParkingHistory>({
    queryKey: parkingKeys.history(slug ?? '', from, to, rangeDays, resolution),
    queryFn: () => parkingApi.getHistory(slug!, from, to, resolution),
    enabled: Boolean(slug),
    ...queryDefaults.history,
  });
}

/** Load fine-grained daily samples for commuter metrics and the Quick view chart. */
export function useFacilityRecentHistory(slug: FacilitySlug | undefined, days: 1 | 3, enabled: boolean) {
  const to = sydneyDateDaysAgo(0);
  const from = sydneyDateDaysAgo(days - 1);
  return useQuery<ParkingHistory>({
    queryKey: parkingKeys.history(slug ?? '', from, to, days, 'TEN_MINUTE'),
    queryFn: async () => {
      const dates = Array.from({ length: days }, (_, index) => sydneyDateDaysAgo(days - index - 1));
      const histories = await Promise.all(
        dates.map((date) => parkingApi.getHistory(slug!, date, date, 'TEN_MINUTE'))
      );
      const coarseHistory = histories.find((history) => history.resolution !== 'TEN_MINUTE');
      return {
        from,
        to,
        resolution: coarseHistory?.resolution ?? 'TEN_MINUTE',
        points: histories.flatMap((history) => history.points).sort(([left], [right]) => left - right),
      };
    },
    enabled: Boolean(slug) && enabled,
    ...queryDefaults.history,
    gcTime: queryDefaults.history.gcTime,
  });
}
