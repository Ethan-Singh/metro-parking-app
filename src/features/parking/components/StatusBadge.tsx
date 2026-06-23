import { Chip } from "@mui/material";
import { semantic } from "../../../design-tokens/semantic";
import type { AvailabilityStatus } from "../types";
import { getStatusLabel } from "../utils/getStatusLabel.tsx";

function getConfig(status: AvailabilityStatus) {
    switch (status) {
        case "FULL":
            return {
                color: semantic.color.error,
                bg: "rgba(155, 28, 28, 0.10)",
                border: "rgba(155, 28, 28, 0.25)",
            };

        case "ALMOST_FULL":
            return {
                color: semantic.color.warning,
                bg: "rgba(146, 97, 10, 0.10)",
                border: "rgba(146, 97, 10, 0.25)",
            };

        default:
            return {
                color: semantic.color.success,
                bg: "rgba(0, 125, 102, 0.10)",
                border: "rgba(0, 125, 102, 0.25)",
            };
    }
}

export function StatusBadge({ status }: { status: AvailabilityStatus }) {
    const config = getConfig(status);

    return (
        <Chip
            label={getStatusLabel(status)}
            sx={{
                fontWeight: 700,
                fontSize: "0.6875rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                height: 22,
                borderRadius: 1,

                color: config.color,
                backgroundColor: config.bg,
                border: `1px solid ${config.border}`,
            }}
        />
    );
}