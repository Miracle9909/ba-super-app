/* =========================================================================
   BA Super App v3 — Root: WorkspaceV3 (Discovery v3 + Tasks v3) + BASuperAppV3
   ========================================================================= */
function WorkspaceV3({ project, activeTab, onTab, activeTask, setActiveTask, onSinhNhap }) {
  return (
    <div className="px-10 py-8 max-w-[1320px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[24px] font-semibold tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{project.name}</h1>
            <IndustryBadge industryId={project.industry} size="md" />
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
              style={{ background: BA_TOKENS.primary, color: "#fff" }}>v3</span>
          </div>
          <div className="flex items-center gap-1.5 text-[13px] mt-2" style={{ color: BA_TOKENS.textSecondary }}>
            <span>Tạo: {project.created}</span>
            <span style={{ color: BA_TOKENS.border }}>·</span>
            <span>Cập nhật: {project.updated}</span>
            <span style={{ color: BA_TOKENS.border }}>·</span>
            <span>Readiness: <span style={{ color: BA_TOKENS.primary, fontWeight: 600 }}>{project.readiness}%</span></span>
          </div>
        </div>
        <IconBtn icon="settings" title="Cài đặt dự án" />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b mb-7" style={{ borderColor: BA_TOKENS.border }}>
        {BA2_TABS.map((t) => {
          const active = t.id === activeTab;
          return (
            <button key={t.id} onClick={() => { onTab(t.id); setActiveTask(null); }}
              style={{ color: active ? BA_TOKENS.primary : BA_TOKENS.textSecondary }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = BA_TOKENS.textPrimary; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = BA_TOKENS.textSecondary; }}
              className="relative inline-flex items-center gap-2 px-4 h-11 text-[13.5px] font-medium transition-colors">
              <Icon name={t.icon} size={18} strokeWidth={active ? 2.1 : 1.85} />
              {t.label}
              {active && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full" style={{ background: BA_TOKENS.primary }} />}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === "info"      && <InfoTabV2 project={project} />}
        {activeTab === "sources"   && <SourcesTabV2 />}
        {activeTab === "discovery" && <DiscoveryTabV3 project={project} onSinhNhap={onSinhNhap} />}
        {activeTab === "tasks"     && <TasksTabV3 activeTask={activeTask} onOpen={setActiveTask} onBack={() => setActiveTask(null)} />}
        {activeTab === "output"    && <OutputTab project={project} />}
      </div>
    </div>
  );
}

function BASuperAppV3() {
  const [screen, setScreen]         = React.useState("dashboard");
  const [activeTab, setActiveTab]   = React.useState("info");
  const [activeProject, setProject] = React.useState("bidv");
  const [activeTask, setActiveTask] = React.useState(null);
  const [showCreate, setShowCreate] = React.useState(false);

  let activeNav = "dashboard";
  if (screen === "workspace") {
    activeNav = ({ discovery: "knowledge", tasks: "tasks", output: "reports" })[activeTab] || "projects";
  }

  const handleNav = (item) => {
    setActiveTask(null);
    if (item.screen === "dashboard") { setScreen("dashboard"); return; }
    setScreen("workspace");
    if (item.tab) setActiveTab(item.tab);
  };

  const openProject = (id) => {
    setProject(id); setScreen("workspace"); setActiveTab("info"); setActiveTask(null);
  };

  const handleCreate = (data) => {
    console.log("v3 create project:", data);
    setShowCreate(false);
    setScreen("workspace");
    setActiveTab("discovery");
    setActiveTask(null);
  };

  // "Sinh nháp" from Khai phá → jump to Tasks hub
  const handleSinhNhap = (outputs) => {
    console.log("Sinh nháp:", outputs);
    setActiveTab("tasks");
    setActiveTask(null);
  };

  const project = BA2_PROJECTS[activeProject];

  return (
    <div className="h-full w-full flex" style={{ background: BA_TOKENS.appBg, padding: 12 }}>
      <SidebarV2 activeNav={activeNav} onNav={handleNav} />

      <main className="flex-1 min-w-0 flex flex-col rounded-3xl overflow-hidden"
        style={{ background: BA_TOKENS.surface, boxShadow: "0 1px 3px rgba(60,64,67,.10), 0 4px 16px rgba(60,64,67,.06)" }}>
        <Header onCreate={() => setShowCreate(true)} />
        <div className="flex-1 overflow-y-auto" style={{ background: "#fcfdff" }}>
          {screen === "dashboard"
            ? <DashboardV2 onOpenProject={openProject} onCreate={() => setShowCreate(true)} />
            : <WorkspaceV3
                project={project} activeTab={activeTab} onTab={setActiveTab}
                activeTask={activeTask} setActiveTask={setActiveTask}
                onSinhNhap={handleSinhNhap} />}
        </div>
      </main>

      <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
    </div>
  );
}

Object.assign(window, { WorkspaceV3, BASuperAppV3 });
