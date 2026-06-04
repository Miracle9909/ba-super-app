import React, { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Card } from '../../ui/Card';
import { Icon } from '../../ui/Icon';
import { GhostBtn, PrimaryBtn } from '../../ui/Buttons';
import { anthropicProvider } from '../../../lib/llm/anthropic';

interface AC {
  g: string; // Given
  w: string; // When
  t: string; // Then
}

interface ReqData {
  ears: string;
  acs: AC[];
  score: {
    total: number;
    completeness: number;
    clarity: number;
    testability: number;
  };
}

interface NewReqViewProps {
  projectId: string;
  onBack: () => void;
}

export const NewReqView: React.FC<NewReqViewProps> = ({ projectId, onBack }) => {
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  
  // Requirement state
  const [ears, setEars] = useState('Khi khách hàng hoàn tất xác thực eKYC, hệ thống PHẢI tự động tạo hồ sơ vay với trạng thái "Chờ bổ sung" trong vòng 3 giây.');
  const [acs, setAcs] = useState<AC[]>([
    { g: 'Khách hàng đã hoàn tất eKYC', w: 'Hệ thống nhận kết quả xác thực', t: 'Hồ sơ vay được tạo tự động với trạng thái "Chờ bổ sung"' }
  ]);
  const [score, setScore] = useState({ total: 0, completeness: 0, clarity: 0, testability: 0 });
  const [editingEars, setEditingEars] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  
  const reqTasks = useLiveQuery(() => db.tasks.where('projectId').equals(projectId).filter(t => t.type === 'requirement').toArray(), [projectId]);

  // Load active req
  useEffect(() => {
    if (activeReqId && reqTasks) {
      const task = reqTasks.find(t => t.id === activeReqId);
      if (task) {
        try {
          const data = JSON.parse(task.content) as ReqData;
          setEars(data.ears || '');
          setAcs(data.acs || []);
          setScore(data.score || { total: 0, completeness: 0, clarity: 0, testability: 0 });
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [activeReqId, reqTasks]);

  const handleSave = async () => {
    const content = JSON.stringify({ ears, acs, score });
    if (activeReqId) {
      await db.tasks.update(activeReqId, {
        content,
        updatedAt: Date.now()
      });
    } else {
      const newId = crypto.randomUUID();
      await db.tasks.add({
        id: newId,
        projectId,
        type: 'requirement',
        title: `REQ: ${ears.substring(0, 30)}...`,
        content,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
      setActiveReqId(newId);
    }
  };

  const handleRefine = async () => {
    setIsRefining(true);
    try {
      const prompt = `You are an expert Requirements Engineer. Please review and refine the following requirement and its acceptance criteria.
Evaluate it and provide improvements based on EARS (Easy Approach to Requirements Syntax).
Also provide a Quality Score out of 100 based on Completeness, Clarity, and Testability.

Current EARS Requirement:
${ears}

Current Acceptance Criteria:
${acs.map((ac, i) => `AC-${i+1}: GIVEN ${ac.g} WHEN ${ac.w} THEN ${ac.t}`).join('\n')}

Return a JSON object EXACTLY in this format, with no markdown wrappers or additional text:
{
  "ears": "Improved EARS statement",
  "acs": [{"g": "Given statement", "w": "When statement", "t": "Then statement"}],
  "score": {"total": 85, "completeness": 90, "clarity": 80, "testability": 85}
}`;

      const response = await anthropicProvider.generateResponse([{ role: 'user', content: prompt }]);
      
      // Clean potential markdown blocks
      const cleanedJson = response.replace(/```json\n/g, '').replace(/```\n?/g, '');
      const data = JSON.parse(cleanedJson);
      
      if (data.ears) setEars(data.ears);
      if (data.acs) setAcs(data.acs);
      if (data.score) setScore(data.score);
      
      // Auto-save after refine
      await handleSave();
    } catch (error) {
      console.error('Error refining:', error);
      alert('Lỗi khi refine requirement. Vui lòng thử lại.');
    } finally {
      setIsRefining(false);
    }
  };

  const addAc = () => setAcs([...acs, { g: '', w: '', t: '' }]);
  const updateAc = (index: number, key: keyof AC, value: string) => {
    const newAcs = [...acs];
    newAcs[index][key] = value;
    setAcs(newAcs);
  };
  const removeAc = (index: number) => setAcs(acs.filter((_, i) => i !== index));

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-primary transition-colors mb-3">
            <Icon name="chevron-left" size={16} strokeWidth={2.2} /> Quay lại danh sách
          </button>
          <h2 className="text-[20px] font-semibold text-text-primary">Yêu cầu mới (EARS & AC)</h2>
        </div>
        <PrimaryBtn onClick={handleSave} icon="save">Lưu Requirement</PrimaryBtn>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Left List of saved Reqs */}
        <div className="col-span-1">
          <h3 className="text-[14px] font-semibold mb-3">Saved Requirements</h3>
          <div className="flex flex-col gap-2">
            <div 
              className={`p-3 border rounded-xl cursor-pointer transition-colors text-[13px] ${!activeReqId ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}
              onClick={() => { setActiveReqId(null); setEars(''); setAcs([]); setScore({ total: 0, completeness: 0, clarity: 0, testability: 0 }); }}
            >
              <div className="flex items-center gap-2 font-medium text-primary"><Icon name="plus" size={14} /> Tạo mới</div>
            </div>
            {reqTasks?.map(req => (
              <div 
                key={req.id} 
                className={`p-3 border rounded-xl cursor-pointer transition-colors flex justify-between items-center ${activeReqId === req.id ? 'border-primary bg-primary/5' : 'border-border-color hover:border-primary/50'}`}
                onClick={() => setActiveReqId(req.id)}
              >
                <span className="text-[13px] truncate pr-2">{req.title}</span>
                <button onClick={(e) => { e.stopPropagation(); db.tasks.delete(req.id); if(activeReqId === req.id) setActiveReqId(null); }} className="text-text-disabled hover:text-red-500">
                  <Icon name="trash" size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-5">
            {/* EARS */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-bg-active text-primary">EARS</span>
                  <h3 className="text-[14px] font-semibold text-text-primary">Phát biểu yêu cầu</h3>
                </div>
                <GhostBtn icon="pencil" onClick={() => setEditingEars(!editingEars)}>
                  {editingEars ? 'Xong' : 'Sửa'}
                </GhostBtn>
              </div>
              {editingEars ? (
                <textarea
                  value={ears}
                  onChange={(e) => setEars(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-3 rounded-xl text-[14px] outline-none resize-none leading-relaxed font-medium border border-primary text-text-primary"
                  style={{ boxShadow: '0 0 0 3px rgba(11,87,208,0.13)' }}
                />
              ) : (
                <div className="rounded-xl p-4 text-[14px] leading-relaxed border border-border-color text-text-primary" style={{ background: '#fcfdff' }}>
                  {ears.split(/\b(Khi|hệ thống PHẢI)\b/).map((p, i) =>
                    p === 'Khi' || p === 'hệ thống PHẢI'
                      ? <span key={i} className="font-semibold text-primary">{p}</span>
                      : <span key={i}>{p}</span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <GhostBtn icon={isRefining ? "loader-2" : "sparkles"} disabled={isRefining} onClick={handleRefine}>
                  {isRefining ? 'Đang phân tích...' : 'Refine & Chấm điểm bằng AI'}
                </GhostBtn>
              </div>
            </Card>

            {/* Acceptance Criteria */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} style={{ color: '#137333' }} />
                  <h3 className="text-[14px] font-semibold text-text-primary">Acceptance Criteria</h3>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium bg-bg-hover text-text-secondary">{acs.length}</span>
                </div>
                <GhostBtn icon="plus" onClick={addAc}>Thêm AC</GhostBtn>
              </div>
              <div className="flex flex-col gap-3">
                {acs.map((ac, i) => (
                  <div key={i} className="rounded-xl border border-border-color p-3.5 relative group">
                    <button onClick={() => removeAc(i)} className="absolute top-2 right-2 text-text-disabled opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                      <Icon name="x" size={16} />
                    </button>
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-disabled mb-1.5 block">AC-{String(i + 1).padStart(2, '0')}</span>
                    {(['g', 'w', 't'] as const).map(k => (
                      <div key={k} className="flex items-start gap-2 py-1">
                        <span className="font-semibold font-mono shrink-0 w-14 text-[12.5px] pt-1" style={{ color: k === 'g' ? '#1967d2' : k === 'w' ? '#b06000' : '#137333' }}>
                          {k === 'g' ? 'Given' : k === 'w' ? 'When' : 'Then'}
                        </span>
                        <input
                          value={ac[k]}
                          onChange={(e) => updateAc(i, k, e.target.value)}
                          className="flex-1 px-2 py-1 bg-transparent border-b border-transparent hover:border-border-color focus:border-primary outline-none text-[13px]"
                          placeholder={`Enter ${k === 'g' ? 'precondition' : k === 'w' ? 'action' : 'result'}...`}
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right sidebar: Score */}
          <div className="flex flex-col gap-5">
            <Card className="p-5 text-center">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-text-disabled mb-2">Quality Score</div>
              <div className="text-[42px] font-bold text-primary leading-none mb-1">{score.total}</div>
              <div className="text-[12px] text-text-secondary">/ 100 điểm</div>
              <div className="mt-4 space-y-2 text-left">
                {[
                  { label: 'Completeness', val: score.completeness },
                  { label: 'Clarity', val: score.clarity },
                  { label: 'Testability', val: score.testability },
                ].map(q => (
                  <div key={q.label}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-text-secondary">{q.label}</span>
                      <span className="font-semibold text-text-primary">{q.val}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-bg-hover overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${q.val}%`, transition: 'width .4s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
