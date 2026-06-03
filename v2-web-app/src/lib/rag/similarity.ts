/**
 * Calculates the dot product of two vectors
 */
export function dotProduct(vecA: number[], vecB: number[]): number {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

/**
 * Calculates the magnitude (length) of a vector
 */
export function magnitude(vec: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

/**
 * Calculates the cosine similarity between two vectors.
 * Returns a value between -1 and 1, where 1 means identical direction.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must be of the same length');
  }
  if (vecA.length === 0) {
    return 0;
  }

  const magA = magnitude(vecA);
  const magB = magnitude(vecB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dotProduct(vecA, vecB) / (magA * magB);
}

export interface SearchResult<T> {
  item: T;
  score: number;
}

/**
 * Brute-force searches through a list of items with vectors, returning the top K most similar items.
 * @param queryVector The vector to search for
 * @param items The items to search through
 * @param getVector A function to extract the vector from an item
 * @param topK The number of results to return
 * @param threshold The minimum cosine similarity score to include
 */
export function vectorSearch<T>(
  queryVector: number[],
  items: T[],
  getVector: (item: T) => number[] | undefined,
  topK: number = 5,
  threshold: number = 0.0
): SearchResult<T>[] {
  const results: SearchResult<T>[] = [];

  for (const item of items) {
    const itemVector = getVector(item);
    if (!itemVector) continue;

    const score = cosineSimilarity(queryVector, itemVector);
    if (score >= threshold) {
      results.push({ item, score });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}
