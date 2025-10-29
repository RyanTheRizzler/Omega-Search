import { GoogleGenAI } from "@google/genai";
import type { SearchResult, ApiError, GroundingChunk, Article } from '../types';

// Per guidelines, initialize with API key from environment variables.
const ai = new GoogleGenAI({apiKey: process.env.API_KEY!});

const prompt = `
  You are the search engine for "Omega," a tool that ONLY provides links to articles from factually verified, authoritative sources. Your ONLY output should be a single JSON code block. Do not add any introductory or closing text.

  Based on the user's query, find between 5 and 10 relevant articles.

  **CRITICAL RULES FOR SOURCE VERIFICATION:**
  1.  **ALLOWED SOURCES:** Prioritize academic journals, government websites (.gov), university websites (.edu), reputable scientific repositories (e.g., arXiv.org, osf.io), major non-partisan news organizations with a history of fact-checking (e.g., Reuters, Associated Press, BBC News), and professionally-curated encyclopedias (e.g., Encyclopedia Britannica).
  2.  **STRICTLY FORBIDDEN SOURCES:** You MUST NOT use Wikipedia, YouTube, personal blogs, forums (like Reddit), social media, opinion pieces, advocacy websites, or e-commerce sites. Any source that is not verifiably authoritative is forbidden.
  3.  **URL ACCURACY IS PARAMOUNT:** You MUST ONLY use direct, working URLs found by the search tool. Before outputting a URL, mentally verify that it is not a broken link or a redirect. Do not invent, guess, or modify URLs in any way. If a link from the search tool appears broken or irrelevant, discard that source. An incorrect URL is a critical failure.

  **OUTPUT FORMAT:**
  Your response must be a single JSON object wrapped in a markdown code block (\`\`\`json ... \`\`\`). The JSON object must have a single key "articles" which is an array of article objects. Each article object must contain:
  - "articleTitle": The full title of the article.
  - "url": The direct URL to the article.
  - "summary": A brief, neutral, one-to-two-sentence summary of the article's content.
  - "sourceName": The name of the publication or website.

  Do not output anything besides the JSON code block.

  The user's query is:
`;

export const performSearch = async (query: string): Promise<SearchResult | ApiError> => {
  if (!query.trim()) {
    return { articles: [], chunks: [] };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${prompt} "${query}"`,
      config: {
        tools: [{googleSearch: {}}],
      },
    });

    const rawText = response.text;
    
    // Regex to extract content from a JSON markdown block
    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch || !jsonMatch[1]) {
      // Fallback for when the model doesn't use markdown block
      try {
        const result: { articles: Article[] } = JSON.parse(rawText);
        const chunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { articles: result.articles || [], chunks };
      } catch (e) {
         throw new Error("The service failed to return a valid JSON response format.");
      }
    }
    
    const jsonText = jsonMatch[1];
    
    const result: { articles: Article[] } = JSON.parse(jsonText);
    const chunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { articles: result.articles || [], chunks };
  } catch (error) {
    console.error("Error performing search:", error);
    let message = 'An unknown error occurred';
    if (error instanceof Error) {
        message = error.message;
    }
    if (message.includes('JSON') || message.includes('service failed')) {
        message = 'The service failed to return a valid response. Please try rephrasing your search.'
    }
    return { message: `An error occurred during the search: ${message}` };
  }
};