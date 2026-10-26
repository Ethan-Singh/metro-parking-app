import type {
  DailyParkingMetrics,
  FacilitySlug,
  LiveCarPark,
  ParkingHistory,
  RequestedHistoryResolution,
} from '../types.ts';
import { httpGet } from '../../../services/httpClient.ts';

const BASE = (import.meta.env.VITE_API_BASE || '/api/v1/parking').replace(/\/$/, '');

export const parkingApi = {
  getAll: (): Promise<LiveCarPark[]> => httpGet<LiveCarPark[]>(BASE),

  getLive: (slug: FacilitySlug): Promise<LiveCarPark> =>
    httpGet<LiveCarPark>(`${BASE}/${encodeURIComponent(slug)}/live`),

  getDailyMetrics: (
    slug: FacilitySlug,
    from: string,
    to: string
  ): Promise<DailyParkingMetrics> => {
    const params = new URLSearchParams({ from, to });
    return httpGet<DailyParkingMetrics>(
      `${BASE}/${encodeURIComponent(slug)}/metrics/daily?${params}`
    );
  },

  getHistory: (
    slug: FacilitySlug,
    from: string,
    to: string,
    resolution: RequestedHistoryResolution = 'AUTO'
  ): Promise<ParkingHistory> => {
    const params = new URLSearchParams({ from, to, resolution });
    return httpGet<ParkingHistory>(
      `${BASE}/${encodeURIComponent(slug)}/history?${params}`
    );
  },
};
