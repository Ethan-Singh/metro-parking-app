import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { theme } from "../../design-tokens/theme.ts";
import { injectCSSVariables } from "../../design-tokens/css";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
    // Ensure CSS variables are synced with semantic tokens once at app start
    React.useEffect(() => {
        injectCSSVariables();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline enableColorScheme />
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
}