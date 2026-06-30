export const queryDefaults = {
    live: {
        staleTime: 30_000,
        refetchInterval: 30_000 as const,
        retry: 1,
    },

    static: {
        staleTime: 1000 * 60 * 60 * 24, // 24h
        retry: false,
        refetchInterval: false as const,
    },
} as const;