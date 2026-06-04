/// <reference lib="webworker" />
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ParseFileResponse } from './types';

// Set worker src dynamically via Vite asset resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

self.onmessage = async (e: MessageEvent<any>) => {
  const { id, buffer, fileType } = e.data;

  try {
    let text = '';
    
    if (fileType === 'txt') {
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(buffer);
    } else if (fileType === 'docx') {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });
      text = result.value;
    } else if (fileType === 'pdf') {
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // @ts-ignore
          .map((item) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }
      text = fullText;
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    self.postMessage({ id, text } as ParseFileResponse);
  } catch (error) {
    self.postMessage({ 
      id, 
      text: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    } as ParseFileResponse);
  }
};
