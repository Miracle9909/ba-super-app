<!--
  Document ID: BRD-WEBAPP-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: BRD per-component cho Component 07 (Web Workspace) của sản phẩm BA Super App. Chuẩn AIPlat (BRD↔SRS 1:1). Framework source: ../../02-web-app/README.md.
-->

# Component 07: Web Workspace — BRD

> **Business Requirements** cho **Web Workspace** — vỏ web (SPA) hiện thực hoá pipeline BA: dashboard đa dự án + workspace 5 tab + nạp dữ liệu đa kênh + domain model. Mức **vì sao & cái gì**; chi tiết chức năng/kỹ thuật ở [SRS 07](../../02-requirements/srs/07-web-app.md).
>
> **Prefix:** `WEBAPP`. ID nghiệp vụ `REQ-WEBAPP-##`, rule `BR-WEBAPP-##`. Nguồn hiện thực: [`../../02-web-app/README.md`](../../02-web-app/README.md) + `02-web-app/app.js` + `index.html`/`workspace.html`.
>
> **Lưu ý trạng thái:** đây là **prototype client-side** (vanilla JS + localStorage). README đánh dấu **Phase 1 đã xong**, **Phase 2 (Quality Gates) đang dở**, **Phase 3+ chưa làm**. Tài liệu này ghi rõ REQ nào đã hiện thực vs còn lộ trình — **không** mô tả tính năng chưa có như đã có.

---

## 1. Bối cảnh & mục tiêu nghiệp vụ

Framework BA Super App ([`../../01-framework/`](../../01-framework/)) là prompt-kit dùng standalone (paste `master_prompt` vào LLM). Cách dùng standalone mạnh nhưng **rời rạc**: người dùng phải tự quản nhiều dự án, tự lưu ngữ cảnh, tự gom tài liệu đầu vào, tự theo dõi pipeline đang ở phase nào. Web Workspace là **lớp vỏ trực quan** giải nỗi đau đó: một nơi để quản nhiều dự án, nạp dữ liệu thô (HSYC/meeting notes/URL), nhìn thấy tri thức trích xuất (entities/rules/glossary) và tiến độ pipeline — tất cả **chạy hoàn toàn trên trình duyệt**, không backend.

Mục tiêu nghiệp vụ của Component 07:

- **Trực quan hoá pipeline:** biến luồng 6 phase Discovery→Sprint của framework thành giao diện dashboard + workspace để người dùng (BA/PO) thao tác bằng chuột thay vì gõ lệnh.
- **Quản nhiều dự án cục bộ:** mỗi dự án có domain, phase, độ sẵn sàng (readiness), nguồn dữ liệu và tri thức riêng; lưu ngay trên máy người dùng (localStorage), không cần đăng nhập / không cần server.
- **Một điểm nạp dữ liệu đa kênh:** gom đầu vào (text/file/URL/email/template) về một "Trung tâm nạp dữ liệu" để chuẩn bị cho bước phân tích AI (Discovery input của framework).
- **Hạ rào cản onboarding:** prototype tĩnh, mở bằng trình duyệt, không cần build — đủ để demo giá trị sản phẩm và thu phản hồi sớm.

> ⚠️ Assumption: vai trò người dùng hiện cố định là **Business Analyst** (avatar "BA" hardcode trong `index.html`); chưa có khái niệm đăng nhập / nhiều vai trò. Phân quyền và đa người dùng nằm ngoài phạm vi MVP.

## 2. Phạm vi (Scope)

| In scope (MVP — Phase 1) | Out of scope (MVP) |
|---|---|
| Dashboard đa dự án (danh sách + stats tổng quan) | Backend / API server / đăng nhập |
| Workspace 5 tab (Thông tin / Nguồn dữ liệu / Tri thức / Pipeline / Báo cáo) | Đồng bộ cloud / đa thiết bị |
| Nạp dữ liệu đa kênh (text/file/URL/email/template) qua modal | Parse AI thật (gọi LLM API) — hiện là mô phỏng |
| Hiển thị domain model (entities / business rules / glossary) | Render Mermaid trong web |
| Lưu state ở localStorage (`ba_super_app_projects`) | Lưu deliverable ra `04-outputs` + export |
| Mô phỏng "Parse AI" (đổi trạng thái nguồn, thông báo) | Validation engine / quality-gate report (`/validate`) chạy thật |

> Ranh giới then chốt: Web Workspace là **lớp trình bày (presentation shell)**, không định nghĩa lại pipeline. Logic pipeline & chuẩn output là của framework (xem [BRD overview §3](../brd.md), invariant R-01 ở [SRS overview §5](../../02-requirements/srs.md)). Việc thực thi pipeline thật trong web (nối LLM) là lộ trình Phase 3.

## 3. Mapping năng lực Web ↔ Framework

Bảng ánh xạ (theo [README §"Ánh xạ Web ↔ Framework"](../../02-web-app/README.md)) — mỗi tab/tính năng web ứng với phần nào của framework:

| Web (tab / tính năng) | Framework tương ứng | Trạng thái |
|---|---|:---:|
| Workspace → "Nguồn dữ liệu" (ingestion) | `inputs/project-context` (đầu vào M1 Discovery) | 🟢 Phase 1 |
| Workspace → "Tri thức" (entities/rules/glossary) | M1 Discovery → domain model | 🟢 Phase 1 (mock) |
| Workspace → "Pipeline" | M1→M6 ([modules](../../01-framework/modules/)) | 🟡 placeholder |
| Workspace → "Báo cáo" | deliverable → [`../../04-outputs`](../../04-outputs/) | 🟡 placeholder |
| (chưa có) validation engine | [quality-gates](../../01-framework/core/quality-gates.md) | ⏳ Phase 2 dở |

## 4. Business Requirements (REQ-WEBAPP-##)

> Cột **Status** phản ánh đúng trạng thái hiện thực trong `README.md`/`app.js`: 🟢 Done (Phase 1) · 🟡 Partial (mô phỏng / placeholder) · ⏳ Pending (Phase 2/3+).

| ID | Requirement (nghiệp vụ) | Maps REQ (overview) | Priority | Status |
|----|--------------------------|:---:|:---:|:---:|
| REQ-WEBAPP-01 | Người dùng xem **dashboard đa dự án**: danh sách dự án gần đây (tên, domain, phase, tiến độ) + thẻ thống kê tổng quan | REQ-008 | 🔴 Must | 🟢 Done |
| REQ-WEBAPP-02 | Người dùng mở **workspace của một dự án** với 5 tab: Thông tin / Nguồn dữ liệu / Tri thức / Pipeline / Báo cáo | REQ-008 | 🔴 Must | 🟢 Done |
| REQ-WEBAPP-03 | Người dùng **nạp dữ liệu đa kênh** (paste text / upload file / URL / email / template) vào một dự án qua một "Trung tâm nạp dữ liệu" | REQ-008 | 🔴 Must | 🟢 Done |
| REQ-WEBAPP-04 | Người dùng phân loại tài liệu khi nạp (loại: BRD/SRS/RFP/Meeting Notes/User Story/Reference; chọn template phân tích) | REQ-008 | 🟡 Should | 🟢 Done |
| REQ-WEBAPP-05 | Người dùng **kích hoạt phân tích AI** ("Parse") cho nguồn đã nạp để hệ thống trích xuất rules/entities | REQ-001, REQ-002 | 🔴 Must | 🟡 Partial (mô phỏng) |
| REQ-WEBAPP-06 | Người dùng xem **domain model** đã trích xuất: Entities, Business Rules, Glossary — kèm nguồn gốc (truy vết về tài liệu) | REQ-003 | 🔴 Must | 🟡 Partial (mock) |
| REQ-WEBAPP-07 | Hệ thống **lưu mọi dự án cục bộ** (localStorage); dữ liệu còn nguyên sau khi tải lại trang | REQ-008 | 🔴 Must | 🟢 Done |
| REQ-WEBAPP-08 | Người dùng chạy **Quality Gate / kiểm nhất quán** trên dự án và nhận báo cáo PASS/FAIL + danh sách gap | REQ-004 | 🟡 Should | ⏳ Pending (Phase 2 dở) |
| REQ-WEBAPP-09 | Hệ thống **thực thi pipeline thật** trong web (nối LLM ChatGPT/Claude) để sinh deliverable | REQ-002, REQ-007 | 🟢 Could | ⏳ Pending (Phase 3) |
| REQ-WEBAPP-10 | Người dùng **lưu/xuất deliverable** (vào `04-outputs`) và xem Mermaid render trong web | REQ-009 | 🟢 Could | ⏳ Pending (Phase 3) |

> ⚠️ Assumption: REQ-WEBAPP-05/06 hiện chạy trên **dữ liệu mô phỏng** — nút "Parse" đợi ~1.5s rồi đổi nhãn trạng thái và hiện `alert`, còn entities/rules/glossary là nội dung mẫu hardcode (ví dụ BIDV Home: Customer/Loan/Collateral, BR-LOAN-01...). Khi nối AI thật (REQ-WEBAPP-09) các yêu cầu này mới được hiện thực đầy đủ.

## 5. Business Rules (BR-WEBAPP-##)

- **BR-WEBAPP-01 (Client-side only):** Toàn bộ state dự án nằm trên máy người dùng (localStorage key `ba_super_app_projects`). Không gửi dữ liệu lên server khi dùng prototype (kế thừa NFR-S02). → bám invariant **R-04** ở [SRS overview §5](../../02-requirements/srs.md).
- **BR-WEBAPP-02 (Shell, không định nghĩa lại pipeline):** Web chỉ **trình bày** pipeline; chuẩn output và logic 6 phase thuộc framework. Web không được "phát minh" phase mới ngoài framework (bám **R-01**).
- **BR-WEBAPP-03 (No-fabrication trên UI):** Tính năng chưa hiện thực phải hiển thị rõ trạng thái "Đang xây dựng" thay vì giả vờ chạy. Tab Pipeline/Báo cáo hiện đúng placeholder "construction"; không bịa kết quả (kế thừa BR-CORE-02).
- **BR-WEBAPP-04 (3-state UX):** Mỗi tác vụ nạp/parse cần thể hiện trạng thái loading/empty/done rõ ràng cho người dùng (kế thừa NFR-U03). Hiện: nút Parse có spinner + trạng thái nguồn `pending`/`parsed`.
- **BR-WEBAPP-05 (Static, no-build):** Sản phẩm là web tĩnh mở trực tiếp bằng trình duyệt; không yêu cầu bước build/đăng nhập (kế thừa NFR-P03). Khuyến nghị chạy qua local server để tránh hạn chế `file://` khi `fetch`.

## 6. Stakeholders

| Stakeholder | Quan tâm với Web Workspace |
|-------------|----------------------------|
| Business Analyst / PO (người dùng chính) | Một nơi trực quan để quản dự án, nạp dữ liệu, xem tri thức — đỡ phải gõ prompt thủ công |
| Dev/QA (người tiêu thụ deliverable) | Lộ trình: xem/tải SRS-US-traceability sinh ra từ web (Phase 3) |
| Project Manager | Lộ trình: nhìn tiến độ pipeline & readiness của nhiều dự án trên dashboard |
| Doanh nghiệp (mua) | Demo nhanh giá trị sản phẩm; prototype tĩnh dễ trình diễn, không cần hạ tầng |

## 7. KPIs / Success Metrics

| KPI | Mục tiêu |
|-----|----------|
| Mở dashboard | < 2s (client-side, không backend) — kế thừa NFR-PF01 |
| Bền dữ liệu | 100% dự án còn nguyên sau reload (localStorage) — kế thừa NFR-R04 |
| Phủ kênh nạp | Hỗ trợ ≥ 3 kênh thực dụng (text/file/URL) trong MVP |
| Minh bạch trạng thái | 100% tính năng chưa làm hiển thị "Đang xây dựng" (không bịa) |

## 8. Phasing

Theo bảng trạng thái trong [README §"Trạng thái"](../../02-web-app/README.md):

| Phase | Hạng mục | Trạng thái | REQ liên quan |
|---|---|:---:|---|
| **1** | Input Processing & Domain Extraction (dashboard, workspace 5 tab, nạp đa kênh, domain model UI, localStorage) | 🟢 Xong | REQ-WEBAPP-01..07 |
| **2** | Quality Gates & Consistency Check (validation engine, báo cáo `/validate`) | 🟡 Đang dở | REQ-WEBAPP-08 |
| **3+** | Render Mermaid · nối AI thật (ChatGPT/Claude API) · lưu `04-outputs` + export | ⏳ Chưa | REQ-WEBAPP-09, REQ-WEBAPP-10 |

> Nợ kỹ thuật cần dọn (P3, theo README): hợp nhất 3 nguồn mock (hardcode `app.js` + `data/mock_project.json` + `data/budget_data.js`); chưa có test; chưa render Mermaid.

## 9. Traceability & Revision

- **REQ → SRS-FR:** mỗi `REQ-WEBAPP-##` map tới `FR-WEBAPP-##` ở [SRS 07 §6](../../02-requirements/srs/07-web-app.md). Bản đồ rút gọn:

| REQ-WEBAPP | Hiện thực bởi FR-WEBAPP | Status |
|---|---|:---:|
| REQ-WEBAPP-01 | FR-WEBAPP-01 (Dashboard) | 🟢 |
| REQ-WEBAPP-02 | FR-WEBAPP-02 (Workspace 5 tab) | 🟢 |
| REQ-WEBAPP-03, -04 | FR-WEBAPP-03 (Ingestion đa kênh) | 🟢 |
| REQ-WEBAPP-05 | FR-WEBAPP-04 (Parse AI — mô phỏng) | 🟡 |
| REQ-WEBAPP-06 | FR-WEBAPP-04 (Domain model view) | 🟡 |
| REQ-WEBAPP-07 | FR-WEBAPP-06 (Persistence localStorage) | 🟢 |
| REQ-WEBAPP-08 | FR-WEBAPP-05 (Quality-gate UI) | ⏳ |
| REQ-WEBAPP-09, -10 | (lộ trình — Open Questions §7 SRS) | ⏳ |

- **Cross-link:** SRS đối ứng → [`../../02-requirements/srs/07-web-app.md`](../../02-requirements/srs/07-web-app.md). Overview → [BRD](../brd.md) · [SRS](../../02-requirements/srs.md).
- **Revision:** v1.0 (2026-06-02) — bản đầu, theo chuẩn AIPlat; bám trạng thái thật của `02-web-app` (Phase 1 xong / Phase 2 dở).

---

*BRD Component 07 (Web Workspace) v1.0 — 10 REQ-WEBAPP (7 done · 1 partial-pair · 2 pending) + 5 BR-WEBAPP; 1:1 với [SRS 07](../../02-requirements/srs/07-web-app.md).*
