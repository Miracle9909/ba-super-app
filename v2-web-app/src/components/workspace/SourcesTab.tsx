import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { v4 as uuidv4 } from 'uuid';
import { splitTextIntoChunks } from '../../lib/parsers/chunking';
import { embeddingClient } from '../../lib/llm/embeddingClient';
import { parseUrl } from '../../lib/parsers/urlParser';

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    try {
      const file = files[0];
      const sourceId = uuidv4();
      const blobId = uuidv4();

      // Lưu file vào blobs table
      const buffer = await file.arrayBuffer();
      await db.blobs.add({
        id: blobId,
        data: buffer,
        mimeType: file.type,
      });

      // Tạo source record pending
      await db.sources.add({
        id: sourceId,
        projectId,
        name: file.name,
        type: 'file',
        blobId: blobId,
        status: 'pending',
        extractedText: '',
        chunks: [],
        provenance: file.name,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      // Bắt đầu worker để parse
      const worker = new Worker(new URL('../../lib/parsers/fileParserWorker.ts', import.meta.url), {
        type: 'module'
      });

      worker.onmessage = async (e) => {
        const { status, text, error } = e.data;
        if (status === 'success') {
          const chunks = splitTextIntoChunks(text, 1000);
          
          // Generate embeddings and create knowledge items
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

          // Cập nhật status
          await db.sources.update(sourceId, {
            status: 'ready',
            extractedText: text,
            updatedAt: Date.now()
          });
        } else {
          // Cập nhật status lỗi
          await db.sources.update(sourceId, {
            status: 'error',
            errorMessage: error,
            updatedAt: Date.now()
          });
        }
        worker.terminate();
      };

      worker.postMessage({ buffer, fileType: file.name.split('.').pop()?.toLowerCase() }, [buffer]);

    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  const handlePasteSubmit = async () => {
    if (!pasteTitle.trim() || !pasteContent.trim()) return;
    
    setIsUploading(true);
    const sourceId = uuidv4();
    try {
      await db.sources.add({
        id: sourceId,
        projectId,
        name: pasteTitle.trim(),
        type: 'text',
        status: 'ready',
        extractedText: pasteContent,
        chunks: [],
        provenance: pasteTitle.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      });

      const chunks = splitTextIntoChunks(pasteContent, 1000);
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
          console.error("Embedding failed for paste chunk", err);
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
      const { text, chunks } = await parseUrl(urlInput.trim());
      
      await db.sources.add({
        id: sourceId,
        projectId,
        name: urlInput.trim(),
        type: 'url',
        status: 'ready',
        extractedText: text,
        chunks: [],
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

  return (
    <div className="flex flex-col h-full p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-text-primary">Danh sách tài liệu</h2>
        <div>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            accept=".pdf,.docx,.txt"
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
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-1/2">Tên tài liệu</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-1/4">Trạng thái</th>
                <th className="px-6 py-4 text-[13px] font-medium text-text-secondary w-1/4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b border-border-color/50 hover:bg-bg-surface transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-rounded text-primary/70">description</span>
                      <span className="text-[14px] text-text-primary font-medium">{source.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {source.status === 'ready' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[12px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Sẵn sàng</span>}
                    {source.status === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[12px] font-medium"><span className="material-symbols-rounded text-[14px] animate-spin">sync</span>Đang xử lý</span>}
                    {source.status === 'error' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[12px] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Lỗi</span>}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(source.id, source.blobId)}
                      className="text-text-secondary hover:text-red-500 transition-colors p-1"
                      title="Xóa tài liệu"
                    >
                      <span className="material-symbols-rounded text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
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
