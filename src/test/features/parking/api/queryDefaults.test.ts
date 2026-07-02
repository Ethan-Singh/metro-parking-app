import { describe, it, expect } from 'vitest';
import { queryDefaults } from '../../../../main/features/parking/api/queryDefaults';

describe('queryDefaults', () => {
  it('defines the live query defaults', () => {
    expect(queryDefaults.live).toEqual({
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchInterval: 30_000,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: true,
      retry: 1,
    });
  });

  it('defines the static query defaults', () => {
    expect(queryDefaults.static).toEqual({
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: Infinity,
      retry: false,
      refetchInterval: false,
    });
  });
});
