/* =========================================================================
   BA Super App v2 — Sidebar (v2), Modal Tạo dự án (multi-file + templates)
   ========================================================================= */
const T2 = BA_TOKENS;

/* ---------- Industry badge (7 colors) ---------- */
function IndustryBadge({ industryId, size = "sm" }) {
  const ind = BA2_INDUSTRIES.find(i => i.id === industryId) || BA2_INDUSTRIES[0];
  const pad = size === "sm" ? "3px 10px 3px 8px" : "4px 12px 4px 9px";
  const fs = size === "sm" ? 12 : 12.5;
  return (
    <span style={{ background: ind.bg, color: ind.fg, padding: pad, fontSize: fs }}
      className="inline-flex items-center gap-1.5 font-medium rounded-full leading-none whitespace-nowrap">
      <Icon name={ind.icon} size={size === "sm" ? 13 : 14} strokeWidth={2.1} />
      {ind.short}
    </span>
  );
}

/* ---------- v2 Sidebar ---------- */
function SidebarV2({ activeNav, onNav }) {
  return (
    <aside style={{ width: 280, background: T2.appBg }} className="shrink-0 h-full flex flex-col px-3 py-2">
      <button onClick={() => onNav(BA2_NAV[0])}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T2.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: T2.primary }}>
          <Icon name="drafting-compass" size={22} strokeWidth={2} />
        </div>
        <div className="text-left leading-tight flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold" style={{ color: T2.textPrimary }}>BA Super App</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded font-mono"
              style={{ background: T2.primary, color: "#fff" }}>v2</span>
          </div>
          <div className="text-[11px]" style={{ color: T2.textSecondary }}>Senior Business Analyst</div>
        </div>
      </button>

      <div className="px-3 mt-5 mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: T2.textDisabled }}>
        Menu chính
      </div>

      <nav className="flex flex-col gap-1">
        {BA2_NAV.map((item) => {
          const isActive = item.id === activeNav;
          return (
            <button key={item.id} onClick={() => onNav(item)}
              style={isActive
                ? { backgroundColor: T2.primaryContainer, color: T2.onPrimaryContainer }
                : { color: T2.textSecondary, backgroundColor: "transparent" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = T2.hover; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              className="flex items-center gap-3 px-3 h-11 rounded-full text-[13.5px] font-medium text-left">
              <Icon name={item.icon} size={20} strokeWidth={isActive ? 2.1 : 1.85} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      <button
        style={{ color: T2.textSecondary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T2.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        className="flex items-center gap-3 px-3 h-11 rounded-full text-[13.5px] font-medium transition-colors">
        <Icon name="settings" size={20} />
        <span>Cài đặt</span>
      </button>

      <div className="mt-2 mb-1 flex items-center gap-3 px-3 py-2.5 rounded-2xl border"
        style={{ background: T2.surface, borderColor: T2.border }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
          style={{ background: T2.primary }}>BA</div>
        <div className="leading-tight min-w-0">
          <div className="text-[13px] font-semibold truncate" style={{ color: T2.textPrimary }}>Người dùng</div>
          <div className="text-[11.5px] truncate" style={{ color: T2.textSecondary }}>Business Analyst</div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Helpers ---------- */
function fileIconFor(name) {
  const ext = (name.split(".").pop() || "").toLowerCase();
  return ({ doc: "file-text", docx: "file-text", pdf: "file-text", md: "file-text",
    xls: "table", xlsx: "table", csv: "table" })[ext] || "file-text";
}
function formatBytes(b) {
  if (b == null) return "";
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(2) + " MB";
}

/* ---------- File chip ---------- */
function FileChip({ file, onRemove, accent = "#1967d2", accentBg = "#e8f0fe" }) {
  return (
    <div className="inline-flex items-center gap-2 pl-2 pr-1 h-8 rounded-lg border"
      style={{ borderColor: T2.border, background: "#fff" }}>
      <span className="w-5 h-5 rounded flex items-center justify-center shrink-0"
        style={{ background: accentBg, color: accent }}>
        <Icon name={fileIconFor(file.name)} size={11} strokeWidth={2} />
      </span>
      <span className="text-[12.5px] font-medium truncate max-w-[180px]" style={{ color: T2.textPrimary }}>{file.name}</span>
      <span className="text-[10.5px] font-mono" style={{ color: T2.textSecondary }}>{formatBytes(file.size)}</span>
      <button onClick={onRemove} title="Bỏ"
        style={{ color: T2.textSecondary }}
        onMouseEnter={(e) => (e.currentTarget.style.background = T2.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        className="w-6 h-6 rounded flex items-center justify-center transition-colors">
        <Icon name="x" size={13} strokeWidth={2.1} />
      </button>
    </div>
  );
}

/* ---------- Drop zone (mock) ---------- */
function DropZone({ accept, files, onFiles, onRemove, hint, label, icon = "upload", accent = "#1967d2", accentBg = "#e8f0fe", compact = false }) {
  const inputRef = React.useRef(null);
  const [drag, setDrag] = React.useState(false);
  const onPick = (e) => {
    const arr = [...(e.target.files || [])].map(f => ({ name: f.name, size: f.size }));
    onFiles(arr);
    e.target.value = "";
  };
  return (
    <div>
      <button onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault(); setDrag(false);
          const arr = [...(e.dataTransfer.files || [])].map(f => ({ name: f.name, size: f.size }));
          onFiles(arr);
        }}
        style={{
          borderColor: drag ? accent : T2.border,
          background: drag ? accentBg : "#fcfdff",
          borderStyle: "dashed",
        }}
        className={`w-full rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-colors text-center ${compact ? "py-4 px-3" : "py-7 px-4"}`}>
        <div className={`rounded-2xl flex items-center justify-center ${compact ? "w-9 h-9" : "w-11 h-11"}`}
          style={{ background: accentBg, color: accent }}>
          <Icon name={icon} size={compact ? 18 : 22} strokeWidth={2} />
        </div>
        <div className={`font-semibold ${compact ? "text-[12.5px]" : "text-[13.5px]"}`} style={{ color: T2.textPrimary }}>
          {label || "Kéo thả hoặc bấm để chọn"}
        </div>
        {hint && (
          <div className="text-[11.5px]" style={{ color: T2.textSecondary }}>{hint}</div>
        )}
        <input ref={inputRef} type="file" multiple accept={accept} onChange={onPick} className="hidden" />
      </button>

      {files && files.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {files.map((f, i) => (
            <FileChip key={i} file={f} onRemove={() => onRemove(i)} accent={accent} accentBg={accentBg} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Create Project modal ---------- */
function CreateProjectModal({ open, onClose, onCreate }) {
  const [name, setName]             = React.useState("");
  const [industry, setIndustry]     = React.useState("banking");
  const [mode, setMode]             = React.useState("text");          // text | file
  const [goal, setGoal]             = React.useState("");
  const [sourceFiles, setSrcFiles]  = React.useState([]);
  const [activeCats, setActiveCats] = React.useState(["brd", "srs"]);   // category ids enabled
  const [customCats, setCustomCats] = React.useState([]);                // user-added category defs
  const [customLabel, setCustomLabel] = React.useState("");
  const [tplFiles, setTplFiles]     = React.useState({});                // {catId: [files]}

  if (!open) return null;

  const allCats = [...BA2_TEMPLATE_CATEGORIES, ...customCats];
  const findCat = (id) => allCats.find(c => c.id === id);
  const toneOf  = (cat) => BA2_TPL_TONES[cat?.tone || "slate"];

  const addSrcFiles = (arr) => setSrcFiles(s => [...s, ...arr]);
  const removeSrc   = (i)   => setSrcFiles(s => s.filter((_, idx) => idx !== i));

  const toggleCat = (id) => {
    setActiveCats(a => a.includes(id) ? a.filter(x => x !== id) : [...a, id]);
  };
  const addCustomCat = () => {
    const lbl = customLabel.trim();
    if (!lbl) return;
    const id = "custom_" + Date.now();
    setCustomCats(c => [...c, {
      id, label: lbl, group: "Tự định nghĩa", icon: "file-text",
      accept: ".doc,.docx,.pdf,.md,.xls,.xlsx", hint: ".doc · .pdf · .md · .xlsx", tone: "slate", custom: true,
    }]);
    setActiveCats(a => [...a, id]);
    setCustomLabel("");
  };
  const addTpl    = (id, arr) => setTplFiles(t => ({ ...t, [id]: [...(t[id] || []), ...arr] }));
  const removeTpl = (id, i)   => setTplFiles(t => ({ ...t, [id]: (t[id] || []).filter((_, idx) => idx !== i) }));

  const totalTpls = Object.values(tplFiles).reduce((s, a) => s + a.length, 0);
  const canCreate = name.trim() && (mode === "text" ? goal.trim() : sourceFiles.length > 0);

  // Group preset categories by .group for the library UI
  const grouped = BA2_TEMPLATE_CATEGORIES.reduce((acc, c) => {
    (acc[c.group] = acc[c.group] || []).push(c); return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(15,23,42,.40)", backdropFilter: "blur(2px)" }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-[900px] w-[94vw] max-h-[94vh] overflow-y-auto"
        style={{ border: `1px solid ${T2.border}` }}>

        {/* Header */}
        <div className="px-7 pt-6 pb-4 flex items-start justify-between gap-4 border-b sticky top-0 bg-white z-10" style={{ borderColor: T2.border }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon name="rocket" size={20} style={{ color: T2.primary }} />
              <h2 className="text-[18px] font-semibold tracking-tight" style={{ color: T2.textPrimary }}>Tạo dự án mới</h2>
            </div>
            <p className="text-[13px]" style={{ color: T2.textSecondary }}>Lớp 1: Input — chọn ngành, nạp mô tả/nguồn &amp; (tuỳ chọn) đính tài liệu mẫu để output theo đúng định dạng.</p>
          </div>
          <button onClick={onClose} title="Đóng"
            style={{ color: T2.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T2.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-6">
          {/* 1. Tên dự án + Industry */}
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-1">
              <label className="block text-[12.5px] font-semibold mb-1.5" style={{ color: T2.textPrimary }}>Tên dự án</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="BIDV Home GĐ3"
                className="w-full h-11 px-3.5 rounded-xl text-[14px] outline-none transition-all"
                style={{ border: `1px solid ${T2.border}`, background: "#fff", color: T2.textPrimary }}
                onFocus={(e) => { e.currentTarget.style.borderColor = T2.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${T2.primary}22`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = T2.border; e.currentTarget.style.boxShadow = "none"; }}
              />
              <div className="mt-3 p-3 rounded-xl text-[11.5px] leading-relaxed flex items-start gap-1.5"
                style={{ background: "#fcfdff", color: T2.textSecondary, border: `1px solid ${T2.border}` }}>
                <Icon name="info" size={12} strokeWidth={2.2} style={{ color: T2.primary, marginTop: 1, flexShrink: 0 }} />
                <span>Ràng buộc / chuẩn áp dụng sẽ được chuyên gia ngành <strong style={{ color: T2.textPrimary }}>hỏi & làm rõ trong cuộc hội thoại</strong> ở bước Khai phá.</span>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-[12.5px] font-semibold mb-2" style={{ color: T2.textPrimary }}>Ngành (chọn 1)</label>
              <div className="grid grid-cols-4 gap-2">
                {BA2_INDUSTRIES.map(ind => {
                  const sel = industry === ind.id;
                  return (
                    <button key={ind.id} onClick={() => setIndustry(ind.id)}
                      style={{
                        borderColor: sel ? ind.fg : T2.border,
                        background: sel ? ind.bg : "#fff",
                        boxShadow: sel ? `0 0 0 1px ${ind.fg} inset` : "none",
                      }}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: sel ? "#fff" : ind.bg, color: ind.fg }}>
                        <Icon name={ind.icon} size={18} strokeWidth={2} />
                      </div>
                      <span className="text-[12px] font-medium leading-tight text-center"
                        style={{ color: sel ? ind.fg : T2.textPrimary }}>{ind.short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 2. Mô tả dự án / Nguồn */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[12.5px] font-semibold" style={{ color: T2.textPrimary }}>Mô tả dự án &amp; nguồn input</label>
              <div className="inline-flex items-center gap-1 p-1 rounded-lg" style={{ background: "#f1f3f4" }}>
                {[
                  { id: "text", label: "Nhập text",  icon: "file-text" },
                  { id: "file", label: "Upload file", icon: "upload" },
                ].map(m => {
                  const sel = mode === m.id;
                  return (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      style={sel
                        ? { background: "#fff", color: T2.primary, boxShadow: "0 1px 2px rgba(60,64,67,.12)" }
                        : { background: "transparent", color: T2.textSecondary }}
                      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-[12.5px] font-medium transition-all">
                      <Icon name={m.icon} size={14} strokeWidth={2} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {mode === "text" ? (
              <textarea value={goal} onChange={(e) => setGoal(e.target.value)} rows={4}
                placeholder="Mô tả phạm vi, mục tiêu, ràng buộc của dự án…"
                className="w-full px-3.5 py-3 rounded-xl text-[14px] outline-none resize-none transition-all leading-relaxed"
                style={{ border: `1px solid ${T2.border}`, background: "#fff", color: T2.textPrimary }}
                onFocus={(e) => { e.currentTarget.style.borderColor = T2.primary; e.currentTarget.style.boxShadow = `0 0 0 3px ${T2.primary}22`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = T2.border; e.currentTarget.style.boxShadow = "none"; }}
              />
            ) : (
              <DropZone
                accept=".doc,.docx,.pdf,.md,.xls,.xlsx"
                files={sourceFiles}
                onFiles={addSrcFiles}
                onRemove={removeSrc}
                label="Kéo thả nhiều file hoặc bấm để chọn"
                hint=".doc · .docx · .xlsx · .md · .pdf  ·  nhiều file"
              />
            )}
          </div>

          {/* 3. Flexible template library */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-[12.5px] font-semibold" style={{ color: T2.textPrimary }}>Tài liệu mẫu tham chiếu <span className="font-normal" style={{ color: T2.textDisabled }}>(tuỳ chọn)</span></label>
                <p className="text-[12px] mt-0.5" style={{ color: T2.textSecondary }}>
                  Chọn loại tài liệu cần — output cùng loại sẽ <strong>render theo đúng định dạng mẫu đã nạp</strong>. Mỗi loại nhận nhiều file đa định dạng.
                </p>
              </div>
              {totalTpls > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold"
                  style={{ background: "#e6f4ea", color: "#137333" }}>
                  <Icon name="check-circle" size={12} strokeWidth={2.2} /> {totalTpls} file · {activeCats.length} loại
                </span>
              )}
            </div>

            {/* Library — preset categories grouped */}
            <div className="rounded-2xl border p-3.5 mb-3" style={{ borderColor: T2.border, background: "#fcfdff" }}>
              <div className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: T2.textDisabled }}>
                Thư viện loại tài liệu — bấm để thêm vào dự án
              </div>
              <div className="flex flex-col gap-2.5">
                {Object.entries(grouped).map(([group, items]) => (
                  <div key={group}>
                    <div className="text-[10.5px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: T2.textSecondary }}>{group}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(cat => {
                        const on = activeCats.includes(cat.id);
                        const tone = toneOf(cat);
                        return (
                          <button key={cat.id} onClick={() => toggleCat(cat.id)}
                            style={on
                              ? { background: tone.bg, color: tone.fg, borderColor: tone.fg }
                              : { background: "#fff", color: T2.textPrimary, borderColor: T2.border }}
                            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[12.5px] font-medium border transition-colors">
                            <Icon name={cat.icon} size={13} strokeWidth={2} />
                            {cat.label}
                            {on && <Icon name="check" size={12} strokeWidth={2.6} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom input */}
              <div className="mt-3 pt-3 border-t flex items-center gap-2" style={{ borderColor: T2.border }}>
                <div className="flex-1 flex items-center gap-2 h-10 rounded-lg px-3"
                  style={{ background: "#fff", border: `1px solid ${T2.border}` }}>
                  <Icon name="plus" size={14} style={{ color: T2.textSecondary }} />
                  <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") addCustomCat(); }}
                    placeholder="Tự định nghĩa loại (vd: Báo cáo bảo trì, KPI dashboard…)"
                    className="flex-1 bg-transparent outline-none text-[13px]"
                    style={{ color: T2.textPrimary }} />
                </div>
                <button onClick={addCustomCat}
                  disabled={!customLabel.trim()}
                  style={{ background: customLabel.trim() ? T2.primary : "#dadce0", color: "#fff" }}
                  className="h-10 px-3.5 rounded-lg text-[12.5px] font-semibold inline-flex items-center gap-1.5">
                  <Icon name="plus" size={14} strokeWidth={2.4} />
                  Thêm loại
                </button>
              </div>
            </div>

            {/* Active slots */}
            {activeCats.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed py-8 text-center"
                style={{ borderColor: T2.border, color: T2.textSecondary }}>
                <Icon name="layout-template" size={22} style={{ color: T2.textDisabled, margin: "0 auto 6px" }} />
                <div className="text-[13px] font-medium">Chưa chọn loại tài liệu nào</div>
                <div className="text-[12px] mt-1">Bấm chip ở thư viện phía trên hoặc tự định nghĩa</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {activeCats.map(id => {
                  const cat = findCat(id);
                  if (!cat) return null;
                  const files = tplFiles[id] || [];
                  const hasFiles = files.length > 0;
                  const tone = toneOf(cat);
                  return (
                    <div key={id} className="rounded-2xl border p-3.5"
                      style={{
                        borderColor: hasFiles ? "#a8dab5" : T2.border,
                        background: hasFiles ? "#f6fdf8" : "#fff",
                      }}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={hasFiles
                              ? { background: "#e6f4ea", color: "#137333" }
                              : { background: tone.bg, color: tone.fg }}>
                            <Icon name={cat.icon} size={16} strokeWidth={2} />
                          </div>
                          <div className="leading-tight min-w-0">
                            <div className="text-[13.5px] font-semibold flex items-center gap-1.5" style={{ color: T2.textPrimary }}>
                              <span className="truncate">{cat.label}</span>
                              {cat.custom && (
                                <span className="text-[9.5px] font-bold uppercase tracking-wider px-1 py-0.5 rounded"
                                  style={{ background: "#eef2f7", color: "#475569" }}>custom</span>
                              )}
                            </div>
                            <div className="text-[11px]" style={{ color: T2.textSecondary }}>{cat.hint}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {hasFiles && (
                            <span className="text-[10.5px] font-bold font-mono px-1.5 py-0.5 rounded"
                              style={{ background: "#e6f4ea", color: "#137333" }}>{files.length}</span>
                          )}
                          <button onClick={() => toggleCat(id)} title="Bỏ loại này"
                            style={{ color: T2.textSecondary }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T2.hover)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                            className="w-7 h-7 rounded-md flex items-center justify-center transition-colors">
                            <Icon name="x" size={14} />
                          </button>
                        </div>
                      </div>
                      <DropZone
                        accept={cat.accept}
                        files={files}
                        onFiles={(arr) => addTpl(id, arr)}
                        onRemove={(i) => removeTpl(id, i)}
                        label="Kéo thả hoặc bấm để chọn"
                        hint={null}
                        accent={tone.fg}
                        accentBg={tone.bg}
                        icon="upload"
                        compact
                      />
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3 p-3 rounded-xl text-[12px] leading-relaxed flex items-start gap-2"
              style={{ background: "#fcfdff", color: T2.textPrimary, border: `1px solid ${T2.border}` }}>
              <Icon name="info" size={14} strokeWidth={2.1} style={{ color: T2.primary, marginTop: 2, flexShrink: 0 }} />
              <span style={{ color: T2.textSecondary }}>
                Mỗi loại bạn đính sẽ xuất hiện trong <strong style={{ color: T2.textPrimary }}>Trung tâm Xuất</strong> — AI render output đúng layout, heading, font &amp; ngôn ngữ của file mẫu tương ứng. Loại không đính sẽ dùng template chuẩn của hệ thống.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 flex items-center justify-between gap-3 border-t sticky bottom-0 bg-white" style={{ borderColor: T2.border, background: "#fcfdff" }}>
          <div className="text-[12px] flex items-center gap-3" style={{ color: T2.textSecondary }}>
            {sourceFiles.length > 0 && (
              <span className="inline-flex items-center gap-1"><Icon name="upload" size={13} /> {sourceFiles.length} file nguồn</span>
            )}
            {totalTpls > 0 && (
              <span className="inline-flex items-center gap-1"><Icon name="layout-template" size={13} /> {totalTpls} template</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <GhostBtn onClick={onClose}>Huỷ</GhostBtn>
            <PrimaryBtn icon="rocket" onClick={() => canCreate && onCreate({ name, industry, mode, goal, sourceFiles, tplFiles })}>
              Tạo &amp; bắt đầu khai phá
            </PrimaryBtn>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { T2, IndustryBadge, SidebarV2, CreateProjectModal, DropZone, FileChip, fileIconFor, formatBytes });
