import { pipeline } from '@xenova/transformers';

class PipelineSingleton {
  static task = 'feature-extraction';
  static model = 'Xenova/all-MiniLM-L6-v2';
  static instance: any = null;

  static async getInstance(progress_callback?: Function) {
    if (this.instance === null) {
      this.instance = pipeline(this.task as any, this.model, { progress_callback });
    }
    return this.instance;
  }
}

self.addEventListener('message', async (event) => {
  const { id, text, type } = event.data;

  if (type === 'load') {
    await PipelineSingleton.getInstance((x: any) => {
      self.postMessage({ id, status: 'progress', data: x });
    });
    self.postMessage({ id, status: 'ready' });
    return;
  }

  if (type === 'embed') {
    try {
      const embedder = await PipelineSingleton.getInstance();
      const output = await embedder(text, { pooling: 'mean', normalize: true });
      self.postMessage({ id, status: 'success', vector: Array.from(output.data) });
    } catch (err: any) {
      self.postMessage({ id, status: 'error', error: err.message });
    }
  }
});
