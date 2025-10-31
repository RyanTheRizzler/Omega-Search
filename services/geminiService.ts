import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { StreamEvent, GroundingChunk, Article } from '../types';

// Per guidelines, initialize with API key from environment variables.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

// Session-based cache to store search results for a given query.
const queryCache = new Map<string, { articles: Article[], citations: GroundingChunk[] }>();


const prompt = `
  You are the search engine for "Omega," a tool that ONLY provides links to articles from factually verified, authoritative sources.

  Based on the user's query, find between 10 and 15 relevant articles.

  **CRITICAL RULES FOR SOURCE VERIFICATION:**
  1.  **ALLOWED SOURCES:** Prioritize academic journals, government websites (.gov), university websites (.edu), reputable scientific repositories (e.g., arXiv.org, osf.io), major non-partisan news organizations with a history of fact-checking (e.g., Reuters, Associated Press, BBC News), and professionally-curated encyclopedias (e.g., Encyclopedia Britannica).
  2.  **STRICTLY FORBIDDEN SOURCES:** You MUST NOT use Wikipedia, YouTube, personal blogs, forums (like Reddit), social media, opinion pieces, advocacy websites, or e-commerce sites. Any source that is not verifiably authoritative is forbidden.
  3.  **URL ACCURACY IS PARAMOUNT:** You MUST ONLY use direct, working URLs found by the search tool. Before outputting a URL, mentally verify that it is not a broken link or a redirect. Do not invent, guess, or modify URLs in any way. If a link from the search tool appears broken or irrelevant, discard that source. An incorrect URL is a critical failure.

  **OUTPUT FORMAT:**
  Your response must be a stream of individual JSON objects. For each article you find, immediately output a single, complete JSON object. Each JSON object must be a single line. Do not wrap the objects in an array or a markdown block. Each object must contain:
  - "articleTitle": The full title of the article.
  - "url": The direct URL to the article.
  - "summary": A brief, neutral, one-to-two-sentence summary of the article's content.
  - "sourceName": The name of the publication or website.

  Do not output anything besides the stream of JSON objects.

  The user's query is:
`;

export async function* streamSearch(query: string): AsyncGenerator<StreamEvent, void, unknown> {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return;
  }

  // Check cache first
  if (queryCache.has(normalizedQuery)) {
    const cachedResult = queryCache.get(normalizedQuery)!;
    console.log("Serving from cache:", normalizedQuery);
    for (const article of cachedResult.articles) {
      yield { type: 'article', payload: article };
    }
    if (cachedResult.citations.length > 0) {
      yield { type: 'citations', payload: cachedResult.citations };
    }
    return;
  }

  console.log("Performing new search:", normalizedQuery);
  const articlesForCache: Article[] = [];

  try {
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: `${prompt} "${query}"`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    let buffer = '';
    let lastSeenCitations: GroundingChunk[] = [];

    for await (const chunk of responseStream) {
        const text = chunk.text;
        buffer += text;

        let braceCount = 0;
        let startIndex = -1;

        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i] === '{') {
                if (startIndex === -1) startIndex = i;
                braceCount++;
            } else if (buffer[i] === '}') {
                braceCount--;
                if (braceCount === 0 && startIndex !== -1) {
                    const jsonString = buffer.substring(startIndex, i + 1);
                    try {
                        const article: Article = JSON.parse(jsonString);
                        articlesForCache.push(article); // Add to cache list
                        yield { type: 'article', payload: article };
                    } catch (e) {
                        console.warn('Failed to parse JSON chunk:', jsonString);
                    }
                    buffer = buffer.substring(i + 1);
                    startIndex = -1;
                    i = -1; 
                }
            }
        }
        
        const citations = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (citations && citations.length > 0) {
            lastSeenCitations = citations;
        }
    }
    
    if (lastSeenCitations.length > 0) {
        yield { type: 'citations', payload: lastSeenCitations };
    }
    
    // Store the complete result in the cache for future use
    queryCache.set(normalizedQuery, { articles: articlesForCache, citations: lastSeenCitations });

  } catch (error) {
    console.error("Error performing search:", error);
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
        message = error.message;
    }
    yield { type: 'error', payload: `An error occurred during the search: ${message}` };
  }
}