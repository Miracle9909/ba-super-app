import React from 'react';
import { Sidebar } from './Sidebar';
import type { NavItem } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
  activeNav: string;
  onNav: (item: NavItem) => void;
  onCreateProject?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeNav, onNav, onCreateProject }) => {
  return (
    <div className="flex h-screen bg-bg-app" style={{ padding: 12 }}>
      <Sidebar activeNav={activeNav} onNav={onNav} onCreateProject={onCreateProject} />

      <main
        className="flex-1 min-w-0 flex flex-col rounded-3xl overflow-hidden bg-bg-surface"
        style={{ boxShadow: '0 1px 3px rgba(60,64,67,.10), 0 4px 16px rgba(60,64,67,.06)' }}
      >
        <Header onCreateProject={onCreateProject} />
        <div className="flex-1 overflow-y-auto" style={{ background: '#fcfdff' }}>
          {children}
        </div>
      </main>
    </div>
  );
};
