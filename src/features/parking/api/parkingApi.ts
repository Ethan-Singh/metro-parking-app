import { httpGet } from "../../../services/httpClient";
import type {Facility, FacilityHistory} from "../types";

export const parkingApi = {
    getAll: () => httpGet<Facility[]>("/api/v1/parking"),

    getOverview: (slug: string) =>
        httpGet<Facility>(`/api/v1/parking/${slug}/overview`),

    getHistory: (slug: string, from: string, to: string) =>
        httpGet<FacilityHistory>(
            `/api/v1/parking/${slug}/history?from=${from}&to=${to}&granularity=TEN_MINUTE`
        ),
};