<!--
  Document ID: DESIGNPROMPT-BASUPER-SCREENS-1.0
  Date: 2026-06-03
  Version: 1.0
  Status: Ready-to-use
  Target tool: Claude (claude.ai) — artifact React + Tailwind (prototype TƯƠNG TÁC nhiều màn)
  Mục đích: prompt để claude.ai dựng prototype tương tác các màn BA Super App
            (Dashboard + Workspace 5 tab), bám ĐÚNG design system Google Stitch/Material 3 thật
            (02-web-app/styles.css), nội dung từ vision.md + product-brief.md + user-flows.md + web-app hiện có.
            Định hướng: NÂNG CẤP polish (không phải vẽ lại), KHÔNG bịa.
  Cách dùng: mở claude.ai (Sonnet/Opus, bật Artifacts) → (tuỳ chọn) đính kèm screenshot index.html + workspace.html
            để Claude bám sát hơn → dán TOÀN BỘ khối ``` bên dưới → render artifact → bấm thử (sidebar/tab/mở dự án).
-->

# Prompt — dựng prototype tương tác các màn BA Super App (claude.ai artifact)

> Dán phần trong khối ```text dưới đây vào claude.ai. (Tuỳ chọn) đính kèm ảnh `index.html` + `workspace.html` để bám style.

```text
<role>
Bạn là Senior Product Designer + Senior Front-end Engineer (React, Tailwind, Material Design 3). Hãy tạo MỘT artifact React + Tailwind DUY NHẤT, tự chứa, chạy ngay trong preview của claude.ai: một PROTOTYPE TƯƠNG TÁC nhiều màn của web app "BA Super App" — bấm thử được như app thật (điều hướng sidebar, chuyển tab, mở dự án bằng React state). Phong cách thị giác: "Google Stitch / Material 3" (clean, rounded, light) — NÂNG CẤP polish cao cấp, đồng bộ, đẹp hơn prototype hiện tại NHƯNG GIỮ NGUYÊN DNA (màu, brand, bố cục) ở spec bên dưới.
</role>

<san_pham>
BA Super App = web app biến một AI tổng quát thành Senior Business Analyst, chạy pipeline 6 bước Discovery → User Story → BRD → SRS → Diagram → Sprint, có Quality Gate + Traceability xuyên suốt, domain-adaptive (Banking/Insurance/Fintech/E-commerce/SaaS/Healthcare/Game). Người dùng: Business Analyst, Product Owner, Solution Consultant. (Đây là BỐI CẢNH để bạn hiểu nội dung — KHÔNG thêm tính năng ngoài spec.)
</san_pham>

<man_hinh_can_dung>
HAI màn chính, điều hướng bằng React state (KHÔNG dùng router lib):

A. DASHBOARD "Tổng quan"
- Khung Sidebar (trái) + Main (phải) như <khung_layout>.
- Welcome banner nền gradient nhẹ (primary-container → #e8f0fe): tiêu đề "Xin chào, Business Analyst 👋", phụ "Bạn có 2 dự án đang hoạt động. Hãy tiếp tục công việc hoặc bắt đầu dự án mới." + nút "Tạo dự án mới".
- Hàng 4 stat-card (mỗi card icon nền tint riêng + số lớn + nhãn): [2] Tổng dự án · [12] User Stories · [4] BRD / SRS · [85%] Quality Score.
- Lưới 2:1 —
   TRÁI "Dự án gần đây" (2 project-card; bấm vào → MỞ Workspace của dự án đó):
     • "BIDV Home GĐ3" — badge "Banking" — thanh progress 6 đoạn, 1 đoạn active — meta "Cập nhật: 2 giờ trước · Phase: Discovery (1/6)".
     • "MBL Insurance Platform" — badge "Insurance" — progress 3/6 active — meta "Cập nhật: 1 ngày trước · Phase: BRD (3/6)".
   PHẢI "Bắt đầu nhanh" (3 quick-action-card icon + tiêu đề + mô tả):
     • "Tạo từ mẫu (Template)" — "Dùng framework chuẩn cho Banking, Insurance…"
     • "Import tài liệu" — "Tải lên .docx, .pdf hoặc .md để bắt đầu"
     • "Khởi tạo từ URL" — "Nhập link tài liệu online (Jira, Confluence…)"

B. WORKSPACE (mở khi bấm 1 dự án; mặc định demo = "BIDV Home GĐ3")
- Workspace header: tên dự án + badge domain + nút settings nhỏ; dòng meta "Tạo: 28/05/2026 · Cập nhật: 2 giờ trước · Readiness: 65%".
- Tab bar 5 tab (chuyển bằng state; mỗi tab có icon + nhãn; tab active = chữ primary + underline 2px primary):
   1) Thông tin dự án   2) Nguồn dữ liệu   3) Tri thức dự án   4) Pipeline   5) Báo cáo
- PHẢI dựng ĐỦ nội dung cả 5 tab theo <noi_dung_tab> (KHÔNG để trống/placeholder).
</man_hinh_can_dung>

<noi_dung_tab>
1) THÔNG TIN DỰ ÁN — dạng "read view" 2 cột card, hiển thị giá trị:
   Tên: BIDV Home GĐ3 · Domain: Banking & Finance · Loại nguồn: RFP/HSYC · Quy mô mục tiêu: ~15–60 user story · Compliance: NHNN, PCI-DSS (minh hoạ) · Mô tả ngắn 2–3 dòng (gói vay mua nhà BIDV — giai đoạn 3) · Readiness 65% (thanh tiến độ) · Người tạo: BA. Thêm hàng chip 7 domain hỗ trợ với "Banking" được chọn.

2) NGUỒN DỮ LIỆU — "Trung tâm nạp dữ liệu" + phụ đề "Nạp tài liệu thô, HSYC, meeting notes để AI tự động phân tích và trích xuất tri thức.":
   - 5 channel-card (viền dashed, hover đổi nền/viền primary; icon + nhãn): Paste Text · Upload File · URL Fetch · Email Forward · Template.
   - Header "Tài liệu đã nạp (3)" + nút "Parse tất cả". 3 source-item (icon · tên · meta · badge trạng thái · 3 nút action xem/parse/xoá):
     • "HSYC-BIDV Home GD3.docx" — "Loại: RFP · 15,018 ký tự · Nạp: 28/05/2026" — "Đã xử lý" (xanh).
     • "Meeting Notes - Kick-off" — "Loại: Notes · 2,300 ký tự · Nạp: 27/05/2026" — "Chờ xử lý" (vàng).
     • "https://jira.bidv.com/wiki/HSYC" — "Loại: URL · 8,500 ký tự · Nạp: 26/05/2026" — "Đã xử lý" (xanh).

3) TRI THỨC DỰ ÁN — domain model 3 khối (dữ liệu MINH HOẠ hợp lý cho dự án Banking — ghi rõ "mẫu"):
   - Entities (thẻ/bảng, mỗi entity vài thuộc tính): Khách hàng · Hồ sơ vay · Khoản vay · Tài sản đảm bảo · Lịch trả nợ.
   - Business Rules (danh sách mã BR-xx): vd "BR-01 Tỷ lệ vay tối đa 70% giá trị TSĐB", "BR-02 Tuổi người vay ≤ 65 khi tất toán", "BR-03 Chứng minh thu nhập bắt buộc".
   - Glossary (bảng Thuật ngữ ↔ Định nghĩa): HSYC · TSĐB · LTV · Giải ngân · Tất toán.

4) PIPELINE — LÕI GIÁ TRỊ. 6 bước dạng stepper dọc (hoặc cột kanban), mỗi bước 1 card:
   M1 Discovery (Khám phá) · M2 User Story (Câu chuyện người dùng) · M3 BRD (YC nghiệp vụ) · M4 SRS (Đặc tả YC phần mềm) · M5 Diagram (Sơ đồ) · M6 Sprint (Lập kế hoạch).
   Mỗi card có: mã + tên VN + tên module, badge trạng thái (Hoàn thành ✓ / Đang chạy / Đang khoá), và khối "Quality Gate" gồm 4 chip Completeness · Consistency · Traceability · Feasibility (pass = xanh, chưa = xám/vàng).
   Trạng thái demo cho BIDV: M1 = Hoàn thành (gate PASS) · M2 = Đang chạy (gate đang chạy) · M3–M6 = Đang khoá. Có nút tĩnh "Chạy bước tiếp" và "Refine (≤3 vòng)". Quy tắc fail-closed: bước sau khoá đến khi gate bước trước PASS (chỉ thể hiện thị giác).

5) BÁO CÁO — deliverable + traceability:
   - Lưới deliverable (tài liệu đã sinh, mỗi cái: icon · tên · badge "Nháp"/"Đạt gate" · nút Xem/Export): Discovery Notes · User Story Set · BRD · SRS · Diagram Pack · Sprint Plan.
   - Bảng Traceability (cột US-ID → BRD-REQ → SRS-FR → TC-ID; vài hàng mẫu: US-01 → BRD-REQ-01 → FR-012 → TC-031; US-02 → BRD-REQ-02 → FR-015 → TC-034…).
   - Thẻ "Quality Score 85%" + breakdown 4 trục (Completeness/Consistency/Traceability/Feasibility). Có thể dùng 1 biểu đồ nhỏ (donut hoặc bar) nếu gọn.
</noi_dung_tab>

<design_system>  (BÁM ĐÚNG token — trích từ styles.css thật)
Màu: app-bg #f0f4f9 · surface #ffffff · hover #f1f3f4 · active #e8f0fe · text-primary #202124 · text-secondary #5f6368 · text-disabled #9aa0a6 · primary #0b57d0 · primary-hover #0842a0 · primary-container #d3e3fd · on-primary-container #041e49 · border #dadce0.
Badge domain: Banking nền #e8f0fe / chữ #1967d2 · Insurance nền #fce8e6 / chữ #c5221f.
Status: "Đã xử lý / PASS" nền #e6f4ea / chữ #137333 · "Chờ xử lý / đang chạy" nền #fef7e0 / chữ #b06000.
Stat icon tint: blue #e8f0fe/#1967d2 · green #e6f4ea/#137333 · purple #f3e8fd/#8430ce · amber #fef7e0/#b06000.
Bo góc: sm 8px · md 12px · lg 24px · pill 9999px. Shadow Material RẤT nhẹ.
Nav active = nền primary-container #d3e3fd, chữ on-primary-container, bo pill. Tab active = chữ primary + underline 2px primary.
Font: stack "'Google Sans','Product Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif" đặt ở container gốc (tự fallback nếu thiếu).
</design_system>

<khung_layout>
- Toàn app trong app-shell: nền #f0f4f9, padding 12px, cao toàn màn (h-screen), KHÔNG cuộn ngang.
- Sidebar trái ~280px (nền = app-bg, không phải card): brand (icon + chữ "BA Super App"); nhãn nhóm "Menu chính"; 5 nav-item bo pill (Tổng quan · Quản lý dự án · Tri thức (Knowledge) · Pipeline & Tiến độ · Báo cáo phân tích); dưới cùng: "Cài đặt" + user-profile card (avatar tròn primary chữ "BA" · "Người dùng" · "Business Analyst").
- Main phải: surface trắng bo lg (24px) + shadow nhẹ; gồm Header cao 64px (ô search bo pill rộng ~480px có icon kính lúp + 2 icon-btn notifications/help + nút primary "Tạo mới") và vùng canvas cuộn dọc (padding ~32–48px).
</khung_layout>

<tuong_tac>
- State (useState): screen ('dashboard' | 'workspace') · activeTab ('info'|'sources'|'knowledge'|'pipeline'|'reports') · activeProject ('bidv'|'mbl').
- Sidebar: "Tổng quan" → screen=dashboard; "Quản lý dự án" → screen=workspace; bấm brand → dashboard. Nav-item active phản ánh đúng màn hiện tại.
- Dashboard: bấm 1 project-card → set activeProject + screen=workspace + activeTab='sources'. Header workspace + tab Thông tin đổi theo activeProject (BIDV=Banking / MBL=Insurance).
- Workspace: tab bar đổi activeTab → render đúng panel.
- Hiệu ứng: hover card (shadow / dịch nhẹ), focus-ring cho input, transition mượt khi đổi tab/màn. Nút Parse/Export/Chạy-bước KHÔNG cần logic thật (chỉ visual, tối đa console.log).
- TẤT CẢ trong 1 component (được phép tách sub-component nội bộ trong cùng file). Không điều hướng URL thật.
</tuong_tac>

<he_thong_thi_giac>  (nâng cấp polish)
- Material 3: nhịp spacing 4/8; card viền 1px #dadce0 + shadow rất nhẹ; trạng thái truyền tải bằng CẢ màu + nhãn/icon (không chỉ màu).
- Một màu nhấn chủ đạo primary #0b57d0; màu ngữ nghĩa (xanh lá success · vàng/amber pending · đỏ insurance) dùng TIẾT CHẾ, không phủ khắp.
- Tương phản ≥ WCAG AA. Icon line-style đồng bộ một bộ. Bo góc + padding nhất quán toàn app.
- Nhãn UI tiếng Việt; ĐỊNH DANH kỹ thuật giữ nguyên (M1…M6, US/BRD-REQ/FR/TC, tên file, domain).
- Tinh tế hơn prototype: empty-state đẹp, khoảng trắng cân, chuyển cảnh mượt, không vỡ lưới.
</he_thong_thi_giac>

<rang_buoc_ky_thuat>  (artifact claude.ai)
- MỘT file React (function component, default export) + Tailwind utility (ĐƯỢC dùng giá trị tuỳ chỉnh dạng bg-[#0b57d0], text-[#5f6368]…).
- Icon: CHỈ dùng `lucide-react` (có sẵn trong artifact). Ánh xạ Material Symbols → lucide gần nhất: dashboard→LayoutDashboard · folder_open→FolderOpen · school→GraduationCap · view_kanban→KanbanSquare · analytics→BarChart3 · settings→Settings · search→Search · notifications→Bell · help→HelpCircle · add→Plus · upload_file→Upload · link→Link2 · description→FileText · psychology→BrainCircuit · info→Info · verified→BadgeCheck · visibility→Eye · delete→Trash2 · forward_to_inbox→Forward · library_books→BookCopy · edit_document→FilePenLine. Brand icon ≈ DraftingCompass.
- (Tuỳ chọn) `recharts` chỉ cho 1 biểu đồ nhỏ ở tab Báo cáo — phải gọn.
- KHÔNG dùng CDN font/CSS ngoài, KHÔNG fetch mạng, KHÔNG localStorage/sessionStorage (artifact chặn) — mọi dữ liệu là mock inline + React state.
- Dữ liệu mock gom vào const ở đầu component, tách khỏi JSX.
</rang_buoc_ky_thuat>

<output>
- Xuất ĐẦY ĐỦ code 1 file React, chạy ngay, KHÔNG rút gọn bằng "// tương tự" / "// ...". Mỗi tab dựng nội dung thật theo <noi_dung_tab>.
- Mở đầu 1–2 câu: đây là prototype tương tác BA Super App, style Google Stitch/Material 3 đã nâng cấp polish, bấm sidebar/tab/dự án để thử.
- Vừa 1 khung desktop (~1280–1440px), không vỡ layout, không cuộn ngang.
</output>

<forbidden>
- KHÔNG thêm màn/tab/tính năng ngoài spec (không auth, không dark-mode toggle, không trang Cài đặt chi tiết, không backend giả, không i18n switcher).
- KHÔNG bịa số liệu thành "sự thật" — giữ đúng mock đã cho; domain model ở tab Tri thức ghi rõ là minh hoạ.
- KHÔNG đổi hệ màu/brand cho "đẹp" — bám token Google Stitch ở <design_system>.
- Làm CHÍNH XÁC yêu cầu, KHÔNG over-engineer, không thêm abstraction/thư viện thừa.
</forbidden>
```

---
*Bản đồng hành (tuỳ chọn): prompt riêng cho màn **Budget dashboard** nền tối/glassmorphism (`budget_dashboard.html`) — sinh khi cần, vì đó là ngôn ngữ thị giác khác (dark, Inter, data-dense), không trộn vào app light Material 3.*
