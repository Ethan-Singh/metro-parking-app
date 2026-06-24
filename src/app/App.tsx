import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FacilityPage from "../features/parking/pages/FacilityPage.tsx";
import AppLayout from "./AppLayout.tsx";
import OverviewPage from "../features/parking/pages/OverviewPage.tsx";
import "../css/styles.css";
import {theme} from "../css/theme.ts";

const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, refetchInterval: 30_000 } },
});

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { path: "/", element: <OverviewPage /> },
            { path: "/facility/:slug", element: <FacilityPage /> },
        ],
    },
]);

export default function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </ThemeProvider>
    );
}