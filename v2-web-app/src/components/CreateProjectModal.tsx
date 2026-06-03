import React, { useState } from 'react';
import { db } from '../db/db';
import { Icon } from './ui/Icon';
import { PrimaryBtn, GhostBtn } from './ui/Buttons';

const DOMAINS = [
  { id: 'banking', label: 'Ngân hàng / Tài chính', icon: 'coins' },
  { id: 'insurance', label: 'Bảo hiểm', icon: 'shield-check' },
  { id: 'ecommerce', label: 'Thương mại điện tử', icon: 'shopping-cart' },
  { id: 'healthcare', label: 'Y tế / Sức khoẻ', icon: 'heart-pulse' },
  { id: 'education', label: 'Giáo dục', icon: 'book-open' },
  { id: 'telecom', label: 'Viễn thông', icon: 'phone' },
  { id: 'logistics', label: 'Logistics / Chuỗi cung ứng', icon: 'truck' },
  { id: 'general', label: 'Chung / Khác', icon: 'folder-open' },
];

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [domain, setDomain] = useState('banking');
  const [creating, setCreating] = useState(false);

  if (!open) return null;

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const id = crypto.randomUUID();
      await db.projects.add({
        id,
        name: name.trim(),
        description: desc.trim(),
        domain,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      onCreated(id);
      setName('');
      setDesc('');
      setDomain('banking');
    } catch (err) {
      console.error('Create project error:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-[540px] rounded-3xl bg-white shadow-2xl"
        style={{ animation: 'modalIn .2s ease-out' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-text-primary">Tạo dự án mới</h2>
            <p className="text-[13px] text-text-secondary mt-1">Khai phá tri thức với chuyên gia AI theo ngành</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors"
          >
            <Icon name="x" size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-7 space-y-5">
          {/* Name */}
          <div>
            <label className="text-[13px] font-medium text-text-primary mb-1.5 block">Tên dự án *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Hệ thống vay tiêu dùng online"
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl text-[14px] border border-border-color text-text-primary focus:outline-none focus:border-primary transition-colors placeholder:text-text-disabled"
              style={{ boxShadow: 'none' }}
              onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(11,87,208,0.12)'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[13px] font-medium text-text-primary mb-1.5 block">Mô tả (tùy chọn)</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Mô tả ngắn về dự án..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-[14px] border border-border-color text-text-primary focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-text-disabled"
              onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(11,87,208,0.12)'}
              onBlur={e => e.target.style.boxShadow = 'none'}
            />
          </div>

          {/* Domain picker */}
          <div>
            <label className="text-[13px] font-medium text-text-primary mb-2.5 block">Lĩnh vực chuyên gia</label>
            <div className="grid grid-cols-2 gap-2">
              {DOMAINS.map(d => {
                const active = domain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setDomain(d.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium border transition-all text-left ${
                      active
                        ? 'bg-primary/[.07] border-primary text-primary'
                        : 'bg-white border-border-color text-text-secondary hover:border-primary/40 hover:text-text-primary'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? 'bg-primary text-white' : 'bg-bg-hover text-text-disabled'
                      }`}
                    >
                      <Icon name={d.icon} size={15} strokeWidth={2} />
                    </div>
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <GhostBtn onClick={onClose}>Huỷ</GhostBtn>
            <div style={{ opacity: (!name.trim() || creating) ? 0.5 : 1, pointerEvents: (!name.trim() || creating) ? 'none' : 'auto' }}>
              <PrimaryBtn
                icon="rocket"
                onClick={handleCreate}
              >
                {creating ? 'Đang tạo...' : 'Tạo dự án'}
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { transform: scale(.96) translateY(8px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
