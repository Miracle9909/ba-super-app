/* =========================================================================
   BA Super App v2 — Tab Tác vụ + 4 sub-views (EARS · Functions · Estimate · Enhance)
   ========================================================================= */

function TaskHubCard({ task, onOpen }) {
  return (
    <Card hover onClick={() => onOpen(task.id)} className="p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>
          <Icon name={task.icon} size={24} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-[15px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{task.title}</h3>
            <Icon name="arrow-right" size={16} style={{ color: BA_TOKENS.textSecondary }} />
          </div>
          <p className="text-[13px] mt-1 leading-snug" style={{ color: BA_TOKENS.textSecondary }}>{task.desc}</p>
        </div>
      </div>
    </Card>
  );
}

function TaskBack({ onBack, title, sub }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <button onClick={onBack}
        style={{ color: BA_TOKENS.textSecondary, borderColor: BA_TOKENS.border }}
        onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-white border transition-colors">
        <Icon name="chevron-left" size={18} />
      </button>
      <div>
        <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{title}</h2>
        {sub && <p className="text-[13px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>{sub}</p>}
      </div>
    </div>
  );
}

/* (a) Yêu cầu mới — EARS editor */
function NewReqView({ onBack }) {
  const req = BA2_NEW_REQ;
  return (
    <div>
      <TaskBack onBack={onBack} title={`Yêu cầu mới · ${req.id}`} sub="Soạn theo chuẩn EARS · gắn AC · chấm điểm tự động" />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-5">
          {/* EARS statement */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>EARS</span>
              <h3 className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Phát biểu yêu cầu</h3>
            </div>
            <div className="rounded-xl p-4 text-[14px] leading-relaxed border"
              style={{ background: "#fcfdff", borderColor: BA_TOKENS.border, color: BA_TOKENS.textPrimary }}>
              <span className="font-semibold" style={{ color: BA_TOKENS.primary }}>Khi</span> khách hàng nộp hồ sơ vay mua nhà có TSĐB &gt; 2 tỷ,{" "}
              <span className="font-semibold" style={{ color: BA_TOKENS.primary }}>hệ thống PHẢI</span> tự động gửi yêu cầu định giá tới đối tác độc lập trong vòng 4 giờ làm việc.
            </div>
          </Card>

          {/* AC Given/When/Then */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="check-circle" size={16} style={{ color: "#137333" }} />
              <h3 className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Acceptance Criteria</h3>
              <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{req.ac.length}</span>
            </div>
            <div className="flex flex-col gap-3">
              {req.ac.map((a, i) => (
                <div key={i} className="rounded-xl border p-3.5" style={{ borderColor: BA_TOKENS.border }}>
                  <div className="text-[10.5px] font-bold uppercase tracking-wider mb-2" style={{ color: BA_TOKENS.textDisabled }}>AC-{String(i+1).padStart(2,"0")}</div>
                  {[
                    { k: "Given", v: a.g, fg: "#1967d2" },
                    { k: "When",  v: a.w, fg: "#b06000" },
                    { k: "Then",  v: a.t, fg: "#137333" },
                  ].map(row => (
                    <div key={row.k} className="flex gap-2 py-1 text-[13px] leading-snug">
                      <span className="font-semibold font-mono shrink-0 w-14" style={{ color: row.fg }}>{row.k}</span>
                      <span style={{ color: BA_TOKENS.textPrimary }}>{row.v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Traceability chips */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="git-branch" size={16} style={{ color: BA_TOKENS.primary }} />
              <h3 className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Traceability</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { k: "US", v: req.trace.us, c: "#1967d2", bg: "#e8f0fe" },
                { k: "BRD", v: req.trace.brd, c: "#137333", bg: "#e6f4ea" },
                { k: "SRS", v: req.trace.fr, c: "#8430ce", bg: "#f3e8fd" },
                { k: "TC", v: req.trace.tc, c: "#b06000", bg: "#fef7e0" },
              ].map((chip, i, arr) => (
                <React.Fragment key={chip.k}>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-mono font-semibold"
                    style={{ background: chip.bg, color: chip.c }}>{chip.v}</span>
                  {i < arr.length - 1 && <Icon name="arrow-right" size={14} style={{ color: BA_TOKENS.textDisabled }} />}
                </React.Fragment>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: quality score */}
        <Card className="p-5 self-start">
          <h3 className="text-[14px] font-semibold mb-4" style={{ color: BA_TOKENS.textPrimary }}>Quality Score</h3>
          <div className="flex justify-center mb-4">
            <QualityDonut score={req.score} />
          </div>
          <div className="flex flex-col gap-2">
            {[
              { k: "EARS hợp lệ", ok: true },
              { k: "AC ≥ 2 kịch bản", ok: true },
              { k: "Truy vết đầy đủ", ok: true },
              { k: "Định lượng SLA (4h)", ok: true },
              { k: "Edge case lỗi định giá", ok: false },
            ].map(c => (
              <div key={c.k} className="flex items-center gap-2 text-[12.5px]">
                <Icon name={c.ok ? "check-circle" : "alert-triangle"} size={14}
                  style={{ color: c.ok ? "#137333" : "#b06000" }} strokeWidth={2.1} />
                <span style={{ color: BA_TOKENS.textPrimary }}>{c.k}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* (b) Function tree */
function FuncTreeView({ onBack }) {
  return (
    <div>
      <TaskBack onBack={onBack} title="Function list" sub="Cây Module → Feature → Function (FUNC-xx)" />
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px]" style={{ color: BA_TOKENS.textSecondary }}>
            <span className="font-semibold" style={{ color: BA_TOKENS.textPrimary }}>8</span> functions ·{" "}
            <span style={{ color: "#137333" }}>7 đã gắn yêu cầu</span> ·{" "}
            <span style={{ color: "#b06000" }}>1 chưa gắn</span>
          </span>
          <PrimaryBtn icon="plus" size="sm" onClick={() => console.log("add function")}>Thêm function</PrimaryBtn>
        </div>

        {BA2_FUNC_TREE.map(mod => (
          <div key={mod.id} className="mb-4 last:mb-0">
            {/* Module row */}
            <div className="flex items-center gap-2 py-2">
              <Icon name="chevron-down" size={16} style={{ color: BA_TOKENS.textSecondary }} />
              <span className="px-2 py-0.5 text-[10.5px] font-bold font-mono rounded"
                style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>{mod.id}</span>
              <span className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{mod.name}</span>
              <span className="text-[11px] uppercase tracking-wider font-medium"
                style={{ color: BA_TOKENS.textDisabled }}>{mod.kind}</span>
            </div>
            <div className="ml-5 border-l pl-5 flex flex-col gap-2" style={{ borderColor: BA_TOKENS.border }}>
              {mod.children.map(feat => (
                <div key={feat.id} className="pt-2">
                  <div className="flex items-center gap-2">
                    <Icon name="chevron-down" size={14} style={{ color: BA_TOKENS.textSecondary }} />
                    <span className="text-[13px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{feat.name}</span>
                    <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: BA_TOKENS.textDisabled }}>{feat.kind}</span>
                  </div>
                  <div className="ml-5 mt-1.5 flex flex-col gap-1.5">
                    {feat.children.map(fn => (
                      <div key={fn.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg transition-colors"
                        onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                        <div className="flex items-center gap-2.5">
                          <span className="px-1.5 py-0.5 text-[10.5px] font-bold font-mono rounded"
                            style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{fn.id}</span>
                          <span className="text-[13px]" style={{ color: BA_TOKENS.textPrimary }}>{fn.name}</span>
                        </div>
                        {fn.hasReq ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded"
                            style={{ background: "#e6f4ea", color: "#137333" }}>
                            <Icon name="badge-check" size={11} strokeWidth={2.2} /> ≥1 req
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded"
                            style={{ background: "#fef7e0", color: "#b06000" }}>
                            <Icon name="alert-triangle" size={11} strokeWidth={2.2} /> chưa gắn
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* (c) Estimate */
function complexityColor(n) {
  if (n <= 2) return { bg: "#d1fae5", fg: "#047857" };
  if (n <= 4) return { bg: "#dbeafe", fg: "#1d4ed8" };
  if (n <= 6) return { bg: "#fef3c7", fg: "#a16207" };
  if (n <= 8) return { bg: "#ffedd5", fg: "#c2410c" };
  return { bg: "#fee2e2", fg: "#b91c1c" };
}
function EstimateView({ onBack }) {
  const total = BA2_ESTIMATE.reduce((s, r) => s + r.md, 0);
  const totalSp = BA2_ESTIMATE.reduce((s, r) => s + r.sp, 0);
  const fuzzyCount = BA2_ESTIMATE.filter(r => r.fuzzy).length;
  return (
    <div>
      <TaskBack onBack={onBack} title="Estimate" sub="Complexity (1–10) · Story point · Man-day · (minh hoạ)" />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>Tổng man-day</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: BA_TOKENS.primary }}>{total} <span className="text-[14px] font-medium" style={{ color: BA_TOKENS.textSecondary }}>MD</span></div>
          <div className="text-[11.5px] mt-1" style={{ color: BA_TOKENS.textSecondary }}>± 12% (tin cậy 80%)</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>Tổng story point</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{totalSp} <span className="text-[14px] font-medium" style={{ color: BA_TOKENS.textSecondary }}>SP</span></div>
          <div className="text-[11.5px] mt-1" style={{ color: BA_TOKENS.textSecondary }}>~ 4–5 sprint (đội 5 người)</div>
        </Card>
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>Function</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{BA2_ESTIMATE.length}</div>
          <div className="text-[11.5px] mt-1" style={{ color: BA_TOKENS.textSecondary }}>đã estimate</div>
        </Card>
        <Card className="p-4" style={{ borderColor: fuzzyCount ? "#fde68a" : BA_TOKENS.border, background: fuzzyCount ? "#fffbeb" : "#fff" }}>
          <div className="text-[11.5px] font-medium uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#b06000" }}>
            <Icon name="alert-triangle" size={12} strokeWidth={2.2} />
            Cảnh báo
          </div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: "#b06000" }}>{fuzzyCount}</div>
          <div className="text-[11.5px] mt-1" style={{ color: "#b06000" }}>function mơ hồ, cần làm rõ</div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: "#f6f8fc" }}>
                <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3" style={{ color: BA_TOKENS.textSecondary }}>Function</th>
                <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-44" style={{ color: BA_TOKENS.textSecondary }}>Complexity</th>
                <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-24 text-right" style={{ color: BA_TOKENS.textSecondary }}>SP</th>
                <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-28 text-right" style={{ color: BA_TOKENS.textSecondary }}>Man-day</th>
              </tr>
            </thead>
            <tbody>
              {BA2_ESTIMATE.map((r, i) => {
                const cc = complexityColor(r.complexity);
                return (
                  <tr key={i} style={{ borderTop: `1px solid ${BA_TOKENS.border}` }}>
                    <td className="px-4 py-3 text-[13px]" style={{ color: BA_TOKENS.textPrimary }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{r.func}</span>
                        {r.fuzzy && (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded"
                            style={{ background: "#fef7e0", color: "#b06000" }}>
                            <Icon name="alert-triangle" size={10} strokeWidth={2.2} /> mơ hồ
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md font-semibold text-[12px] flex items-center justify-center"
                          style={{ background: cc.bg, color: cc.fg }}>{r.complexity}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#eceff3" }}>
                          <div style={{ width: `${r.complexity * 10}%`, background: cc.fg, height: "100%" }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-right font-mono" style={{ color: BA_TOKENS.textPrimary }}>{r.sp}</td>
                    <td className="px-4 py-3 text-[13px] text-right font-mono font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{r.md}</td>
                  </tr>
                );
              })}
              <tr style={{ borderTop: `2px solid ${BA_TOKENS.border}`, background: "#fcfdff" }}>
                <td className="px-4 py-3 text-[13px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Tổng</td>
                <td className="px-4 py-3"></td>
                <td className="px-4 py-3 text-[13px] text-right font-mono font-bold" style={{ color: BA_TOKENS.textPrimary }}>{totalSp}</td>
                <td className="px-4 py-3 text-[13px] text-right font-mono font-bold" style={{ color: BA_TOKENS.primary }}>{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* (d) Enhance */
function EnhanceView({ onBack }) {
  const [desc, setDesc] = React.useState("Đề xuất hạ ngưỡng định giá độc lập từ 2 tỷ xuống 1.5 tỷ để mở rộng phân khúc.");
  const labelColor = (l) => ({
    "Thêm": { bg: "#e6f4ea", fg: "#137333" },
    "Sửa":  { bg: "#fef7e0", fg: "#b06000" },
    "Bỏ":   { bg: "#fce8e6", fg: "#c5221f" },
  }[l]);
  return (
    <div>
      <TaskBack onBack={onBack} title="Enhance · Impact analysis" sub="Mô tả thay đổi → AI phân tích item bị ảnh hưởng" />
      <div className="grid grid-cols-3 gap-6 items-start">
        <Card className="p-5 col-span-2">
          <h3 className="text-[14px] font-semibold mb-2" style={{ color: BA_TOKENS.textPrimary }}>Mô tả thay đổi</h3>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
            placeholder="Mô tả thay đổi đề xuất…"
            className="w-full px-3.5 py-2.5 rounded-xl text-[14px] outline-none resize-none transition-all leading-relaxed"
            style={{ border: `1px solid ${BA_TOKENS.border}`, background: "#fff", color: BA_TOKENS.textPrimary }}
            onFocus={(e) => { e.currentTarget.style.borderColor = BA_TOKENS.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${BA_TOKENS.primary}22`; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = BA_TOKENS.border; e.currentTarget.style.boxShadow = "none"; }}
          />
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-[13px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Item bị ảnh hưởng ({BA2_IMPACT.length})</h4>
              <span className="text-[11.5px]" style={{ color: BA_TOKENS.textSecondary }}>req · function · TC</span>
            </div>
            <div className="flex flex-col gap-2">
              {BA2_IMPACT.map((it, i) => {
                const lc = labelColor(it.label);
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: BA_TOKENS.border }}>
                    <span className="px-2 py-0.5 text-[10.5px] font-bold font-mono rounded uppercase shrink-0"
                      style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{it.kind}</span>
                    <span className="font-mono text-[12px] font-semibold" style={{ color: BA_TOKENS.primary }}>{it.id}</span>
                    <span className="flex-1 text-[13px]" style={{ color: BA_TOKENS.textPrimary }}>{it.text}</span>
                    <span className="px-2.5 py-1 text-[11.5px] font-semibold rounded-full"
                      style={{ background: lc.bg, color: lc.fg }}>{it.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5">
            <PrimaryBtn icon="wand-2" onClick={() => console.log("create delta spec")}>Tạo delta spec</PrimaryBtn>
            <GhostBtn icon="refresh-cw" onClick={() => console.log("re-analyze")}>Phân tích lại</GhostBtn>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-[14px] font-semibold mb-3" style={{ color: BA_TOKENS.textPrimary }}>Tóm tắt</h3>
          <div className="flex flex-col gap-2.5">
            {[
              { l: "Yêu cầu sửa", v: 1, c: "#b06000" },
              { l: "Function thêm", v: 1, c: "#137333" },
              { l: "Function sửa", v: 1, c: "#b06000" },
              { l: "Test case sửa", v: 1, c: "#b06000" },
              { l: "Test case bỏ",  v: 1, c: "#c5221f" },
            ].map(s => (
              <div key={s.l} className="flex items-center justify-between text-[13px]">
                <span style={{ color: BA_TOKENS.textSecondary }}>{s.l}</span>
                <span className="font-semibold font-mono" style={{ color: s.c }}>{s.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl text-[12px] leading-relaxed"
            style={{ background: "#fff7e0", color: "#7a4a00", border: "1px solid #fde68a" }}>
            <Icon name="info" size={13} strokeWidth={2.2} style={{ display: "inline", marginRight: 4, verticalAlign: -2 }} />
            Đề nghị review thẩm định nội bộ trước khi áp dụng delta spec.
          </div>
        </Card>
      </div>
    </div>
  );
}

function TasksTab({ activeTask, onOpen, onBack }) {
  if (activeTask === "new")      return <NewReqView onBack={onBack} />;
  if (activeTask === "funcs")    return <FuncTreeView onBack={onBack} />;
  if (activeTask === "estimate") return <EstimateView onBack={onBack} />;
  if (activeTask === "enhance")  return <EnhanceView onBack={onBack} />;
  return (
    <div>
      <SectionTitle sub="Chọn loại tác vụ để bắt đầu — mỗi tác vụ là 1 view chuyên biệt với editor & output riêng.">
        Tác vụ
      </SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        {BA2_TASK_CARDS.map(t => <TaskHubCard key={t.id} task={t} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

Object.assign(window, { TasksTab, NewReqView, FuncTreeView, EstimateView, EnhanceView });
