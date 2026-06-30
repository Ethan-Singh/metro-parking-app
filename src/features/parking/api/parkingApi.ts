import type { Granularity, ParkingHistory, ParkingOverview } from "../types.ts";
import type { FacilitySlug } from "../config/lineConfig.ts";
import { httpGet } from "../../../services/httpClient.ts";
import { facilityLines } from "../config/lineConfig.ts";

const BASE = "/api/v1/parking";

const isFacilitySlug = (s: string): s is FacilitySlug =>
    s in facilityLines;

function toParkingOverview(dto: ParkingOverview): ParkingOverview {
    return {
        ...dto,
        slug: isFacilitySlug(dto.slug)
            ? dto.slug
            : (dto.slug as FacilitySlug),

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
        return httpGet(`${BASE}/${slug}/history?${params}`);
    },
};