export interface ParseFileRequest {
  id: string;
  file: File;
  type: 'pdf' | 'docx' | 'txt' | 'md' | 'html' | 'csv' | 'xlsx';
}

export interface ParseFileResponse {
  id: string;
  text: string;
  markdown: string;
  error?: string;
}

export interface IFileParser {
  parse(file: File): Promise<string>;
}
