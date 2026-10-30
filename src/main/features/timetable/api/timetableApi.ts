import { httpGet } from '../../../services/httpClient.ts';
import type {
  RealtimeOverlay,
  TimetableManifest,
  TimetableOfferingKey,
  TimetablePackage,
} from './types.ts';

const BASE = (import.meta.env.VITE_API_BASE || '/api/v1/parking')
  .replace(/\/$/, '')
  .replace(/\/parking$/, '/timetable');

export const timetableApi = {
  getManifest: () => httpGet<TimetableManifest>(`${BASE}/manifest`),
  getPackage: (date: string, offering: TimetableOfferingKey) => {
    const query = new URLSearchParams({ offering });
    return httpGet<TimetablePackage>(
      `${BASE}/packages/${encodeURIComponent(date)}?${query}`
    );
  },
  getRealtime: (offering: TimetableOfferingKey) => {
    const query = new URLSearchParams({ offering });
    return httpGet<RealtimeOverlay>(`${BASE}/realtime?${query}`);
  },
};
