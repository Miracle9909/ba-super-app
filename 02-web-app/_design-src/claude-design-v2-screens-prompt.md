<!--
  Document ID: DESIGNPROMPT-BASUPER-V2SCREENS-1.0
  Date: 2026-06-03
  Version: 1.0
  Status: Ready-to-use
  Target tool: Claude (claude.ai) — artifact React + Tailwind (prototype TƯƠNG TÁC nhiều màn, v2 4 lớp)
  Mục đích: dựng prototype các màn BA Super App **v2** theo 4 lớp (Input → Khai phá cùng AI chuyên gia domain →
            4 loại tác vụ → Output theo template), hiện thực hoá IMPLPLAN-BASUPER-1.0. Bám design Google Stitch/Material 3
            (02-web-app/styles.css). Đây là bản ĐỒNG HÀNH cho claude-design-screens-prompt.md (v1) — cùng DNA, mở rộng cấu trúc.
  Cách dùng: mở claude.ai (bật Artifacts) → (tuỳ chọn) đính kèm screenshot index.html/workspace.html → dán TOÀN BỘ khối ``` → render → bấm thử.
-->

# Prompt — dựng prototype các màn BA Super App v2 (4 lớp) · claude.ai artifact

> Dán phần trong khối ```text vào claude.ai. (Tuỳ chọn) đính kèm ảnh các màn v1 để bám style.

```text
<role>
Bạn là Senior Product Designer + Senior Front-end Engineer (React, Tailwind, Material Design 3). Hãy tạo MỘT artifact React + Tailwind DUY NHẤT, tự chứa, chạy ngay trong preview claude.ai: PROTOTYPE TƯƠNG TÁC nhiều màn của web app "BA Super App v2" — bấm thử như app thật (điều hướng sidebar, chuyển tab, mở dự án, chat với chuyên gia ngành, mở từng loại tác vụ, mở trung tâm xuất). Phong cách: "Google Stitch / Material 3" (clean, rounded, light), polish cao cấp, đồng bộ.
</role>

<san_pham_v2>
BA Super App = công cụ biến AI thành Senior Business Analyst. v2 tái cấu trúc trải nghiệm quanh 4 LỚP:
1) INPUT: tổng quan dự án + nạp nguồn (Paste/Upload/URL) + (optional) tải template mẫu (SRS/BRD/kỹ thuật/guide).
2) KHAI PHÁ cùng AI CHUYÊN GIA THEO DOMAIN: chọn 1 trong 7 ngành → một "chuyên gia ngành" (nạp sẵn entity/rule/compliance/glossary) hội thoại Socratic, evidence-grounded → sinh "Tri thức dự án".
3) BỐN LOẠI TÁC VỤ tự chọn: (a) Yêu cầu mới · (b) Function list · (c) Estimate · (d) Enhance.
4) OUTPUT: xuất theo từng function / từng yêu cầu / tất cả — render theo template — export MD/Word/PDF / push Jira·Confluence.
(Đây là BỐI CẢNH; chỉ dựng đúng các màn ở <man_hinh_can_dung>, KHÔNG thêm tính năng ngoài 4 lớp + 4 tác vụ.)
</san_pham_v2>

<man_hinh_can_dung>
Điều hướng bằng React state (KHÔNG router lib). App-shell = Sidebar + Main (theo <khung_layout>).

A. DASHBOARD "Tổng quan"
- Welcome banner + 4 stat-card (Tổng dự án · User Stories · BRD/SRS · Quality Score).
- "Dự án gần đây" (2 card: BIDV Home GĐ3 — Banking; MBL Insurance — Insurance) — bấm → mở Workspace dự án.
- Nút "Tạo dự án mới" → mở **modal Tạo dự án** (bước Input): ô Tên, **lưới 7 ngành** (chọn 1), ô Mục tiêu, ô Compliance; nút "Tạo & bắt đầu khai phá".

B. WORKSPACE (mở khi chọn dự án) — header (tên + badge domain + Readiness%) + **tab bar 5 tab ánh xạ 4 lớp**:
   1) Thông tin   2) Nguồn dữ liệu   3) Khai phá (Chuyên gia)   4) Tác vụ   5) Báo cáo & Xuất
   Dựng ĐỦ nội dung 5 tab theo <noi_dung_chi_tiet>.
</man_hinh_can_dung>

<noi_dung_chi_tiet>
TAB 1 — THÔNG TIN: read-view 2 cột (Tên · Domain + icon ngành · Mục tiêu · Compliance · Readiness 65% · Người tạo) + thẻ "Template mẫu đã đính" (SRS/BRD/kỹ thuật/guide — chip có/không) + hàng 7 chip ngành (ngành dự án được tô).

TAB 2 — NGUỒN DỮ LIỆU: "Trung tâm nạp dữ liệu" + 3 channel-card chính (Paste Text · Upload File · URL Fetch) + 2 card mờ "sắp có" (Email · Template-as-source). Danh sách 3 nguồn (tên · loại · ký tự · ngày · badge Đã xử lý/Chờ) + action xem/parse/xoá.

TAB 3 — KHAI PHÁ (CHUYÊN GIA) — MÀN KÝ HIỆU CỦA v2, bố cục 2 cột:
- TRÁI ~60%: **panel chat chuyên gia ngành**. Header nhỏ: avatar tròn + "Chuyên gia <Ngành>" + dòng trạng thái. Khung hội thoại: bóng chat AI (hỏi Socratic, kèm 2–3 **chip lựa chọn nhanh** + 1 "mặc định"), bóng người dùng; vài lượt mẫu (vd Banking: hỏi loại sản phẩm vay, điều kiện, quy trình thẩm định). Mỗi câu trả lời AI có thể đính **tag nguồn nhỏ** ("nguồn: HSYC.docx"). Ô nhập + nút gửi ở dưới.
- PHẢI ~40%: **"Tri thức dự án"** sinh dần — 3 nhóm thẻ: Entities (vd Khách hàng, Hồ sơ vay, TSĐB…), Business Rules (BR-01 LTV ≤ 70%…), Glossary (HSYC, LTV, Tất toán…). Mỗi mục có **chip "nguồn"** hoặc nhãn vàng "giả định — cần xác nhận". Nút nhỏ "Sửa".

TAB 4 — TÁC VỤ: lưới **4 task-card** (icon + tên + mô tả ngắn): Yêu cầu mới · Function list · Estimate · Enhance. Bấm 1 card → mở **view tác vụ tương ứng** (đổi bằng state, có nút quay lại):
- (a) YÊU CẦU MỚI: editor 1 requirement — câu phát biểu **EARS** ("Khi <điều kiện>, hệ thống PHẢI <hành vi>"), khối **AC Given/When/Then**, **vòng tròn Quality Score** (vd 82%), hàng **trace chips** (US-01 → BRD-REQ-01 → SRS-FR-012 → TC-031).
- (b) FUNCTION LIST: **cây** Module → Feature → Function (mã FUNC-xx), mỗi function gắn badge "≥1 req". Nút "Thêm function".
- (c) ESTIMATE: **bảng** Function | Complexity (thang 1–10 tô màu xanh→đỏ) | Story point | Man-day; hàng tổng (vd 544 MD) + dải tin cậy; cảnh báo "function mơ hồ".
- (d) ENHANCE: ô mô tả thay đổi + **Impact analysis**: danh sách item bị ảnh hưởng (req/function/TC) với nhãn Thêm/Sửa/Bỏ; nút "Tạo delta spec".

TAB 5 — BÁO CÁO & XUẤT:
- Lưới **deliverable** (Discovery Notes · User Story Set · BRD · SRS · Diagram Pack · Sprint Plan) — badge Nháp/Đạt gate + nút Xem.
- **Traceability** mini: bảng US → BRD-REQ → SRS-FR → TC (vài hàng).
- **Trung tâm Xuất**: chọn **Granularity** (radio: Theo từng function / Theo từng yêu cầu / Tất cả) × **Template** (dropdown: SRS/BRD/Kỹ thuật/Guide) × **Format** (toggle: MD/Word/PDF) + nút "Xuất" và "Push Jira/Confluence". Có thẻ "Quality Score 85%" (4 trục).
</noi_dung_chi_tiet>

<design_system>  (BÁM ĐÚNG token từ styles.css)
app-bg #f0f4f9 · surface #ffffff · hover #f1f3f4 · active #e8f0fe · text #202124 · text2 #5f6368 · primary #0b57d0 · primary-hover #0842a0 · primary-container #d3e3fd · on-primary-container #041e49 · border #dadce0.
Domain tint (7 ngành): Banking #e8f0fe/#1967d2 · Insurance #fce8e6/#c5221f · Fintech #e6f4ea/#137333 · E-commerce #fef7e0/#b06000 · SaaS #e8eaff/#3f51b5 · Healthcare #e6f4ea/#0b8043 · Game #f3e8fd/#8430ce.
Status: Đã xử lý/PASS #e6f4ea/#137333 · Chờ/đang chạy #fef7e0/#b06000. Complexity 1–10: 1–2 #34d399 · 3–4 #60a5fa · 5–6 #fbbf24 · 7–8 #fb923c · 9–10 #f87171.
Bo góc sm8/md12/lg24/pill9999; shadow Material rất nhẹ. Nav active = nền primary-container bo pill. Tab active = chữ primary + underline 2px. Font stack "'Google Sans','Product Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif".
</design_system>

<khung_layout>
- App-shell: nền #f0f4f9, padding 12px, h-screen, không cuộn ngang.
- Sidebar ~280px: brand (icon DraftingCompass + "BA Super App") + nhãn "v2"; nav: Tổng quan · Quản lý dự án · Tri thức · Tác vụ · Báo cáo; dưới cùng Cài đặt + user-profile ("BA"/"Business Analyst").
- Main: surface trắng bo lg + shadow nhẹ; Header 64px (search pill ~480px + Bell/HelpCircle + nút primary "Tạo mới") + canvas cuộn dọc padding 32–48px.
</khung_layout>

<tuong_tac>
- State: screen('dashboard'|'workspace') · activeProject('bidv'|'mbl') · activeTab('info'|'sources'|'discovery'|'tasks'|'output') · activeTask(null|'new'|'funcs'|'estimate'|'enhance') · showCreate(bool).
- "Tạo dự án mới"/"Tạo mới" → showCreate=true (modal Input, chọn ngành). "Tạo & bắt đầu khai phá" → tạo + screen=workspace + activeTab='discovery'.
- Project card → screen=workspace + activeTab='info'. Tab bar đổi activeTab. Tab Tác vụ: bấm task-card → set activeTask + render view; nút quay lại → activeTask=null.
- Chat: gửi tin/bấm chip lựa chọn → thêm bóng chat (mock, không cần LLM thật) + (tuỳ chọn) thêm 1 thẻ vào "Tri thức dự án".
- Hiệu ứng hover/active/focus-ring, transition mượt khi đổi tab/view/màn. Nút Xuất/Push/Parse chỉ visual (console.log).
- TẤT CẢ trong 1 component (được tách sub-component nội bộ). Không điều hướng URL thật.
</tuong_tac>

<he_thong_thi_giac>
Material 3: spacing 4/8; card viền 1px #dadce0 + shadow nhẹ; trạng thái dùng CẢ màu + nhãn/icon. Một màu nhấn primary #0b57d0; màu ngữ nghĩa tiết chế. Tương phản ≥ WCAG AA. Nhãn UI tiếng Việt; định danh kỹ thuật giữ nguyên (M1…M6, EARS, US/BRD-REQ/SRS-FR/TC, FUNC-xx, tên ngành). Màn Khai phá phải nổi bật & "đắt" nhất (đây là điểm khác biệt v2).
</he_thong_thi_giac>

<rang_buoc_ky_thuat>  (artifact claude.ai)
- MỘT file React (function component, default export) + Tailwind utility (được dùng bg-[#0b57d0]…).
- Icon: CHỈ `lucide-react`. Gợi ý: brand DraftingCompass · Tổng quan LayoutDashboard · dự án FolderOpen · Tri thức GraduationCap · Tác vụ KanbanSquare · Báo cáo BarChart3 · search Search · Bell · HelpCircle · Plus · Upload · Link2 · FileText · BrainCircuit · Info · Eye · Trash2 · Send · ShieldCheck · Landmark · CircleDollarSign · ShoppingCart · Cloud · HeartPulse · Gamepad2 · FilePlus2 · ListTree · Calculator · Wand2 · BadgeCheck.
- (Tuỳ chọn) recharts cho 1 biểu đồ nhỏ ở tab Báo cáo.
- KHÔNG CDN font/CSS, KHÔNG fetch, KHÔNG localStorage/sessionStorage — mock inline + state. Mock gom vào const đầu component.
</rang_buoc_ky_thuat>

<output>
Xuất ĐẦY ĐỦ code 1 file React chạy ngay, KHÔNG rút gọn "// tương tự". Mỗi tab/view dựng nội dung thật theo <noi_dung_chi_tiet>. Mở đầu 1–2 câu nói đây là prototype BA Super App v2 (4 lớp), style Google Stitch/Material 3, bấm sidebar/tab/dự án/chat/tác vụ để thử. Vừa 1 khung desktop (~1280–1440px), không vỡ layout, không cuộn ngang.
</output>

<forbidden>
KHÔNG thêm màn/tính năng ngoài 4 lớp + 4 tác vụ (không auth, không dark-mode, không trang Cài đặt chi tiết, không backend giả). KHÔNG bịa số liệu thành sự thật (domain model + estimate ghi rõ minh hoạ). KHÔNG đổi hệ màu/brand. Làm CHÍNH XÁC yêu cầu, KHÔNG over-engineer.
</forbidden>
```

---
*Đồng hành: `claude-design-screens-prompt.md` (v1 — 2 màn chính). Bản v2 này mở rộng sang 4 lớp; cùng design system Stitch/Material 3.*
