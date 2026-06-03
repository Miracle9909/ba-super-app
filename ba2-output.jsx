/* =========================================================================
   BA Super App v2 — Tab Báo cáo & Xuất (Trung tâm Xuất)
   ========================================================================= */
function DeliverableCardV2({ d }) {
  const gate = d.state === "gate";
  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: gate ? "#e6f4ea" : "#f1f3f4", color: gate ? "#137333" : BA_TOKENS.textSecondary }}>
          <Icon name={d.icon} size={20} />
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium"
          style={gate ? { background: "#e6f4ea", color: "#137333" } : { background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>
          <Icon name={gate ? "check-circle" : "pencil"} size={11} strokeWidth={2.2} />
          {gate ? "Đạt gate" : "Nháp"}
        </span>
      </div>
      <div className="text-[14px] font-semibold mb-3" style={{ color: BA_TOKENS.textPrimary }}>{d.name}</div>
      <button onClick={() => console.log("view", d.name)}
        className="w-full h-8 rounded-full text-[12.5px] font-medium border inline-flex items-center justify-center gap-1.5 transition-colors"
        style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary, background: "#fff" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
        <Icon name="eye" size={14} /> Xem
      </button>
    </Card>
  );
}

function ExportCenter({ project }) {
  const [gran, setGran] = React.useState("all");
  const [tplOpen, setTplOpen] = React.useState(false);
  const [format, setFormat] = React.useState("MD");

  // Build dynamic template list from project's attached files
  const tplFiles = (project && project.tplFiles) || {};
  const attachedKeys = Object.keys(tplFiles).filter(k => (tplFiles[k] || []).length > 0);
  const attachedOpts = attachedKeys.map(k => {
    const cat = BA2_TEMPLATE_CATEGORIES.find(c => c.id === k);
    return {
      id: k,
      label: cat?.label || k,
      icon: cat?.icon || "file-text",
      group: cat?.group || "Tự định nghĩa",
      tone: BA2_TPL_TONES[cat?.tone || "slate"],
      attached: true,
      count: (tplFiles[k] || []).length,
    };
  });
  // Also include uncovered preset categories (system default templates)
  const presetOpts = BA2_TEMPLATE_CATEGORIES.filter(c => !attachedKeys.includes(c.id)).map(c => ({
    id: c.id, label: c.label, icon: c.icon, group: c.group,
    tone: BA2_TPL_TONES[c.tone || "slate"], attached: false, count: 0,
  }));
  const allOpts = [...attachedOpts, ...presetOpts];
  const [template, setTemplate] = React.useState(attachedOpts[0]?.id || (allOpts[0]?.id || "brd"));
  const selected = allOpts.find(o => o.id === template) || allOpts[0];

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="file-down-2" size={20} style={{ color: BA_TOKENS.primary }} />
            <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>Trung tâm Xuất</h2>
          </div>
          <p className="text-[13px]" style={{ color: BA_TOKENS.textSecondary }}>Chọn độ chi tiết · template · định dạng. Có thể push thẳng sang Jira/Confluence.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Granularity radio */}
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: BA_TOKENS.textDisabled }}>Granularity</div>
          <div className="flex flex-col gap-2">
            {BA2_GRANS.map(g => {
              const sel = gran === g.id;
              return (
                <button key={g.id} onClick={() => setGran(g.id)}
                  style={sel
                    ? { background: BA_TOKENS.active, borderColor: BA_TOKENS.primary }
                    : { background: "#fff", borderColor: BA_TOKENS.border }}
                  onMouseEnter={(e) => { if (!sel) e.currentTarget.style.background = BA_TOKENS.hover; }}
                  onMouseLeave={(e) => { if (!sel) e.currentTarget.style.background = "#fff"; }}
                  className="flex items-start gap-3 p-3 rounded-xl border text-left transition-colors">
                  <span className="w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center"
                    style={{ borderColor: sel ? BA_TOKENS.primary : BA_TOKENS.border, background: sel ? "#fff" : "#fff" }}>
                    {sel && <span className="w-2 h-2 rounded-full" style={{ background: BA_TOKENS.primary }} />}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold" style={{ color: sel ? BA_TOKENS.primary : BA_TOKENS.textPrimary }}>{g.label}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>{g.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template dropdown (dynamic) */}
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: BA_TOKENS.textDisabled }}>Loại tài liệu (template)</div>
          <div className="relative">
            <button onClick={() => setTplOpen(o => !o)}
              className="w-full h-12 px-3 rounded-xl border text-[13.5px] flex items-center justify-between transition-colors"
              style={{ borderColor: BA_TOKENS.border, background: "#fff", color: BA_TOKENS.textPrimary }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = BA_TOKENS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = BA_TOKENS.border)}>
              <div className="flex items-center gap-2 min-w-0">
                {selected && (
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: selected.tone.bg, color: selected.tone.fg }}>
                    <Icon name={selected.icon} size={15} strokeWidth={2} />
                  </span>
                )}
                <span className="font-semibold truncate">{selected?.label}</span>
                {selected?.attached && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: "#e6f4ea", color: "#137333" }}>mẫu đính</span>
                )}
              </div>
              <Icon name="chevron-down" size={16} style={{ color: BA_TOKENS.textSecondary }} />
            </button>
            {tplOpen && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl shadow-lg border z-20 overflow-hidden max-h-72 overflow-y-auto"
                style={{ borderColor: BA_TOKENS.border }}>
                {attachedOpts.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "#f6fdf8", color: "#137333" }}>Đã đính ({attachedOpts.length})</div>
                    {attachedOpts.map(o => (
                      <button key={o.id} onClick={() => { setTemplate(o.id); setTplOpen(false); }}
                        className="w-full px-3 h-11 text-left text-[13px] flex items-center gap-2 transition-colors"
                        style={{ color: BA_TOKENS.textPrimary }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: o.tone.bg, color: o.tone.fg }}>
                          <Icon name={o.icon} size={14} strokeWidth={2} />
                        </span>
                        <span className="flex-1 truncate font-medium">{o.label}</span>
                        <span className="text-[10.5px] font-mono px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: "#e6f4ea", color: "#137333" }}>{o.count} file</span>
                        {o.id === template && <Icon name="check" size={14} style={{ color: BA_TOKENS.primary }} strokeWidth={2.4} />}
                      </button>
                    ))}
                  </div>
                )}
                {presetOpts.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "#f6f8fc", color: BA_TOKENS.textSecondary }}>Template chuẩn hệ thống</div>
                    {presetOpts.map(o => (
                      <button key={o.id} onClick={() => { setTemplate(o.id); setTplOpen(false); }}
                        className="w-full px-3 h-10 text-left text-[12.5px] flex items-center gap-2 transition-colors"
                        style={{ color: BA_TOKENS.textPrimary }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <span className="w-6 h-6 rounded flex items-center justify-center shrink-0"
                          style={{ background: o.tone.bg, color: o.tone.fg }}>
                          <Icon name={o.icon} size={12} strokeWidth={2} />
                        </span>
                        <span className="flex-1 truncate">{o.label}</span>
                        <span className="text-[10px]" style={{ color: BA_TOKENS.textDisabled }}>{o.group}</span>
                        {o.id === template && <Icon name="check" size={13} style={{ color: BA_TOKENS.primary }} strokeWidth={2.4} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-2.5 p-2.5 rounded-lg text-[11.5px] leading-relaxed flex items-start gap-1.5"
            style={selected?.attached
              ? { background: "#f6fdf8", color: "#137333", border: `1px solid #a8dab5` }
              : { background: "#fcfdff", color: BA_TOKENS.textSecondary, border: `1px solid ${BA_TOKENS.border}` }}>
            <Icon name={selected?.attached ? "check-circle" : "info"} size={12} strokeWidth={2.2} style={{ marginTop: 2, flexShrink: 0 }} />
            {selected?.attached
              ? <span>Output sẽ render theo <strong>đúng định dạng</strong> của {selected.count} file mẫu · layout, heading, font &amp; ngôn ngữ giữ nguyên.</span>
              : <span>Loại này chưa đính mẫu. AI sẽ dùng template chuẩn của hệ thống.</span>}
          </div>
        </div>

        {/* Format toggle */}
        <div>
          <div className="text-[11.5px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: BA_TOKENS.textDisabled }}>Format</div>
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl" style={{ background: "#f1f3f4" }}>
            {BA2_FORMATS.map(f => {
              const sel = format === f;
              return (
                <button key={f} onClick={() => setFormat(f)}
                  style={sel
                    ? { background: "#fff", color: BA_TOKENS.primary, boxShadow: "0 1px 2px rgba(60,64,67,.12)" }
                    : { background: "transparent", color: BA_TOKENS.textSecondary }}
                  className="h-10 rounded-lg text-[13px] font-semibold transition-all">
                  {f}
                </button>
              );
            })}
          </div>
          <div className="mt-3 p-3 rounded-xl text-[12px] leading-relaxed"
            style={{ background: "#fcfdff", color: BA_TOKENS.textPrimary, border: `1px solid ${BA_TOKENS.border}` }}>
            <div className="font-medium mb-1 flex items-center gap-1.5" style={{ color: BA_TOKENS.textSecondary }}>
              <Icon name="file-down" size={13} strokeWidth={2.2} />
              Bộ xuất hiện tại
            </div>
            <div className="font-mono text-[11.5px]" style={{ color: BA_TOKENS.textPrimary }}>
              {BA2_GRANS.find(g => g.id === gran)?.label} · {selected?.label || template} · {format}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t" style={{ borderColor: BA_TOKENS.border }}>
        <GhostBtn icon="trello" onClick={() => console.log("push jira/confluence")}>
          Push Jira · Confluence
        </GhostBtn>
        <PrimaryBtn icon="file-down-2" onClick={() => console.log("export", gran, template, format)}>
          Xuất
        </PrimaryBtn>
      </div>
    </Card>
  );
}

function OutputTab({ project }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <SectionTitle sub="Tài liệu sinh ra từ knowledge + task. Đạt gate khi vượt Quality Gate.">Deliverables</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {BA2_DELIVERABLES.map(d => <DeliverableCardV2 key={d.name} d={d} />)}
        </div>
      </Card>

      <ExportCenter project={project} />

      <div className="grid grid-cols-3 gap-6 items-start">
        <Card className="p-6 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="git-branch" size={19} style={{ color: BA_TOKENS.primary }} />
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Traceability</h3>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BA_TOKENS.border }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: "#f6f8fc" }}>
                  {["US-ID", "BRD-REQ", "SRS-FR", "TC-ID"].map((h) => (
                    <th key={h} className="text-[12px] font-semibold uppercase tracking-wide px-4 py-2.5 font-mono" style={{ color: BA_TOKENS.textSecondary }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BA2_TRACE.map((row) => (
                  <tr key={row.us} style={{ borderTop: `1px solid ${BA_TOKENS.border}` }}>
                    {[row.us, row.brd, row.fr, row.tc].map((v, i) => (
                      <td key={i} className="px-4 py-3 text-[13px] font-mono" style={{ color: i === 0 ? BA_TOKENS.primary : BA_TOKENS.textPrimary, fontWeight: i === 0 ? 600 : 400 }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 col-span-1">
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: BA_TOKENS.textPrimary }}>Quality Score</h3>
          <div className="flex justify-center mb-5"><QualityDonut score={85} /></div>
          <div className="flex flex-col gap-3">
            {BA2_QUALITY.map((q) => (
              <div key={q.axis}>
                <div className="flex items-center justify-between text-[12.5px] mb-1">
                  <span style={{ color: BA_TOKENS.textSecondary }}>{q.axis}</span>
                  <span className="font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{q.value}%</span>
                </div>
                <ProgressBar value={q.value} height={6} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { OutputTab, ExportCenter, DeliverableCardV2 });
