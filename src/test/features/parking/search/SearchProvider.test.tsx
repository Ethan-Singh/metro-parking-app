import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SearchProvider } from '../../../../main/features/parking/search/SearchProvider';
import { useSearch } from '../../../../main/features/parking/search/useSearch';
import React from 'react';

describe('SearchProvider', () => {
  it('provides default empty query', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.query).toBe('');
  });

  it('updates query via setQuery', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setQuery('Ashfield');
    });

    expect(result.current.query).toBe('Ashfield');
  });

  it('clears query via clear()', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SearchProvider>{children}</SearchProvider>
    );

    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setQuery('test');
    });

    expect(result.current.query).toBe('test');

    act(() => {
      result.current.clear();
    });

    expect(result.current.query).toBe('');
  });
});
