import React, { useState } from 'react';
import { Icon } from '../ui/Icon';
import { Card } from '../ui/Card';
import { UserStoryView } from './tasks/UserStoryView';
import { NewReqView } from './tasks/NewReqView';

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

  /* Sub-view routing */

  /* Sub-view routing */
  if (activeTask === 'new-req') return <NewReqView projectId={_projectId} onBack={() => setActiveTask(null)} />;
  if (activeTask === 'user-story') return <UserStoryView projectId={_projectId} onBack={() => setActiveTask(null)} />;

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
