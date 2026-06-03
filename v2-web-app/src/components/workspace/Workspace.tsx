import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { Icon } from '../ui/Icon';
import { IndustryBadge } from '../ui/Badges';
import { IconBtn } from '../ui/Buttons';
import { SourcesTab } from './SourcesTab';
import { DiscoveryTab } from './DiscoveryTab';
import { TasksTab } from './TasksTab';

/* Tab config matching prototype */
const TABS = [
  { id: 'info', label: 'Thông tin dự án', icon: 'info' },
  { id: 'sources', label: 'Nguồn dữ liệu', icon: 'upload' },
  { id: 'discovery', label: 'Khai phá chuyên gia', icon: 'messages-square' },
  { id: 'tasks', label: 'Tác vụ', icon: 'list-checks' },
  { id: 'output', label: 'Output', icon: 'file-text' },
] as const;

type TabId = typeof TABS[number]['id'];

interface WorkspaceProps {
  projectId: string;
  initialTab?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({ projectId, initialTab }) => {
  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const [activeTab, setActiveTab] = useState<TabId>((initialTab as TabId) || 'sources');
  const [_activeTask, setActiveTask] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary text-[14px]">Đang tải dự án...</div>
      </div>
    );
  }

  return (
    <div className="px-10 py-8 max-w-[1280px] mx-auto">
      {/* Workspace header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[24px] font-semibold tracking-tight text-text-primary">{project.name}</h1>
            <IndustryBadge domain={project.domain} size="md" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono text-white bg-primary">v3</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] mt-2 text-text-secondary">
            <span>Tạo: {new Date(project.createdAt).toLocaleDateString('vi-VN')}</span>
            <span className="text-border-color">·</span>
            <span>Cập nhật: {new Date(project.updatedAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>
        <IconBtn icon="settings" title="Cài đặt dự án" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border-color mb-7">
        {TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setActiveTask(null); }}
              className={`relative inline-flex items-center gap-2 px-4 h-11 text-[13.5px] font-medium transition-colors ${
                active ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={t.icon} size={18} strokeWidth={active ? 2.1 : 1.85} />
              {t.label}
              {active && (
                <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border-color p-6 bg-bg-surface" style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
              <h3 className="text-[15px] font-semibold text-text-primary mb-3">Thông tin dự án</h3>
              <div className="space-y-3 text-[14px]">
                <p><span className="font-medium text-text-primary">Mô tả:</span>{' '}
                  <span className="text-text-secondary">{project.description || 'Chưa có mô tả cho dự án này.'}</span>
                </p>
                <p><span className="font-medium text-text-primary">Lĩnh vực:</span>{' '}
                  <span className="text-text-secondary">{project.domain}</span>
                </p>
                <p><span className="font-medium text-text-primary">Tạo lúc:</span>{' '}
                  <span className="text-text-secondary">{new Date(project.createdAt).toLocaleString('vi-VN')}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'sources' && <SourcesTab projectId={projectId} />}
        {activeTab === 'discovery' && <DiscoveryTab projectId={projectId} />}
        {activeTab === 'tasks' && (
          <TasksTab
            projectId={projectId}
          />
        )}
        {activeTab === 'output' && (
          <div className="flex flex-col items-center justify-center py-16 text-text-secondary text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-hover flex items-center justify-center mb-4 text-text-disabled">
              <Icon name="file-text" size={32} strokeWidth={1.4} />
            </div>
            <p className="text-[15px] font-medium text-text-primary mb-1">Output đang được phát triển</p>
            <p className="text-[14px] max-w-md">Khu vực này sẽ hiển thị BRD, SRS, User Stories được tạo tự động.</p>
          </div>
        )}
      </div>
    </div>
  );
};
