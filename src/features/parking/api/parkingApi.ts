import type {Granularity, ParkingHistory, ParkingOverview} from "../types.ts";
import {httpGet} from "../../../services/httpClient.ts";

const BASE = "/api/v1/parking";

function toParkingOverview(dto: ParkingOverview): ParkingOverview {
    return {
        ...dto,
        facilityName: dto.facilityName.replace(/^Park&Ride\s*-\s*/, ""),
    };
}

export const parkingApi = {
    getAll: async (): Promise<ParkingOverview[]> => {
        const facilities = await httpGet<ParkingOverview[]>(BASE);
        return facilities.map(toParkingOverview);
    },

    getOverview: async (slug: string): Promise<ParkingOverview> => {
        const facility = await httpGet<ParkingOverview>(
            `${BASE}/${slug}/overview`
        );
        return toParkingOverview(facility);
    },

    getHistory: (
        slug: string,
        from: string,
        to: string,
        granularity: Granularity = "TEN_MINUTE",
    ): Promise<ParkingHistory> => {
        const params = new URLSearchParams({ from, to, granularity });
        return httpGet(`${BASE}/${slug}/history?${params}`);
    },
};