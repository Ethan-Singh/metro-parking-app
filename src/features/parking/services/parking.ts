// ─── Enums ───────────────────────────────────────────────────────────────────
// Mirrors Java enums exactly — don't rename these.

export type Status = "AVAILABLE" | "ALMOST_FULL" | "FULL";
export type StatusLabel = "Available" | "Almost full" | "Full";
export type Granularity = "TEN_MINUTE" | "HOURLY" | "DAILY";

// ─── Backend response shapes ──────────────────────────────────────────────────
// One type per backend DTO. Field names match the Java record fields verbatim
// (Jackson serialises camelCase by default, so asOf → asOf, etc.).

/** Maps to ParkingOverviewResponse */
export interface ParkingOverview {
    slug: string;
    facilityName: string;
    spots: number;
    occupancy: number;
    available: number;
    occupancyRate: number;        // 0–1 decimal
    status: Status;
    statusLabel: StatusLabel;
    approximation: string;
    asOf: string;                 // LocalDateTime → ISO-8601 string
    ariaLabel: string;
}

/** One row inside ParkingHistoryResponse.dataPoints */
export interface DataPoint {
    timestamp: string;            // LocalDateTime → ISO-8601 string
    occupancy: number;            // 0-1 decimal
    available: number;
    occupancyRate: number;        // 0–1 decimal
}

/** Maps to ParkingHistoryResponse */
export interface ParkingHistory {
    slug: string;
    date: string;                 // LocalDate → "YYYY-MM-DD"
    granularity: Granularity;
    dataPoints: DataPoint[];
}

/** Maps to ErrorResponse */
export interface ApiError {
    error: string;
    timestamp: string;            // Instant → ISO-8601 string
}