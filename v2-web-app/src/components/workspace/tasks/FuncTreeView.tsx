import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { GhostBtn } from '../../ui/Buttons';
import { TaskBack } from '../../ui/TaskBack';
import { anthropicProvider } from '../../../lib/llm/anthropic';

interface FuncNode {
  id: string;
  name: string;
  hasReq: boolean;
}
interface FeatNode {
  id: string;
  name: string;
  kind: string;
  children: FuncNode[];
}
interface ModuleNode {
  id: string;
  name: string;
  kind: string;
  children: FeatNode[];
}

const SEED_TREE: ModuleNode[] = [
  {
    id: 'M-LOAN',
    name: 'Loan Management',
    kind: 'Module',
    children: [
      {
        id: 'F-APPL',
        name: 'Tiếp nhận hồ sơ',
        kind: 'Feature',
        children: [
          { id: 'FUNC-101', name: 'Tạo hồ sơ vay', hasReq: true },
          { id: 'FUNC-102', name: 'Tải tài liệu HSYC', hasReq: true },
          { id: 'FUNC-103', name: 'Kiểm tra CCCD', hasReq: true },
        ],
      },
      {
        id: 'F-VAL',
        name: 'Định giá TSĐB',
        kind: 'Feature',
        children: [
          { id: 'FUNC-110', name: 'Gửi yêu cầu định giá', hasReq: true },
          { id: 'FUNC-111', name: 'Nhận kết quả định giá', hasReq: true },
          { id: 'FUNC-112', name: 'Override định giá', hasReq: false },
        ],
      },
      {
        id: 'F-DECI',
        name: 'Quyết định cho vay',
        kind: 'Feature',
        children: [
          { id: 'FUNC-120', name: 'Chấm điểm tín dụng', hasReq: true },
          { id: 'FUNC-121', name: 'Duyệt / Từ chối', hasReq: true },
        ],
      },
    ],
  },
];

interface FuncTreeViewProps {
  projectId: string;
  onBack: () => void;
}

export const FuncTreeView: React.FC<FuncTreeViewProps> = ({ projectId, onBack }) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [tree, setTree] = useState<ModuleNode[]>(SEED_TREE);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [aiError, setAiError] = useState('');

  const tasks = useLiveQuery(
    () => db.tasks.where('projectId').equals(projectId).filter(t => t.type === 'function-tree').toArray(),
    [projectId]
  );

  // Load existing tree task (one per project) or seed a default.
  useEffect(() => {
    if (!tasks) return; // still loading
    const existing = tasks[0];
    if (existing) {
      setTaskId(existing.id);
      try {
        const parsed = JSON.parse(existing.content) as ModuleNode[];
        if (Array.isArray(parsed) && parsed.length) setTree(parsed);
      } catch (e) {
        console.error('FuncTreeView: failed to parse stored tree', e);
      }
    }
  }, [tasks]);

  const counts = useMemo(() => {
    const total = tree.reduce((s, m) => s + m.children.reduce((s2, f) => s2 + f.children.length, 0), 0);
    const linked = tree.reduce(
      (s, m) => s + m.children.reduce((s2, f) => s2 + f.children.filter(fn => fn.hasReq).length, 0),
      0
    );
    return { total, linked, unlinked: total - linked };
  }, [tree]);

  const persist = async (next: ModuleNode[]) => {
    const content = JSON.stringify(next);
    if (taskId) {
      await db.tasks.update(taskId, { content, updatedAt: Date.now() });
    } else {
      const newId = crypto.randomUUID();
      await db.tasks.add({
        id: newId,
        projectId,
        type: 'function-tree',
        title: 'Function tree',
        content,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setTaskId(newId);
    }
  };

  const update = (next: ModuleNode[]) => {
    setTree(next);
    void persist(next);
  };

  const addFn = (modId: string, featId: string) => {
    const newId = 'FUNC-' + (200 + Math.floor(Math.random() * 100));
    update(
      tree.map(m =>
        m.id !== modId
          ? m
          : {
              ...m,
              children: m.children.map(f =>
                f.id !== featId
                  ? f
                  : { ...f, children: [...f.children, { id: newId, name: 'Function mới (sửa tên)', hasReq: false }] }
              ),
            }
      )
    );
  };

  const removeFn = (modId: string, featId: string, fnId: string) => {
    update(
      tree.map(m =>
        m.id !== modId
          ? m
          : {
              ...m,
              children: m.children.map(f =>
                f.id !== featId ? f : { ...f, children: f.children.filter(fn => fn.id !== fnId) }
              ),
            }
      )
    );
  };

  const renameFn = (modId: string, featId: string, fnId: string, name: string) => {
    update(
      tree.map(m =>
        m.id !== modId
          ? m
          : {
              ...m,
              children: m.children.map(f =>
                f.id !== featId
                  ? f
                  : { ...f, children: f.children.map(fn => (fn.id !== fnId ? fn : { ...fn, name })) }
              ),
            }
      )
    );
  };

  const toggleReq = (modId: string, featId: string, fnId: string) => {
    update(
      tree.map(m =>
        m.id !== modId
          ? m
          : {
              ...m,
              children: m.children.map(f =>
                f.id !== featId
                  ? f
                  : { ...f, children: f.children.map(fn => (fn.id !== fnId ? fn : { ...fn, hasReq: !fn.hasReq })) }
              ),
            }
      )
    );
  };

  // AI: suggest requirement titles for unlinked functions, then mark them linked. Degrades gracefully.
  const aiFillMissing = async () => {
    const unlinked: { fnId: string; name: string }[] = [];
    tree.forEach(m =>
      m.children.forEach(f => f.children.forEach(fn => !fn.hasReq && unlinked.push({ fnId: fn.id, name: fn.name })))
    );
    if (!unlinked.length) return;

    setAiState('loading');
    setAiError('');
    try {
      const prompt = `Bạn là Business Analyst. Với mỗi function chưa có yêu cầu dưới đây, gợi ý 1 tiêu đề yêu cầu (requirement title) ngắn gọn theo chuẩn EARS.
Functions:
${unlinked.map(u => `- ${u.fnId}: ${u.name}`).join('\n')}

Trả về JSON DUY NHẤT, không markdown, dạng:
{"suggestions":[{"id":"FUNC-xxx","req":"tiêu đề yêu cầu"}]}`;

      const response = await anthropicProvider.generateResponse([{ role: 'user', content: prompt }]);
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const data = JSON.parse(cleaned) as { suggestions?: { id: string; req: string }[] };
      const suggestedIds = new Set((data.suggestions || []).map(s => s.id));

      const next = tree.map(m => ({
        ...m,
        children: m.children.map(f => ({
          ...f,
          children: f.children.map(fn => (suggestedIds.has(fn.id) ? { ...fn, hasReq: true } : fn)),
        })),
      }));
      update(next);
      setAiState('idle');
    } catch (e) {
      console.error('FuncTreeView: AI fill failed', e);
      setAiError('Không thể gọi AI. Vui lòng kiểm tra API key và thử lại.');
      setAiState('error');
    }
  };

  const loading = tasks === undefined;

  return (
    <div>
      <TaskBack
        onBack={onBack}
        title="Function list"
        sub="Editor: thêm / sửa tên / gắn req. AI tự nhận diện function thiếu yêu cầu."
      />

      {loading ? (
        <Card className="p-8 flex items-center justify-center gap-2 text-text-secondary text-[13px]">
          <Icon name="loader-2" size={16} className="animate-spin" /> Đang tải cây chức năng…
        </Card>
      ) : (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <span className="text-[13px] text-text-secondary">
              <span className="font-semibold text-text-primary">{counts.total}</span> functions ·{' '}
              <span style={{ color: '#137333' }}>{counts.linked} đã gắn yêu cầu</span> ·{' '}
              <span style={{ color: '#b06000' }}>{counts.unlinked} chưa gắn</span>
            </span>
            <GhostBtn
              icon={aiState === 'loading' ? 'loader-2' : 'wand-2'}
              tone="primary"
              disabled={aiState === 'loading' || counts.unlinked === 0}
              onClick={aiFillMissing}
            >
              {aiState === 'loading' ? 'Đang gợi ý…' : 'AI gắn req thiếu'}
            </GhostBtn>
          </div>

          {aiState === 'error' && (
            <div
              className="flex items-center gap-2 mb-4 p-3 rounded-xl text-[12.5px]"
              style={{ background: '#fce8e6', color: '#c5221f' }}
            >
              <Icon name="alert-triangle" size={14} strokeWidth={2.2} /> {aiError}
            </div>
          )}

          {tree.map(mod => (
            <div key={mod.id} className="mb-4 last:mb-0">
              <div className="flex items-center gap-2 py-2">
                <Icon name="chevron-down" size={16} className="text-text-secondary" />
                <span className="px-2 py-0.5 text-[10.5px] font-bold font-mono rounded bg-bg-active text-primary">
                  {mod.id}
                </span>
                <span className="text-[14px] font-semibold text-text-primary">{mod.name}</span>
                <span className="text-[11px] uppercase tracking-wider font-medium text-text-disabled">{mod.kind}</span>
              </div>
              <div className="ml-5 border-l border-border-color pl-5 flex flex-col gap-2">
                {mod.children.map(feat => (
                  <div key={feat.id} className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="chevron-down" size={14} className="text-text-secondary" />
                        <span className="text-[13px] font-semibold text-text-primary">{feat.name}</span>
                        <span className="text-[11px] uppercase tracking-wider font-medium text-text-disabled">
                          {feat.kind}
                        </span>
                      </div>
                      <button
                        onClick={() => addFn(mod.id, feat.id)}
                        className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-medium border border-border-color bg-white text-text-secondary hover:bg-bg-hover transition-colors"
                      >
                        <Icon name="plus" size={11} strokeWidth={2.4} /> Thêm function
                      </button>
                    </div>
                    <div className="ml-5 mt-1.5 flex flex-col gap-1.5">
                      {feat.children.map(fn => (
                        <div
                          key={fn.id}
                          className="flex items-center justify-between py-1.5 px-3 rounded-lg group hover:bg-bg-hover transition-colors"
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <span className="px-1.5 py-0.5 text-[10.5px] font-bold font-mono rounded shrink-0 bg-bg-hover text-text-secondary">
                              {fn.id}
                            </span>
                            <input
                              value={fn.name}
                              onChange={e => renameFn(mod.id, feat.id, fn.id, e.target.value)}
                              className="flex-1 text-[13px] bg-transparent outline-none border-b border-transparent focus:border-primary focus:border-dashed text-text-primary"
                              aria-label={`Tên function ${fn.id}`}
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleReq(mod.id, feat.id, fn.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded"
                              style={
                                fn.hasReq
                                  ? { background: '#e6f4ea', color: '#137333' }
                                  : { background: '#fef7e0', color: '#b06000' }
                              }
                            >
                              <Icon
                                name={fn.hasReq ? 'badge-check' : 'alert-triangle'}
                                size={11}
                                strokeWidth={2.2}
                              />
                              {fn.hasReq ? '≥1 req' : 'chưa gắn'}
                            </button>
                            <button
                              onClick={() => removeFn(mod.id, feat.id, fn.id)}
                              className="w-6 h-6 rounded-md flex items-center justify-center text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity hover:bg-bg-hover"
                              style={{ color: '#c5221f' }}
                              aria-label={`Xoá function ${fn.id}`}
                            >
                              <Icon name="trash-2" size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
};
