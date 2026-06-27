import {availabilityIcons} from "../../../css/tokens";
import type {Availability} from "./types.ts";

export function getAvailabilityIcon(availability: Availability) {
    const config = availabilityIcons.map[availability];

    if (!config) return null;

    const Icon = config.icon;

    return (
        <Icon
            style={{
                fontSize: availabilityIcons.icon.size,
                color: config.color,
            }}
        />
    );
}