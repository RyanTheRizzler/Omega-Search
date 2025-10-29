// Define TypeScript types for the application data structures.

export interface Article {
  articleTitle: string;
  url: string;
  summary: string;
  sourceName: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  articles: Article[];
  chunks: GroundingChunk[];
}

export interface ApiError {
  message: string;
}
