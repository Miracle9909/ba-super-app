import React from 'react';
import { Icon } from './Icon';

interface TaskBackProps {
  onBack: () => void;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

/* Back header for task editor sub-views — ported from prototype v3 (ba2-tasks.jsx TaskBack). */
export const TaskBack: React.FC<TaskBackProps> = ({ onBack, title, sub, right }) => {
  return (
    <div className="flex items-center gap-4 mb-5">
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-white border border-border-color text-text-secondary transition-colors hover:bg-bg-hover shrink-0"
        title="Quay lại"
      >
        <Icon name="chevron-left" size={18} />
      </button>
      <div className="flex-1 min-w-0">
        <h2 className="text-[18px] font-semibold tracking-tight text-text-primary">{title}</h2>
        {sub && <p className="text-[13px] mt-0.5 text-text-secondary">{sub}</p>}
      </div>
      {right}
    </div>
  );
};
