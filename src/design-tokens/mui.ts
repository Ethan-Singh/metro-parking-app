import { createTheme } from "@mui/material/styles";
import { semantic } from "./semantic";

export const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: semantic.color.primary,
            dark: semantic.color.primaryDark,
            contrastText: "#FFFFFF",
        },

        secondary: {
            main: semantic.color.info,
            contrastText: "#FFFFFF",
        },

        success: {
            main: semantic.color.success,
        },

        warning: {
            main: semantic.color.warning,
        },

        error: {
            main: semantic.color.error,
        },

        background: {
            default: semantic.color.background.page,
            paper: semantic.color.background.card,
        },

        text: {
            primary: semantic.color.text.primary,
            secondary: semantic.color.text.secondary,
        },

        divider: semantic.color.border,
    },

    typography: {
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",

        h4: {
            fontWeight: 700,
            fontSize: "1.5rem",
            color: semantic.color.text.primary,
        },

        h5: {
            fontWeight: 600,
            fontSize: "1.125rem",
            color: semantic.color.text.primary,
        },

        body1: {
            fontSize: "0.9375rem",
            lineHeight: 1.6,
        },

        body2: {
            fontSize: "0.8125rem",
            color: semantic.color.text.secondary,
        },
    },

    shape: {
        borderRadius: semantic.radius.card,
    },

    shadows: Array(25).fill(semantic.shadow.sm) as any,

    components: {
        MuiCard: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    background: semantic.color.background.card,
                    borderRadius: semantic.radius.card,
                    boxShadow: semantic.shadow.md,
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: semantic.radius.button,
                },
            },
        },
    },
});