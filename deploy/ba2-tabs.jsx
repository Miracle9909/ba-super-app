/* =========================================================================
   BA Super App v2 — Tab: Thông tin + Nguồn dữ liệu
   ========================================================================= */

function InfoTabV2({ project }) {
  const ind = BA2_INDUSTRIES.find(i => i.id === project.industry);
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col gap-6">
        <Card className="p-6">
          <SectionTitle>Thông tin chung</SectionTitle>
          <div className="grid grid-cols-2 gap-x-8">
            <div>
              <Field label="Tên dự án">{project.name}</Field>
              <Field label="Domain">
                <span className="inline-flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: ind.bg, color: ind.fg }}>
                    <Icon name={ind.icon} size={14} strokeWidth={2} />
                  </span>
                  {ind.label}
                </span>
              </Field>
              <Field label="Người tạo">{project.creator} · Business Analyst</Field>
            </div>
            <div>
              <Field label="Compliance">{project.compliance}</Field>
              <Field label="Ngày tạo">{project.created}</Field>
              <Field label="Cập nhật">{project.updated}</Field>
            </div>
          </div>
          <div className="pt-4">
            <div className="text-[12px] font-medium uppercase tracking-wide mb-1.5" style={{ color: BA_TOKENS.textDisabled }}>Mục tiêu dự án</div>
            <p className="text-[14px] leading-relaxed" style={{ color: BA_TOKENS.textPrimary }}>{project.goal}</p>
          </div>
        </Card>

        {/* Template attached — dynamic categories */}
        <Card className="p-6">
          <SectionTitle sub="Output cùng loại sẽ được render theo đúng định dạng của tài liệu mẫu đã đính.">
            Tài liệu mẫu đã đính
          </SectionTitle>
          {(() => {
            const tpls = project.tplFiles || {};
            const keys = Object.keys(tpls).filter(k => (tpls[k] || []).length > 0);
            if (keys.length === 0) {
              return (
                <div className="rounded-2xl border-2 border-dashed py-6 text-center"
                  style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary }}>
                  <Icon name="layout-template" size={22} style={{ color: BA_TOKENS.textDisabled, margin: "0 auto 6px" }} />
                  <div className="text-[13px] font-medium">Chưa đính tài liệu mẫu nào</div>
                  <div className="text-[12px] mt-1">Output sẽ dùng template chuẩn của hệ thống</div>
                </div>
              );
            }
            return (
              <div className="grid grid-cols-2 gap-3">
                {keys.map(k => {
                  const cat = BA2_TEMPLATE_CATEGORIES.find(c => c.id === k);
                  const label = cat?.label || k;
                  const icon = cat?.icon || "file-text";
                  const tone = BA2_TPL_TONES[cat?.tone || "slate"];
                  const files = tpls[k];
                  return (
                    <div key={k} className="rounded-2xl border p-3.5"
                      style={{ borderColor: "#a8dab5", background: "#f6fdf8" }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ background: tone.bg, color: tone.fg }}>
                          <Icon name={icon} size={16} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13.5px] font-semibold truncate" style={{ color: BA_TOKENS.textPrimary }}>{label}</div>
                          <div className="text-[11px]" style={{ color: BA_TOKENS.textSecondary }}>{cat?.group || "Tự định nghĩa"}</div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: "#e6f4ea", color: "#137333" }}>
                          <Icon name="check-circle" size={11} strokeWidth={2.2} /> {files.length}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {files.map((f, i) => (
                          <div key={i} className="flex items-center gap-2 text-[12px]" style={{ color: BA_TOKENS.textPrimary }}>
                            <Icon name={fileIconFor(f.name)} size={13} style={{ color: BA_TOKENS.textSecondary }} />
                            <span className="font-medium truncate flex-1">{f.name}</span>
                            <span className="font-mono text-[10.5px]" style={{ color: BA_TOKENS.textSecondary }}>{formatBytes(f.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </Card>

        {/* 7 industry chips */}
        <Card className="p-6">
          <SectionTitle sub="Ngành quyết định bộ chuyên gia, knowledge gốc & template áp dụng.">
            Ngành hỗ trợ
          </SectionTitle>
          <div className="flex flex-wrap gap-2.5">
            {BA2_INDUSTRIES.map((ind2) => {
              const sel = ind2.id === project.industry;
              return (
                <span key={ind2.id}
                  style={sel
                    ? { background: ind2.bg, color: ind2.fg, borderColor: ind2.fg }
                    : { background: "#fff", color: BA_TOKENS.textSecondary, borderColor: BA_TOKENS.border }}
                  className="inline-flex items-center gap-1.5 px-3 h-9 rounded-full text-[13px] font-medium border">
                  <Icon name={ind2.icon} size={15} strokeWidth={2} />
                  {ind2.short}
                  {sel && <Icon name="check" size={14} strokeWidth={2.4} />}
                </span>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div className="col-span-1 flex flex-col gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="gauge" size={20} style={{ color: BA_TOKENS.primary }} />
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Readiness</h3>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <div className="text-[40px] font-semibold leading-none tracking-tight" style={{ color: BA_TOKENS.primary }}>{project.readiness}%</div>
            <div className="text-[13px] pb-1.5" style={{ color: BA_TOKENS.textSecondary }}>sẵn sàng output</div>
          </div>
          <ProgressBar value={project.readiness} />
          <p className="text-[12.5px] mt-4 leading-relaxed" style={{ color: BA_TOKENS.textSecondary }}>
            Cần hoàn tất khai phá & xác nhận tri thức trước khi sinh deliverables.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-[15px] font-semibold mb-3" style={{ color: BA_TOKENS.textPrimary }}>Bước tiếp theo</h3>
          <div className="flex flex-col gap-2">
            {[
              { t: "Hoàn tất khai phá với chuyên gia", done: false },
              { t: "Xác nhận tri thức (Entities · Rules)", done: false },
              { t: "Chốt Function list",                   done: false },
              { t: "Estimate & review",                    done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[13px]">
                <div className="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0"
                  style={{ borderColor: BA_TOKENS.border, background: "#fff" }}>
                  <span className="text-[10px] font-bold" style={{ color: BA_TOKENS.textDisabled }}>{i + 1}</span>
                </div>
                <span style={{ color: BA_TOKENS.textPrimary }}>{s.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Sources tab v2 ---------- */
function ChannelCardV2({ channel, coming }) {
  const [h, setH] = React.useState(false);
  return (
    <button
      disabled={coming}
      onMouseEnter={() => !coming && setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => !coming && console.log("channel:", channel.label)}
      style={{
        borderColor: h ? BA_TOKENS.primary : BA_TOKENS.border,
        background: h ? BA_TOKENS.active : "#fff",
        borderStyle: "dashed",
        opacity: coming ? 0.55 : 1,
        cursor: coming ? "not-allowed" : "pointer",
      }}
      className="flex flex-col items-center justify-center gap-2.5 py-6 rounded-2xl border-2 transition-all relative">
      {coming && (
        <span className="absolute top-2 right-2 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
          style={{ background: "#fef7e0", color: "#b06000" }}>sắp có</span>
      )}
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: h ? "#fff" : "#f1f3f4", color: coming ? BA_TOKENS.textSecondary : BA_TOKENS.primary }}>
        <Icon name={channel.icon} size={24} strokeWidth={2} />
      </div>
      <div className="text-center">
        <div className="text-[13.5px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{channel.label}</div>
        <div className="text-[11.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>{channel.desc}</div>
      </div>
    </button>
  );
}

function SourcesTabV2() {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <SectionTitle sub="Nạp tài liệu thô để chuyên gia AI phân tích & trích xuất tri thức.">
          Trung tâm nạp dữ liệu
        </SectionTitle>
        <div className="grid grid-cols-3 gap-3.5 mb-3.5">
          {BA2_CHANNELS_MAIN.map(c => <ChannelCardV2 key={c.label} channel={c} />)}
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          {BA2_CHANNELS_COMING.map(c => <ChannelCardV2 key={c.label} channel={c} coming />)}
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle right={<GhostBtn icon="refresh-cw" tone="primary" onClick={() => console.log("parse all")}>Parse tất cả</GhostBtn>}>
          Tài liệu đã nạp (3)
        </SectionTitle>
        <div className="flex flex-col gap-3">
          {BA2_SOURCES.map(s => <SourceItem key={s.name} source={s} />)}
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { InfoTabV2, SourcesTabV2, ChannelCardV2 });
