import { createTheme } from "@mui/material/styles";

/**
 * ─────────────────────────────────────────────
 * Sydney Transport Colour System (UI tokens)
 * ─────────────────────────────────────────────
 */

const METRO = "#168388";

const T1 = "#F99D1C";
const T2 = "#0098CD";
const T3 = "#F37021";
const T4 = "#005AA3";
const T5 = "#C4258F";
const T6 = "#7C3E21";
const T7 = "#6F818E";
const T8 = "#00954C";
const T9 = "#D11F2F";

const INTERCITY_RED = "#D11F2F";
const INTERCITY_BLUE = "#005AA3";
const INTERCITY_GREEN = "#00954C";

const LIGHT_SURFACE = "#F3F7FB";
const CARD_SURFACE = "rgba(255,255,255,0.82)";
const BORDER = "rgba(0,0,0,0.06)";

const INK = "#0C1C2E";
const INK_MUTED = "#3D5166";

/**
 * ─────────────────────────────────────────────
 * Theme
 * ─────────────────────────────────────────────
 */

export const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: METRO,
            contrastText: "#FFFFFF",
        },

        secondary: {
            main: T2,
            contrastText: "#FFFFFF",
        },

        success: {
            main: T8,
        },

        warning: {
            main: T1,
        },

        error: {
            main: T9,
        },

        info: {
            main: T4,
        },

        background: {
            default: LIGHT_SURFACE,
            paper: CARD_SURFACE,
        },

        text: {
            primary: INK,
            secondary: INK_MUTED,
        },

        divider: BORDER,
    },

    typography: {
        fontFamily: ["Inter", "system-ui", "-apple-system", "sans-serif"].join(","),

        h4: {
            fontWeight: 700,
            letterSpacing: "-0.3px",
            color: INK,
        },

        h5: {
            fontWeight: 600,
            letterSpacing: "-0.2px",
            color: INK,
        },

        h6: {
            fontWeight: 600,
            letterSpacing: "-0.1px",
            color: INK,
        },

        body1: {
            fontSize: "0.9375rem",
            lineHeight: 1.6,
        },

        body2: {
            fontSize: "0.8125rem",
            color: INK_MUTED,
        },

        caption: {
            fontSize: "0.75rem",
            color: INK_MUTED,
        },
    },

    shape: {
        borderRadius: 14,
    },

    shadows: Array(25).fill("0px 4px 16px rgba(0,0,0,0.06)") as any,

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: LIGHT_SURFACE,
                },
            },
        },

        MuiCard: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    background: CARD_SURFACE,
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: 14,
                    transition: "all 0.25s ease",
                    "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                    },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 22,
                    borderRadius: 6,
                    textTransform: "uppercase",
                },
            },
        },

        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 99,
                    height: 6,
                    backgroundColor: "rgba(0,0,0,0.05)",
                },
                bar: {
                    borderRadius: 99,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 12,
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    background: "#fff",
                    border: BORDER,
                },
            },
        },
    },
});