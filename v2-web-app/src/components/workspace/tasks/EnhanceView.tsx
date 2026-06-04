import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../../db/db';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { GhostBtn, PrimaryBtn } from '../../ui/Buttons';
import { TaskBack } from '../../ui/TaskBack';
import { anthropicProvider } from '../../../lib/llm/anthropic';

type ImpactKind = 'req' | 'function' | 'tc';
type ImpactLabel = 'add' | 'mod' | 'remove';

interface ImpactItem {
  kind: ImpactKind;
  id: string;
  text: string;
  label: ImpactLabel;
}

interface EnhanceState {
  desc: string;
  impacts: ImpactItem[];
  deltaSpec: string;
}

const SEED: EnhanceState = {
  desc: 'Đề xuất hạ ngưỡng định giá độc lập từ 2 tỷ xuống 1.5 tỷ để mở rộng phân khúc.',
  impacts: [
    { kind: 'req', id: 'BRD-REQ-12', text: 'Cập nhật ngưỡng định giá độc lập từ 2 tỷ → 1.5 tỷ', label: 'mod' },
    { kind: 'function', id: 'FUNC-110', text: 'Thay đổi điều kiện kích hoạt gửi yêu cầu', label: 'mod' },
    { kind: 'function', id: 'FUNC-130', text: 'Tách flow định giá nội bộ cho khoản nhỏ', label: 'add' },
    { kind: 'tc', id: 'TC-088', text: 'Bổ sung kịch bản TSĐB ở ngưỡng mới', label: 'mod' },
    { kind: 'tc', id: 'TC-061', text: 'Loại bỏ test case cũ cho ngưỡng 2 tỷ', label: 'remove' },
  ],
  deltaSpec: '',
};

const LABEL_META: Record<ImpactLabel, { text: string; bg: string; fg: string }> = {
  add: { text: 'Thêm', bg: '#e6f4ea', fg: '#137333' },
  mod: { text: 'Sửa', bg: '#fef7e0', fg: '#b06000' },
  remove: { text: 'Bỏ', bg: '#fce8e6', fg: '#c5221f' },
};

const KIND_LABEL: Record<ImpactKind, string> = { req: 'req', function: 'function', tc: 'TC' };

interface EnhanceViewProps {
  projectId: string;
  onBack: () => void;
}

export const EnhanceView: React.FC<EnhanceViewProps> = ({ projectId, onBack }) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [desc, setDesc] = useState(SEED.desc);
  const [impacts, setImpacts] = useState<ImpactItem[]>(SEED.impacts);
  const [deltaSpec, setDeltaSpec] = useState('');
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [aiError, setAiError] = useState('');

  const tasks = useLiveQuery(
    () => db.tasks.where('projectId').equals(projectId).filter(t => t.type === 'enhance').toArray(),
    [projectId]
  );
  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const knowledge = useLiveQuery(
    () => db.knowledge.where('projectId').equals(projectId).toArray(),
    [projectId]
  );

  useEffect(() => {
    if (!tasks) return;
    const existing = tasks[0];
    if (existing) {
      setTaskId(existing.id);
      try {
        const parsed = JSON.parse(existing.content) as EnhanceState;
        setDesc(parsed.desc || '');
        setImpacts(parsed.impacts || []);
        setDeltaSpec(parsed.deltaSpec || '');
      } catch (e) {
        console.error('EnhanceView: failed to parse stored state', e);
      }
    }
  }, [tasks]);

  const summary = useMemo(() => {
    const count = (kind: ImpactKind, label: ImpactLabel) =>
      impacts.filter(i => i.kind === kind && i.label === label).length;
    return [
      { l: 'Yêu cầu sửa', v: count('req', 'mod'), c: '#b06000' },
      { l: 'Function thêm', v: count('function', 'add'), c: '#137333' },
      { l: 'Function sửa', v: count('function', 'mod'), c: '#b06000' },
      { l: 'Test case sửa', v: count('tc', 'mod'), c: '#b06000' },
      { l: 'Test case bỏ', v: count('tc', 'remove'), c: '#c5221f' },
    ];
  }, [impacts]);

  const persist = async (state: EnhanceState) => {
    const content = JSON.stringify(state);
    if (taskId) {
      await db.tasks.update(taskId, { content, updatedAt: Date.now() });
    } else {
      const newId = crypto.randomUUID();
      await db.tasks.add({
        id: newId,
        projectId,
        type: 'enhance',
        title: `Enhance: ${state.desc.substring(0, 40)}…`,
        content,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setTaskId(newId);
    }
  };

  const save = (next: Partial<EnhanceState>) => {
    const state: EnhanceState = {
      desc: next.desc ?? desc,
      impacts: next.impacts ?? impacts,
      deltaSpec: next.deltaSpec ?? deltaSpec,
    };
    void persist(state);
  };

  const addImpact = () => {
    const next = [...impacts, { kind: 'req' as ImpactKind, id: '', text: '', label: 'add' as ImpactLabel }];
    setImpacts(next);
    save({ impacts: next });
  };

  const updateImpact = (index: number, patch: Partial<ImpactItem>) => {
    const next = impacts.map((it, i) => (i === index ? { ...it, ...patch } : it));
    setImpacts(next);
    save({ impacts: next });
  };

  const removeImpact = (index: number) => {
    const next = impacts.filter((_, i) => i !== index);
    setImpacts(next);
    save({ impacts: next });
  };

  const buildContext = () => {
    const parts: string[] = [];
    if (project) parts.push(`Dự án: ${project.name} (lĩnh vực: ${project.domain})`);
    const impactLines = impacts.map(i => `- [${KIND_LABEL[i.kind]}] ${i.id}: ${i.text} (${LABEL_META[i.label].text})`);
    if (impactLines.length) parts.push(`Item bị ảnh hưởng:\n${impactLines.join('\n')}`);
    if (knowledge && knowledge.length) {
      const kn = knowledge.slice(0, 8).map(k => `- ${k.content}`).join('\n');
      parts.push(`Tri thức dự án:\n${kn}`);
    }
    return parts.join('\n\n');
  };

  const createDeltaSpec = async () => {
    if (!desc.trim()) return;
    setAiState('loading');
    setAiError('');
    try {
      const prompt = `Bạn là Senior Business Analyst. Dựa trên mô tả thay đổi dưới đây và tri thức dự án, hãy viết một "Delta Spec" (đặc tả thay đổi) bằng Markdown, gồm: tóm tắt thay đổi, các yêu cầu/function/test case bị ảnh hưởng và hành động cụ thể, rủi ro và đề xuất review.

Mô tả thay đổi:
${desc}`;

      const response = await anthropicProvider.generateResponse(
        [{ role: 'user', content: prompt }],
        buildContext()
      );
      setDeltaSpec(response);
      save({ deltaSpec: response });
      setAiState('idle');
    } catch (e) {
      console.error('EnhanceView: delta spec generation failed', e);
      setAiError('Không thể tạo delta spec. Vui lòng kiểm tra API key và thử lại.');
      setAiState('error');
    }
  };

  const loading = tasks === undefined;

  return (
    <div>
      <TaskBack
        onBack={onBack}
        title="Enhance · Impact analysis"
        sub="Mô tả thay đổi → AI phân tích item bị ảnh hưởng & sinh delta spec."
      />

      <div className="grid grid-cols-3 gap-6 items-start">
        <Card className="p-5 col-span-2">
          <h3 className="text-[14px] font-semibold mb-2 text-text-primary">Mô tả thay đổi</h3>
          <textarea
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onBlur={() => save({ desc })}
            rows={3}
            placeholder="Mô tả thay đổi đề xuất…"
            className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none resize-none leading-relaxed border border-border-color bg-white text-text-primary focus:border-primary"
          />

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-[13px] font-semibold text-text-primary">Item bị ảnh hưởng ({impacts.length})</h4>
              <GhostBtn icon="plus" onClick={addImpact}>
                Thêm item
              </GhostBtn>
            </div>
            <div className="flex flex-col gap-2">
              {impacts.map((it, i) => {
                const lc = LABEL_META[it.label];
                return (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl border border-border-color group">
                    <select
                      value={it.kind}
                      onChange={e => updateImpact(i, { kind: e.target.value as ImpactKind })}
                      className="text-[11px] font-bold font-mono uppercase rounded px-1.5 py-1 bg-bg-hover text-text-secondary outline-none shrink-0"
                      aria-label="Loại item"
                    >
                      <option value="req">REQ</option>
                      <option value="function">FUNC</option>
                      <option value="tc">TC</option>
                    </select>
                    <input
                      value={it.id}
                      onChange={e => updateImpact(i, { id: e.target.value })}
                      placeholder="ID"
                      className="w-28 font-mono text-[12px] font-semibold text-primary bg-transparent outline-none border-b border-transparent focus:border-primary shrink-0"
                      aria-label="Mã item"
                    />
                    <input
                      value={it.text}
                      onChange={e => updateImpact(i, { text: e.target.value })}
                      placeholder="Mô tả ảnh hưởng…"
                      className="flex-1 text-[13px] text-text-primary bg-transparent outline-none border-b border-transparent focus:border-primary"
                      aria-label="Mô tả ảnh hưởng"
                    />
                    <select
                      value={it.label}
                      onChange={e => updateImpact(i, { label: e.target.value as ImpactLabel })}
                      className="px-2.5 py-1 text-[11.5px] font-semibold rounded-full outline-none shrink-0"
                      style={{ background: lc.bg, color: lc.fg }}
                      aria-label="Hành động"
                    >
                      <option value="add">Thêm</option>
                      <option value="mod">Sửa</option>
                      <option value="remove">Bỏ</option>
                    </select>
                    <button
                      onClick={() => removeImpact(i)}
                      className="w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      style={{ color: '#c5221f' }}
                      aria-label="Xoá item"
                    >
                      <Icon name="trash-2" size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-5">
            <PrimaryBtn
              icon={aiState === 'loading' ? 'loader-2' : 'wand-2'}
              disabled={aiState === 'loading' || !desc.trim()}
              onClick={createDeltaSpec}
            >
              {aiState === 'loading' ? 'Đang tạo…' : 'Tạo delta spec'}
            </PrimaryBtn>
            {loading && (
              <span className="text-[12px] text-text-secondary inline-flex items-center gap-1.5">
                <Icon name="loader-2" size={14} className="animate-spin" /> Đang tải…
              </span>
            )}
          </div>

          {aiState === 'error' && (
            <div
              className="flex items-center gap-2 mt-4 p-3 rounded-xl text-[12.5px]"
              style={{ background: '#fce8e6', color: '#c5221f' }}
            >
              <Icon name="alert-triangle" size={14} strokeWidth={2.2} /> {aiError}
            </div>
          )}

          {deltaSpec && (
            <div className="mt-5 pt-5 border-t border-border-color">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="sparkles" size={15} className="text-primary" />
                <h4 className="text-[13px] font-semibold text-text-primary">Delta Spec</h4>
              </div>
              <div className="prose prose-sm max-w-none text-[13px] leading-relaxed text-text-primary">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{deltaSpec}</ReactMarkdown>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-[14px] font-semibold mb-3 text-text-primary">Tóm tắt</h3>
          <div className="flex flex-col gap-2.5">
            {summary.map(s => (
              <div key={s.l} className="flex items-center justify-between text-[13px]">
                <span className="text-text-secondary">{s.l}</span>
                <span className="font-semibold font-mono" style={{ color: s.c }}>
                  {s.v}
                </span>
              </div>
            ))}
          </div>
          <div
            className="mt-4 p-3 rounded-xl text-[12px] leading-relaxed"
            style={{ background: '#fff7e0', color: '#7a4a00', border: '1px solid #fde68a' }}
          >
            <Icon
              name="info"
              size={13}
              strokeWidth={2.2}
              style={{ display: 'inline', marginRight: 4, verticalAlign: -2 }}
            />
            Đề nghị review thẩm định nội bộ trước khi áp dụng delta spec.
          </div>
        </Card>
      </div>
    </div>
  );
};
