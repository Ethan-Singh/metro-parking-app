import type {
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
