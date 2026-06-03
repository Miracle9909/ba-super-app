import { useEffect, useState, useCallback } from 'react';
import { AppShell } from './components/layout/AppShell';
import type { NavItem } from './components/layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Workspace } from './components/workspace/Workspace';
import { CreateProjectModal } from './components/CreateProjectModal';

function App() {
  const [screen, setScreen] = useState<'dashboard' | 'workspace'>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('sources');
  const [showCreate, setShowCreate] = useState(false);

  // Persistence Storage
  useEffect(() => {
    async function checkPersistedStorage() {
      if (navigator.storage && navigator.storage.persist) {
        try {
          const isPersisted = await navigator.storage.persisted();
          if (!isPersisted) {
            await navigator.storage.persist();
          }
        } catch (error) {
          console.error("Lỗi khi yêu cầu persistent storage:", error);
        }
      }
    }
    checkPersistedStorage();
  }, []);

  // Hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#project-')) {
        setActiveProjectId(hash.replace('#project-', ''));
        setScreen('workspace');
      } else {
        setActiveProjectId(null);
        setScreen('dashboard');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Listen for create project event from anywhere
  useEffect(() => {
    const handler = () => setShowCreate(true);
    window.addEventListener('ba-create-project', handler);
    return () => window.removeEventListener('ba-create-project', handler);
  }, []);

  // Compute activeNav for sidebar highlighting
  let activeNav = 'dashboard';
  if (screen === 'workspace' && activeProjectId) {
    const tabMap: Record<string, string> = {
      discovery: 'knowledge',
      tasks: 'tasks',
      output: 'reports',
    };
    activeNav = tabMap[activeTab] || 'projects';
  }

  const handleNav = useCallback((item: NavItem) => {
    if (item.screen === 'dashboard') {
      setScreen('dashboard');
      window.location.hash = '';
      return;
    }
    if (item.tab) setActiveTab(item.tab);
    if (activeProjectId) {
      setScreen('workspace');
    }
  }, [activeProjectId]);

  const handleOpenProject = useCallback((id: string) => {
    window.location.hash = `#project-${id}`;
  }, []);

  const handleCreateProject = useCallback(() => {
    setShowCreate(true);
  }, []);

  const handleProjectCreated = useCallback((id: string) => {
    setShowCreate(false);
    window.location.hash = `#project-${id}`;
  }, []);

  return (
    <>
      <AppShell activeNav={activeNav} onNav={handleNav} onCreateProject={handleCreateProject}>
        {screen === 'workspace' && activeProjectId ? (
          <Workspace projectId={activeProjectId} initialTab={activeTab} />
        ) : (
          <Dashboard onOpenProject={handleOpenProject} onCreateProject={handleCreateProject} />
        )}
      </AppShell>

      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleProjectCreated}
      />
    </>
  );
}

export default App;
