// Design Tokens - Single Source of Truth
import {Cancel, CheckCircle, WarningAmber} from "@mui/icons-material";

export const tokens = {
    color: {
        primary: "#0A4FA6",
        secondary: "#0097B8",
        success: "#007D66",
        warning: "#92610A",
        error: "#9B1C1C",
        text: "#0C1C2E",
        textMuted: "#3D5166",
        bg: "#DCF0FA",
        surface: "rgba(255, 255, 255, 0.80)",
        border: "rgba(10, 79, 166, 0.10)",
    },
    space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
    radius: 14,
    shadow: "0 4px 12px rgba(10,79,166,0.08)",
    shadowHover: "0 12px 32px rgba(10,79,166,0.12)",
    grid: {
        gap: 2,
        cardSize: { xs: 12, sm: 6, md: 4 }, // 3 cols on desktop
        skeletonHeight: 200,
    },
    card: {
        hoverTransform: "translateY(-4px)",
        hoverTransitionMs: 300,
    },
    palette: {
        primary: { main: "#0A4FA6" },
        secondary: { main: "#0097B8" },
        success: { main: "#007D66" },
        warning: { main: "#92610A" },
        error: { main: "#9B1C1C" },
        text: { primary: "#0C1C2E", secondary: "#3D5166" },
        background: { default: "#DCF0FA", paper: "rgba(255, 255, 255, 0.80)" },
        divider: "rgba(10, 79, 166, 0.10)",
    },
    shape: { borderRadius: 14 },
    metaFooter: {
        container: {
            display: "flex",
            alignItems: "center",
            gap: 4,
        },

        icon: {
            fontSize: 14,
            color: "#3D5166",
        },

        text: {
            color: "#3D5166",
        },

        separator: {
            margin: "0 4px",
            color: "#3D5166",
        },

        item: {
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
        },
    },
} as const;

export const occupancyColors = {
    FULL: tokens.color.error,
    ALMOST_FULL: tokens.color.warning,
    AVAILABLE: tokens.color.success,
} as const;

export const availabilityIcons = {
    icon: {
        size: 14,
    },

    map: {
        AVAILABLE: {
            icon: CheckCircle,
            color: tokens.color.success,
        },
        ALMOST_FULL: {
            icon: WarningAmber,
            color: tokens.color.warning,
        },
        FULL: {
            icon: Cancel,
            color: tokens.color.error,
        },
    },
} as const;