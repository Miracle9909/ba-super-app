export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface LLMProvider {
  generateResponse(messages: ChatMessage[], context?: string, systemPrompt?: string): Promise<string>;
  streamResponse(messages: ChatMessage[], context?: string, systemPrompt?: string): AsyncGenerator<string, void, unknown>;
}
