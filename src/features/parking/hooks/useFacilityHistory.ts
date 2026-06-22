import { useQuery } from "@tanstack/react-query";
import { parkingApi } from "../api/parkingApi";

function getDateNDaysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
}

export function useFacilityHistory(slug: string) {
    const from = getDateNDaysAgo(7);
    const to = getDateNDaysAgo(0);

    return useQuery({
        queryKey: ["parking", "history", slug, from, to],
        queryFn: () => parkingApi.getHistory(slug, from, to),
    });
}