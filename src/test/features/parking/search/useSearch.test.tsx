import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearch } from '../../../../main/features/parking/search/useSearch';
import { SearchProvider } from '../../../../main/features/parking/search/SearchProvider';
import React from 'react';

describe('useSearch', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useSearch())).toThrow(
      'useSearch must be used inside SearchProvider'
    );
  });

  it('returns context values when used inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.query).toBe('');
    expect(typeof result.current.setQuery).toBe('function');
    expect(typeof result.current.clear).toBe('function');
  });
});
