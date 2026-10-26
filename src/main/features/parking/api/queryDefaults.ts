/** Backend rotates current-day ingests across enabled facilities, so one facility updates on a multi-minute sweep. */
export const BACKEND_REFRESH_INTERVAL_MS = 2 * 60 * 1000;

export const queryDefaults = {
  live: {
    staleTime: BACKEND_REFRESH_INTERVAL_MS,
    gcTime: 5 * 60 * 1000,
    refetchInterval: BACKEND_REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: 1,
  },

  history: {
    staleTime: BACKEND_REFRESH_INTERVAL_MS,
    gcTime: 7 * 24 * 60 * 60 * 1000,
    refetchInterval: BACKEND_REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  },
} as const;
