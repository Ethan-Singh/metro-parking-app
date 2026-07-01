export const queryDefaults = {
  live: {
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchInterval: 30_000,
    retry: 1,
  },

  static: {
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: Infinity,
    retry: false,
    refetchInterval: false,
  },
} as const;
