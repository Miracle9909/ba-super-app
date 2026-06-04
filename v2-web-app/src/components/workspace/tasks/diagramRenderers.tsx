import React from 'react';

/* =========================================================================
   Hand-coded SVG diagram renderers — ported VERBATIM from the v3 prototype
   (Design/ba3-diagrams.jsx: DiagFlow / DiagBPMN / DiagSequence / DiagArch /
    DiagER / DiagState + DiagramSVG dispatcher). These are static sample
   previews keyed by diagram type (no mermaid rendering dependency).
   ========================================================================= */

interface DiagProps {
  w?: number;
  h?: number;
}

export const DiagFlow: React.FC<DiagProps> = ({ w = 520, h = 160 }) => {
  const boxes = [
    { x: 20, y: 55, label: 'Nộp hồ sơ' },
    { x: 150, y: 55, label: 'Kiểm tra CCCD' },
    { x: 280, y: 55, label: 'Định giá TSĐB' },
    { x: 410, y: 55, label: 'Quyết định' },
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
};

export const DiagBPMN: React.FC<DiagProps> = ({ w = 520, h = 200 }) => {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%">
      <defs>
        <marker id="ar-bpmn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#8430ce" />
        </marker>
      </defs>
      {/* Lanes */}
      <rect x="10" y="20" width="500" height="80" fill="#faf6ff" stroke="#d9c8f0" />
      <rect x="10" y="100" width="500" height="80" fill="#fefcff" stroke="#d9c8f0" />
      <text x="20" y="60" fontSize="10.5" fontWeight="700" fill="#8430ce" transform="rotate(-90, 20, 60)">BA</text>
      <text x="20" y="140" fontSize="10.5" fontWeight="700" fill="#8430ce" transform="rotate(-90, 20, 140)">System</text>
      <line x1="40" y1="20" x2="40" y2="180" stroke="#d9c8f0" />
      {/* Start */}
      <circle cx="70" cy="60" r="10" fill="#fff" stroke="#8430ce" strokeWidth="2" />
      <rect x="100" y="45" width="80" height="30" rx="8" fill="#f3e8fd" stroke="#8430ce" />
      <text x="140" y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b21b6">Nhận HSYC</text>
      {/* Gateway diamond */}
      <polygon points="220,60 240,45 260,60 240,75" fill="#fff" stroke="#8430ce" strokeWidth="1.5" />
      <text x="240" y="63" textAnchor="middle" fontSize="9.5" fill="#8430ce">≥ 2 tỷ?</text>
      {/* System tasks */}
      <rect x="290" y="125" width="100" height="30" rx="8" fill="#f3e8fd" stroke="#8430ce" />
      <text x="340" y="144" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b21b6">Gửi đối tác</text>
      <rect x="290" y="45" width="100" height="30" rx="8" fill="#f3e8fd" stroke="#8430ce" />
      <text x="340" y="64" textAnchor="middle" fontSize="11" fontWeight="600" fill="#5b21b6">Định giá nội bộ</text>
      {/* End */}
      <circle cx="450" cy="90" r="11" fill="#fff" stroke="#8430ce" strokeWidth="3" />
      {/* Arrows */}
      <path d="M80,60 L100,60" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M180,60 L220,60" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M260,60 L290,60" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M240,75 L240,110 L290,140" fill="none" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M390,60 L450,80" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
      <path d="M390,140 L450,100" stroke="#8430ce" strokeWidth="1.8" markerEnd="url(#ar-bpmn)" />
    </svg>
  );
};

export const DiagSequence: React.FC<DiagProps> = ({ w = 520, h = 200 }) => {
  const cols = [
    { x: 60, label: 'Khách hàng' },
    { x: 220, label: 'Loan API' },
    { x: 380, label: 'Đối tác' },
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
};

export const DiagArch: React.FC<DiagProps> = ({ w = 520, h = 200 }) => {
  const layers = [
    { y: 20, label: 'Channels', items: ['Web', 'Mobile', 'API'], bg: '#fef7e0', fg: '#b06000' },
    { y: 60, label: 'Service', items: ['Loan Service', 'Valuation', 'Scoring'], bg: '#fff7d6', fg: '#9a6700' },
    { y: 100, label: 'Integration', items: ['MQ', 'API Gateway', 'Partner Adapter'], bg: '#fef3c7', fg: '#b45309' },
    { y: 140, label: 'Data', items: ['PostgreSQL', 'Redis', 'Audit Log'], bg: '#fde68a', fg: '#92400e' },
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
};

export const DiagER: React.FC<DiagProps> = ({ w = 520, h = 200 }) => {
  const ents = [
    { x: 30, y: 30, label: 'Khách hàng', attrs: ['id', 'Họ tên', 'CCCD'] },
    { x: 200, y: 30, label: 'Hồ sơ vay', attrs: ['Mã HS', 'Loại', 'TT'] },
    { x: 370, y: 30, label: 'TSĐB', attrs: ['Loại', 'Giá trị'] },
    { x: 200, y: 130, label: 'Khoản vay', attrs: ['Số tiền', 'LTV'] },
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
};

export const DiagState: React.FC<DiagProps> = ({ w = 520, h = 180 }) => {
  const states = [
    { x: 60, y: 90, label: 'Nháp' },
    { x: 200, y: 50, label: 'Thẩm định' },
    { x: 200, y: 130, label: 'Từ chối' },
    { x: 360, y: 90, label: 'Duyệt' },
    { x: 470, y: 90, label: 'Giải ngân' },
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
};

/* Dispatcher: pick the renderer by diagram type id (defaults to flow). */
type DiagComponent = React.FC<DiagProps>;

const RENDERERS: Record<string, DiagComponent> = {
  flow: DiagFlow,
  bpmn: DiagBPMN,
  sequence: DiagSequence,
  arch: DiagArch,
  er: DiagER,
  state: DiagState,
};

export const DiagramSVG: React.FC<{ type: string } & DiagProps> = ({ type, ...rest }) => {
  const Renderer = RENDERERS[type] || DiagFlow;
  return <Renderer {...rest} />;
};
