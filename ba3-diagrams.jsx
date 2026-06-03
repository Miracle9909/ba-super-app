/* =========================================================================
   BA Super App v3 — Sơ đồ nghiệp vụ: types, mock data, SVG renderers, gallery
   ========================================================================= */
const BA3_DIAGRAM_TYPES = [
  { id: "flow",     label: "Process Flow",        icon: "git-branch",       tone: "indigo", desc: "Quy trình tuyến tính" },
  { id: "bpmn",     label: "BPMN",                icon: "square-kanban",    tone: "purple", desc: "Swim-lane chuẩn BPMN 2.0" },
  { id: "sequence", label: "Sequence Diagram",    icon: "list-tree",        tone: "sky",    desc: "Tương tác giữa actor/system" },
  { id: "arch",     label: "Kiến trúc tổng quan",  icon: "layout-dashboard", tone: "amber",  desc: "Layered architecture" },
  { id: "er",       label: "ER Diagram",          icon: "database",         tone: "green",  desc: "Quan hệ thực thể" },
  { id: "state",    label: "State Machine",       icon: "circle-dot",       tone: "rose",   desc: "Vòng đời trạng thái" },
];

const BA3_DIAGRAMS = [
  { id: "DIAG-001", title: "Quy trình tiếp nhận hồ sơ vay",         type: "flow",     linked: { kind: "req",  id: "US-01" },     updated: "1 giờ trước",  ai: true  },
  { id: "DIAG-002", title: "BPMN: Thẩm định TSĐB",                   type: "bpmn",     linked: { kind: "func", id: "FUNC-110" },  updated: "2 giờ trước",  ai: true  },
  { id: "DIAG-003", title: "Sequence: Gửi yêu cầu định giá độc lập", type: "sequence", linked: { kind: "req",  id: "US-08" },     updated: "3 giờ trước",  ai: true  },
  { id: "DIAG-004", title: "Kiến trúc tổng quan Loan Management",     type: "arch",     linked: { kind: "module", id: "M-LOAN" }, updated: "1 ngày trước", ai: false },
  { id: "DIAG-005", title: "ER: Khách hàng · Hồ sơ vay · TSĐB",       type: "er",       linked: null,                             updated: "2 ngày trước", ai: false },
  { id: "DIAG-006", title: "Vòng đời hồ sơ vay",                       type: "state",    linked: { kind: "req",  id: "US-01" },     updated: "2 ngày trước", ai: true  },
];

function tonePair(toneId) { return BA2_TPL_TONES[toneId] || BA2_TPL_TONES.slate; }

/* =====================  SVG diagram renderers (mock)  ===================== */

function DiagFlow({ w = 520, h = 160 }) {
  const boxes = [
    { x: 20,  y: 55, label: "Nộp hồ sơ" },
    { x: 150, y: 55, label: "Kiểm tra CCCD" },
    { x: 280, y: 55, label: "Định giá TSĐB" },
    { x: 410, y: 55, label: "Quyết định" },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      <defs>
        <marker id="ar-flow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#1967d2" />
        </marker>
      </defs>
      {boxes.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.y} width="110" height="50" rx="10" fill="#e8f0fe" stroke="#1967d2" strokeWidth="1.5" />
          <text x={b.x + 55} y={b.y + 30} textAnchor="middle" fontSize="12" fontWeight="600" fill="#1967d2">{b.label}</text>
        </g>
      ))}
      {boxes.slice(0, -1).map((b, i) => (
        <line key={i} x1={b.x + 110} y1={b.y + 25} x2={boxes[i + 1].x} y2={b.y + 25}
          stroke="#1967d2" strokeWidth="2" markerEnd="url(#ar-flow)" />
      ))}
    </svg>
  );
}

function DiagBPMN({ w = 520, h = 200 }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      <defs>
        <marker id="ar-bpmn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#8430ce" />
        </marker>
      </defs>
      {/* Lanes */}
      <rect x="10" y="20"  width="500" height="80" fill="#faf6ff" stroke="#d9c8f0" />
      <rect x="10" y="100" width="500" height="80" fill="#fefcff" stroke="#d9c8f0" />
      <text x="20" y="60"  fontSize="10.5" fontWeight="700" fill="#8430ce" transform="rotate(-90, 20, 60)">BA</text>
      <text x="20" y="140" fontSize="10.5" fontWeight="700" fill="#8430ce" transform="rotate(-90, 20, 140)">System</text>
      <line x1="40" y1="20" x2="40" y2="180" stroke="#d9c8f0" />
      {/* Start */}
      <circle cx="70"  cy="60"  r="10" fill="#fff" stroke="#8430ce" strokeWidth="2" />
      <rect   x="100" y="45"   width="80"  height="30" rx="8" fill="#f3e8fd" stroke="#8430ce" />
      <text   x="140" y="64"   textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b21b6">Nhận HSYC</text>
      {/* Gateway diamond */}
      <polygon points="220,60 240,45 260,60 240,75" fill="#fff" stroke="#8430ce" strokeWidth="1.5" />
      <text x="240" y="63" textAnchor="middle" fontSize="9.5" fill="#8430ce">≥ 2 tỷ?</text>
      {/* System tasks */}
      <rect x="290" y="125" width="100" height="30" rx="8" fill="#f3e8fd" stroke="#8430ce" />
      <text x="340" y="144" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b21b6">Gửi đối tác</text>
      <rect x="290" y="45"  width="100" height="30" rx="8" fill="#f3e8fd" stroke="#8430ce" />
      <text x="340" y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b21b6">Định giá nội bộ</text>
      {/* End */}
      <circle cx="450" cy="90" r="11" fill="#fff" stroke="#8430ce" strokeWidth="3" />
      {/* Arrows */}
      <path d="M80,60 L100,60"   stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M180,60 L220,60"  stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M260,60 L290,60"  stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M240,75 L240,110 L290,140" fill="none" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M390,60 L450,80"  stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M390,140 L450,100" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
    </svg>
  );
}

function DiagSequence({ w = 520, h = 200 }) {
  const cols = [
    { x: 60,  label: "Khách hàng" },
    { x: 220, label: "Loan API" },
    { x: 380, label: "Đối tác" },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      <defs>
        <marker id="ar-seq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0369a1" />
        </marker>
      </defs>
      {cols.map((c, i) => (
        <g key={i}>
          <rect x={c.x - 50} y="15" width="100" height="28" rx="6" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5" />
          <text x={c.x} y="33" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0369a1">{c.label}</text>
          <line x1={c.x} y1="45" x2={c.x} y2="190" stroke="#9cc3df" strokeDasharray="3 3" />
        </g>
      ))}
      {/* Arrows */}
      <line x1="62" y1="70" x2="218" y2="70" stroke="#0369a1" strokeWidth="1.6" markerEnd="url(#ar-seq)" />
      <text x="140" y="63" textAnchor="middle" fontSize="10" fill="#0c4a6e">nộp hồ sơ vay</text>
      <line x1="222" y1="105" x2="378" y2="105" stroke="#0369a1" strokeWidth="1.6" markerEnd="url(#ar-seq)" />
      <text x="300" y="98" textAnchor="middle" fontSize="10" fill="#0c4a6e">request định giá</text>
      <line x1="378" y1="140" x2="222" y2="140" stroke="#0369a1" strokeWidth="1.6" strokeDasharray="4 3" markerEnd="url(#ar-seq)" />
      <text x="300" y="133" textAnchor="middle" fontSize="10" fill="#0c4a6e">kết quả định giá</text>
      <line x1="218" y1="175" x2="62" y2="175" stroke="#0369a1" strokeWidth="1.6" strokeDasharray="4 3" markerEnd="url(#ar-seq)" />
      <text x="140" y="168" textAnchor="middle" fontSize="10" fill="#0c4a6e">phản hồi khách hàng</text>
    </svg>
  );
}

function DiagArch({ w = 520, h = 200 }) {
  const layers = [
    { y: 20,  label: "Channels",     items: ["Web", "Mobile", "API"], bg: "#fef7e0", fg: "#b06000" },
    { y: 60,  label: "Service",      items: ["Loan Service", "Valuation", "Scoring"], bg: "#fff7d6", fg: "#9a6700" },
    { y: 100, label: "Integration",  items: ["MQ", "API Gateway", "Partner Adapter"], bg: "#fef3c7", fg: "#b45309" },
    { y: 140, label: "Data",         items: ["PostgreSQL", "Redis", "Audit Log"], bg: "#fde68a", fg: "#92400e" },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      {layers.map((l, i) => (
        <g key={i}>
          <rect x="20" y={l.y} width="480" height="34" rx="6" fill={l.bg} stroke={l.fg} strokeWidth="1" />
          <text x="32" y={l.y + 22} fontSize="10.5" fontWeight="700" fill={l.fg}>{l.label.toUpperCase()}</text>
          {l.items.map((it, j) => (
            <g key={j}>
              <rect x={140 + j * 120} y={l.y + 5} width="110" height="24" rx="5" fill="#fff" stroke={l.fg} strokeWidth="1" />
              <text x={140 + j * 120 + 55} y={l.y + 21} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={l.fg}>{it}</text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function DiagER({ w = 520, h = 200 }) {
  const ents = [
    { x: 30,  y: 30,  label: "Khách hàng",   attrs: ["id", "Họ tên", "CCCD"] },
    { x: 200, y: 30,  label: "Hồ sơ vay",     attrs: ["Mã HS", "Loại", "TT"] },
    { x: 370, y: 30,  label: "TSĐB",          attrs: ["Loại", "Giá trị"] },
    { x: 200, y: 130, label: "Khoản vay",     attrs: ["Số tiền", "LTV"] },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      {ents.map((e, i) => (
        <g key={i}>
          <rect x={e.x} y={e.y} width="120" height={20 + e.attrs.length * 14} rx="6" fill="#e6f4ea" stroke="#137333" strokeWidth="1.5" />
          <text x={e.x + 60} y={e.y + 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#137333">{e.label}</text>
          <line x1={e.x} y1={e.y + 20} x2={e.x + 120} y2={e.y + 20} stroke="#137333" strokeWidth="1" />
          {e.attrs.map((a, j) => (
            <text key={j} x={e.x + 6} y={e.y + 32 + j * 14} fontSize="10" fill="#1c4631">{a}</text>
          ))}
        </g>
      ))}
      <line x1="150" y1="55" x2="200" y2="55" stroke="#137333" strokeWidth="1.5" />
      <text x="160" y="50" fontSize="9" fill="#137333">1..*</text>
      <line x1="320" y1="55" x2="370" y2="55" stroke="#137333" strokeWidth="1.5" />
      <text x="330" y="50" fontSize="9" fill="#137333">1..1</text>
      <line x1="260" y1="80" x2="260" y2="130" stroke="#137333" strokeWidth="1.5" />
      <text x="265" y="108" fontSize="9" fill="#137333">1..*</text>
    </svg>
  );
}

function DiagState({ w = 520, h = 180 }) {
  const states = [
    { x: 60,  y: 90, label: "Nháp" },
    { x: 200, y: 50, label: "Thẩm định" },
    { x: 200, y: 130, label: "Từ chối" },
    { x: 360, y: 90, label: "Duyệt" },
    { x: 470, y: 90, label: "Giải ngân" },
  ];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      <defs>
        <marker id="ar-st" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#c5221f" />
        </marker>
      </defs>
      {states.map((s, i) => (
        <g key={i}>
          <ellipse cx={s.x} cy={s.y} rx="42" ry="22" fill="#fce8e6" stroke="#c5221f" strokeWidth="1.5" />
          <text x={s.x} y={s.y + 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="#c5221f">{s.label}</text>
        </g>
      ))}
      <line x1="102" y1="86" x2="158" y2="58" stroke="#c5221f" strokeWidth="1.6" markerEnd="url(#ar-st)" />
      <line x1="240" y1="62" x2="320" y2="84" stroke="#c5221f" strokeWidth="1.6" markerEnd="url(#ar-st)" />
      <line x1="240" y1="125" x2="200" y2="125" stroke="#c5221f" strokeWidth="1.6" markerEnd="url(#ar-st)" opacity="0" />
      <path d="M180,72 Q150,100 180,125" fill="none" stroke="#c5221f" strokeWidth="1.6" markerEnd="url(#ar-st)" />
      <line x1="402" y1="90" x2="430" y2="90" stroke="#c5221f" strokeWidth="1.6" markerEnd="url(#ar-st)" />
    </svg>
  );
}

function DiagramSVG({ type }) {
  const map = { flow: DiagFlow, bpmn: DiagBPMN, sequence: DiagSequence, arch: DiagArch, er: DiagER, state: DiagState };
  const C = map[type] || DiagFlow;
  return <C />;
}

/* =====================  Components  ===================== */

function DiagramCard({ diag, onOpen }) {
  const tdef = BA3_DIAGRAM_TYPES.find(t => t.id === diag.type);
  const tone = tonePair(tdef?.tone);
  return (
    <Card hover onClick={() => onOpen(diag)} className="p-0 overflow-hidden">
      <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: tone.bg, color: tone.fg }}>
              <Icon name={tdef?.icon || "git-branch"} size={14} strokeWidth={2} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tone.fg }}>{tdef?.label}</span>
            {diag.ai && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded"
                style={{ background: "#e8f0fe", color: "#1967d2" }}>
                <Icon name="sparkles" size={9} strokeWidth={2.2} /> AI
              </span>
            )}
          </div>
          <div className="text-[14px] font-semibold leading-tight" style={{ color: BA_TOKENS.textPrimary }}>{diag.title}</div>
          <div className="text-[11.5px] mt-1 flex items-center gap-2 flex-wrap" style={{ color: BA_TOKENS.textSecondary }}>
            {diag.linked && (
              <span className="font-mono px-1.5 py-0.5 rounded" style={{ background: "#f1f3f4" }}>
                {diag.linked.kind === "req" ? "🎯" : diag.linked.kind === "func" ? "⚙️" : "📦"} {diag.linked.id}
              </span>
            )}
            <span>·</span>
            <span>{diag.updated}</span>
          </div>
        </div>
      </div>
      <div className="px-2 pb-3 pt-1" style={{ background: "#fcfdff" }}>
        <div style={{ height: 130, overflow: "hidden", borderRadius: 10, background: "#fff", border: `1px solid ${BA_TOKENS.border}` }}>
          <DiagramSVG type={diag.type} />
        </div>
      </div>
      <div className="px-4 py-2.5 border-t flex items-center gap-2" style={{ borderColor: BA_TOKENS.border }}>
        <button onClick={(e) => { e.stopPropagation(); onOpen(diag); }}
          className="flex-1 h-8 rounded-full text-[12.5px] font-medium border inline-flex items-center justify-center gap-1.5"
          style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary, background: "#fff" }}>
          <Icon name="eye" size={13} /> Xem
        </button>
        <button onClick={(e) => { e.stopPropagation(); console.log("download", diag.id); }}
          className="flex-1 h-8 rounded-full text-[12.5px] font-medium border inline-flex items-center justify-center gap-1.5"
          style={{ borderColor: BA_TOKENS.border, color: BA_TOKENS.textSecondary, background: "#fff" }}>
          <Icon name="file-down" size={13} /> Tải
        </button>
      </div>
    </Card>
  );
}

function DiagramViewerModal({ diag, onClose }) {
  if (!diag) return null;
  const tdef = BA3_DIAGRAM_TYPES.find(t => t.id === diag.type);
  const tone = tonePair(tdef?.tone);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(15,23,42,.45)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-[1040px] w-[94vw] max-h-[92vh] overflow-hidden flex flex-col"
        style={{ border: `1px solid ${BA_TOKENS.border}` }}>
        <div className="px-6 py-4 flex items-start justify-between gap-4 border-b" style={{ borderColor: BA_TOKENS.border }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: tone.bg, color: tone.fg }}>
                <Icon name={tdef?.icon || "git-branch"} size={16} strokeWidth={2} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tone.fg }}>{tdef?.label}</span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded" style={{ background: "#f1f3f4", color: BA_TOKENS.textSecondary }}>{diag.id}</span>
            </div>
            <h2 className="text-[17px] font-semibold tracking-tight" style={{ color: BA_TOKENS.textPrimary }}>{diag.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <GhostBtn icon="file-down" onClick={() => console.log("download", diag.id)}>SVG · PNG</GhostBtn>
            <GhostBtn icon="pencil" onClick={() => console.log("edit diagram")}>Sửa</GhostBtn>
            <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ color: BA_TOKENS.textSecondary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BA_TOKENS.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
              <Icon name="x" size={18} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6" style={{ background: "#fcfdff" }}>
          <div style={{ background: "#fff", border: `1px solid ${BA_TOKENS.border}`, borderRadius: 16, padding: 16 }}>
            <DiagramSVG type={diag.type} />
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BA3_DIAGRAM_TYPES, BA3_DIAGRAMS, DiagramSVG, DiagramCard, DiagramViewerModal });
