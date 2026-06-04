/* =========================================================================
   BA Super App v3 — Tác vụ editor mode + Sơ đồ sub-view
   Reuses TaskBack, complexityColor from v2 ba2-tasks.jsx
   ========================================================================= */
const BA3_TASK_CARDS = [
  ...BA2_TASK_CARDS,
  { id: "diagrams", icon: "git-branch", title: "Sơ đồ nghiệp vụ", desc: "Process · BPMN · Sequence · Architecture · ER · State" },
];

/* ----- (a) Yêu cầu mới — editable ----- */
function NewReqViewV3({ onBack }) {
  const [ears, setEars] = React.useState(BA2_NEW_REQ.ears);
  const [acs, setAcs]   = React.useState(BA2_NEW_REQ.ac);
  const [score, setScore] = React.useState(BA2_NEW_REQ.score);
  const [editing, setEditing] = React.useState(false);

  const addAc = () => setAcs(a => [...a, { g: "", w: "", t: "" }]);
  const updateAc = (i, k, v) => setAcs(a => a.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const removeAc = (i) => setAcs(a => a.filter((_, idx) => idx !== i));
  const refine = () => { setScore(s => Math.min(98, s + 5)); console.log("AI refine"); };

  return (
    <div>
      <TaskBack onBack={onBack} title={`Yêu cầu mới · ${BA2_NEW_REQ.id}`} sub="Editor: sửa EARS, thêm/xoá AC, AI tự re-score & cập nhật trace." />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-5">
          {/* EARS */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded"
                  style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>EARS</span>
                <h3 className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Phát biểu yêu cầu</h3>
              </div>
              <button onClick={() => setEditing(e => !e)}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11.5px] font-medium border"
                style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary, background: editing ? BA_TOKENS.active : "#fff" }}>
                <Icon name="pencil" size={12} /> {editing ? "Đang sửa" : "Sửa"}
              </button>
            </div>
            {editing ? (
              <textarea value={ears} onChange={(e) => setEars(e.target.value)} rows={3}
                className="w-full px-3.5 py-3 rounded-xl text-[14px] outline-none resize-none leading-relaxed font-medium"
                style={{ border: `1px solid ${BA_TOKENS.primary}`, color: BA_TOKENS.textPrimary, boxShadow: `0 0 0 3px ${BA_TOKENS.primary}22` }}
              />
            ) : (
              <div className="rounded-xl p-4 text-[14px] leading-relaxed border"
                style={{ background: "#fcfdff", borderColor: BA_TOKENS.border, color: BA_TOKENS.textPrimary }}>
                {ears.split(/\b(Khi|hệ thống PHẢI)\b/).map((p, i) => (
                  p === "Khi" || p === "hệ thống PHẢI"
                    ? <span key={i} className="font-semibold" style={{ color: BA_TOKENS.primary }}>{p}</span>
                    : <span key={i}>{p}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-3">
              <GhostBtn icon="wand-2" onClick={refine}>Refine bằng AI</GhostBtn>
              <GhostBtn icon="file-down" onClick={() => console.log("download req")}>Tải xuống</GhostBtn>
            </div>
          </Card>

          {/* AC */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="check-circle" size={16} style={{ color: "#137333" }} />
                <h3 className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Acceptance Criteria</h3>
                <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{acs.length}</span>
              </div>
              <button onClick={addAc}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded-md text-[11.5px] font-semibold"
                style={{ background: BA_TOKENS.primary, color: "#fff" }}>
                <Icon name="plus" size={12} strokeWidth={2.4} /> Thêm AC
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {acs.map((a, i) => (
                <div key={i} className="rounded-xl border p-3.5 relative" style={{ borderColor: BA_TOKENS.border }}>
                  <div className="flex items-start justify-between mb-1.5">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>AC-{String(i + 1).padStart(2, "0")}</span>
                    <button onClick={() => removeAc(i)} className="w-6 h-6 rounded-md flex items-center justify-center"
                      style={{ color: "#c5221f" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fce8e6")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                      <Icon name="trash-2" size={12} />
                    </button>
                  </div>
                  {[
                    { k: "g", label: "Given", fg: "#1967d2", val: a.g },
                    { k: "w", label: "When",  fg: "#b06000", val: a.w },
                    { k: "t", label: "Then",  fg: "#137333", val: a.t },
                  ].map(row => (
                    <div key={row.k} className="flex items-start gap-2 py-1">
                      <span className="font-semibold font-mono shrink-0 w-14 text-[12.5px] pt-1.5" style={{ color: row.fg }}>{row.label}</span>
                      <input value={row.val} onChange={(e) => updateAc(i, row.k, e.target.value)}
                        placeholder={`${row.label}…`}
                        className="flex-1 h-8 px-2.5 rounded-md text-[13px] outline-none"
                        style={{ border: `1px solid ${BA_TOKENS.border}`, color: BA_TOKENS.textPrimary, background: "#fff" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = BA_TOKENS.primary)}
                        onBlur={(e) => (e.currentTarget.style.borderColor = BA_TOKENS.border)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Trace */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="git-branch" size={16} style={{ color: BA_TOKENS.primary }} />
              <h3 className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Traceability</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { v: BA2_NEW_REQ.trace.us,  c: "#1967d2", bg: "#e8f0fe" },
                { v: BA2_NEW_REQ.trace.brd, c: "#137333", bg: "#e6f4ea" },
                { v: BA2_NEW_REQ.trace.fr,  c: "#8430ce", bg: "#f3e8fd" },
                { v: BA2_NEW_REQ.trace.tc,  c: "#b06000", bg: "#fef7e0" },
              ].map((chip, i, arr) => (
                <React.Fragment key={i}>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-mono font-semibold"
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
          <div className="flex justify-center mb-4"><QualityDonut score={score} /></div>
          <div className="flex flex-col gap-2">
            {[
              { k: "EARS hợp lệ",       ok: true },
              { k: "AC ≥ 2 kịch bản",   ok: acs.length >= 2 },
              { k: "Truy vết đầy đủ",   ok: true },
              { k: "Định lượng SLA",    ok: /\d+\s*(giờ|phút|ngày)/.test(ears) },
              { k: "Edge case lỗi",      ok: false },
            ].map(c => (
              <div key={c.k} className="flex items-center gap-2 text-[12.5px]">
                <Icon name={c.ok ? "check-circle" : "alert-triangle"} size={14}
                  style={{ color: c.ok ? "#137333" : "#b06000" }} strokeWidth={2.1} />
                <span style={{ color: BA_TOKENS.textPrimary }}>{c.k}</span>
              </div>
            ))}
          </div>
          <button onClick={refine} className="w-full mt-4 h-9 rounded-full text-[12.5px] font-semibold inline-flex items-center justify-center gap-1.5"
            style={{ background: BA_TOKENS.primary, color: "#fff" }}>
            <Icon name="refresh-cw" size={13} /> Score lại
          </button>
        </Card>
      </div>
    </div>
  );
}

/* ----- (b) Function tree — editable ----- */
function FuncTreeViewV3({ onBack }) {
  const [tree, setTree] = React.useState(BA2_FUNC_TREE);
  const addFn = (modId, featId) => {
    const newId = "FUNC-" + (200 + Math.floor(Math.random() * 100));
    setTree(t => t.map(m => m.id !== modId ? m : ({
      ...m,
      children: m.children.map(f => f.id !== featId ? f : ({
        ...f,
        children: [...f.children, { id: newId, name: "Function mới (sửa tên)", hasReq: false }],
      })),
    })));
  };
  const removeFn = (modId, featId, fnId) => {
    setTree(t => t.map(m => m.id !== modId ? m : ({
      ...m,
      children: m.children.map(f => f.id !== featId ? f : ({
        ...f,
        children: f.children.filter(fn => fn.id !== fnId),
      })),
    })));
  };
  const renameFn = (modId, featId, fnId, name) => {
    setTree(t => t.map(m => m.id !== modId ? m : ({
      ...m,
      children: m.children.map(f => f.id !== featId ? f : ({
        ...f,
        children: f.children.map(fn => fn.id !== fnId ? fn : { ...fn, name }),
      })),
    })));
  };
  const toggleReq = (modId, featId, fnId) => {
    setTree(t => t.map(m => m.id !== modId ? m : ({
      ...m,
      children: m.children.map(f => f.id !== featId ? f : ({
        ...f,
        children: f.children.map(fn => fn.id !== fnId ? fn : { ...fn, hasReq: !fn.hasReq }),
      })),
    })));
  };

  const total = tree.reduce((s, m) => s + m.children.reduce((s2, f) => s2 + f.children.length, 0), 0);
  const linked = tree.reduce((s, m) => s + m.children.reduce((s2, f) => s2 + f.children.filter(fn => fn.hasReq).length, 0), 0);

  return (
    <div>
      <TaskBack onBack={onBack} title="Function list" sub="Editor: thêm / sửa tên / gắn req. AI tự nhận diện function thiếu yêu cầu." />
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[13px]" style={{ color: BA_TOKENS.textSecondary }}>
            <span className="font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{total}</span> functions ·{" "}
            <span style={{ color: "#137333" }}>{linked} đã gắn yêu cầu</span> ·{" "}
            <span style={{ color: "#b06000" }}>{total - linked} chưa gắn</span>
          </span>
          <div className="flex items-center gap-2">
            <GhostBtn icon="wand-2" onClick={() => console.log("AI fill missing")}>AI gắn req thiếu</GhostBtn>
            <GhostBtn icon="file-down" onClick={() => console.log("download")}>Tải</GhostBtn>
          </div>
        </div>

        {tree.map(mod => (
          <div key={mod.id} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 py-2">
              <Icon name="chevron-down" size={16} style={{ color: BA_TOKENS.textSecondary }} />
              <span className="px-2 py-0.5 text-[10.5px] font-bold font-mono rounded" style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>{mod.id}</span>
              <span className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{mod.name}</span>
              <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: BA_TOKENS.textDisabled }}>{mod.kind}</span>
            </div>
            <div className="ml-5 border-l pl-5 flex flex-col gap-2" style={{ borderColor: BA_TOKENS.border }}>
              {mod.children.map(feat => (
                <div key={feat.id} className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="chevron-down" size={14} style={{ color: BA_TOKENS.textSecondary }} />
                      <span className="text-[13px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{feat.name}</span>
                      <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: BA_TOKENS.textDisabled }}>{feat.kind}</span>
                    </div>
                    <button onClick={() => addFn(mod.id, feat.id)}
                      className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-[11px] font-medium border"
                      style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary, background: "#fff" }}>
                      <Icon name="plus" size={11} strokeWidth={2.4} /> Thêm function
                    </button>
                  </div>
                  <div className="ml-5 mt-1.5 flex flex-col gap-1.5">
                    {feat.children.map(fn => (
                      <div key={fn.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg group">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <span className="px-1.5 py-0.5 text-[10.5px] font-bold font-mono rounded shrink-0"
                            style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{fn.id}</span>
                          <input value={fn.name}
                            onChange={(e) => renameFn(mod.id, feat.id, fn.id, e.target.value)}
                            className="flex-1 text-[13px] bg-transparent outline-none border-b border-transparent focus:border-current focus:border-dashed"
                            style={{ color: BA_TOKENS.textPrimary }} />
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleReq(mod.id, feat.id, fn.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded"
                            style={fn.hasReq
                              ? { background: "#e6f4ea", color: "#137333" }
                              : { background: "#fef7e0", color: "#b06000" }}>
                            <Icon name={fn.hasReq ? "badge-check" : "alert-triangle"} size={11} strokeWidth={2.2} />
                            {fn.hasReq ? "≥1 req" : "chưa gắn"}
                          </button>
                          <button onClick={() => removeFn(mod.id, feat.id, fn.id)}
                            className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ color: "#c5221f" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#fce8e6")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                            <Icon name="trash-2" size={12} />
                          </button>
                        </div>
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

/* ----- (c) Estimate — inline editable ----- */
function EstimateViewV3({ onBack }) {
  const [rows, setRows] = React.useState(BA2_ESTIMATE);
  const setRow = (i, k, v) => setRows(r => r.map((x, idx) => idx === i ? { ...x, [k]: v } : x));

  const total   = rows.reduce((s, r) => s + Number(r.md || 0), 0);
  const totalSp = rows.reduce((s, r) => s + Number(r.sp || 0), 0);
  const fuzzy   = rows.filter(r => r.fuzzy).length;

  return (
    <div>
      <TaskBack onBack={onBack} title="Estimate" sub="Editor: inline sửa Complexity / SP / MD. AI re-suggest khi đổi complexity." />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>Tổng man-day</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: BA_TOKENS.primary }}>{total} <span className="text-[14px] font-medium" style={{ color: BA_TOKENS.textSecondary }}>MD</span></div>
        </Card>
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>Story point</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{totalSp} <span className="text-[14px] font-medium" style={{ color: BA_TOKENS.textSecondary }}>SP</span></div>
        </Card>
        <Card className="p-4">
          <div className="text-[11.5px] font-medium uppercase tracking-wider" style={{ color: BA_TOKENS.textDisabled }}>Function</div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{rows.length}</div>
        </Card>
        <Card className="p-4" style={{ borderColor: fuzzy ? "#fde68a" : BA_TOKENS.border, background: fuzzy ? "#fffbeb" : "#fff" }}>
          <div className="text-[11.5px] font-medium uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#b06000" }}>
            <Icon name="alert-triangle" size={12} strokeWidth={2.2} /> Cảnh báo
          </div>
          <div className="text-[26px] font-semibold mt-1 tracking-tight" style={{ color: "#b06000" }}>{fuzzy}</div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: BA_TOKENS.border }}>
          <span className="text-[12.5px]" style={{ color: BA_TOKENS.textSecondary }}>
            Bấm vào ô để chỉnh. AI sẽ re-suggest khi đổi Complexity.
          </span>
          <div className="flex items-center gap-2">
            <GhostBtn icon="wand-2" onClick={() => console.log("AI rebalance")}>AI re-suggest</GhostBtn>
            <GhostBtn icon="file-down" onClick={() => console.log("export xlsx")}>Tải .xlsx</GhostBtn>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: "#f6f8fc" }}>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3" style={{ color: BA_TOKENS.textSecondary }}>Function</th>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-32" style={{ color: BA_TOKENS.textSecondary }}>Complexity</th>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-20 text-right" style={{ color: BA_TOKENS.textSecondary }}>SP</th>
              <th className="text-[12px] font-semibold uppercase tracking-wide px-4 py-3 w-24 text-right" style={{ color: BA_TOKENS.textSecondary }}>MD</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const cc = complexityColor(r.complexity);
              return (
                <tr key={i} style={{ borderTop: `1px solid ${BA_TOKENS.border}` }}>
                  <td className="px-4 py-2 text-[13px] font-mono" style={{ color: BA_TOKENS.textPrimary }}>
                    {r.func}
                    {r.fuzzy && (
                      <span className="ml-2 inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: "#fef7e0", color: "#b06000" }}>
                        <Icon name="alert-triangle" size={10} strokeWidth={2.2} /> mơ hồ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <input type="number" min={1} max={10} value={r.complexity}
                        onChange={(e) => setRow(i, "complexity", Math.max(1, Math.min(10, Number(e.target.value))))}
                        className="w-10 h-7 rounded-md text-[12px] font-semibold text-center outline-none"
                        style={{ background: cc.bg, color: cc.fg, border: `1px solid ${cc.fg}33` }} />
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#eceff3" }}>
                        <div style={{ width: `${r.complexity * 10}%`, background: cc.fg, height: "100%" }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input type="number" value={r.sp} onChange={(e) => setRow(i, "sp", Number(e.target.value))}
                      className="w-14 h-7 px-2 text-right text-[12.5px] font-mono rounded-md outline-none"
                      style={{ border: `1px solid ${BA_TOKENS.border}`, color: BA_TOKENS.textPrimary }} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <input type="number" value={r.md} onChange={(e) => setRow(i, "md", Number(e.target.value))}
                      className="w-16 h-7 px-2 text-right text-[12.5px] font-mono font-semibold rounded-md outline-none"
                      style={{ border: `1px solid ${BA_TOKENS.border}`, color: BA_TOKENS.primary }} />
                  </td>
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
      </Card>
    </div>
  );
}

/* ----- (e) Sơ đồ nghiệp vụ ----- */
function DiagramsView({ onBack }) {
  const [filter, setFilter] = React.useState("all");
  const [open, setOpen] = React.useState(null);

  const types = BA3_DIAGRAM_TYPES;
  const diags = filter === "all" ? BA3_DIAGRAMS : BA3_DIAGRAMS.filter(d => d.type === filter);

  return (
    <div>
      <TaskBack onBack={onBack} title="Sơ đồ nghiệp vụ" sub="Process · BPMN · Sequence · Architecture · ER · State — gắn với yêu cầu hoặc function cụ thể." />

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button onClick={() => setFilter("all")}
            style={filter === "all"
              ? { background: BA_TOKENS.primaryContainer, color: BA_TOKENS.onPrimaryContainer, borderColor: "transparent" }
              : { background: "#fff", color: BA_TOKENS.textSecondary, borderColor: BA_TOKENS.border }}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium border">
            Tất cả <span className="text-[10.5px] font-mono">{BA3_DIAGRAMS.length}</span>
          </button>
          {types.map(t => {
            const sel = filter === t.id;
            const tone = BA2_TPL_TONES[t.tone];
            const n = BA3_DIAGRAMS.filter(d => d.type === t.id).length;
            return (
              <button key={t.id} onClick={() => setFilter(t.id)}
                style={sel
                  ? { background: tone.bg, color: tone.fg, borderColor: tone.fg }
                  : { background: "#fff", color: BA_TOKENS.textSecondary, borderColor: BA_TOKENS.border }}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium border">
                <Icon name={t.icon} size={13} strokeWidth={2} />
                {t.label} <span className="text-[10.5px] font-mono opacity-80">{n}</span>
              </button>
            );
          })}
        </div>
        <PrimaryBtn icon="wand-2" onClick={() => console.log("AI generate diagram")}>Sinh sơ đồ bằng AI</PrimaryBtn>
      </div>

      {/* Diagram type quick-start (when no filter or empty) */}
      <Card className="p-4 mb-5" style={{ background: "linear-gradient(110deg, #eef4fe 0%, #f6fdf8 100%)", borderColor: BA_TOKENS.border }}>
        <div className="flex items-center gap-2 mb-3">
          <Icon name="sparkles" size={15} style={{ color: BA_TOKENS.primary }} />
          <span className="text-[12.5px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Sinh nhanh theo loại — gắn vào yêu cầu / function cụ thể</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {types.map(t => {
            const tone = BA2_TPL_TONES[t.tone];
            return (
              <button key={t.id} onClick={() => console.log("generate", t.id)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border bg-white transition-colors"
                style={{ borderColor: BA_TOKENS.border }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = tone.fg)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = BA_TOKENS.border)}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: tone.bg, color: tone.fg }}>
                  <Icon name={t.icon} size={18} strokeWidth={2} />
                </div>
                <span className="text-[11.5px] font-semibold leading-tight text-center" style={{ color: BA_TOKENS.textPrimary }}>{t.label}</span>
                <span className="text-[10px] text-center leading-tight" style={{ color: BA_TOKENS.textSecondary }}>{t.desc}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Diagrams grid */}
      <div className="grid grid-cols-2 gap-4">
        {diags.map(d => <DiagramCard key={d.id} diag={d} onOpen={setOpen} />)}
      </div>

      <DiagramViewerModal diag={open} onClose={() => setOpen(null)} />
    </div>
  );
}

/* ----- Hub + dispatcher ----- */
function TasksTabV3({ activeTask, onOpen, onBack }) {
  if (activeTask === "new")      return <NewReqViewV3 onBack={onBack} />;
  if (activeTask === "funcs")    return <FuncTreeViewV3 onBack={onBack} />;
  if (activeTask === "estimate") return <EstimateViewV3 onBack={onBack} />;
  if (activeTask === "enhance")  return <EnhanceView onBack={onBack} />;
  if (activeTask === "diagrams") return <DiagramsView onBack={onBack} />;

  return (
    <div>
      <SectionTitle sub="Mỗi tác vụ là 1 view chuyên biệt — sửa nháp do AI sinh, refine, gắn trace, tải xuống.">
        Tác vụ
      </SectionTitle>
      <div className="grid grid-cols-3 gap-4">
        {BA3_TASK_CARDS.map(t => <TaskHubCard key={t.id} task={t} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

Object.assign(window, { TasksTabV3, NewReqViewV3, FuncTreeViewV3, EstimateViewV3, DiagramsView, BA3_TASK_CARDS });
