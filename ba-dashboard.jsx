/* =========================================================================
   BA Super App — Dashboard screen ("Tổng quan")
   ========================================================================= */
function StatCard({ stat }) {
  return (
    <Card hover className="p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: stat.tintBg, color: stat.tintFg }}>
        <Icon name={stat.icon} size={24} strokeWidth={2} />
      </div>
      <div className="leading-tight">
        <div className="text-[28px] font-semibold tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{stat.value}</div>
        <div className="text-[13px]" style={{ color: BA_TOKENS.textSecondary }}>{stat.label}</div>
      </div>
    </Card>
  );
}

function ProjectCard({ project, onOpen }) {
  return (
    <Card hover onClick={onOpen} className="p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold leading-tight truncate" style={{ color: BA_TOKENS.textPrimary }}>
            {project.name}
          </h3>
          <div className="mt-2"><DomainBadge domain={project.domain} /></div>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>
          <Icon name="arrow-right" size={18} strokeWidth={2} />
        </div>
      </div>
      <SegmentBar total={6} active={project.phaseStep} />
      <div className="mt-3.5 flex items-center gap-1.5 text-[12.5px]" style={{ color: BA_TOKENS.textSecondary }}>
        <Icon name="clock" size={14} />
        <span>Cập nhật: {project.updated} · Phase: {project.phase}</span>
      </div>
    </Card>
  );
}

function QuickActionCard({ action }) {
  return (
    <Card hover className="p-4 flex items-center gap-3.5">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: action.tintBg, color: action.tintFg }}>
        <Icon name={action.icon} size={22} strokeWidth={2} />
      </div>
      <div className="min-w-0 leading-snug">
        <div className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{action.title}</div>
        <div className="text-[12.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>{action.desc}</div>
      </div>
    </Card>
  );
}

function DashboardScreen({ onOpenProject, onCreate }) {
  return (
    <div className="px-10 py-8 max-w-[1180px] mx-auto">
      {/* Welcome banner */}
      <div className="rounded-3xl px-8 py-7 mb-7 flex items-center justify-between gap-6 flex-wrap"
        style={{ background: `linear-gradient(110deg, ${BA_TOKENS.primaryContainer} 0%, #e8f0fe 60%, #eef4fe 100%)` }}>
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold tracking-tight" style={{ color: BA_TOKENS.onPrimaryContainer }}>
            Xin chào, Business Analyst 👋
          </h1>
          <p className="text-[14px] mt-2 max-w-[560px]" style={{ color: "#1a3a66" }}>
            Bạn có 2 dự án đang hoạt động. Hãy tiếp tục công việc hoặc bắt đầu dự án mới.
          </p>
        </div>
        <PrimaryBtn icon="plus" onClick={onCreate}>Tạo dự án mới</PrimaryBtn>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {BA_STATS.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* 2:1 grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent projects */}
        <div className="col-span-2">
          <SectionTitle>Dự án gần đây</SectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <ProjectCard project={BA_PROJECTS.bidv} onOpen={() => onOpenProject("bidv")} />
            <ProjectCard project={BA_PROJECTS.mbl} onOpen={() => onOpenProject("mbl")} />
          </div>
        </div>

        {/* Quick start */}
        <div className="col-span-1">
          <SectionTitle>Bắt đầu nhanh</SectionTitle>
          <div className="flex flex-col gap-3.5">
            {BA_QUICK_ACTIONS.map((a) => <QuickActionCard key={a.title} action={a} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardScreen, StatCard, ProjectCard, QuickActionCard });
