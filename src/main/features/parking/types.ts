import type { components } from './api/openapi.generated.ts';

/** Contract types generated from the backend's published OpenAPI document. */
export type FacilitySlug = components['schemas']['LiveCarPark']['slug'];
export type Availability = components['schemas']['LiveCarPark']['availability'];
export type LiveCarPark = components['schemas']['LiveCarPark'];
export type RequestedHistoryResolution =
  components['schemas']['RequestedHistoryResolution'];
export type ResolvedHistoryResolution =
  components['schemas']['ResolvedHistoryResolution'];
export type HistoryRangeDays = 1 | 3 | 7 | 14 | 31;
export type HistoryPoint = components['schemas']['HistoryPoint'];
export type ParkingHistory = components['schemas']['ParkingHistory'];
export type ApiError = components['schemas']['ErrorResponse'];
