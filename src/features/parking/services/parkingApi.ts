import type {Granularity, ParkingHistory, ParkingOverview} from "../utils/types.ts";
import {httpGet} from "../../../services/httpClient.ts";

const BASE = "/api/v1/parking";

export const parkingApi = {
    /** GET /api/v1/parking  →  list of all facilities (overview shape) */
    getAll: (): Promise<ParkingOverview[]> =>
        httpGet(`${BASE}`),

    /** GET /api/v1/parking/:slug/overview */
    getOverview: (slug: string): Promise<ParkingOverview> =>
        httpGet(`${BASE}/${slug}/overview`),

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