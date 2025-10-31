import React from 'react';
import { Article, GroundingChunk } from '../types';

interface SearchResultsProps {
  articles: Article[];
  citations: GroundingChunk[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ articles, citations }) => {
  if (articles.length === 0 && citations.length === 0) {
    return null;
  }

  const sources = citations.map(chunk => chunk.web).filter(Boolean);

  return (
    <div className="w-full mt-12">
      <div className="space-y-6">
        {articles.map((article, index) => (
          <div 
            key={`${article.url}-${index}`} 
            className="bg-white/50 dark:bg-[#333333]/80 p-5 rounded-lg border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-lg hover:border-[#D4AF37]/50 transition-all duration-200 text-left"
          >
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block mb-1"
            >
              <h2 className="text-xl font-cinzel font-bold text-gray-900 dark:text-gray-100 hover:text-[#B8860B] transition-colors">
                {article.articleTitle}
              </h2>
            </a>
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-gray-500 dark:text-gray-400 truncate block mb-2 hover:underline"
            >
              {article.url}
            </a>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{article.summary}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Source: <span className="font-bold text-gray-800 dark:text-gray-300">{article.sourceName}</span>
            </p>
          </div>
        ))}
      </div>

      {sources.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-700 text-left">
          <h3 className="text-lg font-cinzel font-bold mb-3 text-gray-800 dark:text-gray-200">Information Sources:</h3>
          <ul className="list-disc list-inside space-y-2">
            {sources.map((source, index) => (
              <li key={`source-${index}`}>
                <a
                  href={source!.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-[#B8860B] hover:underline text-sm"
                >
                  {source!.title || source!.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};