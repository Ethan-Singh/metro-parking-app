import { useQuery } from "@tanstack/react-query";
import { parkingApi } from "./parkingApi.ts";

export const parkingKeys = {
    all: () => ["parking"] as const,
    list: () => [...parkingKeys.all(), "list"] as const,
    overview: (slug: string) => [...parkingKeys.all(), "overview", slug] as const,
    history: (slug: string, from: string, to: string) =>
        [...parkingKeys.all(), "history", slug, from, to] as const,
};

const LIVE_INTERVAL = 30_000;

export function useParkingQueries() {
    return useQuery({
        queryKey: parkingKeys.list(),
        queryFn: parkingApi.getAll,
        staleTime: LIVE_INTERVAL,
        refetchInterval: LIVE_INTERVAL,
    });
}

export function useFacilityOverview(slug: string) {
    return useQuery({
        queryKey: parkingKeys.overview(slug),
        queryFn: () => parkingApi.getOverview(slug),
        staleTime: LIVE_INTERVAL,
        refetchInterval: LIVE_INTERVAL,
        enabled: Boolean(slug),
    });
}

export function useFacilityHistory(slug: string) {
    const from = daysAgo(7);
    const to = daysAgo(0);

    return useQuery({
        queryKey: parkingKeys.history(slug, from, to),
        queryFn: () => parkingApi.getHistory(slug, from, to),
        enabled: Boolean(slug),
    });
}

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
}