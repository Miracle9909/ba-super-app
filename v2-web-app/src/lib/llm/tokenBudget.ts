export const estimateTokens = (text: string): number => {
  // A rough estimation: 1 token is approximately 4 characters for English text.
  // For Vietnamese/unicode it might be different, but this is a good baseline.
  return Math.ceil(text.length / 4);
};

// Assuming we want to warn user if context is getting too large
export const MAX_CONTEXT_TOKENS = 150000; 
export const TOKEN_WARNING_THRESHOLD = 100000;
