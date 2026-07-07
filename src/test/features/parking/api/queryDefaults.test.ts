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
    expect(queryDefaults.history).toEqual({
      staleTime: 24 * 60 * 60 * 1000,
      gcTime: 7 * 24 * 60 * 60 * 1000,
      refetchInterval: false,
      refetchOnWindowFocus: false,
      retry: 1,
    });
  });
});
