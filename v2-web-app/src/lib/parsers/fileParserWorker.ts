/// <reference lib="webworker" />
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import TurndownService from 'turndown';
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
    let markdown = '';

    if (fileType === 'txt') {
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(buffer);
      // Auto-detect markdown (heuristic: if file has heading markers or list markers)
      if (text.includes('# ') || text.includes('## ') || /^\s*[-*+]\s/m.test(text)) {
        markdown = text;
      } else {
        markdown = text.split('\n').map(line => line.trim() ? `${line}\n` : '').join('\n');
      }
    } else if (fileType === 'md') {
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(buffer);
      markdown = text;
    } else if (fileType === 'html') {
      const decoder = new TextDecoder('utf-8');
      const htmlContent = decoder.decode(buffer);
      const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      markdown = turndownService.turndown(htmlContent);
      text = markdown.replace(/[*_#\[\]]/g, '');
    } else if (fileType === 'docx') {
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
      const turndownService = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      markdown = turndownService.turndown(result.value);

      const rawTextResult = await mammoth.extractRawText({ arrayBuffer: buffer });
      text = rawTextResult.value;
    } else if (fileType === 'csv' || fileType === 'xlsx') {
      const workbook = XLSX.read(buffer, { type: 'array' });

      const allSheetsMarkdown: string[] = [];
      const allSheetsText: string[] = [];

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        allSheetsText.push(`--- Sheet: ${sheetName} ---\n${csv}`);

        // Convert CSV to Markdown table
        const rows = csv.split('\n').filter(r => r.trim());
        if (rows.length > 0) {
          const headers = rows[0].split(',').map(h => h.trim());
          const headerRow = `| ${headers.join(' | ')} |`;
          const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
          const dataRows = rows.slice(1).map(r => `| ${r.split(',').map(c => c.trim()).join(' | ')} |`);
          allSheetsMarkdown.push(`## Sheet: ${sheetName}\n\n${[headerRow, separatorRow, ...dataRows].join('\n')}`);
        }
      }

      text = allSheetsText.join('\n\n');
      markdown = allSheetsMarkdown.join('\n\n');
    } else if (fileType === 'pdf') {
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      let fullText = '';
      let fullMarkdown = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        // --- Collect all items with position + style info ---
        const items = (textContent.items as any[]).filter(item => item.str && item.str.trim());
        if (items.length === 0) continue;

        // Gather font sizes to calculate relative thresholds for this page
        const fontSizes = items.map(item => Number(item.height) || 12);
        const maxFontSize = Math.max(...fontSizes);
        const medianFontSize = fontSizes.sort((a, b) => a - b)[Math.floor(fontSizes.length / 2)] || 12;

        // Thresholds relative to this document's actual fonts
        const h1Threshold = medianFontSize * 1.5;
        const h2Threshold = medianFontSize * 1.25;

        let pageText = '';
        let pageMarkdown = '';
        let lastY = -1;
        let lastFontSize = medianFontSize;
        let currentLine = '';
        let currentLineIsHeading = 0; // 0 = body, 1 = h1, 2 = h2

        const flushLine = () => {
          if (!currentLine.trim()) return;
          const trimmed = currentLine.trim();
          if (currentLineIsHeading === 1) {
            pageMarkdown += `\n# ${trimmed}\n\n`;
          } else if (currentLineIsHeading === 2) {
            pageMarkdown += `\n## ${trimmed}\n\n`;
          } else {
            pageMarkdown += trimmed + '\n';
          }
          currentLine = '';
          currentLineIsHeading = 0;
        };

        for (const item of items) {
          const str = item.str.trim();
          if (!str) continue;

          const y = item.transform[5];
          const height = Number(item.height) || medianFontSize;

          pageText += str + ' ';

          // Detect line break based on Y position change
          const isNewLine = lastY !== -1 && Math.abs(lastY - y) > Math.max(height, lastFontSize) * 0.5;

          if (isNewLine) {
            flushLine();
          }

          // Classify the text based on font size relative to document norms
          if (height >= h1Threshold && maxFontSize > medianFontSize * 1.3) {
            currentLineIsHeading = Math.max(currentLineIsHeading, 1);
          } else if (height >= h2Threshold && maxFontSize > medianFontSize * 1.15) {
            currentLineIsHeading = Math.max(currentLineIsHeading, 2);
          }

          currentLine += (currentLine ? ' ' : '') + str;
          lastY = y;
          lastFontSize = height;
        }

        flushLine(); // flush last line on page

        fullText += pageText + '\n';
        fullMarkdown += pageMarkdown + '\n\n---\n\n'; // Page separator
      }

      text = fullText.trim();
      markdown = cleanupMarkdown(fullMarkdown.trim());
    } else {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    self.postMessage({ id, text, markdown } as ParseFileResponse);
  } catch (error) {
    self.postMessage({
      id,
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ParseFileResponse);
  }
};

/**
 * Post-process markdown to clean up common PDF parsing artifacts:
 *  - Remove excessive blank lines
 *  - Merge broken paragraphs (lines that don't end with sentence terminators)
 */
function cleanupMarkdown(md: string): string {
  // Collapse 3+ consecutive newlines into 2
  let cleaned = md.replace(/\n{3,}/g, '\n\n');

  // Merge lines that look like broken paragraphs:
  // A line that doesn't end with . ! ? : and is followed by a line
  // that starts with a lowercase letter → merge them.
  cleaned = cleaned.replace(/([^\n.!?:\-#|>])\n(?=[a-záàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ])/g, '$1 ');

  return cleaned;
}
