import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Seek timeless knowledge..."
          className="w-full p-4 pl-6 pr-20 text-lg bg-stone-800 border-2 border-stone-600 rounded-md text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] hover:from-[#E7C65F] hover:to-[#C9970C] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold w-12 h-12 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-stone-800 focus:ring-[#D4AF37] shadow-md flex items-center justify-center"
          aria-label="Search"
        >
          <SearchIcon className="w-6 h-6" />
        </button>
      </div>
    </form>
  );
};