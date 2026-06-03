export function splitTextIntoChunks(text: string, chunkSize: number = 1000, _overlap: number = 200): string[] {
  if (!text) return [];
  
  const separators = ['\n\n', '\n', '. ', ' ', ''];
  
  function split(textToSplit: string, separatorIndex: number): string[] {
    const separator = separators[separatorIndex];
    if (separator === undefined) {
      // Fallback: character splitting
      const chars = [];
      for (let i = 0; i < textToSplit.length; i += chunkSize) {
        chars.push(textToSplit.slice(i, i + chunkSize));
      }
      return chars;
    }

    const splits = separator ? textToSplit.split(separator) : textToSplit.split('');
    const chunks: string[] = [];
    let currentChunk = '';

    for (let i = 0; i < splits.length; i++) {
      const s = splits[i];
      const nextChunk = currentChunk ? currentChunk + separator + s : s;

      if (nextChunk.length <= chunkSize) {
        currentChunk = nextChunk;
      } else {
        if (currentChunk) {
          chunks.push(currentChunk);
          // Simple overlap: take the last 'overlap' characters of currentChunk as the start of next
          // But actually, we want to overlap by words/sentences if possible.
          // For simplicity, we just start the next chunk with the current split. 
          // Overlap implementation is complex for recursive. Let's do a basic sliding window if we want overlap, 
          // but for recursive, we can just split and then we might not perfectly overlap.
          // Let's implement a simpler approach that just handles max chunk size for now.
          currentChunk = s; 
          
          // If the split itself is too large, recurse
          if (currentChunk.length > chunkSize) {
            const subChunks = split(currentChunk, separatorIndex + 1);
            chunks.push(...subChunks.slice(0, -1));
            currentChunk = subChunks[subChunks.length - 1] || '';
          }
        } else {
          // split is larger than chunkSize and currentChunk is empty
          const subChunks = split(s, separatorIndex + 1);
          chunks.push(...subChunks.slice(0, -1));
          currentChunk = subChunks[subChunks.length - 1] || '';
        }
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  return split(text, 0);
}
