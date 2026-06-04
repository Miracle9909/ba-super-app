/* =========================================================================
   BA Super App v2 — Mock data. Reuses BA_TOKENS, overrides nav/tabs.
   ========================================================================= */

// 7 industries with brand tints (per design system)
const BA2_INDUSTRIES = [
  { id: "banking",    label: "Banking & Finance", short: "Banking",    bg: "#e8f0fe", fg: "#1967d2", icon: "landmark" },
  { id: "insurance",  label: "Insurance",          short: "Insurance",  bg: "#fce8e6", fg: "#c5221f", icon: "briefcase" },
  { id: "fintech",    label: "Fintech",            short: "Fintech",    bg: "#e6f4ea", fg: "#137333", icon: "circle-dollar-sign" },
  { id: "ecom",       label: "E-commerce",         short: "E-commerce", bg: "#fef7e0", fg: "#b06000", icon: "shopping-cart" },
  { id: "saas",       label: "SaaS",               short: "SaaS",       bg: "#e8eaff", fg: "#3f51b5", icon: "cloud" },
  { id: "healthcare", label: "Healthcare",         short: "Healthcare", bg: "#e6f4ea", fg: "#0b8043", icon: "heart-pulse" },
  { id: "game",       label: "Game",               short: "Game",       bg: "#f3e8fd", fg: "#8430ce", icon: "gamepad-2" },
];

// ===== Template tones & preset categories (library) =====
const BA2_TPL_TONES = {
  indigo: { bg: "#e8f0fe", fg: "#1967d2" },
  purple: { bg: "#f3e8fd", fg: "#8430ce" },
  sky:    { bg: "#e0f2fe", fg: "#0369a1" },
  green:  { bg: "#e6f4ea", fg: "#137333" },
  amber:  { bg: "#fef7e0", fg: "#b06000" },
  rose:   { bg: "#fce8e6", fg: "#c5221f" },
  slate:  { bg: "#eef2f7", fg: "#475569" },
};

const BA2_TEMPLATE_CATEGORIES = [
  // — Core spec —
  { id: "brd",      label: "BRD",                  group: "Đặc tả",      icon: "file-pen-line",    accept: ".doc,.docx,.pdf,.md",        hint: ".doc · .docx · .pdf · .md",        tone: "indigo" },
  { id: "srs",      label: "SRS",                  group: "Đặc tả",      icon: "scroll-text",      accept: ".doc,.docx,.pdf,.md",        hint: ".doc · .docx · .pdf · .md",        tone: "purple" },
  { id: "tech",     label: "Kỹ thuật / Architecture", group: "Đặc tả",   icon: "file-text",        accept: ".doc,.docx,.pdf,.md,.xls,.xlsx", hint: ".doc · .pdf · .md · .xlsx",    tone: "sky" },
  { id: "usecase",  label: "Use Case",             group: "Đặc tả",      icon: "git-branch",       accept: ".doc,.docx,.md",             hint: ".doc · .docx · .md",               tone: "purple" },
  { id: "ac",       label: "Acceptance Criteria", group: "Đặc tả",      icon: "check-circle",     accept: ".doc,.docx,.md",             hint: ".doc · .docx · .md",               tone: "green" },
  // — Commercial / planning —
  { id: "quote",    label: "Báo giá",              group: "Thương mại",  icon: "coins",            accept: ".doc,.docx,.xls,.xlsx,.pdf", hint: ".docx · .xlsx · .pdf",             tone: "amber" },
  { id: "estimate", label: "Estimation",           group: "Thương mại",  icon: "calculator",       accept: ".xls,.xlsx,.doc,.docx,.pdf", hint: ".xlsx · .docx · .pdf",             tone: "amber" },
  { id: "rfp",      label: "RFP Response",         group: "Thương mại",  icon: "file-text",        accept: ".doc,.docx,.pdf",            hint: ".doc · .docx · .pdf",              tone: "indigo" },
  { id: "funcs",    label: "Function list",        group: "Lập kế hoạch", icon: "list-tree",       accept: ".xls,.xlsx,.doc,.docx,.md",  hint: ".xlsx · .docx · .md",              tone: "sky" },
  // — QA / governance —
  { id: "testplan", label: "Test Plan",            group: "Chất lượng",   icon: "badge-check",     accept: ".doc,.docx,.xls,.xlsx,.pdf", hint: ".docx · .xlsx · .pdf",             tone: "rose" },
  { id: "risk",     label: "Risk Register",        group: "Chất lượng",   icon: "alert-triangle",  accept: ".xls,.xlsx,.doc,.docx",      hint: ".xlsx · .docx",                    tone: "rose" },
  // — User-facing —
  { id: "guide",    label: "User Guide",           group: "Hướng dẫn",    icon: "book-copy",       accept: ".doc,.docx,.pdf,.md",        hint: ".doc · .docx · .pdf · .md",        tone: "green" },
];

const BA2_NAV = [
  { id: "dashboard", label: "Tổng quan",         icon: "layout-dashboard", screen: "dashboard" },
  { id: "projects",  label: "Quản lý dự án",      icon: "folder-open",       screen: "workspace", tab: "info" },
  { id: "knowledge", label: "Tri thức",           icon: "graduation-cap",    screen: "workspace", tab: "discovery" },
  { id: "tasks",     label: "Tác vụ",             icon: "square-kanban",     screen: "workspace", tab: "tasks" },
  { id: "reports",   label: "Báo cáo",            icon: "bar-chart-3",       screen: "workspace", tab: "output" },
];

// 5 tabs ánh xạ 4 lớp (Input split thành Info+Sources)
const BA2_TABS = [
  { id: "info",      label: "Thông tin",          icon: "info" },
  { id: "sources",   label: "Nguồn dữ liệu",      icon: "upload" },
  { id: "discovery", label: "Khai phá",           icon: "messages-square" },
  { id: "tasks",     label: "Tác vụ",             icon: "square-kanban" },
  { id: "output",    label: "Báo cáo & Xuất",      icon: "file-down-2" },
];

// ===== Projects =====
const BA2_PROJECTS = {
  bidv: {
    id: "bidv", name: "BIDV Home GĐ3", industry: "banking",
    created: "28/05/2026", updated: "2 giờ trước", readiness: 65,
    goal: "Mở rộng gói vay mua nhà — giai đoạn 3, tự động thẩm định & chấm điểm.",
    compliance: "NHNN, PCI-DSS (minh hoạ)",
    templates: { srs: true, brd: true, tech: false, guide: false },
    tplFiles: {
      brd:      [{ name: "BIDV-BRD-template-v2.docx", size: 248320 }, { name: "BIDV-BRD-glossary.md", size: 8120 }],
      srs:      [{ name: "SRS-banking-2024.docx", size: 312456 }],
      estimate: [{ name: "Estimation-model.xlsx", size: 142000 }],
      quote:    [{ name: "BIDV-baogia-template.docx", size: 86400 }],
      funcs:    [{ name: "Function-list-template.xlsx", size: 64200 }],
    },
    creator: "BA",
  },
  mbl: {
    id: "mbl", name: "MBL Insurance Platform", industry: "insurance",
    created: "20/05/2026", updated: "1 ngày trước", readiness: 78,
    goal: "Nền tảng bảo hiểm số: quản lý hợp đồng, bồi thường, kênh phân phối đa điểm chạm.",
    compliance: "Bộ Tài chính, IFRS17 (minh hoạ)",
    templates: { srs: true, brd: true, tech: true, guide: false },
    tplFiles: {
      brd:      [{ name: "MBL-BRD-standard.docx", size: 198400 }],
      srs:      [{ name: "IFRS17-SRS-template.pdf", size: 1024500 }, { name: "SRS-checklist.md", size: 4200 }],
      tech:     [{ name: "Tech-arch-spec.docx", size: 320000 }, { name: "DB-schema.xlsx", size: 156000 }],
      testplan: [{ name: "MBL-TestPlan-template.docx", size: 92000 }],
      risk:     [{ name: "Risk-register-IFRS17.xlsx", size: 78400 }],
    },
    creator: "BA",
  },
};

// ===== Dashboard stats =====
const BA2_STATS = [
  { value: "2",   label: "Tổng dự án",   icon: "folder-open", tintBg: "#e8f0fe", tintFg: "#1967d2" },
  { value: "12",  label: "User Stories", icon: "file-text",   tintBg: "#e6f4ea", tintFg: "#137333" },
  { value: "4",   label: "BRD / SRS",    icon: "book-copy",   tintBg: "#f3e8fd", tintFg: "#8430ce" },
  { value: "85%", label: "Quality Score",icon: "gauge",       tintBg: "#fef7e0", tintFg: "#b06000" },
];

// ===== Sources (same 3 documents) =====
const BA2_CHANNELS_MAIN = [
  { icon: "file-text", label: "Paste Text", desc: "Dán nội dung HSYC, notes…" },
  { icon: "upload",    label: "Upload File", desc: ".docx · .pdf · .md" },
  { icon: "link-2",    label: "URL Fetch",  desc: "Jira · Confluence · web" },
];
const BA2_CHANNELS_COMING = [
  { icon: "mail",             label: "Email Forward",     desc: "Chuyển email vào dự án" },
  { icon: "layout-template",  label: "Template-as-source", desc: "Lấy mẫu sẵn làm khung" },
];
const BA2_SOURCES = [
  { icon: "file-text", name: "HSYC-BIDV Home GD3.docx",      meta: "Loại: RFP · 15,018 ký tự · Nạp: 28/05/2026", status: "done" },
  { icon: "scroll-text", name: "Meeting Notes - Kick-off",    meta: "Loại: Notes · 2,300 ký tự · Nạp: 27/05/2026", status: "pending" },
  { icon: "link-2",    name: "https://jira.bidv.com/wiki/HSYC", meta: "Loại: URL · 8,500 ký tự · Nạp: 26/05/2026", status: "done" },
];

// ===== Discovery (Banking expert) =====
const BA2_CHAT = [
  { role: "ai", text: "Chào BA. Tôi là chuyên gia ngành Banking — chuyên gói vay tiêu dùng & thế chấp. Hãy bắt đầu từ phạm vi sản phẩm: dự án này tập trung loại vay nào?",
    chips: ["Vay mua nhà", "Vay tiêu dùng", "Cả hai"], defaultChip: 0,
    sources: ["HSYC.docx"] },
  { role: "user", text: "Vay mua nhà — giai đoạn 3 mở rộng cho phân khúc trung lưu." },
  { role: "ai", text: "OK. Hồ sơ vay mua nhà cần thẩm định tài sản đảm bảo. Theo HSYC, định giá lấy từ đơn vị nội bộ hay đối tác độc lập?",
    chips: ["Đối tác độc lập", "Nội bộ", "Cả hai (theo hạn mức)"], defaultChip: 0,
    sources: ["HSYC.docx §3.2"] },
  { role: "user", text: "Đối tác độc lập cho khoản > 2 tỷ; nội bộ cho khoản nhỏ hơn." },
  { role: "ai", text: "Đã ghi nhận. Tỷ lệ vay tối đa theo định giá (LTV) thường 70%. Dự án này có ngưỡng riêng?",
    chips: ["Giữ 70%", "65% — bảo thủ", "75% — khách VIP"], defaultChip: 0,
    sources: ["HSYC.docx §4.1", "Meeting Notes"] },
];

// Knowledge auto-grown from chat — each item has source or "giả định"
const BA2_KB_ENTITIES = [
  { name: "Khách hàng",       icon: "user",        attrs: ["id","Họ tên","CCCD","Thu nhập","Nhóm KH"], src: "HSYC.docx" },
  { name: "Hồ sơ vay",        icon: "file-text",   attrs: ["Mã HS","Loại vay","Trạng thái"],            src: "HSYC.docx" },
  { name: "Tài sản đảm bảo",   icon: "building-2",  attrs: ["Loại","Định giá","Đơn vị định giá"],         src: "HSYC §3.2" },
  { name: "Khoản vay",        icon: "coins",       attrs: ["Số tiền","Lãi suất","LTV","Kỳ hạn"],         src: null },
];

const BA2_KB_RULES = [
  { id: "BR-01", text: "LTV ≤ 70% giá trị TSĐB (mặc định)",          src: "HSYC §4.1" },
  { id: "BR-02", text: "Khoản > 2 tỷ phải định giá bởi đối tác độc lập", src: "chat" },
  { id: "BR-03", text: "Tuổi người vay ≤ 65 khi tất toán",            src: null },
  { id: "BR-04", text: "DTI ≤ 50% tổng thu nhập tháng",                src: "HSYC §5" },
];

const BA2_KB_GLOSSARY = [
  { term: "HSYC",     def: "Hồ sơ yêu cầu", src: "HSYC.docx" },
  { term: "TSĐB",     def: "Tài sản đảm bảo", src: "HSYC.docx" },
  { term: "LTV",      def: "Loan-to-Value", src: null },
  { term: "Tất toán",  def: "Hoàn tất thanh toán toàn bộ", src: null },
];

// ===== Task hub =====
const BA2_TASK_CARDS = [
  { id: "new",      icon: "file-plus-2", title: "Yêu cầu mới",   desc: "Tạo 1 requirement chuẩn EARS + AC + trace" },
  { id: "funcs",    icon: "list-tree",   title: "Function list", desc: "Cây Module → Feature → Function" },
  { id: "estimate", icon: "calculator",  title: "Estimate",      desc: "Complexity 1–10 · Story point · Man-day" },
  { id: "enhance",  icon: "wand-2",      title: "Enhance",        desc: "Impact analysis cho thay đổi yêu cầu" },
];

// (a) New requirement (EARS demo)
const BA2_NEW_REQ = {
  id: "US-08",
  ears: "Khi khách hàng nộp hồ sơ vay mua nhà có TSĐB > 2 tỷ, hệ thống PHẢI tự động gửi yêu cầu định giá tới đối tác độc lập trong vòng 4 giờ làm việc.",
  ac: [
    { g: "Khách hàng đã nộp hồ sơ với TSĐB > 2 tỷ", w: "Hồ sơ chuyển trạng thái 'Cần định giá'",
      t: "Hệ thống gửi request tới đối tác độc lập kèm metadata TSĐB" },
    { g: "Đối tác độc lập chưa phản hồi sau 4 giờ",   w: "Hết SLA",
      t: "Hệ thống gửi nhắc tự động + alert tới BA Manager" },
  ],
  score: 82,
  trace: { us: "US-08", brd: "BRD-REQ-12", fr: "SRS-FR-031", tc: "TC-088" },
};

// (b) Function tree
const BA2_FUNC_TREE = [
  { id: "M-LOAN", name: "Loan Management", kind: "Module", children: [
    { id: "F-APPL", name: "Tiếp nhận hồ sơ", kind: "Feature", children: [
      { id: "FUNC-101", name: "Tạo hồ sơ vay",         hasReq: true },
      { id: "FUNC-102", name: "Tải tài liệu HSYC",      hasReq: true },
      { id: "FUNC-103", name: "Kiểm tra CCCD",          hasReq: true },
    ]},
    { id: "F-VAL", name: "Định giá TSĐB", kind: "Feature", children: [
      { id: "FUNC-110", name: "Gửi yêu cầu định giá",    hasReq: true },
      { id: "FUNC-111", name: "Nhận kết quả định giá",   hasReq: true },
      { id: "FUNC-112", name: "Override định giá",       hasReq: false },
    ]},
    { id: "F-DECI", name: "Quyết định cho vay", kind: "Feature", children: [
      { id: "FUNC-120", name: "Chấm điểm tín dụng",      hasReq: true },
      { id: "FUNC-121", name: "Duyệt / Từ chối",          hasReq: true },
    ]},
  ]},
];

// (c) Estimate rows
const BA2_ESTIMATE = [
  { func: "FUNC-101 · Tạo hồ sơ vay",          complexity: 3, sp: 5,  md: 8  },
  { func: "FUNC-102 · Tải tài liệu HSYC",       complexity: 2, sp: 3,  md: 4  },
  { func: "FUNC-103 · Kiểm tra CCCD",          complexity: 4, sp: 5,  md: 7  },
  { func: "FUNC-110 · Gửi yêu cầu định giá",    complexity: 6, sp: 8,  md: 12 },
  { func: "FUNC-111 · Nhận kết quả định giá",   complexity: 5, sp: 8,  md: 11 },
  { func: "FUNC-112 · Override định giá",       complexity: 8, sp: 13, md: 18, fuzzy: true },
  { func: "FUNC-120 · Chấm điểm tín dụng",      complexity: 9, sp: 21, md: 32, fuzzy: true },
  { func: "FUNC-121 · Duyệt / Từ chối",          complexity: 5, sp: 8,  md: 12 },
];

// (d) Enhance impact analysis
const BA2_IMPACT = [
  { kind: "req",  id: "BRD-REQ-12", text: "Cập nhật ngưỡng định giá độc lập từ 2 tỷ → 1.5 tỷ", label: "Sửa" },
  { kind: "func", id: "FUNC-110",   text: "Thay đổi điều kiện kích hoạt gửi yêu cầu",          label: "Sửa" },
  { kind: "func", id: "FUNC-130",   text: "Tách flow định giá nội bộ cho khoản nhỏ",            label: "Thêm" },
  { kind: "tc",   id: "TC-088",     text: "Bổ sung kịch bản TSĐB ở ngưỡng mới",                 label: "Sửa" },
  { kind: "tc",   id: "TC-061",     text: "Loại bỏ test case cũ cho ngưỡng 2 tỷ",                label: "Bỏ" },
];

// ===== Output / deliverables =====
const BA2_DELIVERABLES = [
  { name: "Discovery Notes",  icon: "file-text",     state: "gate"  },
  { name: "User Story Set",   icon: "book-copy",     state: "gate"  },
  { name: "BRD",              icon: "file-pen-line", state: "draft" },
  { name: "SRS",              icon: "scroll-text",   state: "draft" },
  { name: "Diagram Pack",     icon: "git-branch",    state: "draft" },
  { name: "Sprint Plan",      icon: "square-kanban", state: "draft" },
];

const BA2_TRACE = [
  { us: "US-01", brd: "BRD-REQ-01", fr: "SRS-FR-012", tc: "TC-031" },
  { us: "US-02", brd: "BRD-REQ-02", fr: "SRS-FR-015", tc: "TC-034" },
  { us: "US-08", brd: "BRD-REQ-12", fr: "SRS-FR-031", tc: "TC-088" },
];

const BA2_QUALITY = [
  { axis: "Completeness",  value: 88 },
  { axis: "Consistency",   value: 84 },
  { axis: "Traceability",  value: 90 },
  { axis: "Feasibility",   value: 78 },
];

const BA2_TEMPLATES_LEGACY = ["SRS", "BRD", "Kỹ thuật", "Guide"];
const BA2_FORMATS   = ["MD", "Word", "PDF"];
const BA2_GRANS     = [
  { id: "function",     label: "Theo từng function", desc: "Mỗi FUNC-xx 1 file" },
  { id: "requirement",  label: "Theo từng yêu cầu",   desc: "Mỗi US/BRD-REQ 1 file" },
  { id: "all",          label: "Tất cả",              desc: "Trọn bộ deliverable" },
];

Object.assign(window, {
  BA2_INDUSTRIES, BA2_TPL_TONES, BA2_TEMPLATE_CATEGORIES,
  BA2_NAV, BA2_TABS, BA2_PROJECTS, BA2_STATS,
  BA2_CHANNELS_MAIN, BA2_CHANNELS_COMING, BA2_SOURCES,
  BA2_CHAT, BA2_KB_ENTITIES, BA2_KB_RULES, BA2_KB_GLOSSARY,
  BA2_TASK_CARDS, BA2_NEW_REQ, BA2_FUNC_TREE, BA2_ESTIMATE, BA2_IMPACT,
  BA2_DELIVERABLES, BA2_TRACE, BA2_QUALITY,
  BA2_FORMATS, BA2_GRANS,
});
