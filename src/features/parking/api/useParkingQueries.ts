import { parkingApi } from "./parkingApi.ts";
import {queryDefaults} from "./queryDefaults.ts";
import type {FacilitySlug, ParkingHistory} from "../types.ts";
import {useQuery} from "@tanstack/react-query";

export const parkingKeys = {
    all: () => ["parking"] as const,
    list: () => [...parkingKeys.all(), "list"] as const,
    overview: (slug: FacilitySlug) =>
        [...parkingKeys.all(), "overview", slug] as const,
    history: (slug: FacilitySlug, from: string, to: string) =>
        [...parkingKeys.all(), "history", slug, from, to] as const,
};

export function useParkingQueries() {
    return useQuery({
        queryKey: parkingKeys.list(),
        queryFn: parkingApi.getAll,
        ...queryDefaults.live,
    });
}

export function useFacilityOverview(slug: FacilitySlug) {
    return useQuery({
        queryKey: parkingKeys.overview(slug),
        queryFn: () => parkingApi.getOverview(slug),
        ...queryDefaults.live,
    });
}

export function useFacilityHistory(slug: FacilitySlug) {
    const from = daysAgo(7);
    const to = daysAgo(0);

    return useQuery<ParkingHistory>({
        queryKey: parkingKeys.history(slug, from, to),
        queryFn: () => parkingApi.getHistory(slug, from, to),
        ...queryDefaults.static,
    });
}

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
}