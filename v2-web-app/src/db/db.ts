import Dexie, { type EntityTable } from 'dexie';

export interface Project {
  id: string;
  name: string;
  domain: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface BlobData {
  id: string;
  data: ArrayBuffer;
  mimeType: string;
}

export interface Source {
  id: string;
  projectId: string;
  name: string;
  type: 'file' | 'url' | 'text';
  status: 'pending' | 'parsed' | 'ready' | 'error';
  blobId?: string;
  extractedText: string;
  chunks: string[];
  provenance: string; // e.g., filename or url
  errorMessage?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Knowledge {
  id: string;
  projectId: string;
  type?: 'entity' | 'rule' | 'term' | 'text'; // added text
  content: string;
  vector?: number[]; // For basic cosine similarity in JS
  sourceId: string; // Reference to Source.id
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  projectId: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const db = new Dexie('BASuperAppDatabase') as Dexie & {
  projects: EntityTable<Project, 'id'>;
  sources: EntityTable<Source, 'id'>;
  blobs: EntityTable<BlobData, 'id'>;
  knowledge: EntityTable<Knowledge, 'id'>;
  conversations: EntityTable<Conversation, 'id'>;
};

// Schema declaration
db.version(2).stores({
  projects: 'id, name, domain, createdAt, updatedAt',
  sources: 'id, projectId, type, status, blobId, createdAt',
  blobs: 'id',
  knowledge: 'id, projectId, type, sourceId, createdAt',
  conversations: 'id, projectId, updatedAt'
});

export { db };
