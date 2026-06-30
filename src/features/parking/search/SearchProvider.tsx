import React, { useState } from 'react';
import { SearchContext } from './SearchContext';

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');

  const clear = () => setQuery('');

  return (
    <SearchContext.Provider value={{ query, setQuery, clear }}>
      {children}
    </SearchContext.Provider>
  );
}
