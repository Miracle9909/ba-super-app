import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';
import { Icon } from './ui/Icon';
import { Card } from './ui/Card';
import { PrimaryBtn, GhostBtn } from './ui/Buttons';
import { IndustryBadge, SectionTitle, StatCard } from './ui/Badges';

interface DashboardProps {
  onOpenProject: (id: string) => void;
  onCreateProject: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenProject, onCreateProject }) => {
  const projects = useLiveQuery(() => db.projects.toArray());
  const sources = useLiveQuery(() => db.sources.toArray());
  const knowledge = useLiveQuery(() => db.knowledge.toArray());

  const projectCount = projects?.length || 0;
  const sourceCount = sources?.length || 0;
  const knowledgeCount = knowledge?.length || 0;

  const stats = [
    { value: String(projectCount), label: 'Tổng dự án', icon: 'folder-open', tintBg: '#e8f0fe', tintFg: '#1967d2' },
    { value: String(sourceCount), label: 'Nguồn dữ liệu', icon: 'file-text', tintBg: '#e6f4ea', tintFg: '#137333' },
    { value: String(knowledgeCount), label: 'Tri thức trích xuất', icon: 'brain-circuit', tintBg: '#f3e8fd', tintFg: '#8430ce' },
    { value: '—', label: 'Quality Score', icon: 'gauge', tintBg: '#fef7e0', tintFg: '#b06000' },
  ];

  return (
    <div className="px-10 py-8 max-w-[1180px] mx-auto">
      {/* Welcome */}
      <div
        className="rounded-3xl px-8 py-7 mb-7 flex items-center justify-between gap-6 flex-wrap"
        style={{ background: 'linear-gradient(110deg, var(--primary-container) 0%, #e8f0fe 60%, #eef4fe 100%)' }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11.5px] font-semibold uppercase tracking-wider text-primary">
              Local-first · Chuyên gia ngành
            </span>
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight text-on-primary-container">
            Xin chào, Business Analyst 👋
          </h1>
          <p className="text-[14px] mt-2 max-w-[600px]" style={{ color: '#1a3a66' }}>
            {projectCount > 0
              ? `Bạn có ${projectCount} dự án đang hoạt động. Tiếp tục khai phá hoặc tạo dự án mới.`
              : 'Bắt đầu bằng cách tạo dự án đầu tiên & khai phá với chuyên gia theo ngành.'
            }
          </p>
        </div>
        <PrimaryBtn icon="rocket" onClick={onCreateProject}>Tạo dự án mới</PrimaryBtn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Recent projects */}
      <SectionTitle
        right={
          <GhostBtn icon="folder-open" tone="primary" onClick={() => console.log('all projects')}>
            Tất cả
          </GhostBtn>
        }
      >
        Dự án gần đây
      </SectionTitle>

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {projects.slice(0, 4).map(p => (
            <Card key={p.id} hover onClick={() => onOpenProject(p.id)} className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="min-w-0">
                  <h3 className="text-[16px] font-semibold leading-tight text-text-primary">{p.name}</h3>
                  <div className="mt-2">
                    <IndustryBadge domain={p.domain} />
                  </div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-bg-active text-primary"
                >
                  <Icon name="arrow-right" size={18} strokeWidth={2} />
                </div>
              </div>
              {p.description && (
                <p className="text-[13px] text-text-secondary mb-3 line-clamp-2">{p.description}</p>
              )}
              <div className="flex items-center gap-1.5 text-[12.5px] text-text-secondary">
                <Icon name="clock" size={14} />
                <span>Cập nhật: {new Date(p.updatedAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-text-disabled mb-2">
            <Icon name="folder-open" size={48} strokeWidth={1.2} />
          </div>
          <p className="text-[15px] font-medium text-text-primary mb-1">Chưa có dự án nào</p>
          <p className="text-[13px] text-text-secondary mb-4">Tạo dự án đầu tiên để bắt đầu trích xuất tri thức</p>
          <PrimaryBtn icon="plus" onClick={onCreateProject}>Tạo dự án mới</PrimaryBtn>
        </Card>
      )}
    </div>
  );
};
