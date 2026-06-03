export interface ParseFileRequest {
  id: string;
  file: File;
  type: 'pdf' | 'docx' | 'txt';
}

export interface ParseFileResponse {
  id: string;
  text: string;
  error?: string;
}

export interface IFileParser {
  parse(file: File): Promise<string>;
}
