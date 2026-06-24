import { createTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

export const theme = createTheme({
    palette: tokens.palette,
    typography: { fontFamily: "Inter, system-ui, sans-serif" },
    shape: tokens.shape,
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: tokens.color.bg,
                    background: "linear-gradient(180deg, #C8E8F8 0%, #DCF0FA 35%, #EAF5FC 100%)",
                    backgroundAttachment: "fixed",
                    fontVariantNumeric: "tabular-nums",
                },
            },
        },
        MuiCard: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    background: tokens.color.surface,
                    border: `1px solid rgba(255, 255, 255, 0.90)`,
                    boxShadow: tokens.shadow,
                    transition: `transform ${tokens.card.hoverTransitionMs}ms ease, box-shadow ${tokens.card.hoverTransitionMs}ms ease`,
                    "&:hover": {
                        transform: tokens.card.hoverTransform,
                        boxShadow: tokens.shadowHover,
                    },
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: tokens.space.lg,
                    "&:last-child": { paddingBottom: tokens.space.lg },
                },
            },
        },
    },
});