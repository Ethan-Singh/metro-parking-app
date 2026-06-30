import React, { createContext, useContext, useState } from "react";

type SearchContextType = {
    query: string;
    setQuery: (v: string) => void;
    clear: () => void;
};

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: React.ReactNode }) {
    const [query, setQuery] = useState("");

    const clear = () => setQuery("");

    return (
        <SearchContext.Provider value={{ query, setQuery, clear }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
    return ctx;
}