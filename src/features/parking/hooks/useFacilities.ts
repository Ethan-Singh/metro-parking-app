import { useQuery } from "@tanstack/react-query";
import { parkingApi } from "../api/parkingApi";

export function useFacilities() {
    return useQuery({
        queryKey: ["parking", "facilities"],
        queryFn: parkingApi.getAll,
        staleTime: 30_000,
        refetchInterval: 30_000, // live dashboard feel
    });
}