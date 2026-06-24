import { useQuery } from "@tanstack/react-query";
import { parkingApi } from "./parkingApi.ts";

// ─── Cache key factory ────────────────────────────────────────────────────────
// Keep keys in one place so they're easy to invalidate from anywhere.

export const parkingKeys = {
    all:     ()                          => ["parking"] as const,
    list:    ()                          => [...parkingKeys.all(), "list"] as const,
    overview: (slug: string)             => [...parkingKeys.all(), "overview", slug] as const,
    history:  (slug: string, from: string, to: string) =>
        [...parkingKeys.all(), "history", slug, from, to] as const,
};

// ─── Shared intervals ─────────────────────────────────────────────────────────

const LIVE_INTERVAL = 30_000; // 30 s — feels live without hammering the backend

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** All facilities for the overview dashboard. Refreshes every 30 s. */
export function useParkingQueries() {
    return useQuery({
        queryKey: parkingKeys.list(),
        queryFn:  parkingApi.getAll,
        staleTime: LIVE_INTERVAL,
        refetchInterval: LIVE_INTERVAL,
    });
}

/** Single facility overview. Refreshes every 30 s. */
export function useFacilityOverview(slug: string) {
    return useQuery({
        queryKey: parkingKeys.overview(slug),
        queryFn:  () => parkingApi.getOverview(slug),
        staleTime: LIVE_INTERVAL,
        refetchInterval: LIVE_INTERVAL,
        enabled: Boolean(slug),
    });
}

/** 7-day history for a facility. Fetched once; history doesn't change live. */
export function useFacilityHistory(slug: string) {
    const from = daysAgo(7);
    const to   = daysAgo(0);

    return useQuery({
        queryKey: parkingKeys.history(slug, from, to),
        queryFn:  () => parkingApi.getHistory(slug, from, to),
        enabled: Boolean(slug),
        // No refetchInterval — historical data doesn't change
    });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}