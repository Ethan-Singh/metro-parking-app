export type AvailabilityStatus = 'AVAILABLE' | 'ALMOST_FULL' | 'FULL';
export type Granularity = 'TEN_MINUTE' | 'HOURLY' | 'DAILY';

export interface Facility {
    slug: string;
    facilityName: string;
    spots: number;
    occupancy: number;
    available: number;
    occupancyRate: number;
    status: AvailabilityStatus;
    statusLabel: string;
    approximation: string;
    asOf: string; // LocalDateTime from Java becomes ISO string
    ariaLabel: string;
}

export interface DataPoint {
    timestamp: string; // LocalDateTime from Java becomes ISO string
    occupancy: number;
    available: number;
    occupancyRate: number;
}

export interface ParkingHistoryResponse {
    slug: string;
    date: string; // LocalDate from Java becomes ISO string (YYYY-MM-DD)
    granularity: Granularity;
    dataPoints: DataPoint[];
}

export type FacilityOverview = Facility;
export type FacilityHistory = ParkingHistoryResponse;
export type FacilityHistoryPoint = DataPoint;

export interface ErrorResponse {
    error: string;
    timestamp: string;
}

export interface ApiError {
    status: number;
    message: string;
    details?: ErrorResponse;
}