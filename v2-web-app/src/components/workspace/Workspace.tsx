import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { Icon } from '../ui/Icon';
import { IndustryBadge, ProgressBar } from '../ui/Badges';
import { IconBtn } from '../ui/Buttons';
import { SourcesTab } from './SourcesTab';
import { DiscoveryTab } from './DiscoveryTab';
import { TasksTab } from './TasksTab';
import { INDUSTRIES } from '../../lib/ba/domainExpert';

const TABS = [
  { id: 'info',      label: 'Thông tin',      icon: 'info'            },
  { id: 'sources',   label: 'Nguồn dữ liệu',  icon: 'upload'          },
  { id: 'discovery', label: 'Khai phá',       icon: 'messages-square' },
  { id: 'tasks',     label: 'Tác vụ',         icon: 'square-kanban'   },
  { id: 'output',    label: 'Báo cáo & Xuất', icon: 'file-down-2'     },
] as const;

type TabId = typeof TABS[number]['id'];

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mb-4">
    <div className="text-[11px] font-semibold uppercase tracking-wider mb-1 text-text-disabled">{label}</div>
    <div className="text-[14px] text-text-primary">{children}</div>
  </div>
);

interface WorkspaceProps {
  projectId: string;
  initialTab?: string;
}

export const Workspace: React.FC<WorkspaceProps> = ({ projectId, initialTab }) => {
  const project      = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const [activeTab, setActiveTab] = useState<TabId>((initialTab as TabId) || 'sources');
  const [_activeTask, setActiveTask] = useState<string | null>(null);

  const sourcesCount   = useLiveQuery(() => db.sources.where('projectId').equals(projectId).count(), [projectId]) ?? 0;
  const knowledgeCount = useLiveQuery(() => db.knowledge.where('projectId').equals(projectId).count(), [projectId]) ?? 0;
  const convoCount     = useLiveQuery(() => db.conversations.where('projectId').equals(projectId).count(), [projectId]) ?? 0;
  const tasksCount     = useLiveQuery(() => db.tasks.where('projectId').equals(projectId).count(), [projectId]) ?? 0;

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-secondary text-[14px]">Đang tải dự án...</div>
      </div>
    );
  }

  const readiness = [
    sourcesCount   > 0 ? 25 : 0,
    knowledgeCount > 0 ? 25 : 0,
    convoCount     > 0 ? 25 : 0,
    tasksCount     > 0 ? 25 : 0,
  ].reduce((a, b) => a + b, 0);

  const nextSteps = [
    { t: 'Thêm nguồn dữ liệu',              done: sourcesCount > 0  },
    { t: 'Hoàn tất khai phá với chuyên gia', done: convoCount > 0   },
    { t: 'Chốt Function list',              done: tasksCount > 0    },
    { t: 'Sinh deliverables',               done: false              },
  ];

  return (
    <div className="px-10 py-8 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[24px] font-semibold tracking-tight text-text-primary">{project.name}</h1>
            <IndustryBadge domain={project.domain} size="md" />
          </div>
          <div className="flex items-center gap-1.5 text-[13px] mt-2 text-text-secondary">
            <span>Tạo: {new Date(project.createdAt).toLocaleDateString('vi-VN')}</span>
            <span className="text-border-color">·</span>
            <span>Cập nhật: {new Date(project.updatedAt).toLocaleDateString('vi-VN')}</span>
            <span className="text-border-color">·</span>
            <span>Readiness: <span className="text-primary font-semibold">{readiness}%</span></span>
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
              {active && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'info' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left 2/3 */}
            <div className="col-span-2 flex flex-col gap-5">

              {/* Thông tin chung */}
              <div className="rounded-2xl border border-border-color p-6 bg-bg-surface"
                style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
                <h3 className="text-[15px] font-semibold text-text-primary mb-4">Thông tin chung</h3>
                <div className="grid grid-cols-2 gap-x-8">
                  <div>
                    <Field label="Tên dự án">{project.name}</Field>
                    <Field label="Domain"><IndustryBadge domain={project.domain} /></Field>
                    <Field label="Người tạo">BA · Business Analyst</Field>
                  </div>
                  <div>
                    <Field label="Compliance">Theo ngành (NHNN, PCI-DSS)</Field>
                    <Field label="Ngày tạo">{new Date(project.createdAt).toLocaleDateString('vi-VN')}</Field>
                    <Field label="Cập nhật">{new Date(project.updatedAt).toLocaleDateString('vi-VN')}</Field>
                  </div>
                </div>
                {project.description && (
                  <div className="pt-4 mt-2 border-t border-border-color">
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-text-disabled">
                      Mục tiêu dự án
                    </div>
                    <p className="text-[14px] leading-relaxed text-text-primary">{project.description}</p>
                  </div>
                )}
              </div>

              {/* Tài liệu mẫu đã đính */}
              <div className="rounded-2xl border border-border-color p-6 bg-bg-surface"
                style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
                <div className="mb-4">
                  <h3 className="text-[15px] font-semibold text-text-primary">Tài liệu mẫu đã đính</h3>
                  <p className="text-[13px] mt-1 text-text-secondary">
                    Output cùng loại sẽ được render theo đúng định dạng của tài liệu mẫu đã đính.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-dashed py-6 text-center"
                  style={{ borderColor: 'var(--border-color)' }}>
                  <Icon name="layout-template" size={22} className="text-text-disabled mx-auto mb-1.5" />
                  <div className="text-[13px] font-medium text-text-secondary">Chưa đính tài liệu mẫu nào</div>
                  <div className="text-[12px] mt-1 text-text-disabled">Output sẽ dùng template chuẩn của hệ thống</div>
                </div>
              </div>

              {/* Ngành hỗ trợ */}
              <div className="rounded-2xl border border-border-color p-6 bg-bg-surface"
                style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
                <div className="mb-4">
                  <h3 className="text-[15px] font-semibold text-text-primary">Ngành hỗ trợ</h3>
                  <p className="text-[13px] mt-1 text-text-secondary">
                    Ngành quyết định bộ chuyên gia, knowledge gốc &amp; template áp dụng.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {INDUSTRIES.map(ind => {
                    const sel = project.domain.toLowerCase() === ind.id
                      || project.domain.toLowerCase().includes(ind.id);
                    return (
                      <span key={ind.id}
                        style={sel
                          ? { background: ind.bg, color: ind.fg, borderColor: ind.fg }
                          : { background: '#fff', color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
                        className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-[13px] font-medium border">
                        <Icon name={ind.icon} size={15} strokeWidth={2} />
                        {ind.short}
                        {sel && <Icon name="check" size={14} strokeWidth={2.4} />}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 1/3 */}
            <div className="col-span-1 flex flex-col gap-5">

              {/* Readiness */}
              <div className="rounded-2xl border border-border-color p-6 bg-bg-surface"
                style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon name="gauge" size={20} className="text-primary" />
                  <h3 className="text-[15px] font-semibold text-text-primary">Readiness</h3>
                </div>
                <div className="flex items-end gap-2 mb-3">
                  <div className="text-[40px] font-semibold leading-none tracking-tight text-primary">
                    {readiness}%
                  </div>
                  <div className="text-[13px] pb-1.5 text-text-secondary">sẵn sàng output</div>
                </div>
                <ProgressBar value={readiness} />
                <p className="text-[12.5px] mt-4 leading-relaxed text-text-secondary">
                  Cần hoàn tất khai phá &amp; xác nhận tri thức trước khi sinh deliverables.
                </p>
              </div>

              {/* Bước tiếp theo */}
              <div className="rounded-2xl border border-border-color p-6 bg-bg-surface"
                style={{ boxShadow: '0 1px 2px rgba(60,64,67,.06)' }}>
                <h3 className="text-[15px] font-semibold mb-3 text-text-primary">Bước tiếp theo</h3>
                <div className="flex flex-col gap-2.5">
                  {nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-[13px]">
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0"
                        style={step.done
                          ? { background: '#e6f4ea', borderColor: '#137333' }
                          : { borderColor: 'var(--border-color)', background: '#fff' }}>
                        {step.done
                          ? <Icon name="check" size={11} strokeWidth={2.5} style={{ color: '#137333' }} />
                          : <span className="text-[10px] font-bold text-text-disabled">{i + 1}</span>
                        }
                      </div>
                      <span className={step.done ? 'text-text-secondary line-through' : 'text-text-primary'}>
                        {step.t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources'   && <SourcesTab projectId={projectId} />}
        {activeTab === 'discovery' && <DiscoveryTab projectId={projectId} />}
        {activeTab === 'tasks'     && <TasksTab projectId={projectId} />}
        {activeTab === 'output'    && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-bg-hover flex items-center justify-center mb-4 text-text-disabled">
              <Icon name="file-text" size={32} strokeWidth={1.4} />
            </div>
            <p className="text-[15px] font-medium text-text-primary mb-1">Báo cáo &amp; Xuất đang được phát triển</p>
            <p className="text-[14px] max-w-md text-text-secondary">
              Khu vực này sẽ hiển thị BRD, SRS, User Stories được tạo tự động.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
