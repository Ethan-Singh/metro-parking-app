import {Cancel, CheckCircle, WarningAmber} from "@mui/icons-material";

export const availabilityConfig = {
    AVAILABLE: {
        color: "#007D66",
        icon: CheckCircle,
    },
    ALMOST_FULL: {
        color: "#92610A",
        icon: WarningAmber,
    },
    FULL: {
        color: "#9B1C1C",
        icon: Cancel,
    },
} as const;