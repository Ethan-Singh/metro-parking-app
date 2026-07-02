import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearchMode } from '../../../../main/features/parking/search/useSearchMode';
import { useLocation, type Location } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
  useLocation: vi.fn(),
}));

function mockLocation(pathname: string): Location {
  return {
    pathname,
    search: '',
    hash: '',
    state: null,
    key: 'test',
  };
}

describe('useSearchMode', () => {
  it('detects facility page', () => {
    vi.mocked(useLocation).mockReturnValue(
      mockLocation('/facility/park-ride-ashfield')
    );

    const { result } = renderHook(() => useSearchMode());

    expect(result.current.isFacilityPage).toBe(true);
    expect(result.current.isOverviewPage).toBe(false);
  });

  it('detects overview page', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('/'));

    const { result } = renderHook(() => useSearchMode());

    expect(result.current.isFacilityPage).toBe(false);
    expect(result.current.isOverviewPage).toBe(true);
  });

  it('detects unknown route', () => {
    vi.mocked(useLocation).mockReturnValue(mockLocation('/random'));

    const { result } = renderHook(() => useSearchMode());

    expect(result.current.isFacilityPage).toBe(false);
    expect(result.current.isOverviewPage).toBe(false);
  });
});
