/// <reference lib="webworker" />
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import type { ParseFileRequest, ParseFileResponse } from './types';

// Set worker src dynamically via Vite asset resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

self.onmessage = async (e: MessageEvent<ParseFileRequest>) => {
  const { id, file, type } = e.data;

  try {
    let text = '';
    
    if (type === 'txt') {
      text = await file.text();
    } else if (type === 'docx') {
      const arrayBuffer = await file.arrayBuffer();
      // mammoth usually uses arrayBuffer natively in browser
      const result = await mammoth.extractRawText({ arrayBuffer });
      text = result.value;
    } else if (type === 'pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
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
      throw new Error(`Unsupported file type: ${type}`);
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
