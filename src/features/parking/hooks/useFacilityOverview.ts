import { useQuery } from "@tanstack/react-query";
import { parkingApi } from "../api/parkingApi";

export function useFacilityOverview(slug: string) {
    return useQuery({
        queryKey: ["parking", "overview", slug],
        queryFn: () => parkingApi.getOverview(slug),
    });
}