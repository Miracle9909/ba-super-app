/* =========================================================================
   BA Super App — Workspace tabs A: Thông tin dự án + Nguồn dữ liệu
   ========================================================================= */
function Field({ label, children }) {
  return (
    <div className="py-3 border-b last:border-b-0" style={{ borderColor: "#eceff3" }}>
      <div className="text-[12px] font-medium uppercase tracking-wide mb-1" style={{ color: BA_TOKENS.textDisabled }}>{label}</div>
      <div className="text-[14px]" style={{ color: BA_TOKENS.textPrimary }}>{children}</div>
    </div>
  );
}

function InfoTab({ project }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left: read fields */}
      <div className="col-span-2 flex flex-col gap-6">
        <Card className="p-6">
          <SectionTitle>Thông tin chung</SectionTitle>
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <Field label="Tên dự án">{project.name}</Field>
              <Field label="Domain">{project.domainFull}</Field>
              <Field label="Loại nguồn">{project.sourceType}</Field>
            </div>
            <div>
              <Field label="Quy mô mục tiêu">{project.scale}</Field>
              <Field label="Compliance">{project.compliance}</Field>
              <Field label="Người tạo">{project.creator} · Business Analyst</Field>
            </div>
          </div>
          <div className="pt-4">
            <div className="text-[12px] font-medium uppercase tracking-wide mb-1.5" style={{ color: BA_TOKENS.textDisabled }}>Mô tả ngắn</div>
            <p className="text-[14px] leading-relaxed" style={{ color: BA_TOKENS.textPrimary }}>{project.desc}</p>
          </div>
        </Card>

        {/* Domain chips */}
        <Card className="p-6">
          <SectionTitle sub="Domain quyết định bộ tri thức, quy tắc & template mà AI áp dụng.">Domain hỗ trợ</SectionTitle>
          <div className="flex flex-wrap gap-2.5">
            {BA_DOMAINS.map((d) => {
              const selected = d === project.domainFull;
              return (
                <span key={d}
                  style={selected
                    ? { background: BA_TOKENS.primaryContainer, color: BA_TOKENS.onPrimaryContainer, borderColor: "transparent" }
                    : { background: "#fff", color: BA_TOKENS.textSecondary, borderColor: BA_TOKENS.border }}
                  className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full text-[13px] font-medium border">
                  {selected && <Icon name="check" size={15} strokeWidth={2.4} />}
                  {d}
                </span>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right: readiness */}
      <div className="col-span-1 flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="gauge" size={20} style={{ color: BA_TOKENS.primary }} />
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Readiness</h3>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-[40px] font-semibold leading-none tracking-tight" style={{ color: BA_TOKENS.primary }}>{project.readiness}%</div>
            <div className="text-[13px] pb-1.5" style={{ color: BA_TOKENS.textSecondary }}>sẵn sàng pipeline</div>
          </div>
          <ProgressBar value={project.readiness} />
          <p className="text-[12.5px] mt-4 leading-relaxed" style={{ color: BA_TOKENS.textSecondary }}>
            Cần bổ sung nguồn dữ liệu & xác nhận tri thức để mở khoá các bước tiếp theo của pipeline.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="circle-dot" size={18} style={{ color: BA_TOKENS.textSecondary }} />
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Trạng thái hiện tại</h3>
          </div>
          <div className="flex items-center justify-between text-[13.5px] py-1.5">
            <span style={{ color: BA_TOKENS.textSecondary }}>Phase</span>
            <span className="font-medium" style={{ color: BA_TOKENS.textPrimary }}>{project.phase}</span>
          </div>
          <div className="flex items-center justify-between text-[13.5px] py-1.5">
            <span style={{ color: BA_TOKENS.textSecondary }}>Cập nhật</span>
            <span className="font-medium" style={{ color: BA_TOKENS.textPrimary }}>{project.updated}</span>
          </div>
          <div className="flex items-center justify-between text-[13.5px] py-1.5">
            <span style={{ color: BA_TOKENS.textSecondary }}>Tạo ngày</span>
            <span className="font-medium" style={{ color: BA_TOKENS.textPrimary }}>{project.created}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Sources tab ---------- */
function ChannelCard({ channel }) {
  const [h, setH] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => console.log("channel:", channel.label)}
      style={{
        borderColor: h ? BA_TOKENS.primary : BA_TOKENS.border,
        background: h ? BA_TOKENS.active : "#fff",
        borderStyle: "dashed",
      }}
      className="flex flex-col items-center justify-center gap-2.5 py-6 rounded-2xl border-2 transition-all">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{ background: h ? "#fff" : "#f1f3f4", color: BA_TOKENS.primary, transition: "background .18s" }}>
        <Icon name={channel.icon} size={22} strokeWidth={2} />
      </div>
      <span className="text-[13px] font-medium" style={{ color: BA_TOKENS.textPrimary }}>{channel.label}</span>
    </button>
  );
}

function SourceItem({ source }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl border transition-colors"
      style={{ borderColor: BA_TOKENS.border, background: "#fff" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>
        <Icon name={source.icon} size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium truncate" style={{ color: BA_TOKENS.textPrimary }}>{source.name}</div>
        <div className="text-[12.5px] mt-0.5 truncate" style={{ color: BA_TOKENS.textSecondary }}>{source.meta}</div>
      </div>
      <StatusBadge status={source.status} />
      <div className="flex items-center gap-1">
        {[["eye", "Xem"], ["refresh-cw", "Parse"], ["trash-2", "Xoá"]].map(([ic, t]) => (
          <button key={ic} title={t} onClick={() => console.log(t, source.name)}
            style={{ color: ic === "trash-2" ? "#c5221f" : BA_TOKENS.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors">
            <Icon name={ic} size={17} />
          </button>
        ))}
      </div>
    </div>
  );
}

function SourcesTab() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <SectionTitle sub="Nạp tài liệu thô, HSYC, meeting notes để AI tự động phân tích và trích xuất tri thức.">
          Trung tâm nạp dữ liệu
        </SectionTitle>
        <div className="grid grid-cols-5 gap-3.5">
          {BA_CHANNELS.map((c) => <ChannelCard key={c.label} channel={c} />)}
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle right={<GhostBtn icon="refresh-cw" tone="primary" onClick={() => console.log("parse all")}>Parse tất cả</GhostBtn>}>
          Tài liệu đã nạp (3)
        </SectionTitle>
        <div className="flex flex-col gap-3">
          {BA_SOURCES.map((s) => <SourceItem key={s.name} source={s} />)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { InfoTab, SourcesTab, Field, ChannelCard, SourceItem });
