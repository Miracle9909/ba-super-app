/* =========================================================================
   BA Super App — Shared UI: atoms + Sidebar + Header
   Style: Google Stitch / Material 3. Tokens from BA_TOKENS.
   ========================================================================= */
const T = BA_TOKENS;

/* ---------- Atoms ---------- */
function DomainBadge({ domain, size = "sm" }) {
  const isBank = domain === "Banking";
  const bg = isBank ? "#e8f0fe" : "#fce8e6";
  const fg = isBank ? "#1967d2" : "#c5221f";
  const pad = size === "sm" ? "2px 10px" : "3px 12px";
  const fs = size === "sm" ? 12 : 12.5;
  return (
    <span style={{ background: bg, color: fg, padding: pad, fontSize: fs }}
      className="inline-flex items-center font-medium rounded-full leading-none whitespace-nowrap">
      {domain}
    </span>
  );
}

function StatusBadge({ status }) {
  // done/pass (green) | pending/running (amber)
  const good = status === "done" || status === "pass";
  const bg = good ? "#e6f4ea" : "#fef7e0";
  const fg = good ? "#137333" : "#b06000";
  const label = status === "done" ? "Đã xử lý" : status === "pending" ? "Chờ xử lý"
    : status === "pass" ? "PASS" : "Đang chạy";
  const icon = good ? "check-circle" : "clock";
  return (
    <span style={{ background: bg, color: fg }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium leading-none whitespace-nowrap">
      <Icon name={icon} size={13} strokeWidth={2.1} />
      {label}
    </span>
  );
}

function PrimaryBtn({ children, icon, onClick, className = "", size = "md" }) {
  const sizes = { sm: "h-9 px-3.5 text-[13px]", md: "h-10 px-4 text-[13.5px]" };
  return (
    <button onClick={onClick}
      style={{ background: T.primary }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.primaryHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = T.primary)}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium text-white transition-colors shadow-sm ${sizes[size]} ${className}`}>
      {icon && <Icon name={icon} size={17} strokeWidth={2} />}
      {children}
    </button>
  );
}

function GhostBtn({ children, icon, onClick, className = "", tone = "default" }) {
  const fg = tone === "primary" ? T.primary : T.textSecondary;
  return (
    <button onClick={onClick}
      style={{ color: fg, borderColor: T.border }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      className={`inline-flex items-center justify-center gap-2 h-9 px-3.5 rounded-full text-[13px] font-medium border bg-white transition-colors ${className}`}>
      {icon && <Icon name={icon} size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}

function IconBtn({ icon, onClick, title, badge }) {
  return (
    <button onClick={onClick} title={title}
      style={{ color: T.textSecondary }}
      onMouseEnter={(e) => (e.currentTarget.style.background = T.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors">
      <Icon name={icon} size={20} />
      {badge && <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "#d93025", boxShadow: "0 0 0 2px #fff" }} />}
    </button>
  );
}

function Card({ children, className = "", style, onClick, hover = false }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setH(true)} onMouseLeave={() => hover && setH(false)}
      style={{
        background: T.surface, borderColor: T.border,
        boxShadow: h ? "0 1px 3px rgba(60,64,67,.18), 0 4px 12px rgba(60,64,67,.10)" : "0 1px 2px rgba(60,64,67,.06)",
        transform: h ? "translateY(-2px)" : "none",
        transition: "box-shadow .18s ease, transform .18s ease, border-color .18s ease",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      className={`border rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

// 6-segment progress used on project cards
function SegmentBar({ total = 6, active = 1, color = T.primary }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="h-1.5 flex-1 rounded-full"
          style={{ background: i < active ? color : "#e3e7ee", transition: "background .2s" }} />
      ))}
    </div>
  );
}

function ProgressBar({ value, color = T.primary, height = 8 }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: "#e3e7ee", height }}>
      <div style={{ width: `${value}%`, background: color, height: "100%", borderRadius: 999, transition: "width .4s ease" }} />
    </div>
  );
}

function SectionTitle({ children, sub, right }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-[18px] font-semibold leading-tight" style={{ color: T.textPrimary }}>{children}</h2>
        {sub && <p className="text-[13px] mt-1" style={{ color: T.textSecondary }}>{sub}</p>}
      </div>
      {right}
    </div>
  );
}

/* ---------- Sidebar ---------- */
function Sidebar({ activeNav, onNav }) {
  return (
    <aside style={{ width: 280, background: T.appBg }} className="shrink-0 h-full flex flex-col px-3 py-2">
      {/* Brand */}
      <button onClick={() => onNav(BA_NAV[0])}
        className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
          style={{ background: T.primary }}>
          <Icon name="drafting-compass" size={22} strokeWidth={2} />
        </div>
        <div className="text-left leading-tight">
          <div className="text-[15px] font-semibold" style={{ color: T.textPrimary }}>BA Super App</div>
          <div className="text-[11px]" style={{ color: T.textSecondary }}>Senior Business Analyst</div>
        </div>
      </button>

      {/* Group label */}
      <div className="px-3 mt-5 mb-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: T.textDisabled }}>
        Menu chính
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {BA_NAV.map((item) => {
          const isActive = item.id === activeNav;
          return (
            <button key={item.id} onClick={() => onNav(item)}
              style={isActive
                ? { backgroundColor: T.primaryContainer, color: T.onPrimaryContainer }
                : { color: T.textSecondary, backgroundColor: "transparent" }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = T.hover; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
              className="flex items-center gap-3 px-3 h-11 rounded-full text-[13.5px] font-medium text-left">
              <Icon name={item.icon} size={20} strokeWidth={isActive ? 2.1 : 1.85} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flex-1" />

      {/* Settings */}
      <button
        style={{ color: T.textSecondary }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = T.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        className="flex items-center gap-3 px-3 h-11 rounded-full text-[13.5px] font-medium transition-colors">
        <Icon name="settings" size={20} />
        <span>Cài đặt</span>
      </button>

      {/* User profile card */}
      <div className="mt-2 mb-1 flex items-center gap-3 px-3 py-2.5 rounded-2xl border"
        style={{ background: T.surface, borderColor: T.border }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
          style={{ background: T.primary }}>BA</div>
        <div className="leading-tight min-w-0">
          <div className="text-[13px] font-semibold truncate" style={{ color: T.textPrimary }}>Người dùng</div>
          <div className="text-[11.5px] truncate" style={{ color: T.textSecondary }}>Business Analyst</div>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Header ---------- */
function Header({ onCreate }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <header className="h-16 shrink-0 flex items-center gap-3 px-6 border-b" style={{ borderColor: T.border }}>
      {/* Search */}
      <div className="flex items-center gap-2.5 h-11 rounded-full px-4 transition-all"
        style={{
          width: 480, maxWidth: "46%",
          background: focus ? "#fff" : "#f1f3f4",
          boxShadow: focus ? `0 0 0 2px ${T.primary}33` : "none",
          border: `1px solid ${focus ? T.primary : "transparent"}`,
        }}>
        <Icon name="search" size={19} style={{ color: T.textSecondary }} />
        <input
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          placeholder="Tìm kiếm dự án, tài liệu, user story…"
          className="flex-1 bg-transparent outline-none text-[13.5px]"
          style={{ color: T.textPrimary }} />
      </div>

      <div className="flex-1" />

      <IconBtn icon="bell" title="Thông báo" badge />
      <IconBtn icon="help-circle" title="Trợ giúp" />
      <div className="w-px h-7 mx-1" style={{ background: T.border }} />
      <PrimaryBtn icon="plus" size="sm" onClick={onCreate}>Tạo mới</PrimaryBtn>
    </header>
  );
}

Object.assign(window, {
  DomainBadge, StatusBadge, PrimaryBtn, GhostBtn, IconBtn, Card,
  SegmentBar, ProgressBar, SectionTitle, Sidebar, Header,
});
