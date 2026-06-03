import { v4 as uuidv4 } from 'uuid';

class EmbeddingClient {
  private worker: Worker | null = null;
  private resolvers: Map<string, { resolve: Function, reject: Function }> = new Map();

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    this.worker = new Worker(new URL('./embeddingWorker.ts', import.meta.url), {
      type: 'module'
    });

    this.worker.onmessage = (e) => {
      const { id, status, vector, error } = e.data;
      const resolver = this.resolvers.get(id);
      
      if (resolver) {
        if (status === 'success') {
          resolver.resolve(vector);
          this.resolvers.delete(id);
        } else if (status === 'error') {
          resolver.reject(new Error(error));
          this.resolvers.delete(id);
        }
      }
    };
  }

  public async embed(text: string): Promise<number[]> {
    if (!this.worker) {
      this.initWorker();
    }
    
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      this.resolvers.set(id, { resolve, reject });
      this.worker!.postMessage({ id, type: 'embed', text });
    });
  }
}

export const embeddingClient = new EmbeddingClient();

// Utility for Cosine Similarity
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
