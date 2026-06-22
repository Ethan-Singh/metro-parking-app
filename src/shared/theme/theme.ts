import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#0B5FFF", // modern gov blue
        },
        secondary: {
            main: "#00A3A3", // calm teal accent
        },
        background: {
            default: "#F6F8FB",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#1A1D21",
            secondary: "#5B6470",
        },
        divider: "rgba(0,0,0,0.08)",
    },

    typography: {
        fontFamily: [
            "Inter",
            "Roboto",
            "system-ui",
            "-apple-system",
            "sans-serif",
        ].join(","),

        h4: {
            fontWeight: 700,
            letterSpacing: "-0.5px",
        },

        h6: {
            fontWeight: 600,
        },

        body1: {
            fontSize: "0.95rem",
            lineHeight: 1.6,
        },
    },

    shape: {
        borderRadius: 14,
    },

    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 10px rgba(16,24,40,0.06)",
                    border: "1px solid rgba(0,0,0,0.06)",
                },
            },
        },

        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                },
            },
        },

        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: "#F6F8FB",
                },
            },
        },
    },
});