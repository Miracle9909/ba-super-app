/* =========================================================================
   BA Super App — Mock data (inline, no network). All in const at top.
   ========================================================================= */

const BA_TOKENS = {
  appBg: "#f0f4f9", surface: "#ffffff", hover: "#f1f3f4", active: "#e8f0fe",
  textPrimary: "#202124", textSecondary: "#5f6368", textDisabled: "#9aa0a6",
  primary: "#0b57d0", primaryHover: "#0842a0", primaryContainer: "#d3e3fd",
  onPrimaryContainer: "#041e49", border: "#dadce0",
};

// 7 domains hỗ trợ (Banking được chọn cho dự án demo)
const BA_DOMAINS = [
  "Banking & Finance", "Insurance", "Fintech", "E-commerce", "SaaS", "Healthcare", "Game",
];

const BA_NAV = [
  { id: "dashboard", label: "Tổng quan", icon: "layout-dashboard", screen: "dashboard" },
  { id: "projects", label: "Quản lý dự án", icon: "folder-open", screen: "workspace", tab: "info" },
  { id: "knowledge", label: "Tri thức (Knowledge)", icon: "graduation-cap", screen: "workspace", tab: "knowledge" },
  { id: "pipeline", label: "Pipeline & Tiến độ", icon: "square-kanban", screen: "workspace", tab: "pipeline" },
  { id: "reports", label: "Báo cáo phân tích", icon: "bar-chart-3", screen: "workspace", tab: "reports" },
];

const BA_TABS = [
  { id: "info", label: "Thông tin dự án", icon: "info" },
  { id: "sources", label: "Nguồn dữ liệu", icon: "upload" },
  { id: "knowledge", label: "Tri thức dự án", icon: "brain-circuit" },
  { id: "pipeline", label: "Pipeline", icon: "square-kanban" },
  { id: "reports", label: "Báo cáo", icon: "bar-chart-3" },
];

// ===== Projects =====
const BA_PROJECTS = {
  bidv: {
    id: "bidv", name: "BIDV Home GĐ3", domain: "Banking", domainFull: "Banking & Finance",
    created: "28/05/2026", updated: "2 giờ trước", readiness: 65,
    phase: "Discovery (1/6)", phaseStep: 1, sourceType: "RFP/HSYC",
    scale: "~15–60 user story", compliance: "NHNN, PCI-DSS (minh hoạ)",
    desc: "Gói vay mua nhà BIDV — giai đoạn 3. Mở rộng luồng thẩm định tự động, tích hợp định giá tài sản đảm bảo và chấm điểm tín dụng theo chuẩn nội bộ.",
    creator: "BA",
  },
  mbl: {
    id: "mbl", name: "MBL Insurance Platform", domain: "Insurance", domainFull: "Insurance",
    created: "20/05/2026", updated: "1 ngày trước", readiness: 78,
    phase: "BRD (3/6)", phaseStep: 3, sourceType: "RFP/HSYC",
    scale: "~30–80 user story", compliance: "Bộ Tài chính, IFRS17 (minh hoạ)",
    desc: "Nền tảng bảo hiểm số MBL — quản lý hợp đồng, bồi thường và kênh phân phối đa điểm chạm cho khách hàng cá nhân.",
    creator: "BA",
  },
};

// ===== Dashboard stats =====
const BA_STATS = [
  { value: "2", label: "Tổng dự án", icon: "folder-open", tintBg: "#e8f0fe", tintFg: "#1967d2" },
  { value: "12", label: "User Stories", icon: "file-text", tintBg: "#e6f4ea", tintFg: "#137333" },
  { value: "4", label: "BRD / SRS", icon: "book-copy", tintBg: "#f3e8fd", tintFg: "#8430ce" },
  { value: "85%", label: "Quality Score", icon: "gauge", tintBg: "#fef7e0", tintFg: "#b06000" },
];

const BA_QUICK_ACTIONS = [
  { icon: "layout-template", title: "Tạo từ mẫu (Template)", desc: "Dùng framework chuẩn cho Banking, Insurance…", tintBg: "#e8f0fe", tintFg: "#1967d2" },
  { icon: "upload", title: "Import tài liệu", desc: "Tải lên .docx, .pdf hoặc .md để bắt đầu", tintBg: "#e6f4ea", tintFg: "#137333" },
  { icon: "link-2", title: "Khởi tạo từ URL", desc: "Nhập link tài liệu online (Jira, Confluence…)", tintBg: "#f3e8fd", tintFg: "#8430ce" },
];

// ===== Sources tab =====
const BA_CHANNELS = [
  { icon: "file-text", label: "Paste Text" },
  { icon: "upload", label: "Upload File" },
  { icon: "link-2", label: "URL Fetch" },
  { icon: "mail", label: "Email Forward" },
  { icon: "layout-template", label: "Template" },
];

const BA_SOURCES = [
  { icon: "file-text", name: "HSYC-BIDV Home GD3.docx", meta: "Loại: RFP · 15,018 ký tự · Nạp: 28/05/2026", status: "done" },
  { icon: "scroll-text", name: "Meeting Notes - Kick-off", meta: "Loại: Notes · 2,300 ký tự · Nạp: 27/05/2026", status: "pending" },
  { icon: "link-2", name: "https://jira.bidv.com/wiki/HSYC", meta: "Loại: URL · 8,500 ký tự · Nạp: 26/05/2026", status: "done" },
];

// ===== Knowledge tab (minh hoạ cho Banking) =====
const BA_ENTITIES = [
  { name: "Khách hàng", icon: "user", attrs: ["id", "Họ tên", "CCCD", "Thu nhập", "Nhóm KH"] },
  { name: "Hồ sơ vay", icon: "file-text", attrs: ["Mã HS", "Loại vay", "Trạng thái", "Ngày nộp"] },
  { name: "Khoản vay", icon: "coins", attrs: ["Mã KV", "Số tiền", "Lãi suất", "Kỳ hạn", "LTV"] },
  { name: "Tài sản đảm bảo", icon: "building-2", attrs: ["Mã TSĐB", "Loại", "Định giá", "Tỷ lệ"] },
  { name: "Lịch trả nợ", icon: "calendar", attrs: ["Kỳ", "Gốc", "Lãi", "Ngày đến hạn"] },
];

const BA_RULES = [
  { id: "BR-01", text: "Tỷ lệ vay tối đa 70% giá trị TSĐB" },
  { id: "BR-02", text: "Tuổi người vay ≤ 65 khi tất toán" },
  { id: "BR-03", text: "Chứng minh thu nhập là bắt buộc" },
  { id: "BR-04", text: "Tỷ lệ DTI ≤ 50% tổng thu nhập tháng" },
  { id: "BR-05", text: "TSĐB phải được định giá bởi đơn vị độc lập" },
];

const BA_GLOSSARY = [
  { term: "HSYC", def: "Hồ sơ yêu cầu — tài liệu mô tả nhu cầu nghiệp vụ từ khách hàng" },
  { term: "TSĐB", def: "Tài sản đảm bảo cho khoản vay (bất động sản, sổ tiết kiệm…)" },
  { term: "LTV", def: "Loan-to-Value — tỷ lệ khoản vay trên giá trị tài sản đảm bảo" },
  { term: "Giải ngân", def: "Quá trình ngân hàng chuyển tiền vay cho khách hàng" },
  { term: "Tất toán", def: "Hoàn tất thanh toán toàn bộ dư nợ và đóng khoản vay" },
];

// ===== Pipeline tab =====
// status: done | running | locked ; gates per gate: pass | running | pending
const BA_GATES = ["Completeness", "Consistency", "Traceability", "Feasibility"];
const BA_PIPELINE = [
  { code: "M1", vn: "Khám phá", module: "Discovery", status: "done",
    gates: ["pass", "pass", "pass", "pass"] },
  { code: "M2", vn: "Câu chuyện người dùng", module: "User Story", status: "running",
    gates: ["running", "pending", "pending", "running"] },
  { code: "M3", vn: "Yêu cầu nghiệp vụ", module: "BRD", status: "locked",
    gates: ["pending", "pending", "pending", "pending"] },
  { code: "M4", vn: "Đặc tả YC phần mềm", module: "SRS", status: "locked",
    gates: ["pending", "pending", "pending", "pending"] },
  { code: "M5", vn: "Sơ đồ", module: "Diagram", status: "locked",
    gates: ["pending", "pending", "pending", "pending"] },
  { code: "M6", vn: "Lập kế hoạch", module: "Sprint", status: "locked",
    gates: ["pending", "pending", "pending", "pending"] },
];

// ===== Reports tab =====
const BA_DELIVERABLES = [
  { name: "Discovery Notes", icon: "file-text", state: "gate" },
  { name: "User Story Set", icon: "book-copy", state: "draft" },
  { name: "BRD", icon: "file-pen-line", state: "draft" },
  { name: "SRS", icon: "scroll-text", state: "draft" },
  { name: "Diagram Pack", icon: "git-branch", state: "draft" },
  { name: "Sprint Plan", icon: "square-kanban", state: "draft" },
];

const BA_TRACE = [
  { us: "US-01", brd: "BRD-REQ-01", fr: "FR-012", tc: "TC-031" },
  { us: "US-02", brd: "BRD-REQ-02", fr: "FR-015", tc: "TC-034" },
  { us: "US-03", brd: "BRD-REQ-03", fr: "FR-019", tc: "TC-041" },
  { us: "US-04", brd: "BRD-REQ-05", fr: "FR-022", tc: "TC-047" },
];

const BA_QUALITY = [
  { axis: "Completeness", value: 88 },
  { axis: "Consistency", value: 84 },
  { axis: "Traceability", value: 90 },
  { axis: "Feasibility", value: 78 },
];

Object.assign(window, {
  BA_TOKENS, BA_DOMAINS, BA_NAV, BA_TABS, BA_PROJECTS, BA_STATS, BA_QUICK_ACTIONS,
  BA_CHANNELS, BA_SOURCES, BA_ENTITIES, BA_RULES, BA_GLOSSARY, BA_GATES, BA_PIPELINE,
  BA_DELIVERABLES, BA_TRACE, BA_QUALITY,
});
