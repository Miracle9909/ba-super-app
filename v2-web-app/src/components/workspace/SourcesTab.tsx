import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { v4 as uuidv4 } from 'uuid';
import { splitTextIntoChunks } from '../../lib/parsers/chunking';
import { embeddingClient } from '../../lib/llm/embeddingClient';
import { parseUrl } from '../../lib/parsers/urlParser';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface SourcesTabProps {
  projectId: string;
}

export const SourcesTab: React.FC<SourcesTabProps> = ({ projectId }) => {
  const sources = useLiveQuery(() => db.sources.where('projectId').equals(projectId).toArray(), [projectId]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewMode, setPreviewMode] = useState<'markdown' | 'raw'>('markdown');

  const startFileWorker = async (sourceId: string, buffer: ArrayBuffer, fileType: string) => {
    const worker = new Worker(new URL('../../lib/parsers/fileParserWorker.ts', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = async (e) => {
      const { text, markdown, error } = e.data;
      if (!error) {
        const contentToChunk = markdown || text || '';
        const chunks = splitTextIntoChunks(contentToChunk, 1000);
        
        const knowledgeItems = [];
        for (const chunk of chunks) {
          try {
            const vector = await embeddingClient.embed(chunk);
            knowledgeItems.push({
              id: uuidv4(),
              sourceId,
              projectId,
              type: 'text' as const,
              content: chunk,
              vector,
              createdAt: Date.now(),
              updatedAt: Date.now()
            });
          } catch (err) {
            console.error("Embedding failed for chunk", err);
          }
        }
        
        if (knowledgeItems.length > 0) {
          await db.knowledge.bulkAdd(knowledgeItems);
        }

        await db.sources.update(sourceId, {
          status: 'ready',
          extractedText: text,
          markdownContent: markdown || text,
          chunks: chunks,
          updatedAt: Date.now()
        });
      } else {
        await db.sources.update(sourceId, {
          status: 'error',
          errorMessage: error,
          updatedAt: Date.now()
        });
      }
      worker.terminate();
    };

    worker.postMessage({ buffer, fileType }, [buffer]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const sourceId = uuidv4();
        const blobId = uuidv4();

        const buffer = await file.arrayBuffer();
        
        // Cần copy buffer cho việc lưu DB và worker vì postMessage transfer ownership của ArrayBuffer gốc
        const dbBuffer = buffer.slice(0);
        const workerBuffer = buffer.slice(0);

        await db.blobs.add({
          id: blobId,
          data: dbBuffer,
          mimeType: file.type,
        });

        await db.sources.add({
          id: sourceId,
          projectId,
          name: file.name,
          type: 'file',
          blobId: blobId,
          status: 'pending',
          extractedText: '',
          markdownContent: '',
          chunks: [],
          size: file.size,
          provenance: file.name,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });

        startFileWorker(sourceId, workerBuffer, file.name.split('.').pop()?.toLowerCase() || '');
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRetry = async (sourceId: string, blobId?: string, fileName?: string) => {
    if (!blobId || !fileName) return;
    try {
      await db.sources.update(sourceId, { status: 'pending', errorMessage: '', updatedAt: Date.now() });
      const blob = await db.blobs.get(blobId);
      if (blob) {
        const workerBuffer = blob.data.slice(0);
        startFileWorker(sourceId, workerBuffer, fileName.split('.').pop()?.toLowerCase() || '');
      }
    } catch(e) {
      console.error("Retry failed", e);
    }
  };

  const handleDelete = async (id: string, blobId?: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nguồn này?')) {
      await db.sources.delete(id);
      if (blobId) {
        await db.blobs.delete(blobId);
      }
      // Xóa knowledge liên quan
      await db.knowledge.where('sourceId').equals(id).delete();
    }
  };

  /**
   * Auto-detect if content looks like Markdown.
   * Checks for headings, lists, tables, code fences, bold/italic.
   */
  const detectMarkdown = (content: string): boolean => {
    const mdSignals = [
      /^#{1,6}\s+/m,           // Headings
      /^\s*[-*+]\s/m,          // Unordered lists
      /^\s*\d+\.\s/m,          // Ordered lists
      /^\|.+\|$/m,             // Tables
      /^```/m,                 // Code fences
      /\*\*.+\*\*/,            // Bold
      /\[.+\]\(.+\)/,          // Links
    ];
    const matchCount = mdSignals.filter(re => re.test(content)).length;
    return matchCount >= 2; // At least 2 markdown signals → treat as markdown
  };

  const handlePasteSubmit = async () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;

    setIsUploading(true);
    const sourceId = uuidv4();
    try {
      // Auto-detect: is the pasted content Markdown or plain text?
      const isMarkdown = detectMarkdown(pasteContent);
      const markdownContent = isMarkdown
        ? pasteContent
        : `# ${pasteTitle.trim()}\n\n${pasteContent.split('\n').map(line => line.trim()).filter(Boolean).join('\n\n')}`;

      const chunks = splitTextIntoChunks(markdownContent, 1000);

      await db.sources.add({
        id: sourceId,
        projectId,
        name: pasteTitle.trim(),
        type: 'text',
        status: 'ready',
        extractedText: pasteContent,
        markdownContent,
        chunks,
        size: pasteContent.length,
        provenance: pasteTitle.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const knowledgeItems = [];
      for (let i = 0; i < chunks.length; i++) {
        try {
          const vector = await embeddingClient.embed(chunks[i]);
          knowledgeItems.push({
            id: uuidv4(),
            sourceId,
            projectId,
            type: 'text' as const,
            content: chunks[i],
            vector,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        } catch (err) {
          console.error(`Embedding failed for paste chunk ${i + 1}/${chunks.length}`, err);
        }
      }

      if (knowledgeItems.length > 0) {
        await db.knowledge.bulkAdd(knowledgeItems);
      }

      setIsPasteModalOpen(false);
      setPasteTitle('');
      setPasteContent('');
    } catch (err) {
      console.error("Paste error", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput.trim()) return;
    
    setIsUploading(true);
    const sourceId = uuidv4();
    try {
      const { text, markdown, chunks } = await parseUrl(urlInput.trim());
      
      await db.sources.add({
        id: sourceId,
        projectId,
        name: urlInput.trim(),
        type: 'url',
        status: 'ready',
        extractedText: text,
        markdownContent: markdown,
        chunks: chunks,
        size: text.length,
        provenance: urlInput.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const knowledgeItems = [];
      for (const chunk of chunks) {
        try {
          const vector = await embeddingClient.embed(chunk);
          knowledgeItems.push({
            id: uuidv4(),
            sourceId,
            projectId,
            type: 'text' as const,
            content: chunk,
            vector,
            createdAt: Date.now(),
            updatedAt: Date.now()
          });
        } catch (err) {
          console.error("Embedding failed for URL chunk", err);
        }
      }

      if (knowledgeItems.length > 0) {
        await db.knowledge.bulkAdd(knowledgeItems);
      }

      setIsUrlModalOpen(false);
      setUrlInput('');
    } catch (err: any) {
      console.error("URL Fetch error", err);
      alert("Lỗi khi tải URL: " + (err.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        // Trigger file upload with dropped files
        const dataTransfer = new DataTransfer();
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          dataTransfer.items.add(e.dataTransfer.files[i]);
        }
        fileInputRef.current.files = dataTransfer.files;
        handleFileUpload({ target: fileInputRef.current } as any);
      }
    }
  };

  return (
    <div 
      className={`flex flex-col h-full p-8 transition-colors ${isDragging ? 'bg-primary/5 border-2 border-dashed border-primary rounded-xl' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-text-primary">Danh sách tài liệu</h2>
        <div>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt,.csv,.xlsx,.html,.md"
            multiple
          />
          <div className="flex gap-3">
            <button 
              className="bg-bg-surface text-text-primary border border-border-color px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 hover:bg-bg-surface-hover transition-colors disabled:opacity-50"
              onClick={() => setIsPasteModalOpen(true)}
              disabled={isUploading}
            >
              <span className="material-symbols-rounded text-[18px]">content_paste</span>
              Dán văn bản
            </button>
            <button 
              className="bg-bg-surface text-text-primary border border-border-color px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 hover:bg-bg-surface-hover transition-colors disabled:opacity-50"
              onClick={() => setIsUrlModalOpen(true)}
              disabled={isUploading}
            >
              <span className="material-symbols-rounded text-[18px]">link</span>
              Thêm URL
            </button>
            <button 
              className="bg-primary text-white px-4 py-2 rounded-full text-[14px] font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <span className="material-symbols-rounded text-[18px]">upload</span>
              {isUploading ? 'Đang tải lên...' : 'Tải tài liệu lên'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg-app rounded-xl border border-border-color">
        {sources && sources.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color">
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-[40%]">Tên tài liệu</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-[20%]">Trạng thái</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-[20%]">Thông tin</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-[20%]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <React.Fragment key={source.id}>
                  <tr className={`border-b border-border-color/50 hover:bg-bg-surface transition-colors ${expandedSourceId === source.id ? 'bg-bg-surface' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-rounded text-primary/70">description</span>
                        <div className="flex flex-col">
                          <span className="text-[14px] text-text-primary font-medium truncate max-w-[250px]">{source.name}</span>
                          {source.errorMessage && (
                            <span className="text-[11px] text-red-500 truncate max-w-[250px]" title={source.errorMessage}>{source.errorMessage}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {source.status === 'ready' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[12px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Sẵn sàng</span>}
                      {source.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[12px] font-medium"><span className="material-symbols-rounded text-[14px] animate-spin">sync</span>Đang xử lý</span>}
                      {source.status === 'error' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[12px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Lỗi</span>}
                    </td>
                    <td className="px-6 py-4 text-[12px] text-text-secondary">
                      <div className="flex flex-col gap-0.5">
                        <span>{formatBytes(source.size)}</span>
                        <span>{source.chunks?.length || 0} chunks</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {source.status === 'error' && source.type === 'file' && (
                          <button 
                            onClick={() => handleRetry(source.id, source.blobId, source.name)}
                            className="text-text-secondary hover:text-primary transition-colors p-1"
                            title="Thử lại"
                          >
                            <span className="material-symbols-rounded text-[20px]">refresh</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setExpandedSourceId(expandedSourceId === source.id ? null : source.id)}
                          className={`text-text-secondary hover:text-primary transition-colors p-1 ${expandedSourceId === source.id ? 'text-primary' : ''}`}
                          title="Xem nội dung"
                          disabled={!source.extractedText}
                        >
                          <span className="material-symbols-rounded text-[20px]">{expandedSourceId === source.id ? 'visibility_off' : 'visibility'}</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(source.id, source.blobId)}
                          className="text-text-secondary hover:text-red-500 transition-colors p-1"
                          title="Xóa tài liệu"
                        >
                          <span className="material-symbols-rounded text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedSourceId === source.id && (
                    <tr className="bg-bg-hover">
                      <td colSpan={4} className="p-0 border-b border-border-color">
                        <div className="p-6 max-h-[400px] overflow-y-auto">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-[13px] font-medium text-text-primary flex items-center gap-2">
                              <span className="material-symbols-rounded text-[16px]">notes</span>
                              Nội dung đã trích xuất
                            </h4>
                            <div className="flex bg-bg-surface rounded-lg p-1 border border-border-color">
                              <button
                                onClick={() => setPreviewMode('markdown')}
                                className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${previewMode === 'markdown' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                              >
                                Markdown
                              </button>
                              <button
                                onClick={() => setPreviewMode('raw')}
                                className={`px-3 py-1 rounded-md text-[12px] font-medium transition-colors ${previewMode === 'raw' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                              >
                                Raw Text
                              </button>
                            </div>
                          </div>
                          <div className="text-[13px] text-text-secondary bg-white border border-border-color p-4 rounded-lg">
                            {previewMode === 'markdown' && source.markdownContent ? (
                              <div className="markdown-body text-[14px]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {source.markdownContent}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap font-mono text-[13px]">
                                {source.extractedText || 'Chưa có nội dung.'}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary p-8 text-center">
            <span className="material-symbols-rounded text-[48px] text-border-color mb-4">folder_open</span>
            <p className="text-[15px] font-medium text-text-primary mb-1">Chưa có tài liệu nào</p>
            <p className="text-[14px] max-w-md">Tải lên các tài liệu dự án (BRD, SRS, Note, PDF, DOCX) để AI có thể phân tích và hỗ trợ bạn.</p>
          </div>
        )}
      </div>

      {/* Paste Modal */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-app rounded-2xl w-full max-w-2xl p-6 shadow-xl border border-border-color">
            <h3 className="text-xl font-medium text-text-primary mb-4">Dán văn bản</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">Tên tài liệu</label>
                <input 
                  type="text" 
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="Ví dụ: Ghi chú cuộc họp 14/10"
                  className="w-full bg-bg-surface border border-border-color rounded-lg px-4 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">Nội dung</label>
                <textarea 
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Dán nội dung văn bản vào đây..."
                  rows={10}
                  className="w-full bg-bg-surface border border-border-color rounded-lg px-4 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsPasteModalOpen(false)}
                className="px-4 py-2 rounded-full text-[14px] font-medium text-text-secondary hover:bg-bg-surface transition-colors"
                disabled={isUploading}
              >
                Hủy
              </button>
              <button 
                onClick={handlePasteSubmit}
                disabled={!pasteTitle.trim() || !pasteContent.trim() || isUploading}
                className="bg-primary text-white px-6 py-2 rounded-full text-[14px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Đang lưu...' : 'Lưu tài liệu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* URL Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-app rounded-2xl w-full max-w-lg p-6 shadow-xl border border-border-color">
            <h3 className="text-xl font-medium text-text-primary mb-4">Thêm URL</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1">Đường dẫn URL</label>
                <input 
                  type="url" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full bg-bg-surface border border-border-color rounded-lg px-4 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsUrlModalOpen(false)}
                className="px-4 py-2 rounded-full text-[14px] font-medium text-text-secondary hover:bg-bg-surface transition-colors"
                disabled={isUploading}
              >
                Hủy
              </button>
              <button 
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim() || isUploading}
                className="bg-primary text-white px-6 py-2 rounded-full text-[14px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Đang lấy dữ liệu...' : 'Thêm URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
