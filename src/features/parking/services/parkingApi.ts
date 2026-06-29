import type {Granularity, ParkingHistory, ParkingOverview} from "../utils/types.ts";
import {httpGet} from "../../../services/httpClient.ts";

const BASE = "/api/v1/parking";

function toParkingOverview(dto: ParkingOverview): ParkingOverview {
    return {
        ...dto,
        facilityName: dto.facilityName.replace(/^Park&Ride\s*-\s*/, ""),
    };
}

export const parkingApi = {
    /** GET /api/v1/parking  →  list of all facilities (overview shape) */
    getAll: async (): Promise<ParkingOverview[]> => {
        const facilities = await httpGet<ParkingOverview[]>(BASE);
        return facilities.map(toParkingOverview);
    },

    /** GET /api/v1/parking/:slug/overview */
    getOverview: async (slug: string): Promise<ParkingOverview> => {
        const facility = await httpGet<ParkingOverview>(
            `${BASE}/${slug}/overview`
        );
        return toParkingOverview(facility);
    },

    /** GET /api/v1/parking/:slug/history?from=&to=&granularity= */
    getHistory: (
        slug: string,
        from: string,       // "YYYY-MM-DD"
        to: string,         // "YYYY-MM-DD"
        granularity: Granularity = "TEN_MINUTE",
    ): Promise<ParkingHistory> => {
        const params = new URLSearchParams({ from, to, granularity });
        return httpGet(`${BASE}/${slug}/history?${params}`);
    },
};