import Anthropic from '@anthropic-ai/sdk';
import { useSettingsStore } from '../../store/useSettingsStore';
import type { LLMProvider, ChatMessage } from './types';

let anthropicClient: Anthropic | null = null;

export const getAnthropicClient = () => {
  const { anthropicApiKey } = useSettingsStore.getState();
  
  if (!anthropicApiKey) {
    throw new Error('Anthropic API Key is not configured.');
  }

  // Recreate client if key changes (or if it doesn't exist)
  if (!anthropicClient || anthropicClient.apiKey !== anthropicApiKey) {
    anthropicClient = new Anthropic({
      apiKey: anthropicApiKey,
      dangerouslyAllowBrowser: true, // Required for client-side web apps
    });
  }

  return anthropicClient;
};

export const anthropicProvider: LLMProvider = {
  generateResponse: async (
    messages: ChatMessage[],
    context: string = '',
    systemPrompt: string = 'You are a Senior Business Analyst expert. Guide the user through requirements discovery.'
  ) => {
    const client = getAnthropicClient();
    
    const fullSystemPrompt = context 
      ? `${systemPrompt}\n\nContext Information:\n${context}` 
      : systemPrompt;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      system: fullSystemPrompt,
      messages: messages,
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  },

  streamResponse: async function* (
    messages: ChatMessage[],
    context: string = '',
    systemPrompt: string = 'You are a Senior Business Analyst expert. Guide the user through requirements discovery.'
  ) {
    const client = getAnthropicClient();
    
    const fullSystemPrompt = context 
      ? `${systemPrompt}\n\nContext Information:\n${context}` 
      : systemPrompt;

    const stream = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      temperature: 0.7,
      system: fullSystemPrompt,
      messages: messages,
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield chunk.delta.text;
      }
    }
  }
};



