import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import OverviewPage from "../../features/parking/pages/OverviewPage";
import FacilityPage from "../../features/parking/pages/FacilityPage";

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { path: "/", element: <OverviewPage /> },
            { path: "/facility/:slug", element: <FacilityPage /> },
        ],
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}