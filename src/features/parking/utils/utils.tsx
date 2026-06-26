import { availability } from "../../../css/tokens";
import type {Status} from "../services/parking.ts";

export function getAvailabilityIcon(status: Status) {
    const config = availability.map[status];

    if (!config) return null;

    const Icon = config.icon;

    return (
        <Icon
            style={{
                fontSize: availability.icon.size,
                color: config.color,
            }}
        />
    );
}