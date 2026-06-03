import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { GhostBtn } from '../ui/Buttons';

/* Task card config matching prototype v3 */
const TASK_CARDS = [
  { id: 'new-req', icon: 'file-plus-2', title: 'Yêu cầu mới', desc: 'EARS statement · AC · AI scoring' },
  { id: 'user-story', icon: 'book-copy', title: 'User Story', desc: 'As a… I want… So that…' },
  { id: 'func-list', icon: 'list-tree', title: 'Danh sách chức năng', desc: 'Module · Sub-module · UC mapping' },
  { id: 'estimation', icon: 'calculator', title: 'Ước lượng', desc: 'Story Point · Effort · Timeline' },
  { id: 'brd-srs', icon: 'scroll-text', title: 'BRD / SRS', desc: 'Auto-gen business & software specs' },
  { id: 'diagrams', icon: 'git-branch', title: 'Sơ đồ nghiệp vụ', desc: 'Process · BPMN · Sequence · ER · State' },
];

interface TasksTabProps {
  projectId: string;
}

export const TasksTab: React.FC<TasksTabProps> = ({ projectId: _projectId }) => {
  const [activeTask, setActiveTask] = useState<string | null>(null);

  /* Sub-view: Back header */
  const TaskBack: React.FC<{ title: string; sub?: string; onBack: () => void }> = ({ title, sub, onBack }) => (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-text-secondary hover:text-primary transition-colors mb-3"
      >
        <Icon name="chevron-left" size={16} strokeWidth={2.2} />
        Quay lại danh sách
      </button>
      <h2 className="text-[20px] font-semibold text-text-primary">{title}</h2>
      {sub && <p className="text-[13px] text-text-secondary mt-1">{sub}</p>}
    </div>
  );

  /* Sub-view: New Requirement Editor */
  const NewReqView = () => {
    const [ears, setEars] = useState('Khi khách hàng hoàn tất xác thực eKYC, hệ thống PHẢI tự động tạo hồ sơ vay với trạng thái "Chờ bổ sung" trong vòng 3 giây.');
    const [editing, setEditing] = useState(false);

    return (
      <div>
        <TaskBack onBack={() => setActiveTask(null)} title="Yêu cầu mới · REQ-001" sub="Editor: sửa EARS, thêm/xoá AC, AI tự re-score & cập nhật trace." />

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 flex flex-col gap-5">
            {/* EARS */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-bg-active text-primary">EARS</span>
                  <h3 className="text-[14px] font-semibold text-text-primary">Phát biểu yêu cầu</h3>
                </div>
                <GhostBtn icon="pencil" onClick={() => setEditing(e => !e)}>
                  {editing ? 'Đang sửa' : 'Sửa'}
                </GhostBtn>
              </div>
              {editing ? (
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
                <GhostBtn icon="sparkles" onClick={() => console.log('AI refine')}>Refine bằng AI</GhostBtn>
                <GhostBtn icon="file-down" onClick={() => console.log('download')}>Tải xuống</GhostBtn>
              </div>
            </Card>

            {/* Acceptance Criteria */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} style={{ color: '#137333' }} />
                  <h3 className="text-[14px] font-semibold text-text-primary">Acceptance Criteria</h3>
                  <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium bg-bg-hover text-text-secondary">2</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  { g: 'Khách hàng đã hoàn tất eKYC', w: 'Hệ thống nhận kết quả xác thực', t: 'Hồ sơ vay được tạo tự động với trạng thái "Chờ bổ sung"' },
                  { g: 'Hồ sơ đã bổ sung đầy đủ giấy tờ', w: 'Cán bộ nhấn "Gửi thẩm định"', t: 'Hồ sơ chuyển sang trạng thái "Đang thẩm định" và thông báo email' },
                ].map((ac, i) => (
                  <div key={i} className="rounded-xl border border-border-color p-3.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-disabled mb-1.5 block">AC-{String(i + 1).padStart(2, '0')}</span>
                    {[
                      { k: 'g', label: 'Given', fg: '#1967d2', val: ac.g },
                      { k: 'w', label: 'When', fg: '#b06000', val: ac.w },
                      { k: 't', label: 'Then', fg: '#137333', val: ac.t },
                    ].map(row => (
                      <div key={row.k} className="flex items-start gap-2 py-1">
                        <span className="font-semibold font-mono shrink-0 w-14 text-[12.5px] pt-0.5" style={{ color: row.fg }}>{row.label}</span>
                        <span className="text-[13px] text-text-primary">{row.val}</span>
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
              <div className="text-[42px] font-bold text-primary leading-none mb-1">85</div>
              <div className="text-[12px] text-text-secondary">/ 100 điểm</div>
              <div className="mt-4 space-y-2 text-left">
                {[
                  { label: 'Completeness', val: 90 },
                  { label: 'Clarity', val: 85 },
                  { label: 'Testability', val: 80 },
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
    );
  };

  /* Sub-view routing */
  if (activeTask === 'new-req') return <NewReqView />;

  /* Default: Task card grid */
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-[18px] font-semibold text-text-primary">Tác vụ phân tích</h2>
        <p className="text-[13px] text-text-secondary mt-1">Chọn tác vụ để bắt đầu làm việc với AI chuyên gia.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {TASK_CARDS.map(task => (
          <Card
            key={task.id}
            hover
            onClick={() => setActiveTask(task.id)}
            className="p-5 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ background: '#e8f0fe', color: '#1967d2' }}
              >
                <Icon name={task.icon} size={22} strokeWidth={1.85} />
              </div>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-text-disabled group-hover:text-primary transition-colors">
                <Icon name="arrow-right" size={16} strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-[15px] font-semibold text-text-primary mb-1">{task.title}</h3>
            <p className="text-[12.5px] text-text-secondary">{task.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
