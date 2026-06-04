import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Card } from '../../ui/Card';
import { PrimaryBtn, GhostBtn } from '../../ui/Buttons';
import { Icon } from '../../ui/Icon';
import { TaskBack } from '../../ui/TaskBack';
import { DIAGRAM_TYPES, tonePair, type DiagramType } from '../../../lib/ba/domainExpert';
import { db, type Task } from '../../../db/db';
import { anthropicProvider } from '../../../lib/llm/anthropic';
import { DiagramSVG } from './diagramRenderers';

/* The shape we serialize into Task.content for type === 'diagram'. */
interface DiagramState {
  type: string;
  title: string;
  mermaid: string;
  linked: { kind: string; id: string } | null;
}

const TASK_TYPE = 'diagram';
const ALL = 'all';

/* Parse a persisted diagram task into its view state (tolerant of bad JSON). */
function parseDiagram(task: Task): DiagramState {
  try {
    const parsed = JSON.parse(task.content) as Partial<DiagramState>;
    return {
      type: parsed.type || 'flow',
      title: parsed.title || task.title,
      mermaid: parsed.mermaid || '',
      linked: parsed.linked ?? null,
    };
  } catch {
    return { type: 'flow', title: task.title, mermaid: task.content || '', linked: null };
  }
}

function typeDef(typeId: string): DiagramType | undefined {
  return DIAGRAM_TYPES.find((t) => t.id === typeId);
}

/* ===================== DiagramCard ===================== */
interface DiagramCardProps {
  task: Task;
  onOpen: (task: Task) => void;
}

const DiagramCard: React.FC<DiagramCardProps> = ({ task, onOpen }) => {
  const diag = parseDiagram(task);
  const tdef = typeDef(diag.type);
  const tone = tonePair(tdef?.tone);
  const updated = new Date(task.updatedAt).toLocaleDateString('vi-VN');

  return (
    <Card hover onClick={() => onOpen(task)} className="p-0 overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: tone.bg, color: tone.fg }}>
            <Icon name={tdef?.icon || 'git-branch'} size={14} strokeWidth={2} />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tone.fg }}>{tdef?.label || diag.type}</span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: '#e8f0fe', color: '#1967d2' }}>
            <Icon name="sparkles" size={9} strokeWidth={2.2} /> AI
          </span>
        </div>
        <div className="text-[14px] font-semibold leading-tight text-text-primary">{diag.title}</div>
        <div className="text-[11.5px] mt-1 flex items-center gap-2 flex-wrap text-text-secondary">
          {diag.linked && (
            <span className="font-mono px-1.5 py-0.5 rounded" style={{ background: '#f1f3f4' }}>{diag.linked.id}</span>
          )}
          <span>·</span>
          <span>{updated}</span>
        </div>
      </div>
      <div className="px-2 pb-3 pt-1" style={{ background: '#fcfdff' }}>
        <div style={{ height: 130, overflow: 'hidden', borderRadius: 10, background: '#fff' }} className="border border-border-color">
          <DiagramSVG type={diag.type} />
        </div>
      </div>
      <div className="px-4 py-2.5 border-t border-border-color flex items-center gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(task); }}
          className="flex-1 h-8 rounded-full text-[12.5px] font-medium border border-border-color bg-white text-text-secondary inline-flex items-center justify-center gap-1.5 transition-colors hover:bg-bg-hover"
        >
          <Icon name="eye" size={13} /> Xem
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); downloadDiagram(diag); }}
          className="flex-1 h-8 rounded-full text-[12.5px] font-medium border border-border-color bg-white text-text-secondary inline-flex items-center justify-center gap-1.5 transition-colors hover:bg-bg-hover"
        >
          <Icon name="file-down" size={13} /> Tải
        </button>
      </div>
    </Card>
  );
};

/* Download the AI-generated mermaid source as a .mmd file. */
function downloadDiagram(diag: DiagramState) {
  const blob = new Blob([diag.mermaid], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${diag.title || 'diagram'}.mmd`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ===================== DiagramViewerModal ===================== */
interface DiagramViewerModalProps {
  task: Task | null;
  onClose: () => void;
}

const DiagramViewerModal: React.FC<DiagramViewerModalProps> = ({ task, onClose }) => {
  if (!task) return null;
  const diag = parseDiagram(task);
  const tdef = typeDef(diag.type);
  const tone = tonePair(tdef?.tone);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(15,23,42,.45)' }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-[1040px] w-[94vw] max-h-[92vh] overflow-hidden flex flex-col border border-border-color"
      >
        <div className="px-6 py-4 flex items-start justify-between gap-4 border-b border-border-color">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: tone.bg, color: tone.fg }}>
                <Icon name={tdef?.icon || 'git-branch'} size={16} strokeWidth={2} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tone.fg }}>{tdef?.label || diag.type}</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded text-text-secondary" style={{ background: '#f1f3f4' }}>{task.id.slice(0, 8)}</span>
            </div>
            <h2 className="text-[17px] font-semibold tracking-tight text-text-primary">{diag.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <GhostBtn icon="file-down" onClick={() => downloadDiagram(diag)}>Tải .mmd</GhostBtn>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-secondary transition-colors hover:bg-bg-hover"
              title="Đóng"
            >
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ background: '#fcfdff' }}>
          <div className="bg-white border border-border-color" style={{ borderRadius: 16, padding: 16 }}>
            <DiagramSVG type={diag.type} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-text-secondary mb-2">
              <Icon name="sparkles" size={13} strokeWidth={2} /> Mermaid (AI)
            </div>
            <pre
              className="text-[12.5px] font-mono leading-relaxed text-text-primary overflow-x-auto whitespace-pre-wrap bg-white border border-border-color rounded-xl p-4"
            >
              {diag.mermaid || '// Không có mã mermaid.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===================== Filter pills ===================== */
interface FilterPillsProps {
  active: string;
  onChange: (id: string) => void;
}

const FilterPills: React.FC<FilterPillsProps> = ({ active, onChange }) => {
  const pills: { id: string; label: string }[] = [
    { id: ALL, label: 'Tất cả' },
    ...DIAGRAM_TYPES.map((t) => ({ id: t.id, label: t.label })),
  ];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pills.map((p) => {
        const isActive = p.id === active;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`h-8 px-3.5 rounded-full text-[12.5px] font-medium border transition-colors ${
              isActive
                ? 'bg-primary-container text-on-primary-container border-transparent'
                : 'bg-white text-text-secondary border-border-color hover:bg-bg-hover'
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
};

/* ===================== Main view ===================== */
interface DiagramsViewProps {
  projectId: string;
  onBack: () => void;
}

export const DiagramsView: React.FC<DiagramsViewProps> = ({ projectId, onBack }) => {
  const [filter, setFilter] = useState<string>(ALL);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [generatingType, setGeneratingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tasks = useLiveQuery(
    () => db.tasks.where('projectId').equals(projectId).filter((t) => t.type === TASK_TYPE).toArray(),
    [projectId],
  );

  const filtered = useMemo(() => {
    const list = tasks || [];
    const visible = filter === ALL ? list : list.filter((t) => parseDiagram(t).type === filter);
    return [...visible].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [tasks, filter]);

  const isLoading = tasks === undefined;
  const isGenerating = generatingType !== null;

  async function generate(typeId: string) {
    const tdef = typeDef(typeId);
    if (!tdef || isGenerating) return;
    setGeneratingType(typeId);
    setError(null);
    try {
      const knowledge = await db.knowledge.where('projectId').equals(projectId).toArray();
      const context = knowledge.map((k) => k.content).join('\n\n').slice(0, 12000);

      const prompt = [
        `Bạn là chuyên gia Business Analyst. Dựa trên tri thức dự án dưới đây, hãy sinh một sơ đồ "${tdef.label}" (${tdef.desc}).`,
        `Trả về DUY NHẤT mã Mermaid hợp lệ thuộc loại "${tdef.mermaid}". Không giải thích, không bọc trong dấu backtick.`,
        '',
        '--- TRI THỨC DỰ ÁN ---',
        context || '(Chưa có tri thức — hãy tạo sơ đồ mẫu hợp lý cho miền nghiệp vụ chung.)',
      ].join('\n');

      const raw = await anthropicProvider.generateResponse([{ role: 'user', content: prompt }]);
      const mermaid = stripFences(raw).trim();

      const state: DiagramState = {
        type: typeId,
        title: `${tdef.label} — sinh bởi AI`,
        mermaid,
        linked: null,
      };
      const now = Date.now();
      const task: Task = {
        id: crypto.randomUUID(),
        projectId,
        type: TASK_TYPE,
        title: state.title,
        content: JSON.stringify(state),
        status: 'draft',
        createdAt: now,
        updatedAt: now,
      };
      await db.tasks.add(task);
    } catch (e) {
      console.error('[DiagramsView] generate failed', e);
      setError(e instanceof Error ? e.message : 'Sinh sơ đồ thất bại. Kiểm tra API key và thử lại.');
    } finally {
      setGeneratingType(null);
    }
  }

  return (
    <div>
      <TaskBack
        onBack={onBack}
        title="Sơ đồ nghiệp vụ"
        sub="Sinh sơ đồ BPMN, sequence, ER... bằng AI từ tri thức dự án"
        right={<PrimaryBtn icon="sparkles" disabled={isGenerating} onClick={() => generate(DIAGRAM_TYPES[0].id)}>Sinh sơ đồ bằng AI</PrimaryBtn>}
      />

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-border-color px-4 py-3 text-[13px]" style={{ background: '#fce8e6', color: '#c5221f' }}>
          <Icon name="alert-triangle" size={16} strokeWidth={2} />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="shrink-0"><Icon name="x" size={15} /></button>
        </div>
      )}

      {/* Quick-start grid: one card per diagram type. */}
      <div className="mb-6">
        <div className="text-[13px] font-semibold uppercase tracking-wider text-text-secondary mb-3">Bắt đầu nhanh</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {DIAGRAM_TYPES.map((t) => {
            const tone = tonePair(t.tone);
            const busy = generatingType === t.id;
            return (
              <Card key={t.id} hover={!isGenerating} onClick={isGenerating ? undefined : () => generate(t.id)} className="p-3.5 flex flex-col gap-2">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: tone.bg, color: tone.fg }}>
                  <Icon name={busy ? 'loader-2' : t.icon} size={18} strokeWidth={2} className={busy ? 'animate-spin' : ''} />
                </span>
                <div className="text-[13px] font-semibold leading-tight text-text-primary">{t.label}</div>
                <div className="text-[11.5px] leading-snug text-text-secondary">{busy ? 'Đang sinh...' : t.desc}</div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Filter pills. */}
      <div className="mb-5">
        <FilterPills active={filter} onChange={setFilter} />
      </div>

      {/* Saved diagrams. */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-border-color rounded-2xl bg-bg-surface animate-pulse" style={{ height: 280 }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-10 flex flex-col items-center justify-center text-center gap-3">
          <span className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#e8f0fe', color: '#1967d2' }}>
            <Icon name="square-kanban" size={24} strokeWidth={1.8} />
          </span>
          <div className="text-[15px] font-semibold text-text-primary">Chưa có sơ đồ nào</div>
          <div className="text-[13px] text-text-secondary max-w-[360px]">
            {filter === ALL
              ? 'Chọn một loại sơ đồ ở mục "Bắt đầu nhanh" để AI sinh sơ đồ đầu tiên từ tri thức dự án.'
              : 'Không có sơ đồ thuộc loại này. Thử bộ lọc khác hoặc sinh sơ đồ mới.'}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <DiagramCard key={t.id} task={t} onOpen={setViewing} />
          ))}
        </div>
      )}

      <DiagramViewerModal task={viewing} onClose={() => setViewing(null)} />
    </div>
  );
};

/* Strip ```mermaid ... ``` fences the model may add despite instructions. */
function stripFences(s: string): string {
  const fence = s.match(/```(?:mermaid)?\s*([\s\S]*?)```/i);
  return fence ? fence[1] : s;
}
