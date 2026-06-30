import type {FacilitySlug, Granularity, ParkingHistory, ParkingOverview} from "../types.ts";
import { httpGet } from "../../../services/httpClient.ts";

const BASE = "/api/v1/parking";

function toParkingOverview(dto: ParkingOverview): ParkingOverview {
    return {
        ...dto,
        slug: dto.slug as FacilitySlug,
        facilityName: dto.facilityName.replace(/^Park&Ride\s*-\s*/, ""),
    };
}

export const parkingApi = {
    getAll: async (): Promise<ParkingOverview[]> => {
        const facilities = await httpGet<ParkingOverview[]>(BASE);
        return facilities.map(toParkingOverview);
    },

    getOverview: async (slug: FacilitySlug): Promise<ParkingOverview> => {
        const facility = await httpGet<ParkingOverview>(
            `${BASE}/${slug}/overview`
        );
        return toParkingOverview(facility);
    },
    getHistory: (
        slug: FacilitySlug,
        from: string,
        to: string,
        granularity: Granularity = "TEN_MINUTE",
    ): Promise<ParkingHistory> => {
        const params = new URLSearchParams({ from, to, granularity });
        return httpGet<ParkingHistory>(`${BASE}/${slug}/history?${params}`);
    },
};