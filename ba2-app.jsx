/* =========================================================================
   BA Super App v2 — Dashboard + Workspace + Root
   ========================================================================= */
function DashboardV2({ onOpenProject, onCreate }) {
  return (
    <div className="px-10 py-8 max-w-[1180px] mx-auto">
      {/* Welcome */}
      <div className="rounded-3xl px-8 py-7 mb-7 flex items-center justify-between gap-6 flex-wrap"
        style={{ background: `linear-gradient(110deg, ${BA_TOKENS.primaryContainer} 0%, #e8f0fe 60%, #eef4fe 100%)` }}>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
              style={{ background: BA_TOKENS.primary, color: "#fff" }}>v2</span>
            <span className="text-[11.5px] font-semibold uppercase tracking-wider" style={{ color: BA_TOKENS.primary }}>4 lớp · Chuyên gia ngành</span>
          </div>
          <h1 className="text-[26px] font-semibold tracking-tight" style={{ color: BA_TOKENS.onPrimaryContainer }}>
            Xin chào, Business Analyst 👋
          </h1>
          <p className="text-[14px] mt-2 max-w-[600px]" style={{ color: "#1a3a66" }}>
            Bạn có 2 dự án đang hoạt động. Tạo dự án mới & bắt đầu khai phá với chuyên gia theo ngành.
          </p>
        </div>
        <PrimaryBtn icon="rocket" onClick={onCreate}>Tạo dự án mới</PrimaryBtn>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {BA2_STATS.map(s => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Recent projects (full width 2 cols) */}
      <SectionTitle right={<GhostBtn icon="folder-open" tone="primary" onClick={() => console.log("all projects")}>Tất cả</GhostBtn>}>
        Dự án gần đây
      </SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(BA2_PROJECTS).map(p => (
          <Card key={p.id} hover onClick={() => onOpenProject(p.id)} className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3.5">
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold leading-tight" style={{ color: BA_TOKENS.textPrimary }}>{p.name}</h3>
                <div className="mt-2"><IndustryBadge industryId={p.industry} /></div>
              </div>
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>
                <Icon name="arrow-right" size={18} strokeWidth={2} />
              </div>
            </div>
            <div className="flex items-center justify-between text-[12.5px] mb-1.5">
              <span style={{ color: BA_TOKENS.textSecondary }}>Readiness</span>
              <span className="font-semibold" style={{ color: BA_TOKENS.primary }}>{p.readiness}%</span>
            </div>
            <ProgressBar value={p.readiness} height={6} />
            <div className="mt-3.5 flex items-center gap-1.5 text-[12.5px]" style={{ color: BA_TOKENS.textSecondary }}>
              <Icon name="clock" size={14} />
              <span>Cập nhật: {p.updated}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------- Workspace shell ---------- */
function WorkspaceV2({ project, activeTab, onTab, activeTask, setActiveTask }) {
  return (
    <div className="px-10 py-8 max-w-[1280px] mx-auto">
      {/* Workspace header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[24px] font-semibold tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{project.name}</h1>
            <IndustryBadge industryId={project.industry} size="md" />
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

      {/* Tab content */}
      <div>
        {activeTab === "info"      && <InfoTabV2 project={project} />}
        {activeTab === "sources"   && <SourcesTabV2 />}
        {activeTab === "discovery" && <DiscoveryTab project={project} />}
        {activeTab === "tasks"     && <TasksTab activeTask={activeTask} onOpen={setActiveTask} onBack={() => setActiveTask(null)} />}
        {activeTab === "output"    && <OutputTab project={project} />}
      </div>
    </div>
  );
}

/* ---------- Root ---------- */
function BASuperAppV2() {
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
    console.log("create project:", data);
    setShowCreate(false);
    setScreen("workspace");
    setActiveTab("discovery"); // bước 2: bắt đầu khai phá
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
            : <WorkspaceV2
                project={project} activeTab={activeTab} onTab={setActiveTab}
                activeTask={activeTask} setActiveTask={setActiveTask} />}
        </div>
      </main>

      <CreateProjectModal open={showCreate} onClose={() => setShowCreate(false)} onCreate={handleCreate} />
    </div>
  );
}

Object.assign(window, { DashboardV2, WorkspaceV2, BASuperAppV2 });
