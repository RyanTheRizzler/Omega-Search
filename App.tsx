import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { LoadingIndicator } from './components/LoadingIndicator';
import { streamSearch } from './services/geminiService';
import { Article, GroundingChunk } from './types';
import { GreekKeyPattern } from './components/icons/GreekKeyPattern';
import { ThemeToggle } from './components/ThemeToggle';
import { InfoIcon } from './components/icons/InfoIcon';

function App() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [citations, setCitations] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setArticles([]);
    setCitations([]);

    try {
      for await (const event of streamSearch(query)) {
        if (event.type === 'article') {
          setArticles(prev => [...prev, event.payload]);
        } else if (event.type === 'citations') {
          setCitations(event.payload);
        } else if (event.type === 'error') {
          setError(event.payload);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred during the search.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-stone-100 dark:bg-[#1a1a1a] min-h-screen text-stone-800 dark:text-[#E0E0E0] transition-colors duration-300">
      {/* Tiling Greek key pattern as the page background */}
      <GreekKeyPattern className="fixed inset-0 w-full h-full text-[#D4AF37]/30 z-0" />
      
      <main className="relative z-10 py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        {/* Main content block, centered, on top of the pattern */}
        <div className="w-full max-w-4xl mx-auto bg-white/90 dark:bg-[#2a2a2a]/90 border-2 border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 backdrop-blur-sm">
          <div className="absolute top-4 right-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
          <div className="flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-cinzel font-bold mb-3 text-[#D4AF37]">
              Omega
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              A search engine for verified information.
            </p>

            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>

          {(articles.length > 0 || citations.length > 0) && (
            <SearchResults articles={articles} citations={citations} />
          )}

          {isLoading && <LoadingIndicator />}
          
          {error && (
            <div className="mt-8 text-center bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 p-4 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          {!isLoading && !error && hasSearched && articles.length === 0 && (
            <div className="mt-8 text-center bg-stone-50 dark:bg-stone-800/50 border border-stone-300 dark:border-stone-700 p-6 rounded-lg flex flex-col items-center gap-4">
              <InfoIcon className="w-12 h-12 text-stone-400 dark:text-stone-500" />
              <div>
                  <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300">No Results Found</h3>
                  <p className="text-stone-500 dark:text-stone-400">Your search did not match any verified articles. Please try a different term.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;