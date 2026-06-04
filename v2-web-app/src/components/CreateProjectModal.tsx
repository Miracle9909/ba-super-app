import React, { useState } from 'react';
import { db } from '../db/db';
import { Icon } from './ui/Icon';
import { PrimaryBtn, GhostBtn } from './ui/Buttons';
import { tonePair, type ToneId } from '../lib/ba/domainExpert';

/* ---- Industries (matching prototype v3, 7 industries) ---- */
const MODAL_INDUSTRIES = [
  { id: 'banking',    short: 'Banking',    bg: '#e8f0fe', fg: '#1967d2', icon: 'landmark'           },
  { id: 'insurance',  short: 'Insurance',  bg: '#fce8e6', fg: '#c5221f', icon: 'briefcase'          },
  { id: 'fintech',    short: 'Fintech',    bg: '#e6f4ea', fg: '#137333', icon: 'circle-dollar-sign' },
  { id: 'ecommerce',  short: 'E-commerce', bg: '#fef7e0', fg: '#b06000', icon: 'shopping-cart'      },
  { id: 'saas',       short: 'SaaS',       bg: '#e8eaff', fg: '#3f51b5', icon: 'cloud'              },
  { id: 'healthcare', short: 'Healthcare', bg: '#e6f4ea', fg: '#0b8043', icon: 'heart-pulse'        },
  { id: 'game',       short: 'Game',       bg: '#f3e8fd', fg: '#8430ce', icon: 'gamepad-2'          },
];

/* ---- Template categories (library) ---- */
interface TplCat { id: string; label: string; group: string; icon: string; tone: ToneId }
const TEMPLATE_CATEGORIES: TplCat[] = [
  { id: 'brd',      label: 'BRD',                     group: 'Đặc tả',       icon: 'file-pen-line', tone: 'indigo' },
  { id: 'srs',      label: 'SRS',                     group: 'Đặc tả',       icon: 'scroll-text',   tone: 'purple' },
  { id: 'tech',     label: 'Kỹ thuật / Architecture',  group: 'Đặc tả',       icon: 'file-text',     tone: 'sky'    },
  { id: 'usecase',  label: 'Use Case',                group: 'Đặc tả',       icon: 'git-branch',    tone: 'purple' },
  { id: 'ac',       label: 'Acceptance Criteria',     group: 'Đặc tả',       icon: 'check-circle',  tone: 'green'  },
  { id: 'quote',    label: 'Báo giá',                 group: 'Thương mại',   icon: 'coins',         tone: 'amber'  },
  { id: 'estimate', label: 'Estimation',              group: 'Thương mại',   icon: 'calculator',    tone: 'amber'  },
  { id: 'rfp',      label: 'RFP Response',            group: 'Thương mại',   icon: 'file-text',     tone: 'indigo' },
  { id: 'funcs',    label: 'Function list',           group: 'Lập kế hoạch', icon: 'list-tree',     tone: 'sky'    },
  { id: 'testplan', label: 'Test Plan',               group: 'Chất lượng',   icon: 'badge-check',   tone: 'rose'   },
  { id: 'risk',     label: 'Risk Register',           group: 'Chất lượng',   icon: 'alert-triangle', tone: 'rose'  },
  { id: 'guide',    label: 'User Guide',              group: 'Hướng dẫn',    icon: 'book-copy',     tone: 'green'  },
];

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ open, onClose, onCreated }) => {
  const [name, setName]           = useState('');
  const [domain, setDomain]       = useState('banking');
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [goal, setGoal]           = useState('');
  const [activeCats, setActiveCats] = useState<string[]>(['brd', 'srs']);
  const [creating, setCreating]   = useState(false);

  if (!open) return null;

  const canCreate = !!name.trim();

  const toggleCat = (id: string) =>
    setActiveCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const id = crypto.randomUUID();
      await db.projects.add({
        id,
        name: name.trim(),
        description: goal.trim(),
        domain,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      onCreated(id);
      setName('');
      setGoal('');
      setDomain('banking');
      setActiveCats(['brd', 'srs']);
    } catch (err) {
      console.error('Create project error:', err);
    } finally {
      setCreating(false);
    }
  };

  const grouped: Record<string, TplCat[]> = {};
  TEMPLATE_CATEGORIES.forEach(c => { (grouped[c.group] ||= []).push(c); });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,.40)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-[900px] w-[94vw] max-h-[94vh] overflow-y-auto"
        style={{ border: '1px solid var(--border-color)' }}
      >

        {/* ---- Header ---- */}
        <div className="px-7 pt-6 pb-4 flex items-start justify-between gap-4 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: 'var(--border-color)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="rocket" size={20} className="text-primary" />
              <h2 className="text-[18px] font-semibold tracking-tight text-text-primary">Tạo dự án mới</h2>
            </div>
            <p className="text-[13px] text-text-secondary">
              Lớp 1: Input — chọn ngành, nạp mô tả/nguồn &amp; (tuỳ chọn) đính tài liệu mẫu để output theo đúng định dạng.
            </p>
          </div>
          <button onClick={onClose} title="Đóng"
            className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover transition-colors">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* ---- Body ---- */}
        <div className="px-7 py-6 flex flex-col gap-6">

          {/* 1. Name + Industry */}
          <div className="grid grid-cols-3 gap-5">
            {/* Name (1/3) */}
            <div className="col-span-1">
              <label className="block text-[12.5px] font-semibold mb-1.5 text-text-primary">Tên dự án</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="VD: BIDV Home GĐ3"
                autoFocus
                className="w-full h-11 px-3.5 rounded-xl text-[14px] outline-none transition-all text-text-primary"
                style={{ border: '1px solid var(--border-color)', background: '#fff' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(11,87,208,.12)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
              <div className="mt-3 p-3 rounded-xl text-[11.5px] leading-relaxed flex items-start gap-1.5"
                style={{ background: '#fcfdff', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
                <Icon name="info" size={12} strokeWidth={2.2} className="text-primary shrink-0 mt-px" />
                <span>Ràng buộc / chuẩn áp dụng sẽ được chuyên gia ngành <strong className="text-text-primary">hỏi &amp; làm rõ trong cuộc hội thoại</strong> ở bước Khai phá.</span>
              </div>
            </div>

            {/* Industry (2/3) */}
            <div className="col-span-2">
              <label className="block text-[12.5px] font-semibold mb-2 text-text-primary">Ngành (chọn 1)</label>
              <div className="grid grid-cols-4 gap-2">
                {MODAL_INDUSTRIES.map(ind => {
                  const sel = domain === ind.id;
                  return (
                    <button key={ind.id} onClick={() => setDomain(ind.id)}
                      style={{
                        borderColor: sel ? ind.fg : 'var(--border-color)',
                        background:  sel ? ind.bg : '#fff',
                        boxShadow:   sel ? `0 0 0 1px ${ind.fg} inset` : 'none',
                      }}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: sel ? '#fff' : ind.bg, color: ind.fg }}>
                        <Icon name={ind.icon} size={18} strokeWidth={2} />
                      </div>
                      <span className="text-[12px] font-medium leading-tight text-center"
                        style={{ color: sel ? ind.fg : 'var(--text-primary)' }}>
                        {ind.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Description / goal */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[12.5px] font-semibold text-text-primary">Mô tả dự án &amp; nguồn input</label>
              <div className="inline-flex items-center gap-1 p-1 rounded-lg" style={{ background: '#f1f3f4' }}>
                {[
                  { id: 'text' as const, label: 'Nhập text',   icon: 'file-text' },
                  { id: 'file' as const, label: 'Upload file', icon: 'upload'    },
                ].map(m => {
                  const sel = inputMode === m.id;
                  return (
                    <button key={m.id} onClick={() => setInputMode(m.id)}
                      style={sel
                        ? { background: '#fff', color: 'var(--primary)', boxShadow: '0 1px 2px rgba(60,64,67,.12)' }
                        : { background: 'transparent', color: 'var(--text-secondary)' }}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium transition-all">
                      <Icon name={m.icon} size={14} strokeWidth={2} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {inputMode === 'text' ? (
              <textarea value={goal} onChange={e => setGoal(e.target.value)} rows={4}
                placeholder="Mô tả phạm vi, mục tiêu, ràng buộc của dự án…"
                className="w-full px-3.5 py-3 rounded-xl text-[14px] outline-none resize-none transition-all leading-relaxed text-text-primary"
                style={{ border: '1px solid var(--border-color)', background: '#fff' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(11,87,208,.12)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.boxShadow = 'none'; }}
              />
            ) : (
              <div className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8 text-center"
                style={{ borderColor: 'var(--border-color)', background: '#fcfdff' }}>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-bg-active text-primary">
                  <Icon name="upload" size={22} strokeWidth={2} />
                </div>
                <div className="text-[13.5px] font-semibold text-text-primary">Kéo thả hoặc bấm để chọn</div>
                <div className="text-[11.5px] text-text-secondary">.doc · .docx · .xlsx · .md · .pdf · nhiều file</div>
                <p className="text-[11px] text-text-disabled mt-1">
                  Files được xử lý sau khi tạo dự án trong tab Nguồn dữ liệu
                </p>
              </div>
            )}
          </div>

          {/* 3. Template library */}
          <div>
            <div className="mb-3">
              <label className="block text-[12.5px] font-semibold text-text-primary">
                Tài liệu mẫu tham chiếu{' '}
                <span className="font-normal text-text-disabled">(tuỳ chọn)</span>
              </label>
              <p className="text-[12px] mt-0.5 text-text-secondary">
                Chọn loại tài liệu cần — output cùng loại sẽ{' '}
                <strong>render theo đúng định dạng mẫu đã nạp</strong>. Mỗi loại nhận nhiều file đa định dạng.
              </p>
            </div>

            <div className="rounded-2xl border p-3.5 mb-3"
              style={{ borderColor: 'var(--border-color)', background: '#fcfdff' }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-2.5 text-text-disabled">
                Thư viện loại tài liệu — bấm để thêm vào dự án
              </div>
              <div className="flex flex-col gap-2.5">
                {Object.entries(grouped).map(([group, items]) => (
                  <div key={group}>
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5 text-text-secondary">
                      {group}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(cat => {
                        const on   = activeCats.includes(cat.id);
                        const tone = tonePair(cat.tone);
                        return (
                          <button key={cat.id} onClick={() => toggleCat(cat.id)}
                            style={on
                              ? { background: tone.bg, color: tone.fg, borderColor: tone.fg }
                              : { background: '#fff', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[12.5px] font-medium border transition-colors">
                            <Icon name={cat.icon} size={13} strokeWidth={2} />
                            {cat.label}
                            {on && <Icon name="check" size={12} strokeWidth={2.6} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl text-[12px] leading-relaxed flex items-start gap-2"
              style={{ background: '#fcfdff', border: '1px solid var(--border-color)' }}>
              <Icon name="info" size={14} strokeWidth={2.1} className="text-primary shrink-0 mt-0.5" />
              <span className="text-text-secondary">
                Mỗi loại bạn đính sẽ xuất hiện trong{' '}
                <strong className="text-text-primary">Trung tâm Xuất</strong> — AI render output đúng
                layout &amp; ngôn ngữ của file mẫu tương ứng. Loại không đính sẽ dùng template chuẩn.
              </span>
            </div>
          </div>
        </div>

        {/* ---- Footer ---- */}
        <div className="px-7 py-4 flex items-center justify-between gap-3 border-t sticky bottom-0"
          style={{ borderColor: 'var(--border-color)', background: '#fcfdff' }}>
          <div className="text-[12px] text-text-secondary flex items-center gap-3">
            {activeCats.length > 0 && (
              <span className="inline-flex items-center gap-1">
                <Icon name="layout-template" size={13} />
                {activeCats.length} loại tài liệu mẫu
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <GhostBtn onClick={onClose}>Huỷ</GhostBtn>
            <div style={{ opacity: (!canCreate || creating) ? 0.5 : 1, pointerEvents: (!canCreate || creating) ? 'none' : 'auto' }}>
              <PrimaryBtn icon="rocket" onClick={handleCreate}>
                {creating ? 'Đang tạo…' : 'Tạo & bắt đầu khai phá'}
              </PrimaryBtn>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
