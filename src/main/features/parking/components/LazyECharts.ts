import { lazy } from 'react';

/** Load only the chart engine modules used by these line charts. */
export const LazyECharts = lazy(() => import('./EChartsView.tsx'));
