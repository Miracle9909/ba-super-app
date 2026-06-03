<!--
  Document ID: BRD-BASUPER-SPRINT-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: BRD per-component cho Component 06 — Sprint Planning của sản phẩm BA Super App. Chuẩn AIPlat (per-component, BRD↔SRS 1:1). Framework source: 01-framework/modules/M6-sprint-planning.md. Prefix ID = SPRINT.
-->

# BRD — Component 06: Sprint Planning

> BRD **per-component** cho năng lực **Sprint Planning** của BA Super App. Đặc tả **vì sao & cái gì** ở mức nghiệp vụ cho component này; chi tiết chức năng/kỹ thuật ở [SRS Component 06](../../02-requirements/srs/06-sprint-planning.md). Nằm trong khung tổng [BRD overview](../brd.md) (trục 7 component, dòng `06`).
>
> **Meta:** đây là BRD **CỦA** một component thuộc BA Super App (công cụ làm tài liệu BA). ID dùng `REQ-SPRINT-##` / `BR-SPRINT-##` để không lẫn với `SP-###` mà component này *sinh ra* cho dự án khách.
>
> **Nguồn framework:** [`M6-sprint-planning`](../../../01-framework/modules/M6-sprint-planning.md) (+ template [`sprint-template`](../../../01-framework/templates/sprint-template.md)).

---

## 1. Bối cảnh & mục tiêu nghiệp vụ

Sau khi có **User Story Backlog đã ưu tiên** (output M2: mỗi US có MoSCoW + story points), nhóm dự án vẫn phải tự tay biến backlog đó thành một **kế hoạch thực thi**: ước lượng năng lực team, sắp xếp phụ thuộc, chia US vào từng sprint, dựng timeline và release plan. Làm thủ công thì chậm, dễ nhồi quá tải một sprint, dễ xếp sai thứ tự dependency, và hay **bịa số velocity/ngày** cho "đẹp kế hoạch".

**Mục tiêu component:** từ một backlog US đã ưu tiên + story points, sinh ra một **Sprint Plan thực thi được** — gồm **velocity estimate** theo capacity thật của team, **dependency management** (tôn trọng thứ tự, chặn circular), **phân bổ US vào các sprint** (ID `SP-###`) theo MVP-first, kèm **Gantt timeline** và **release plan** — mà **không bịa** bất kỳ con số nào: thiếu thì hỏi, buộc giả định thì đánh dấu rõ.

Component này hiện thực phần "Sprint plan + estimate + tiến độ" mà stakeholder Project Manager quan tâm (xem [BRD overview §6](../brd.md)), và là **phase cuối** của pipeline `01 → 02 → 03 → 04 → 05 → 06`.

## 2. Phạm vi (component)

| In scope | Out of scope |
|---|---|
| Velocity estimate theo team size / sprint length (hỏi, không bịa) | Tự "chốt" velocity/ngày thay con người |
| Dependency management US→US (thứ tự, critical path, chặn circular) | Thay thế công cụ PM (Jira/Azure DevOps) — chỉ sinh kế hoạch |
| Phân bổ US vào sprint `SP-###` theo capacity + MVP-first | Resource scheduling theo cá nhân / lịch nghỉ chi tiết |
| Gantt timeline (Mermaid) + release plan multi-sprint | Tracking thực tế (burndown thời gian thực) — đó là việc tool PM |
| Traceability `US-[MODULE]-### → SP-###` | Sinh ra US mới (đó là M2) hoặc đổi priority backlog |
| Gate 6 (Plan Feasibility) trước khi xuất bản | Cam kết ngày release tuyệt đối khi user chưa cấp `[START_DATE]` |

> **Tiền đề cứng:** phải có backlog US đã ưu tiên + story points (M2). Thiếu → KHÔNG chạy component này; quay lại [Component 02](02-user-story.md).

## 3. Người dùng & giá trị

| Người dùng | Giá trị nhận được từ component này |
|------------|-----------------------------------|
| Project Manager / Delivery Lead | Sprint plan + estimate + timeline để cam kết tiến độ, thấy critical path |
| Business Analyst / PO (người dùng chính) | Biến backlog đã ưu tiên thành kế hoạch mà không rời công cụ |
| Dev/QA team | Biết US nào vào sprint nào, thứ tự dependency, owner, để nhận việc |
| Doanh nghiệp (mua) | Có release plan minh bạch, ước lượng dựa trên capacity thật |

## 4. Business Requirements (REQ-SPRINT-##)

> Map lên REQ tổng trong [BRD overview §4](../brd.md): chủ yếu hiện thực **REQ-002** (pipeline + output chuẩn), **REQ-003** (traceability), **REQ-004** (quality gate), **REQ-010** (human-in-the-loop), với **REQ-006** (domain-adaptive qua biến).

| ID | Requirement (nghiệp vụ) | Priority | Map REQ tổng |
|----|--------------------------|:--------:|--------------|
| REQ-SPRINT-01 | Nhận **backlog US đã ưu tiên + story points** từ M2 làm input; thiếu thì KHÔNG chạy, yêu cầu quay lại M2 | 🔴 Must | REQ-002 |
| REQ-SPRINT-02 | **Velocity estimate** theo team size + sprint length; nếu user không cấp số thật thì dùng dải tham khảo như **giả định có đánh dấu**, giảm 20–30% cho sprint đầu (ramp-up) | 🔴 Must | REQ-002 |
| REQ-SPRINT-03 | **Hỏi Socratic** các thông số thiếu (sprint length, team size, velocity, start date, buffer) trước khi ước lượng — không đoán bừa | 🔴 Must | REQ-001, REQ-010 |
| REQ-SPRINT-04 | **Dependency management:** xếp US phụ thuộc ở sprint trước/cùng, đánh dấu **critical path**, phát hiện & chặn **circular dependency** | 🔴 Must | REQ-002 |
| REQ-SPRINT-05 | **Phân bổ US vào sprint** `SP-###`: Must-have trước (MVP-first), **không vượt capacity** từng sprint (sau buffer), mỗi sprint **demo-able** | 🔴 Must | REQ-002 |
| REQ-SPRINT-06 | Sinh **Gantt timeline** (Mermaid) + **release plan** multi-sprint; ngày chưa chốt thì dùng biến `[START_DATE]`, không hardcode | 🔴 Must | REQ-002 |
| REQ-SPRINT-07 | Giữ **traceability** `US-[MODULE]-### → SP-###`: mỗi dòng phân bổ trỏ về một US thật, không tạo dòng "mồ côi", không sót US Must/Should | 🔴 Must | REQ-003 |
| REQ-SPRINT-08 | Tự chạy **Gate 6 — Plan Feasibility**; chưa đạt thì KHÔNG xuất bản, nêu rõ thiếu gì + đề xuất sửa | 🔴 Must | REQ-004 |
| REQ-SPRINT-09 | **Không bịa số:** mọi velocity/ngày/owner hoặc do user cấp, hoặc gắn `⚠️ Assumption`; owner chưa có thì để `[OWNER]` | 🔴 Must | REQ-010 |
| REQ-SPRINT-10 | **Domain-adaptive** qua biến `[PROJECT_NAME]`, `[TEAM_SIZE]`, `[VELOCITY]`, `[SPRINT_LENGTH]`, `[START_DATE]` — không hardcode | 🟡 Should | REQ-006 |
| REQ-SPRINT-11 | Output đổ vào **template Sprint** chuẩn (`sprint-template.md`) với YAML `document_type: "SPRINT"` — không tự chế khung khác | 🟡 Should | REQ-002 |
| REQ-SPRINT-12 | Khi **capacity vỡ** (tổng SP > capacity): KHÔNG nhồi; đề xuất dời US / tăng số sprint / cắt scope (`Could`→`Won't`) | 🟡 Should | REQ-010 |

## 5. Business Rules (BR-SPRINT-##)

> Kế thừa cross-cutting `BR-CORE-01..04` ([BRD overview §5](../brd.md)). Dưới đây là rule riêng của component, bám Hard Rules + Stop Conditions của [M6](../../../01-framework/modules/M6-sprint-planning.md).

- **BR-SPRINT-01 (No fabrication):** Mọi số velocity/ngày/owner phải do user cấp hoặc gắn `⚠️ Assumption`. TUYỆT ĐỐI không điền số "cho có" rồi coi là thật.
- **BR-SPRINT-02 (Ask-first):** Thiếu thông số (team/velocity/length/start date/buffer) → **HỎI Socratic** trước khi ước lượng; vẫn thiếu thì dùng biến/dải tham khảo + đánh dấu giả định.
- **BR-SPRINT-03 (Dependency order):** US phụ thuộc phải nằm ở sprint **TRƯỚC** hoặc **CÙNG** sprint với US nó cần. Không có ngoại lệ.
- **BR-SPRINT-04 (No circular):** Phát hiện vòng lặp phụ thuộc → **dừng**, báo user, đề xuất tách/đảo US. Không phân bổ khi còn circular.
- **BR-SPRINT-05 (Capacity guard):** Tổng SP mỗi sprint ≤ capacity (velocity sau buffer 10–15%). Vỡ capacity → không nhồi; đề xuất dời/tăng sprint/cắt scope.
- **BR-SPRINT-06 (MVP-first):** Toàn bộ US `Must` rơi vào các sprint đầu (mặc định SP-001 → SP-002); mỗi sprint cuối kỳ có lát cắt demo được.
- **BR-SPRINT-07 (Traceability):** Mỗi dòng phân bổ **bắt buộc** ghi `US ID`; không US `Must`/`Should` nào thiếu `SP-###`; không dòng "mồ côi".
- **BR-SPRINT-08 (Human-in-the-loop):** Cuối phase tóm tắt + **xin xác nhận user** trước khi coi là done; AI đề xuất kế hoạch, không tự chốt.
- **BR-SPRINT-09 (Gate-gated):** Chưa qua Gate 6 → không xuất bản Sprint Plan.

## 6. Stakeholders

| Stakeholder | Quan tâm với component Sprint Planning |
|-------------|----------------------------------------|
| Project Manager / Delivery Lead | Velocity hợp lý, timeline khả thi, critical path, release date |
| Business Analyst / PO | Kế hoạch bám đúng priority backlog, không phá traceability |
| Dev/QA team | Phân bổ rõ US/sprint, dependency đúng thứ tự, owner, demo-able |
| Doanh nghiệp (mua) | Release plan minh bạch, estimate dựa capacity thật, không "ảo" tiến độ |

## 7. KPIs / Success Metrics

| KPI | Mục tiêu |
|-----|----------|
| Coverage phân bổ | 100% US `Must`/`Should` của backlog được gán `SP-###` (không sót/trùng) |
| Tính khả thi capacity | 100% sprint có tổng SP ≤ capacity sau buffer (Gate 6 check #1) |
| Tính đúng dependency | 0 vi phạm thứ tự dependency; 0 circular trong plan xuất bản |
| No-fabrication | 100% số velocity/ngày/owner do user cấp **hoặc** gắn `⚠️ Assumption` |
| Traceability | 100% dòng phân bổ lần được về `US-[MODULE]-###` |

> ⚠️ Assumption: Các ngưỡng mục tiêu trên là KPI nội bộ của component (bám Gate 6), chưa được người dùng/đơn vị mua xác nhận; cần chốt khi áp cho một dự án cụ thể.

## 8. Phasing

| Phase | Nội dung component Sprint Planning |
|-------|------------------------------------|
| **v2.0 (now)** | M6 prompt-fragment + sprint-template hoàn chỉnh; sinh velocity/dependency/allocation/Gantt/release qua hội thoại, no-fabrication |
| Next | Nối Web Workspace: render Gantt/dependency graph, đọc backlog đã ưu tiên trực tiếp từ project state |
| Later | Tự đo velocity sau Sprint 1 để re-plan; export Sprint Plan; gợi ý cắt scope tự động khi vỡ capacity |

## 9. Traceability & Revision

- **REQ → FR:** mỗi `REQ-SPRINT-##` map tới `FR-SPRINT-##` trong [SRS Component 06 §6](../../02-requirements/srs/06-sprint-planning.md) (bảng traceability của component).
- **Chuỗi đầy đủ:** `US-[MODULE]-### → BRD-REQ-### → SRS-FR-### → TC-###  (+ SP-###)` — Sprint Planning bổ sung cột `SP-###` vào ma trận truy vết ([traceability-matrix](../../../01-framework/tools/traceability-matrix.md)).
- **Framework source:** [`M6-sprint-planning`](../../../01-framework/modules/M6-sprint-planning.md), template [`sprint-template`](../../../01-framework/templates/sprint-template.md).
- **Revision:** v1.0 (2026-06-02) — bản đầu, theo chuẩn AIPlat (per-component, BRD↔SRS 1:1).

---

*BRD Component 06 — Sprint Planning · prefix `SPRINT` · 12 REQ-SPRINT + 9 BR-SPRINT · 1:1 với [SRS Component 06](../../02-requirements/srs/06-sprint-planning.md).*
