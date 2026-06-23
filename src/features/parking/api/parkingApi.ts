import { httpGet } from "../../../services/httpClient";
import type { Facility, FacilityHistory } from "../types";

const buildQuery = (params: Record<string, string | number | undefined>) => {
    const qs = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) qs.append(key, String(value));
    });

    return qs.toString();
};

export const parkingApi = {
    getAll: () => httpGet<Facility[]>("/api/v1/parking"),

    getOverview: (slug: string) =>
        httpGet<Facility>(`/api/v1/parking/${slug}/overview`),

    getHistory: (slug: string, from: string, to: string) =>
        httpGet<FacilityHistory>(
            `/api/v1/parking/${slug}/history?${buildQuery({
                from,
                to,
                granularity: "TEN_MINUTE",
            })}`
        ),
};