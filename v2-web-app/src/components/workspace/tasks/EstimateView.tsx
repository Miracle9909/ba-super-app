import React, { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { GhostBtn } from '../../ui/Buttons';
import { TaskBack } from '../../ui/TaskBack';
import { complexityColor } from '../../../lib/ba/domainExpert';
import { anthropicProvider } from '../../../lib/llm/anthropic';

interface EstimateRow {
  func: string;
  complexity: number;
  sp: number;
  md: number;
  fuzzy?: boolean;
}

const SEED_ROWS: EstimateRow[] = [
  { func: 'FUNC-101 · Tạo hồ sơ vay', complexity: 3, sp: 5, md: 8 },
  { func: 'FUNC-102 · Tải tài liệu HSYC', complexity: 2, sp: 3, md: 4 },
  { func: 'FUNC-103 · Kiểm tra CCCD', complexity: 4, sp: 5, md: 7 },
  { func: 'FUNC-110 · Gửi yêu cầu định giá', complexity: 6, sp: 8, md: 12 },
  { func: 'FUNC-111 · Nhận kết quả định giá', complexity: 5, sp: 8, md: 11 },
  { func: 'FUNC-112 · Override định giá', complexity: 8, sp: 13, md: 18, fuzzy: true },
  { func: 'FUNC-120 · Chấm điểm tín dụng', complexity: 9, sp: 21, md: 32, fuzzy: true },
  { func: 'FUNC-121 · Duyệt / Từ chối', complexity: 5, sp: 8, md: 12 },
];

interface EstimateViewProps {
  projectId: string;
  onBack: () => void;
}

export const EstimateView: React.FC<EstimateViewProps> = ({ projectId, onBack }) => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [rows, setRows] = useState<EstimateRow[]>(SEED_ROWS);
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [aiError, setAiError] = useState('');

  const tasks = useLiveQuery(
    () => db.tasks.where('projectId').equals(projectId).filter(t => t.type === 'estimation').toArray(),
    [projectId]
  );

  useEffect(() => {
    if (!tasks) return;
    const existing = tasks[0];
    if (existing) {
      setTaskId(existing.id);
      try {
        const parsed = JSON.parse(existing.content) as EstimateRow[];
        if (Array.isArray(parsed) && parsed.length) setRows(parsed);
      } catch (e) {
        console.error('EstimateView: failed to parse stored rows', e);
      }
    }
  }, [tasks]);

  const totals = useMemo(() => {
    const md = rows.reduce((s, r) => s + Number(r.md || 0), 0);
    const sp = rows.reduce((s, r) => s + Number(r.sp || 0), 0);
    const fuzzy = rows.filter(r => r.fuzzy).length;
    return { md, sp, fuzzy };
  }, [rows]);

  const persist = async (next: EstimateRow[]) => {
    const content = JSON.stringify(next);
    if (taskId) {
      await db.tasks.update(taskId, { content, updatedAt: Date.now() });
    } else {
      const newId = crypto.randomUUID();
      await db.tasks.add({
        id: newId,
        projectId,
        type: 'estimation',
        title: 'Estimation',
        content,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setTaskId(newId);
    }
  };

  const setRow = (index: number, key: keyof EstimateRow, value: number) => {
    const next = rows.map((r, i) => (i === index ? { ...r, [key]: value } : r));
    setRows(next);
    void persist(next);
  };

  // AI: re-suggest SP/MD based on each function's complexity. Degrades gracefully.
  const aiReSuggest = async () => {
    setAiState('loading');
    setAiError('');
    try {
      const prompt = `Bạn là chuyên gia ước lượng phần mềm. Với danh sách function và độ phức tạp (1-10), hãy gợi ý lại Story Point (Fibonacci) và Man-day phù hợp.
Functions:
${rows.map(r => `- ${r.func} | complexity=${r.complexity}`).join('\n')}

Trả về JSON DUY NHẤT, không markdown, dạng:
{"rows":[{"func":"<giữ nguyên chuỗi func>","sp":5,"md":8}]}`;

      const response = await anthropicProvider.generateResponse([{ role: 'user', content: prompt }]);
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const data = JSON.parse(cleaned) as { rows?: { func: string; sp: number; md: number }[] };
      const byFunc = new Map((data.rows || []).map(r => [r.func, r]));

      const next = rows.map(r => {
        const s = byFunc.get(r.func);
        return s ? { ...r, sp: Number(s.sp) || r.sp, md: Number(s.md) || r.md } : r;
      });
      setRows(next);
      void persist(next);
      setAiState('idle');
    } catch (e) {
      console.error('EstimateView: AI re-suggest failed', e);
      setAiError('Không thể gọi AI. Vui lòng kiểm tra API key và thử lại.');
      setAiState('error');
    }
  };

  const loading = tasks === undefined;

  return (
    <div>
      <TaskBack
        onBack={onBack}
        title="Estimate"
        sub="Editor: inline sửa Complexity / SP / MD. AI re-suggest khi đổi complexity."
      />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider text-text-disabled">Tổng man-day</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight text-primary">
            {totals.md} <span className="text-[14px] font-medium text-text-secondary">MD</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider text-text-disabled">Story point</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight text-text-primary">
            {totals.sp} <span className="text-[14px] font-medium text-text-secondary">SP</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider text-text-disabled">Function</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight text-text-primary">{rows.length}</div>
        </Card>
        <Card
          className="p-4"
          style={{
            borderColor: totals.fuzzy ? '#fde68a' : undefined,
            background: totals.fuzzy ? '#fffbeb' : undefined,
          }}
        >
          <div
            className="text-[11.5px] font-medium uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: '#b06000' }}
          >
            <Icon name="alert-triangle" size={12} strokeWidth={2.2} /> Cảnh báo
          </div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: '#b06000' }}>
            {totals.fuzzy}
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b border-border-color flex-wrap gap-3">
          <span className="text-[12.5px] text-text-secondary">
            Bấm vào ô để chỉnh. AI sẽ re-suggest SP/MD theo Complexity.
          </span>
          <GhostBtn
            icon={aiState === 'loading' ? 'loader-2' : 'wand-2'}
            tone="primary"
            disabled={aiState === 'loading' || loading}
            onClick={aiReSuggest}
          >
            {aiState === 'loading' ? 'Đang tính…' : 'AI re-suggest'}
          </GhostBtn>
        </div>

        {aiState === 'error' && (
          <div className="px-4 py-3 flex items-center gap-2 text-[12.5px]" style={{ background: '#fce8e6', color: '#c5221f' }}>
            <Icon name="alert-triangle" size={14} strokeWidth={2.2} /> {aiError}
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: '#f6f8fc' }}>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 text-text-secondary">Function</th>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-44 text-text-secondary">Complexity</th>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-20 text-right text-text-secondary">SP</th>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-24 text-right text-text-secondary">MD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const cc = complexityColor(r.complexity);
              return (
                <tr key={i} className="border-t border-border-color">
                  <td className="px-4 py-2 text-[13px] font-mono text-text-primary">
                    {r.func}
                    {r.fuzzy && (
                      <span
                        className="ml-2 inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: '#fef7e0', color: '#b06000' }}
                      >
                        <Icon name="alert-triangle" size={10} strokeWidth={2.2} /> mơ hồ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={r.complexity}
                        onChange={e => setRow(i, 'complexity', Math.max(1, Math.min(10, Number(e.target.value))))}
                        className="w-10 h-7 rounded-md text-[12px] font-semibold text-center outline-none"
                        style={{ background: cc.bg, color: cc.fg, border: `1px solid ${cc.fg}33` }}
                        aria-label={`Complexity ${r.func}`}
                      />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#eceff3' }}>
                        <div style={{ width: `${r.complexity * 10}%`, background: cc.fg, height: '100%' }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={r.sp}
                      onChange={e => setRow(i, 'sp', Number(e.target.value))}
                      className="w-14 h-7 px-2 text-right text-[12.5px] font-mono rounded-md outline-none border border-border-color text-text-primary"
                      aria-label={`Story point ${r.func}`}
                    />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input
                      type="number"
                      value={r.md}
                      onChange={e => setRow(i, 'md', Number(e.target.value))}
                      className="w-16 h-7 px-2 text-right text-[12.5px] font-mono font-semibold rounded-md outline-none border border-border-color text-primary"
                      aria-label={`Man-day ${r.func}`}
                    />
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-border-color" style={{ background: '#fcfdff' }}>
              <td className="px-4 py-3 text-[13px] font-semibold text-text-primary">Tổng</td>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-[13px] text-right font-mono font-bold text-text-primary">{totals.sp}</td>
              <td className="px-4 py-3 text-[13px] text-right font-mono font-bold text-primary">{totals.md}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
};
