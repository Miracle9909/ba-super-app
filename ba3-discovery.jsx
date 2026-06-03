/* =========================================================================
   BA Super App v3 — Khai phá nâng cấp: Q&A upload + Output picker + Sinh nháp
   Reuses ChatBubble, KbCard, SourceChip from ba2-discovery.jsx
   ========================================================================= */
const BA3_QA_FILES = [
  { name: "RFP-BIDV-Q&A.docx",         meta: "24 câu · phân tích xong",     status: "done",    items: 24 },
  { name: "Interview-stakeholder.md",   meta: "12 câu · đang phân tích",    status: "pending", items: 12 },
];

const BA3_OUTPUT_OPTIONS = [
  { id: "brd",      label: "BRD",            icon: "file-pen-line",  tone: "indigo", group: "Đặc tả" },
  { id: "srs",      label: "SRS",            icon: "scroll-text",    tone: "purple", group: "Đặc tả" },
  { id: "tech",     label: "Kỹ thuật",       icon: "file-text",      tone: "sky",    group: "Đặc tả" },
  { id: "usecase",  label: "Use Case",       icon: "git-branch",     tone: "purple", group: "Đặc tả" },
  { id: "diagrams", label: "Sơ đồ nghiệp vụ", icon: "square-kanban", tone: "purple", group: "Đặc tả" },
  { id: "quote",    label: "Báo giá",        icon: "coins",          tone: "amber",  group: "Thương mại" },
  { id: "estimate", label: "Estimation",     icon: "calculator",     tone: "amber",  group: "Thương mại" },
  { id: "funcs",    label: "Function list",  icon: "list-tree",      tone: "sky",    group: "Lập kế hoạch" },
  { id: "testplan", label: "Test Plan",      icon: "badge-check",    tone: "rose",   group: "Chất lượng" },
];

// New chat messages mock — references gap analysis from Q&A
const BA3_CHAT = [
  { role: "ai", text: "Tôi đã đọc 24 câu trong RFP-BIDV-Q&A.docx và 12 câu phỏng vấn stakeholder. Có 3 GAP và 2 ASSUMPTION cần làm rõ trước khi sinh nháp.",
    chips: ["Liệt kê gap", "Bắt đầu hỏi", "Cứ sinh tạm"], defaultChip: 0, sources: ["RFP Q&A", "Interview notes"] },
  { role: "user", text: "Liệt kê gap" },
  { role: "ai", text: "GAP 1 — Ngưỡng định giá độc lập: Q&A nói '>2 tỷ' nhưng phỏng vấn nói '>1.5 tỷ'. Anh chốt số nào?",
    chips: ["2 tỷ (theo RFP)", "1.5 tỷ (theo phỏng vấn)", "Cấu hình được"], defaultChip: 0,
    sources: ["RFP §3.2", "Interview §5"] },
];

/* ----- Q&A Source panel ----- */
function QASourceItem({ file }) {
  const done = file.status === "done";
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl border" style={{ borderColor: BA_TOKENS.border, background: "#fff" }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>
        <Icon name={fileIconFor(file.name)} size={15} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-semibold truncate" style={{ color: BA_TOKENS.textPrimary }}>{file.name}</div>
        <div className="text-[11px] flex items-center gap-1.5" style={{ color: BA_TOKENS.textSecondary }}>
          <Icon name="messages-square" size={10} strokeWidth={2.2} />
          {file.items} câu
          <span>·</span>
          <span style={{ color: done ? "#137333" : "#b06000" }}>{done ? "✓ phân tích xong" : "⏳ đang phân tích"}</span>
        </div>
      </div>
      <button title="Xoá"
        style={{ color: BA_TOKENS.textSecondary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BA_TOKENS.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        className="w-7 h-7 rounded-full flex items-center justify-center">
        <Icon name="x" size={13} />
      </button>
    </div>
  );
}

function QAUploadPanel() {
  const [files, setFiles] = React.useState(BA3_QA_FILES);
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="messages-square" size={16} style={{ color: BA_TOKENS.primary }} />
            <h3 className="text-[13.5px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Nguồn Q&amp;A đã nạp</h3>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{files.length}</span>
          </div>
          <p className="text-[11.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>Chuyên gia AI so khớp với knowledge ngành → chỉ hỏi GAP.</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {files.map((f, i) => <QASourceItem key={i} file={f} />)}
      </div>
      <DropZone
        accept=".doc,.docx,.pdf,.md,.txt,.csv,.xlsx"
        files={[]}
        onFiles={(arr) => setFiles(s => [...s, ...arr.map(a => ({ ...a, meta: "đang phân tích", status: "pending", items: "?" }))])}
        onRemove={() => {}}
        label="Nạp thêm Q&A / Meeting notes / Interview"
        hint=".doc · .docx · .pdf · .md · .csv · .xlsx"
        compact
      />
    </Card>
  );
}

/* ----- Output picker ----- */
function OutputPickerPanel({ selected, setSelected }) {
  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const groups = BA3_OUTPUT_OPTIONS.reduce((acc, o) => { (acc[o.group] = acc[o.group] || []).push(o); return acc; }, {});
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Icon name="rocket" size={16} style={{ color: BA_TOKENS.primary }} />
            <h3 className="text-[13.5px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Yêu cầu output (cần làm gì?)</h3>
            {selected.length > 0 && (
              <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded"
                style={{ background: BA_TOKENS.primaryContainer, color: BA_TOKENS.onPrimaryContainer }}>{selected.length}</span>
            )}
          </div>
          <p className="text-[11.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>AI hướng câu hỏi vào thông tin cần cho các output này.</p>
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: BA_TOKENS.textDisabled }}>{group}</div>
            <div className="flex flex-wrap gap-1.5">
              {items.map(o => {
                const on = selected.includes(o.id);
                const tone = BA2_TPL_TONES[o.tone];
                return (
                  <button key={o.id} onClick={() => toggle(o.id)}
                    style={on
                      ? { background: tone.bg, color: tone.fg, borderColor: tone.fg }
                      : { background: "#fff", color: BA_TOKENS.textPrimary, borderColor: BA_TOKENS.border }}
                    className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[12px] font-medium border">
                    <Icon name={o.icon} size={13} strokeWidth={2} />
                    {o.label}
                    {on && <Icon name="check" size={11} strokeWidth={2.6} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ----- Discovery v3 ----- */
function DiscoveryTabV3({ project, onSinhNhap }) {
  const expert = BA2_INDUSTRIES.find(i => i.id === project.industry);
  const [messages, setMessages] = React.useState(BA3_CHAT);
  const [input, setInput] = React.useState("");
  const [outputs, setOutputs] = React.useState(["brd", "funcs", "estimate"]);
  const endRef = React.useRef(null);

  React.useEffect(() => {
    endRef.current?.parentElement?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [messages]);

  const send = (text) => {
    const t = (text ?? input).trim();
    if (!t) return;
    setMessages(m => [
      ...m,
      { role: "user", text: t },
      { role: "ai", text: "Đã ghi nhận. GAP 2 — Tỷ lệ DTI: RFP nói 50%, phỏng vấn không đề cập. Có exception cho khách VIP?",
        chips: ["50% cứng", "VIP lên 55%", "Không có exception"], defaultChip: 0, sources: ["RFP §5.1"] },
    ]);
    setInput("");
  };

  const remaining = 3 - Math.min(messages.filter(m => m.role === "user").length, 3);

  return (
    <div className="flex flex-col gap-4">
      {/* Top: Q&A + Output side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <QAUploadPanel />
        <OutputPickerPanel selected={outputs} setSelected={setOutputs} />
      </div>

      {/* Chat + KB */}
      <div className="grid gap-4" style={{ gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)" }}>
        <Card className="overflow-hidden flex flex-col" style={{ height: "calc(100vh - 460px)", minHeight: 440 }}>
          <div className="px-5 py-3.5 flex items-center gap-3 border-b" style={{ borderColor: BA_TOKENS.border, background: "linear-gradient(180deg,#fcfdff,#fff)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: expert.bg, color: expert.fg }}>
              <Icon name={expert.icon} size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>Chuyên gia {expert.short}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ background: "#e6f4ea", color: "#137333" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#137333" }} />
                  GAP-analysis mode
                </span>
              </div>
              <div className="text-[11.5px]" style={{ color: BA_TOKENS.textSecondary }}>
                Đã đọc 36 Q&A · phát hiện 3 gap · {outputs.length} output cần sinh
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4" style={{ background: "#fcfdff" }}>
            {messages.map((m, i) => (
              <ChatBubble key={i} msg={m} expert={expert} onChip={(c) => send(c)} />
            ))}
            <div ref={endRef} />
          </div>

          <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: BA_TOKENS.border }}>
            <div className="flex-1 flex items-center gap-2 h-11 rounded-full px-4"
              style={{ background: "#f1f3f4" }}>
              <input
                value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Trả lời chuyên gia hoặc đặt câu hỏi…"
                className="flex-1 bg-transparent outline-none text-[13.5px]"
                style={{ color: BA_TOKENS.textPrimary }} />
            </div>
            <button onClick={() => send()}
              disabled={!input.trim()}
              style={{ background: input.trim() ? BA_TOKENS.primary : "#dadce0", color: "#fff" }}
              className="w-11 h-11 rounded-full flex items-center justify-center">
              <Icon name="send" size={18} strokeWidth={2.1} />
            </button>
          </div>
        </Card>

        <div className="flex flex-col gap-4 overflow-y-auto pr-1" style={{ height: "calc(100vh - 460px)", minHeight: 440 }}>
          <div className="flex items-center justify-between sticky top-0 z-10 bg-[#fcfdff] -mx-1 px-1 pb-2">
            <div>
              <h3 className="text-[15px] font-semibold leading-tight" style={{ color: BA_TOKENS.textPrimary }}>Tri thức dự án</h3>
              <p className="text-[11.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>Tự sinh khi hội thoại tiến triển</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium"
              style={{ background: "#e6f4ea", color: "#137333" }}>
              <Icon name="sparkles" size={12} strokeWidth={2.2} /> auto
            </span>
          </div>

          <KbCard kind="entities" items={BA2_KB_ENTITIES} render={(e) => (
            <div key={e.name} className="rounded-xl border p-3" style={{ borderColor: BA_TOKENS.border }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: BA_TOKENS.active, color: BA_TOKENS.primary }}>
                    <Icon name={e.icon} size={15} strokeWidth={2} />
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{e.name}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {e.attrs.map(a => (
                  <span key={a} className="text-[11px] px-1.5 py-0.5 rounded font-mono"
                    style={{ background: "#f6f8fc", color: BA_TOKENS.textSecondary, border: `1px solid ${BA_TOKENS.border}` }}>{a}</span>
                ))}
              </div>
              <SourceChip src={e.src} />
            </div>
          )} />

          <KbCard kind="rules" items={BA2_KB_RULES} render={(r) => (
            <div key={r.id} className="rounded-xl border p-3" style={{ borderColor: BA_TOKENS.border }}>
              <div className="flex items-start gap-2 mb-2">
                <span className="text-[10.5px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 mt-px"
                  style={{ background: "#e6f4ea", color: "#137333" }}>{r.id}</span>
                <span className="text-[12.5px] leading-snug" style={{ color: BA_TOKENS.textPrimary }}>{r.text}</span>
              </div>
              <SourceChip src={r.src} />
            </div>
          )} />

          <KbCard kind="glossary" items={BA2_KB_GLOSSARY} render={(g) => (
            <div key={g.term} className="rounded-xl border p-3" style={{ borderColor: BA_TOKENS.border }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12.5px] font-bold font-mono" style={{ color: BA_TOKENS.primary }}>{g.term}</span>
                <span className="text-[12px]" style={{ color: BA_TOKENS.textPrimary }}>· {g.def}</span>
              </div>
              <SourceChip src={g.src} />
            </div>
          )} />
        </div>
      </div>

      {/* Bottom action: Sinh nháp */}
      <div className="rounded-2xl p-4 flex items-center gap-4 border"
        style={{ background: "linear-gradient(110deg, #eef4fe 0%, #f6fdf8 100%)", borderColor: BA_TOKENS.border }}>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: "#fff", color: BA_TOKENS.primary }}>
          <Icon name="rocket" size={22} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>
            Sinh nháp {outputs.length} output đã chọn
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>
            {remaining > 0
              ? <>Còn <strong style={{ color: "#b06000" }}>{remaining} gap</strong> cần làm rõ trước khi sinh nháp chất lượng cao.</>
              : <>Đủ thông tin. Bấm để AI sinh nháp đồng thời các output đã chọn (mở Tác vụ để chỉnh sửa).</>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GhostBtn icon="messages-square" onClick={() => console.log("more questions")}>Tiếp tục hỏi</GhostBtn>
          <PrimaryBtn icon="rocket" onClick={() => onSinhNhap && onSinhNhap(outputs)}>
            ▶ Sinh nháp ({outputs.length})
          </PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DiscoveryTabV3, QAUploadPanel, OutputPickerPanel, BA3_QA_FILES, BA3_OUTPUT_OPTIONS });
