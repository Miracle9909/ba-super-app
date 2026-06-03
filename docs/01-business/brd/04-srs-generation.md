<!--
  Document ID: BRD-SRSGEN-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Component: 04 — SRS Generation
  Source: BRD per-component của BA Super App. Đặc tả nghiệp vụ năng lực "sinh SRS" (phase M4). Khớp 1:1 với SRS [srs/04-srs-generation.md]. Framework source: 01-framework/modules/M4-srs.md.
-->

# BRD — Component 04: SRS Generation

> **Business view** của năng lực **SRS Generation** thuộc BA Super App: biến **BRD (cái-gì, vì-sao)** thành **SRS (làm-thế-nào)** — đặc tả kỹ thuật đủ để Dev/QA triển khai và kiểm thử mà không phải đoán. Chi tiết kỹ thuật của *chính năng lực này* ở [SRS Component 04](../../02-requirements/srs/04-srs-generation.md). Bối cảnh tổng: [BRD overview](../brd.md). Năng lực được hiện thực bởi framework module [`M4-srs`](../../../01-framework/modules/M4-srs.md).
>
> **Lưu ý meta:** đây là BRD **CỦA** một công cụ *sinh SRS*. Vì vậy có hai lớp ID: (a) `REQ-SRSGEN-##` / `BR-SRSGEN-##` = yêu cầu nghiệp vụ của **chính công cụ**; (b) `SRS-FR-###` / `SRS-NFR-###` / `BRD-REQ-###` = artefact mà công cụ *sinh ra cho dự án khách* (không phải yêu cầu của công cụ).

---

## 1. Bối cảnh & mục tiêu nghiệp vụ

Sau khi BRD đã chốt (Component 03), đội Dev/QA vẫn không thể bắt tay làm: BRD nói *cái gì* và *vì sao*, nhưng thiếu *làm thế nào* — chưa có Functional Requirement chi tiết, chưa có ràng buộc đo được (NFR), chưa có data model, API contract hay vòng đời trạng thái. Viết SRS thủ công từ BRD là điểm nghẽn kinh điển: tốn thời gian, dễ đứt traceability về `BRD-REQ`, NFR hay viết định tính ("nhanh", "an toàn") thay vì có con số, và mỗi BA ra một format khác nhau.

Component 04 giải nghẽn đó: **từ một BRD đã review, sinh ra một SRS kỹ thuật chuẩn hoá** — mỗi `BRD-REQ` được ánh xạ thành một hay nhiều `SRS-FR` (có Input/Process/Output/Validation/Error), kèm NFR có con số, Data Model + ERD, API spec (khi hệ thống cần), State Machine cho entity có vòng đời, và bảng traceability `SRS-FR → BRD-REQ → US → TC`. Năng lực này dùng được standalone (lệnh `/srs`) hoặc trong pipeline web (Component 07), và tuân thủ luật chung của BA Super App: **không bịa, hỏi khi thiếu, con người chốt** ([BRD overview §5](../brd.md)).

**Mục tiêu nghiệp vụ:** rút ngắn thời gian từ BRD → SRS ≥ 50% so với viết tay, đồng thời đảm bảo **mọi FR truy được về BRD-REQ** (không scope creep) và **mọi NFR có chỉ số đo được**, để SRS sinh ra là đầu vào trực tiếp cho thiết kế (Component 05) và sprint (Component 06).

## 2. Phạm vi (Scope)

| In scope | Out of scope |
|---|---|
| Chuyển `BRD-REQ` (+ US, context) → `SRS-FR` theo khung Input/Process/Output/Validation/Error | Viết lại business case / objectives (đó là BRD — Component 03) |
| Sinh NFR (Performance/Security/Availability/Scalability) **mỗi mục có con số** | Sinh test case chi tiết (đó là QA / Sprint — Component 06) |
| Trích Data Model + vẽ **ERD (Mermaid)**; đánh dấu PII | Vẽ sequence/class/component diagram đầy đủ (đó là Component 05 — Diagram) |
| Đặc tả **API spec** (endpoint + ví dụ Request/Response) khi `[SYSTEM]` cần | Tự **chọn tech stack** thay khách khi BRD/context chưa nêu (phải hỏi Socratic) |
| Sinh **State Machine** cho entity có vòng đời nhiều trạng thái | Tự **chốt** SRS — luôn human-in-the-loop trước khi sang M5 |
| Bảng **Conversion BRD→SRS** + **Traceability** + tự chạy Quality Gate 4 | Sinh SRS khi **chưa có BRD** (dừng, đề xuất chạy M3 rút gọn) |

> Phạm vi này là *capability* của BA Super App, không phải SRS của một dự án khách cụ thể. SRS khách rơi vào [`../../../04-outputs/`](../../../04-outputs/).

## 3. Business Requirements (REQ-SRSGEN-##)

> Yêu cầu nghiệp vụ của **năng lực SRS Generation**. Mỗi REQ map xuống `FR-SRSGEN-##` trong [SRS Component 04](../../02-requirements/srs/04-srs-generation.md) (§7 Traceability). Truy nguồn lên REQ tổng ở [BRD overview §4](../brd.md).

| ID | Requirement | Nguồn (REQ tổng) | Priority |
|----|-------------|:----------------:|:--------:|
| REQ-SRSGEN-01 | Từ một **BRD đã review**, sinh **SRS** bám đúng [`srs-template`](../../../01-framework/templates/srs-template.md) (YAML header `document_type: "SRS"`, đủ section, không đổi thứ tự) | REQ-002 | 🔴 Must |
| REQ-SRSGEN-02 | Mỗi `BRD-REQ` được ánh xạ thành **≥1 `SRS-FR`**; mỗi FR có khung **Mô tả · Source · Input · Process · Output · Validation Rules · Error Handling**; không tạo FR "mồ côi" | REQ-002, REQ-003 | 🔴 Must |
| REQ-SRSGEN-03 | Sinh **NFR** đủ 4 nhóm (Performance / Security / Availability / Scalability), **mỗi mục có con số đo được**; KPI/SLA trong BRD → Performance/Availability target | REQ-002 | 🔴 Must |
| REQ-SRSGEN-04 | Trích **Data Model**: liệt kê entity + attribute chính (PK/FK) + quan hệ; vẽ **ERD Mermaid** render-ready; đánh dấu thuộc tính **PII/nhạy cảm** | REQ-002 | 🔴 Must |
| REQ-SRSGEN-05 | Đặc tả **API spec** (Method · Path · Auth + ví dụ Request/Response JSON) **khi `[SYSTEM]` là web/mobile/api/crm/erp**; nếu là data-pipeline thuần → thay bằng Interface/Contract dữ liệu | REQ-006 | 🟡 Should |
| REQ-SRSGEN-06 | Sinh **State Machine** (`stateDiagram-v2`) cho mọi entity có **vòng đời nhiều trạng thái**, nêu rõ điều kiện chuyển trạng thái | REQ-002 | 🟡 Should |
| REQ-SRSGEN-07 | Cung cấp bảng **Conversion BRD→SRS** chuẩn (Objective→Context, BRD-REQ→FR, Business Rule→Validation Rule, Process→State/Sequence, Data Req→ERD, KPI→NFR, Compliance→Security) | REQ-002, REQ-003 | 🔴 Must |
| REQ-SRSGEN-08 | Lập bảng **Traceability** `SRS-FR → BRD-REQ → US → TC` và tự chạy **Quality Gate 4** (Technical Completeness); chưa đạt → **không** sang M5, nêu rõ thiếu gì | REQ-003, REQ-004 | 🔴 Must |
| REQ-SRSGEN-09 | **Domain-adaptive**: `[DOMAIN]/[SYSTEM]/[COMPLIANCE]` là biến; không hardcode tên khách/sản phẩm vào khung SRS | REQ-006 | 🔴 Must |
| REQ-SRSGEN-10 | **Không bịa & human-in-the-loop**: quyết định kỹ thuật chưa có trong BRD/context → **hỏi Socratic** (options + default); nếu vẫn chưa chốt → ghi `⚠️ Assumption + default`, không khẳng định; cuối phase xin xác nhận trước M5 | REQ-001, REQ-010 | 🔴 Must |

## 4. Business Rules (BR-SRSGEN-##)

- **BR-SRSGEN-01 (Grounding / no-fabrication):** mọi `SRS-FR`, entity, endpoint phải **truy được** về `BRD-REQ` / `US` / context. Thiếu nguồn → hỏi hoặc đánh dấu `⚠️ Assumption`, **không "đắp" cho đầy**.
- **BR-SRSGEN-02 (No orphan FR / no scope creep):** không có `SRS-FR` nào **không** xuất phát từ BRD-REQ; chain `US → BRD-REQ → SRS-FR` không được đứt.
- **BR-SRSGEN-03 (Measurable NFR):** mỗi NFR phải có **con số** (vd p95 < 500ms, uptime 99.9%); NFR định tính ("nhanh", "an toàn") không được chấp nhận.
- **BR-SRSGEN-04 (Stop khi thiếu BRD):** chưa có BRD đã chốt → **không** dựng SRS đầy đủ; đề xuất chạy M3 rút gọn để có `BRD-REQ`, hoặc tạm map FR thẳng từ US (cảnh báo traceability yếu).
- **BR-SRSGEN-05 (Assumption tagging):** mọi default kỹ thuật (kiến trúc/auth/target/datastore…) đưa vào SRS phải gắn **`⚠️ Assumption`** và xin xác nhận; **không coi là sự thật đã chốt**.
- **BR-SRSGEN-06 (Standard-bound):** output theo [`output-standard`](../../../01-framework/core/output-standard.md) và [`srs-template`](../../../01-framework/templates/srs-template.md); ID đúng convention `SRS-FR-###` / `SRS-NFR-###`; heading không skip cấp; **Mermaid hợp lệ** (ERD type token không ngoặc; nhãn flowchart có ký tự đặc biệt phải bọc nháy kép).
- **BR-SRSGEN-07 (Gate fail-closed):** chưa đạt **Quality Gate 4** → **không** chuyển sang M5 (Diagram); nêu rõ hạng mục thiếu + đề xuất sửa.

> Các rule này là hiện thực địa phương của Cross-cutting Business Rules [BR-CORE-01..04](../brd.md) cho phase SRS.

## 5. Stakeholders

| Stakeholder | Quan tâm ở Component 04 |
|-------------|-------------------------|
| Business Analyst / System Analyst (người dùng chính) | Sinh SRS nhanh, đúng chuẩn, mọi FR truy về BRD-REQ, NFR có số |
| Dev team (người tiêu thụ SRS) | FR rõ Input/Process/Output, có API spec + ERD + state để code |
| QA team | FR có Error Handling + Validation; traceability `SRS-FR → TC` để thiết kế test |
| Solution Architect | Data model, integration points, NFR (security/scalability) làm đầu vào kiến trúc |
| Project Manager / PO | SRS đủ rõ để ước lượng & lập sprint (Component 06) |

## 6. Assumptions & Dependencies

> ⚠️ Assumption: phần lớn quyết định kỹ thuật mà công cụ "mặc định" khi BRD/context im lặng đều là **giả định cần khách xác nhận**, không phải fact. Các default chuẩn (theo M4 §④): kiến trúc = **modular-monolith**; auth = **OAuth2/OIDC + RBAC**; performance = **API p95 < 500ms**; availability = **99.9% (RPO 1h / RTO 4h)**; data store = **RDBMS (PostgreSQL)**; compliance = lấy từ context, nếu trống → **PDPA + hỏi xác nhận**.

- **Phụ thuộc đầu vào:** Component 04 **bắt buộc** có **BRD đã review** (`BRD-REQ-###`, Business Rules, Data Requirements, Process Flows) từ [Component 03](03-brd-generation.md); nên có **User Stories** (kèm AC) từ [Component 02](02-user-story.md) và **project context** từ [Component 01](01-discovery.md) (`[DOMAIN]/[SYSTEM]/[COMPLIANCE]`).
- **Phụ thuộc đầu ra:** SRS sinh ra là đầu vào cho [Component 05 — Diagram](05-diagram.md) (sequence/class từ FR & state) và [Component 06 — Sprint Planning](06-sprint-planning.md) (estimate từ FR).
- **Phụ thuộc chuẩn nền:** [`output-standard`](../../../01-framework/core/output-standard.md), [`srs-template`](../../../01-framework/templates/srs-template.md), [`quality-gates`](../../../01-framework/core/quality-gates.md) (Gate 4).
- **Phụ thuộc nền tảng:** một LLM có khả năng làm theo prompt-fragment [`M4-srs`](../../../01-framework/modules/M4-srs.md); render Mermaid để hiển thị ERD/state.

## 7. KPIs / Success Metrics

| KPI | Mục tiêu |
|-----|----------|
| Thời gian BRD → SRS | giảm ≥ **50%** so với viết tay |
| FR coverage | **100%** `BRD-REQ` có ≥1 `SRS-FR` (không REQ nào hở) |
| Orphan FR | **0** FR không truy được về BRD-REQ/US (no scope creep) |
| NFR đo được | **100%** NFR có con số (4 nhóm: Perf/Sec/Avail/Scale) |
| Mermaid render-ready | **100%** ERD + state diagram render không lỗi cú pháp |
| Quality Gate 4 pass | **100%** SRS bàn giao đã qua Gate trước khi sang M5 |

## 8. Phasing

| Phase | Nội dung Component 04 |
|-------|------------------------|
| **v2.0 (now)** | Module `M4-srs` hoàn chỉnh: conversion BRD→SRS, FR khung I/P/O, NFR có số, ERD + state Mermaid, traceability + Gate 4; chạy standalone (`/srs`) | 
| Next | Render Mermaid trực tiếp trong web (Component 07) + nối AI thật để sinh SRS trong workspace |
| Later | Template SRS theo domain (insurance/banking…) + auto-check traceability liên tài liệu |

## 9. Traceability & Revision

- **REQ → FR:** mỗi `REQ-SRSGEN-##` map tới `FR-SRSGEN-##` ở [SRS Component 04 §7](../../02-requirements/srs/04-srs-generation.md). Lên trên: `REQ-SRSGEN-##` hiện thực `REQ-002/003/004/006/001/010` của [BRD overview §4](../brd.md).
- **Nguồn framework:** [`01-framework/modules/M4-srs.md`](../../../01-framework/modules/M4-srs.md) (+ [`srs-template`](../../../01-framework/templates/srs-template.md)).
- **Revision:** v1.0 (2026-06-02) — bản đầu, chuẩn AIPlat per-component.

---

*BRD Component 04 (SRS Generation) — 10 REQ-SRSGEN + 7 BR-SRSGEN; 1:1 với [SRS Component 04](../../02-requirements/srs/04-srs-generation.md).*
