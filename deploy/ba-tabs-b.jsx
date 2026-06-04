/* =========================================================================
   BA Super App — Workspace tabs B: Tri thức + Pipeline + Báo cáo
   ========================================================================= */

/* ---------- Knowledge ---------- */
function IllustrationNote() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium"
      style={{ background: "#fef7e0", color: "#b06000" }}>
      <Icon name="info" size={13} strokeWidth={2.1} /> Dữ liệu mẫu (minh hoạ)
    </span>
  );
}

function KnowledgeTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <SectionTitle sub="Domain model AI trích xuất từ nguồn dữ liệu — bạn có thể xác nhận và tinh chỉnh.">
          Tri thức dự án
        </SectionTitle>
        <IllustrationNote />
      </div>

      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Entities */}
        <Card className="p-6 col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="database" size={19} style={{ color: BA_TOKENS.primary }} />
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Entities</h3>
            <span className="text-[12px] px-2 py-0.5 rounded-full" style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{BA_ENTITIES.length}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BA_ENTITIES.map((e) => (
              <div key={e.name} className="rounded-2xl border p-4" style={{ borderColor: BA_TOKENS.border }}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>
                    <Icon name={e.icon} size={17} strokeWidth={2} />
                  </div>
                  <span className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{e.name}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {e.attrs.map((a) => (
                    <span key={a} className="text-[12px] px-2 py-1 rounded-md font-mono"
                      style={{ background: "#f6f8fc", color: BA_TOKENS.textSecondary, border: `1px solid ${BA_TOKENS.border}` }}>{a}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Business rules */}
        <Card className="p-6 col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="list-checks" size={19} style={{ color: "#137333" }} />
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Business Rules</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {BA_RULES.map((r) => (
              <div key={r.id} className="flex items-start gap-2.5">
                <span className="text-[11px] font-semibold font-mono px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                  style={{ background: "#e6f4ea", color: "#137333" }}>{r.id}</span>
                <span className="text-[13px] leading-snug" style={{ color: BA_TOKENS.textPrimary }}>{r.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Glossary */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="table" size={19} style={{ color: "#8430ce" }} />
          <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Glossary</h3>
        </div>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BA_TOKENS.border }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: "#f6f8fc" }}>
                <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-2.5 w-44" style={{ color: BA_TOKENS.textSecondary }}>Thuật ngữ</th>
                <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-2.5" style={{ color: BA_TOKENS.textSecondary }}>Định nghĩa</th>
              </tr>
            </thead>
            <tbody>
              {BA_GLOSSARY.map((g, i) => (
                <tr key={g.term} style={{ borderTop: `1px solid ${BA_TOKENS.border}` }}>
                  <td className="px-4 py-3 text-[13.5px] font-semibold" style={{ color: BA_TOKENS.primary }}>{g.term}</td>
                  <td className="px-4 py-3 text-[13.5px]" style={{ color: BA_TOKENS.textPrimary }}>{g.def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ---------- Pipeline ---------- */
function GateChip({ label, state }) {
  const map = {
    pass: { bg: "#e6f4ea", fg: "#137333", icon: "check" },
    running: { bg: "#fef7e0", fg: "#b06000", icon: "loader" },
    pending: { bg: "#f1f3f4", fg: "#9aa0a6", icon: "circle-dot" },
  };
  const s = map[state];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium"
      style={{ background: s.bg, color: s.fg }}>
      <Icon name={s.icon} size={13} strokeWidth={2.1} />
      {label}
    </span>
  );
}

function PipelineStep({ step, index, isLast }) {
  const statusMap = {
    done: { label: "Hoàn thành", bg: "#e6f4ea", fg: "#137333", icon: "check-circle", ring: "#137333" },
    running: { label: "Đang chạy", bg: "#fef7e0", fg: "#b06000", icon: "loader", ring: "#b06000" },
    locked: { label: "Đang khoá", bg: "#f1f3f4", fg: "#9aa0a6", icon: "lock", ring: "#dadce0" },
  };
  const s = statusMap[step.status];
  const dimmed = step.status === "locked";
  return (
    <div className="flex gap-4">
      {/* Rail */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-[13px] z-10"
          style={{ background: s.bg, color: s.fg, border: `2px solid ${s.ring}` }}>
          {step.status === "done" ? <Icon name="check" size={18} strokeWidth={2.6} /> : step.code}
        </div>
        {!isLast && <div className="w-0.5 flex-1 my-1" style={{ background: step.status === "done" ? "#137333" : BA_TOKENS.border }} />}
      </div>

      {/* Card */}
      <div className="flex-1 pb-5">
        <Card className="p-5" style={{ opacity: dimmed ? 0.72 : 1 }}>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{step.code} · {step.vn}</span>
              </div>
              <div className="text-[12.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>Module: {step.module}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium"
              style={{ background: s.bg, color: s.fg }}>
              <Icon name={s.icon} size={13} strokeWidth={2.1} />{s.label}
            </span>
          </div>

          {/* Quality gate */}
          <div className="rounded-xl p-3.5" style={{ background: "#f6f8fc" }}>
            <div className="flex items-center gap-1.5 mb-2.5">
              <Icon name="shield-check" size={15} style={{ color: BA_TOKENS.textSecondary }} />
              <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: BA_TOKENS.textSecondary }}>Quality Gate</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {BA_GATES.map((g, i) => <GateChip key={g} label={g} state={step.gates[i]} />)}
            </div>
          </div>

          {step.status === "running" && (
            <div className="flex items-center gap-2.5 mt-4">
              <PrimaryBtn icon="play" size="sm" onClick={() => console.log("run next", step.code)}>Chạy bước tiếp</PrimaryBtn>
              <GhostBtn icon="refresh-cw" onClick={() => console.log("refine", step.code)}>Refine (≤3 vòng)</GhostBtn>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function PipelineTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <SectionTitle sub="Pipeline 6 bước với Quality Gate fail-closed: bước sau mở khoá khi gate bước trước PASS.">
          Pipeline 6 bước
        </SectionTitle>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium"
          style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>
          <Icon name="git-branch" size={15} /> 1/6 hoàn thành
        </span>
      </div>
      <div className="max-w-[760px]">
        {BA_PIPELINE.map((step, i) => (
          <PipelineStep key={step.code} step={step} index={i} isLast={i === BA_PIPELINE.length - 1} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Reports ---------- */
function DeliverableCard({ d }) {
  const gate = d.state === "gate";
  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: gate ? "#e6f4ea" : "#f1f3f4", color: gate ? "#137333" : BA_TOKENS.textSecondary }}>
          <Icon name={d.icon} size={20} />
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11.5px] font-medium"
          style={gate ? { background: "#e6f4ea", color: "#137333" } : { background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>
          {gate ? "Đạt gate" : "Nháp"}
        </span>
      </div>
      <div className="text-[14px] font-semibold mb-3" style={{ color: BA_TOKENS.textPrimary }}>{d.name}</div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => console.log("view", d.name)}
          className="flex-1 h-8 rounded-full text-[12.5px] font-medium border inline-flex items-center justify-center gap-1.5"
          style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary }}>
          <Icon name="eye" size={14} /> Xem
        </button>
        <button onClick={() => console.log("export", d.name)}
          className="flex-1 h-8 rounded-full text-[12.5px] font-medium border inline-flex items-center justify-center gap-1.5"
          style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary }}>
          <Icon name="file-down" size={14} /> Export
        </button>
      </div>
    </Card>
  );
}

function QualityDonut({ score }) {
  const r = 52, c = 2 * Math.PI * r, off = c - (score / 100) * c;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#e3e7ee" strokeWidth="14" />
      <circle cx="70" cy="70" r={r} fill="none" stroke={BA_TOKENS.primary} strokeWidth="14"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
        transform="rotate(-90 70 70)" style={{ transition: "stroke-dashoffset .6s ease" }} />
      <text x="70" y="68" textAnchor="middle" fontSize="30" fontWeight="600" fill={BA_TOKENS.textPrimary}>{score}%</text>
      <text x="70" y="88" textAnchor="middle" fontSize="11.5" fill={BA_TOKENS.textSecondary}>Quality</text>
    </svg>
  );
}

function ReportsTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Deliverables */}
      <Card className="p-6">
        <SectionTitle sub="Tài liệu sinh ra từ pipeline. Trạng thái Nháp → Đạt gate khi vượt Quality Gate.">Deliverables</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          {BA_DELIVERABLES.map((d) => <DeliverableCard key={d.name} d={d} />)}
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-6 items-start">
        {/* Traceability */}
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
                {BA_TRACE.map((row) => (
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

        {/* Quality score */}
        <Card className="p-6 col-span-1">
          <h3 className="text-[15px] font-semibold mb-4" style={{ color: BA_TOKENS.textPrimary }}>Quality Score</h3>
          <div className="flex justify-center mb-5"><QualityDonut score={85} /></div>
          <div className="flex flex-col gap-3">
            {BA_QUALITY.map((q) => (
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

Object.assign(window, { KnowledgeTab, PipelineTab, ReportsTab, GateChip, PipelineStep, DeliverableCard, QualityDonut });
