import { lazy, Suspense } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './AppLayout.tsx';
import OverviewPage from '../features/parking/pages/OverviewPage.tsx';
import { theme } from '../css/theme.ts';
import { SearchProvider } from '../features/parking/search/SearchProvider.tsx';

const FacilityPage = lazy(() => import('../features/parking/pages/FacilityPage.tsx'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchInterval: 30_000 },
  },
});

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <OverviewPage /> },
      {
        path: '/facility/:slug',
        element: (
          <Suspense fallback={<div style={{ minHeight: '70vh' }} />}>
            <FacilityPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <SearchProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </SearchProvider>
  );
}
