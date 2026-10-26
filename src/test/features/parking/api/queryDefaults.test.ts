import { describe, it, expect } from 'vitest';
import { queryDefaults } from '../../../../main/features/parking/api/queryDefaults';

describe('queryDefaults', () => {
  it('defines the live query defaults', () => {
    expect(queryDefaults.live).toEqual({
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      retry: 1,
    });
  });

  it('refreshes live history while keeping it cached between visits', () => {
    expect(queryDefaults.history).toEqual({
      staleTime: 2 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000,
      refetchInterval: 2 * 60 * 1000,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 1,
    });
  });
});
