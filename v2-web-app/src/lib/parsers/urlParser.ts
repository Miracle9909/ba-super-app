import { splitTextIntoChunks } from './chunking';

export const parseUrl = async (url: string): Promise<{ text: string, chunks: string[] }> => {
  try {
    // Basic URL validation — side effect validates the URL format
    new URL(url);
    
    // We use allorigins as a simple CORS proxy. 
    // In a real production app, you should use your own backend service.
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.contents) {
      throw new Error("Không thể tải nội dung từ URL");
    }
    
    // A very simple regex-based HTML to text extractor (since this is client side)
    // Strip script and style elements
    let text = data.contents.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ');
    text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ');
    // Replace <br>, <p>, <div>, etc with newlines
    text = text.replace(/<br\s*[\/]?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    text = text.replace(/<\/div>/gi, '\n');
    text = text.replace(/<\/h[1-6]>/gi, '\n\n');
    // Strip remaining HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Decode basic HTML entities
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    // Clean up excessive whitespace
    text = text.replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n\n').trim();

    if (!text || text.length < 50) {
       throw new Error("Nội dung trang web quá ngắn hoặc không thể trích xuất.");
    }

    const chunks = splitTextIntoChunks(text, 1000, 200);
    return { text, chunks };
  } catch (error: any) {
    console.error("URL parsing error:", error);
    throw new Error(error.message || "Failed to parse URL");
  }
};
