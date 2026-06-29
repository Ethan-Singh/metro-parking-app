export type Granularity = "TEN_MINUTE" | "HOURLY" | "DAILY";
export type Availability = "AVAILABLE" | "ALMOST_FULL" | "FULL";

export type Line = "M1" | "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9";
export type FacilityLines = Record<string, readonly Line[]>;

export interface ParkingOverview {
    slug: string;
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
