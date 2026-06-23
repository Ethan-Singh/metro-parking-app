export const semantic = {
    color: {
        // ── Core brand (Metro identity) ──
        primary: "#168388",
        primaryDark: "#0F5F63",

        // ── Status system (Sydney Transport aligned) ──
        success: "#00954C",   // green line / available
        warning: "#F99D1C",   // T1 / congestion warning
        error: "#D11F2F",     // T9 / critical full
        info: "#0098CD",      // T2 / informational

        // ── Text ──
        text: {
            primary: "#0C1C2E",
            secondary: "#3D5166",
            muted: "#5E748A",
            inverse: "#FFFFFF",
        },

        // ── Background ──
        background: {
            page: "#F3F7FB",
            card: "rgba(255,255,255,0.82)",
        },

        border: "rgba(0,0,0,0.06)",
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
        sm: "0 2px 8px rgba(0,0,0,0.06)",
        md: "0 8px 24px rgba(0,0,0,0.08)",
        lg: "0 16px 40px rgba(0,0,0,0.12)",
    },
} as const;