import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { Spinner } from './components/Spinner';
import { performSearch } from './services/geminiService';
import { SearchResult, ApiError } from './types';
import { GreekKeyPattern } from './components/icons/GreekKeyPattern';

function App() {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    const result = await performSearch(query);

    if (result && 'message' in result) {
      setError((result as ApiError).message);
    } else if (result) {
      setSearchResult(result as SearchResult);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative bg-[#1a1a1a] min-h-screen text-[#E0E0E0]">
      {/* Tiling Greek key pattern as the page background */}
      <GreekKeyPattern className="fixed inset-0 w-full h-full text-[#D4AF37]/30 z-0" />
      
      <main className="relative z-10 py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        {/* Main content block, centered, on top of the pattern */}
        <div className="w-full max-w-4xl mx-auto bg-[#2a2a2a] border-2 border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold mb-3 text-[#D4AF37]">
              Omega Search
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              A search engine for verified information.
            </p>

            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          {isLoading && <Spinner />}
          
          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-600 text-red-300 p-4 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {!isLoading && !error && searchResult && searchResult.articles.length === 0 && (
            <div className="mt-8 text-center text-gray-400 p-4">
              <p>No results found for your query. Please try a different search term.</p>
            </div>
          )}

          {searchResult && <SearchResults result={searchResult} />}
        </div>
      </main>
    </div>
  );
}

export default App;