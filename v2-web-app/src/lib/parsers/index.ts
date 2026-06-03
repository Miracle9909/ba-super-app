import { v4 as uuidv4 } from 'uuid';
import type { IFileParser, ParseFileRequest, ParseFileResponse } from './types';

export class WorkerFileParser implements IFileParser {
  private worker: Worker | null = null;
  private pendingRequests: Map<string, { resolve: (text: string) => void, reject: (error: Error) => void }> = new Map();

  private getWorker(): Worker {
    if (!this.worker) {
      // In Vite, appending ?worker creates a web worker instance
      this.worker = new Worker(new URL('./fileParserWorker.ts', import.meta.url), {
        type: 'module'
      });

      this.worker.onmessage = (e: MessageEvent<ParseFileResponse>) => {
        const { id, text, error } = e.data;
        const callbacks = this.pendingRequests.get(id);
        
        if (callbacks) {
          if (error) {
            callbacks.reject(new Error(error));
          } else {
            callbacks.resolve(text);
          }
          this.pendingRequests.delete(id);
        }
      };

      this.worker.onerror = (err) => {
        console.error("Worker error:", err);
      };
    }
    return this.worker;
  }

  public async parse(file: File): Promise<string> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    let type: ParseFileRequest['type'];

    if (extension === 'pdf') {
      type = 'pdf';
    } else if (extension === 'docx') {
      type = 'docx';
    } else if (extension === 'txt') {
      type = 'txt';
    } else {
      throw new Error(`Định dạng file không được hỗ trợ (chỉ hỗ trợ .txt, .pdf, .docx): ${file.name}`);
    }

    const worker = this.getWorker();
    const id = uuidv4();

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      const request: ParseFileRequest = {
        id,
        file,
        type
      };
      
      worker.postMessage(request);
    });
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.pendingRequests.clear();
    }
  }
}

// Export a singleton instance for ease of use
export const fileParser = new WorkerFileParser();
