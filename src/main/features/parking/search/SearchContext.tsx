import { createContext } from 'react';

export type SearchContextType = {
  query: string;
  setQuery: (v: string) => void;
  clear: () => void;
};

export const SearchContext = createContext<SearchContextType | null>(null);
