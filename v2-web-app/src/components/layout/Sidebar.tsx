import React, { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { v4 as uuidv4 } from 'uuid';
import { exportDB, importInto } from "dexie-export-import";
import { Icon } from '../ui/Icon';
import { SettingsModal } from './SettingsModal';

/* ---- Nav config matching prototype ---- */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Tổng quan', icon: 'layout-dashboard', screen: 'dashboard' as const },
  { id: 'projects', label: 'Quản lý dự án', icon: 'folder-open', screen: 'workspace' as const, tab: 'info' },
  { id: 'knowledge', label: 'Tri thức (Knowledge)', icon: 'graduation-cap', screen: 'workspace' as const, tab: 'discovery' },
  { id: 'tasks', label: 'Tác vụ', icon: 'list-checks', screen: 'workspace' as const, tab: 'tasks' },
  { id: 'reports', label: 'Báo cáo phân tích', icon: 'bar-chart-3', screen: 'workspace' as const, tab: 'output' },
];

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  screen: 'dashboard' | 'workspace';
  tab?: string;
}

interface SidebarProps {
  activeNav: string;
  onNav: (item: NavItem) => void;
  onCreateProject?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNav, onCreateProject }) => {
  const projects = useLiveQuery(() => db.projects.toArray());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', domain: 'Banking', description: '' });

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.name.trim()) {
      const proj = {
        id: uuidv4(),
        name: newProject.name.trim(),
        domain: newProject.domain,
        description: newProject.description.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      await db.projects.add(proj);
      window.location.hash = `#project-${proj.id}`;
      setShowCreateModal(false);
      setNewProject({ name: '', domain: 'Banking', description: '' });
    }
  };

  const handleExport = async () => {
    try {
      setIsProcessing(true);
      const blob = await exportDB(db, { prettyJson: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ba-super-app-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
      alert("Xuất dữ liệu thất bại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (confirm('Import sẽ ghi đè dữ liệu hiện tại. Bạn có chắc chắn?')) {
      try {
        setIsProcessing(true);
        await importInto(db, file, { overwriteValues: true, clearTablesBeforeImport: true });
        alert("Nhập dữ liệu thành công!");
        window.location.reload();
      } catch (error) {
        console.error("Import failed", error);
        alert("Nhập dữ liệu thất bại.");
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <aside className="shrink-0 h-full flex flex-col px-3 py-2" style={{ width: 280, background: 'var(--bg-app)' }}>
        {/* Brand */}
        <button
          onClick={() => onNav(NAV_ITEMS[0])}
          className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors hover:bg-bg-hover"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 bg-primary">
            <Icon name="drafting-compass" size={22} strokeWidth={2} />
          </div>
          <div className="text-left leading-tight">
            <div className="text-[15px] font-semibold text-text-primary">BA Super App</div>
            <div className="text-[11px] text-text-secondary">Senior Business Analyst</div>
          </div>
        </button>

        {/* Group label */}
        <div className="px-3 mt-5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-disabled">
          Menu chính
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item)}
                className={`flex items-center gap-3 px-3 h-11 rounded-full text-[13.5px] font-medium text-left transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-text-secondary hover:bg-bg-hover'
                }`}
              >
                <Icon name={item.icon} size={20} strokeWidth={isActive ? 2.1 : 1.85} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Projects list */}
        <div className="px-3 mt-5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-disabled flex items-center justify-between">
          <span>Dự án</span>
          <button
            className="text-text-secondary hover:text-primary transition-colors"
            onClick={() => onCreateProject ? onCreateProject() : setShowCreateModal(true)}
            title="Tạo dự án mới"
          >
            <Icon name="plus" size={16} strokeWidth={2.2} />
          </button>
        </div>

        <div className="flex flex-col gap-0.5 flex-1 overflow-y-auto min-h-0">
          {projects?.map(project => (
            <a
              key={project.id}
              href={`#project-${project.id}`}
              className="flex items-center gap-3 px-3 h-10 rounded-full text-[13px] font-medium transition-colors text-text-secondary hover:bg-bg-hover truncate"
            >
              <Icon name="folder-open" size={18} strokeWidth={1.85} />
              <span className="truncate">{project.name}</span>
            </a>
          ))}
          {projects?.length === 0 && (
            <div className="px-3 py-3 text-[12px] text-text-disabled italic">Chưa có dự án nào</div>
          )}
        </div>

        {/* Bottom: Settings & Data */}
        <div className="mt-auto pt-2 border-t border-border-color">
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleImport} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-3 px-3 h-9 rounded-full text-[12.5px] font-medium text-text-secondary hover:bg-bg-hover transition-colors disabled:opacity-50 w-full"
          >
            <Icon name="file-down" size={16} /> Nhập dữ liệu
          </button>
          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="flex items-center gap-3 px-3 h-9 rounded-full text-[12.5px] font-medium text-text-secondary hover:bg-bg-hover transition-colors disabled:opacity-50 w-full"
          >
            <Icon name="upload" size={16} /> Xuất dữ liệu
          </button>
        </div>

        {/* User profile card */}
        <div className="mt-2 mb-1 flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-border-color bg-bg-surface group">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 bg-primary">
            BA
          </div>
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-[13px] font-semibold truncate text-text-primary">Người dùng</div>
            <div className="text-[11.5px] truncate text-text-secondary">Business Analyst</div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-hover hover:text-text-primary transition-colors opacity-0 group-hover:opacity-100"
            title="Cài đặt hệ thống"
          >
            <Icon name="settings" size={16} />
          </button>
        </div>
      </aside>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-bg-surface rounded-2xl w-full max-w-md p-6 shadow-xl border border-border-color">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium text-text-primary">Tạo dự án mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-text-secondary hover:text-text-primary transition-colors w-8 h-8 rounded-full hover:bg-bg-hover flex items-center justify-center"
              >
                <Icon name="x" size={18} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Tên dự án <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full bg-bg-surface border border-border-color rounded-lg px-3 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Ví dụ: Hệ thống CRM Core"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Lĩnh vực <span className="text-red-500">*</span></label>
                <select
                  required
                  value={newProject.domain}
                  onChange={(e) => setNewProject({...newProject, domain: e.target.value})}
                  className="w-full bg-bg-surface border border-border-color rounded-lg px-3 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
                >
                  <option value="Banking">Banking (Ngân hàng)</option>
                  <option value="Insurance">Insurance (Bảo hiểm)</option>
                  <option value="Fintech">Fintech</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Mô tả</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full bg-bg-surface border border-border-color rounded-lg px-3 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  rows={3}
                  placeholder="Mô tả ngắn gọn về dự án..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-full text-[14px] font-medium text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newProject.name.trim()}
                  className="px-6 py-2 rounded-full bg-primary text-white text-[14px] font-medium hover:bg-primary-hover disabled:bg-border-color disabled:text-text-disabled transition-colors"
                >
                  Tạo dự án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
