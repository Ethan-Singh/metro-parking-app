import { core } from "./core";

export const semantic = {
    color: {
        primary: core.azure[500],
        primaryDark: core.azure[600],

        success: core.mint[500],
        warning: core.amber[500],
        error: core.red[500],

        info: "#0097B8",

        text: {
            primary: core.ink[900],
            secondary: core.ink[700],
            muted: core.ink[500],
            inverse: "#FFFFFF",
        },

        background: {
            page: core.azure[100],
            card: core.neutral.glass,
        },

        border: "rgba(10,79,166,0.10)",
    },

    radius: {
        card: 14,
        badge: 6,
        button: 12,
        pill: 99,
    },

    blur: {
        glass: "12px",
    },

    shadow: {
        sm: "0 2px 8px rgba(10,79,166,0.08)",
        md: "0 8px 24px rgba(10,79,166,0.10)",
        lg: "0 16px 40px rgba(10,79,166,0.14)",
    },
} as const;