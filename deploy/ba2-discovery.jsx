/* =========================================================================
   BA Super App v2 — Tab Khai phá (Chuyên gia ngành)
   Bố cục 2 cột: chat ~60% / Tri thức dự án ~40%
   ========================================================================= */
function ChatBubble({ msg, expert, onChip }) {
  const isAI = msg.role === "ai";
  return (
    <div className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={isAI
          ? { background: expert.bg, color: expert.fg }
          : { background: BA_TOKENS.primary, color: "#fff" }}>
        {isAI ? <Icon name={expert.icon} size={18} strokeWidth={2} /> : <span className="text-[12px] font-semibold">BA</span>}
      </div>
      {/* Bubble */}
      <div className={`max-w-[78%] ${isAI ? "" : "flex flex-col items-end"}`}>
        <div className="rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed"
          style={isAI
            ? { background: "#fff", color: BA_TOKENS.textPrimary, border: `1px solid ${BA_TOKENS.border}` }
            : { background: BA_TOKENS.primaryContainer, color: BA_TOKENS.onPrimaryContainer }}>
          {msg.text}
        </div>

        {/* Sources tag */}
        {isAI && msg.sources && (
          <div className="flex flex-wrap gap-1.5 mt-1.5 px-1">
            {msg.sources.map(src => (
              <span key={src} className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-md"
                style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>
                <Icon name="file-text" size={10} strokeWidth={2.2} />
                nguồn: {src}
              </span>
            ))}
          </div>
        )}

        {/* Quick choice chips */}
        {isAI && msg.chips && (
          <div className="flex flex-wrap gap-2 mt-2.5 px-1">
            {msg.chips.map((chip, i) => {
              const isDef = i === msg.defaultChip;
              return (
                <button key={chip} onClick={() => onChip && onChip(chip)}
                  style={isDef
                    ? { background: BA_TOKENS.primaryContainer, color: BA_TOKENS.onPrimaryContainer, borderColor: "transparent" }
                    : { background: "#fff", color: BA_TOKENS.textPrimary, borderColor: BA_TOKENS.border }}
                  onMouseEnter={(e) => { if (!isDef) e.currentTarget.style.background = BA_TOKENS.hover; }}
                  onMouseLeave={(e) => { if (!isDef) e.currentTarget.style.background = "#fff"; }}
                  className="inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[12.5px] font-medium border transition-colors">
                  {chip}
                  {isDef && <span className="text-[10px] uppercase tracking-wider opacity-70">mặc định</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function KbCard({ kind, items, render }) {
  const cfg = {
    entities: { icon: "database",   tintBg: "#e8f0fe", tintFg: "#1967d2", title: "Entities" },
    rules:    { icon: "list-checks", tintBg: "#e6f4ea", tintFg: "#137333", title: "Business Rules" },
    glossary: { icon: "table",       tintBg: "#f3e8fd", tintFg: "#8430ce", title: "Glossary" },
  }[kind];
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: cfg.tintBg, color: cfg.tintFg }}>
            <Icon name={cfg.icon} size={15} strokeWidth={2} />
          </div>
          <h4 className="text-[13.5px] font-semibold" style={{ color: BA_TOKENS.textPrimary }}>{cfg.title}</h4>
          <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{items.length}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(render)}
      </div>
    </Card>
  );
}

function SourceChip({ src }) {
  if (src) {
    return (
      <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded"
        style={{ background: "#e6f4ea", color: "#137333" }}>
        <Icon name="file-text" size={10} strokeWidth={2.2} /> {src}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-medium px-1.5 py-0.5 rounded"
      style={{ background: "#fef7e0", color: "#b06000" }}>
      <Icon name="alert-triangle" size={10} strokeWidth={2.2} /> giả định — cần xác nhận
    </span>
  );
}

function DiscoveryTab({ project }) {
  const expert = BA2_INDUSTRIES.find(i => i.id === project.industry);
  const [messages, setMessages] = React.useState(BA2_CHAT);
  const [input, setInput] = React.useState("");
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
      { role: "ai",   text: "Đã ghi nhận. Tôi sẽ bổ sung tri thức tương ứng và tiếp tục đặt câu hỏi để làm rõ phạm vi.",
        chips: ["Tiếp tục", "Đổi chủ đề", "Tóm tắt tới giờ"], defaultChip: 0,
        sources: ["HSYC.docx"] },
    ]);
    setInput("");
  };

  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: "minmax(0,1.5fr) minmax(0,1fr)" }}>
      {/* LEFT — Chat */}
      <Card className="overflow-hidden flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: 560 }}>
        {/* Header */}
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
                đang online · Socratic
              </span>
            </div>
            <div className="text-[11.5px]" style={{ color: BA_TOKENS.textSecondary }}>
              Đã nạp knowledge: 5 entity · 12 rule · 18 glossary cho ngành {expert.short}
            </div>
          </div>
          <button title="Mở rộng"
            style={{ color: BA_TOKENS.textSecondary }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BA_TOKENS.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            className="w-9 h-9 rounded-full flex items-center justify-center">
            <Icon name="external-link" size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4" style={{ background: "#fcfdff" }}>
          {messages.map((m, i) => (
            <ChatBubble key={i} msg={m} expert={expert} onChip={(c) => send(c)} />
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: BA_TOKENS.border }}>
          <div className="flex-1 flex items-center gap-2 h-11 rounded-full px-4 transition-all"
            style={{ background: "#f1f3f4", border: `1px solid transparent` }}>
            <input
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Trả lời chuyên gia, hoặc đặt câu hỏi…"
              className="flex-1 bg-transparent outline-none text-[13.5px]"
              style={{ color: BA_TOKENS.textPrimary }} />
          </div>
          <button onClick={() => send()}
            disabled={!input.trim()}
            style={{ background: input.trim() ? BA_TOKENS.primary : "#dadce0", color: "#fff" }}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-colors">
            <Icon name="send" size={18} strokeWidth={2.1} />
          </button>
        </div>
      </Card>

      {/* RIGHT — Tri thức dự án */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1" style={{ height: "calc(100vh - 280px)", minHeight: 560 }}>
        <div className="flex items-center justify-between sticky top-0 z-10 bg-[#fcfdff] -mx-1 px-1 pb-2">
          <div>
            <h3 className="text-[15px] font-semibold leading-tight" style={{ color: BA_TOKENS.textPrimary }}>Tri thức dự án</h3>
            <p className="text-[11.5px] mt-0.5" style={{ color: BA_TOKENS.textSecondary }}>Sinh dần khi hội thoại tiến triển</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium"
            style={{ background: "#e6f4ea", color: "#137333" }}>
            <Icon name="sparkles" size={12} strokeWidth={2.2} /> tự sinh
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
              <button title="Sửa" onClick={() => console.log("edit", e.name)}
                style={{ color: BA_TOKENS.textSecondary }}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = BA_TOKENS.hover)}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                className="w-7 h-7 rounded-full flex items-center justify-center">
                <Icon name="pencil" size={13} />
              </button>
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
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2 min-w-0">
                <span className="text-[10.5px] font-bold font-mono px-1.5 py-0.5 rounded shrink-0 mt-px"
                  style={{ background: "#e6f4ea", color: "#137333" }}>{r.id}</span>
                <span className="text-[12.5px] leading-snug" style={{ color: BA_TOKENS.textPrimary }}>{r.text}</span>
              </div>
              <button title="Sửa" onClick={() => console.log("edit", r.id)}
                style={{ color: BA_TOKENS.textSecondary }}
                onMouseEnter={(ev) => (ev.currentTarget.style.background = BA_TOKENS.hover)}
                onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                <Icon name="pencil" size={12} />
              </button>
            </div>
            <SourceChip src={r.src} />
          </div>
        )} />

        <KbCard kind="glossary" items={BA2_KB_GLOSSARY} render={(g) => (
          <div key={g.term} className="rounded-xl border p-3 flex items-start gap-2.5" style={{ borderColor: BA_TOKENS.border }}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12.5px] font-bold font-mono" style={{ color: BA_TOKENS.primary }}>{g.term}</span>
                <span className="text-[12px]" style={{ color: BA_TOKENS.textPrimary }}>· {g.def}</span>
              </div>
              <SourceChip src={g.src} />
            </div>
          </div>
        )} />
      </div>
    </div>
  );
}

Object.assign(window, { DiscoveryTab, ChatBubble, KbCard, SourceChip });
