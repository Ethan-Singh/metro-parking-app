export type FacilityStatus = "AVAILABLE" | "ALMOST_FULL";

export interface Facility {
    slug: string;
    facilityName: string;
    spots: number;
    occupancy: number;
    available: number;
    occupancyRate: number;
    status: FacilityStatus;
    statusLabel: string;
    asOf: string;
    ariaLabel: string;
}

export interface FacilityHistoryPoint {
    timestamp: string;
    occupancy: number;
    available: number;
    occupancyRate: number;
}

export interface FacilityHistory {
    slug: string;
    date: string;
    granularity: string;
    dataPoints: FacilityHistoryPoint[];
}