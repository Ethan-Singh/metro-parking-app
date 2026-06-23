import type { AvailabilityStatus } from "../types";

export function getStatusLabel(status: AvailabilityStatus) {
    switch (status) {
        case "FULL":
            return "Full";
        case "ALMOST_FULL":
            return "Almost Full";
        default:
            return "Available";
    }
}