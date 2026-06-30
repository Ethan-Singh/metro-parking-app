export type Granularity = 'TEN_MINUTE' | 'HOURLY' | 'DAILY';
export type Availability = 'AVAILABLE' | 'ALMOST_FULL' | 'FULL';

export type FacilitySlug = keyof typeof String;

export interface ParkingOverview {
  slug: FacilitySlug;
  facilityName: string;
  spots: number;
  occupancy: number;
  available: number;
  occupancyRate: number;
  availability: Availability;
  timestamp: string;
  ariaLabel: string;
}

export interface DataPoint {
  timestamp: string;
  occupancy: number;
  available: number;
  occupancyRate: number;
}

export interface ParkingHistory {
  slug: string;
  date: string;
  granularity: Granularity;
  dataPoints: DataPoint[];
}

export interface ApiError {
  error: string;
  timestamp: string;
}
