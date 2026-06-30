import { availabilityConfig } from "../../../css/availabilityConfig";
import type {Availability} from "../types.ts";

export function getAvailability(availability: Availability) {
    return availabilityConfig[availability];
}