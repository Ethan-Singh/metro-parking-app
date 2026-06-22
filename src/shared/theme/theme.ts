import { createTheme } from "@mui/material/styles";

const CIVIC_BLUE = "#1A56DB";
const CIVIC_BLUE_DARK = "#1447C0";
const CIVIC_TEAL = "#0D7A6E";
const AMBER_WARN = "#B45309";
const INK = "#0F1924";
const INK_MUTED = "#4A5568";
const SURFACE = "#F7F9FC";
const BORDER = "rgba(15, 25, 36, 0.08)";

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: CIVIC_BLUE,
            dark: CIVIC_BLUE_DARK,
            contrastText: "#FFFFFF",
        },
        secondary: {
            main: CIVIC_TEAL,
            contrastText: "#FFFFFF",
        },
        warning: {
            main: AMBER_WARN,
            light: "#FEF3C7",
            contrastText: "#FFFFFF",
        },
        success: {
            main: CIVIC_TEAL,
            light: "#D1FAE5",
            contrastText: "#FFFFFF",
        },
        background: {
            default: SURFACE,
            paper: "#FFFFFF",
        },
        text: {
            primary: INK,
            secondary: INK_MUTED,
        },
        divider: BORDER,
    },

    typography: {
        fontFamily: [
            "Inter",
            "system-ui",
            "-apple-system",
            "sans-serif",
        ].join(","),
        h4: {
            fontWeight: 700,
            fontSize: "1.5rem",
            letterSpacing: "-0.3px",
            color: INK,
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.125rem",
            letterSpacing: "-0.2px",
            color: INK,
        },
        h6: {
            fontWeight: 600,
            fontSize: "0.9375rem",
            letterSpacing: "-0.1px",
            color: INK,
        },
        body1: {
            fontSize: "0.9375rem",
            lineHeight: 1.6,
        },
        body2: {
            fontSize: "0.8125rem",
            lineHeight: 1.55,
            color: INK_MUTED,
        },
        caption: {
            fontSize: "0.75rem",
            color: INK_MUTED,
            letterSpacing: "0.01em",
        },
    },

    shape: {
        borderRadius: 10,
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: SURFACE,
                    // Tabular nums globally — no jitter on live-updating numbers
                    fontVariantNumeric: "tabular-nums",
                },
            },
        },

        MuiCard: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    backgroundColor: "#FFFFFF",
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 1px 3px rgba(15,25,36,0.06), 0 1px 2px rgba(15,25,36,0.04)",
                    borderRadius: 12,
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: "1rem 1.125rem",
                    "&:last-child": { paddingBottom: "1rem" },
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    letterSpacing: "0.01em",
                    height: 22,
                    borderRadius: 5,
                },
                label: {
                    paddingLeft: 8,
                    paddingRight: 8,
                },
            },
        },

        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 99,
                    height: 5,
                    backgroundColor: "rgba(15,25,36,0.08)",
                },
                bar: {
                    borderRadius: 99,
                },
            },
        },

        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                outlined: {
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 1px 3px rgba(15,25,36,0.06)",
                },
            },
        },

        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    fontSize: "0.875rem",
                },
            },
        },

        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: INK,
                    fontSize: "0.75rem",
                    borderRadius: 6,
                },
                arrow: {
                    color: INK,
                },
            },
        },
    },
});