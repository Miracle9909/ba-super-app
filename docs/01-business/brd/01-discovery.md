<!--
  Document ID: BRD-DISC-1.0
  Component: 01 — Discovery & Context Intake
  Prefix: DISC
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: BRD per-component của sản phẩm BA Super App, chuẩn AIPlat (BRD↔SRS 1:1).
          Năng lực gốc: 01-framework/modules/M1-discovery.md (+ inputs/project-context.md, inputs/stakeholder-map.md).
  Meta: Đây là đặc tả "BA Super App PHẢI LÀM GÌ" cho năng lực Discovery — KHÔNG phải template giao cho khách.
        ID dùng REQ-DISC-## để không lẫn với BRD-REQ-### mà công cụ *sinh ra* cho dự án khách.
-->

# BRD — Component 01: Discovery & Context Intake

> **Component:** 01 — Discovery & Context Intake · **Prefix:** `DISC`
> **SRS (1:1):** [`../../02-requirements/srs/01-discovery.md`](../../02-requirements/srs/01-discovery.md)
> **Framework source:** [`../../01-framework/modules/M1-discovery.md`](../../01-framework/modules/M1-discovery.md) (+ [`inputs/project-context.md`](../../01-framework/inputs/project-context.md), [`inputs/stakeholder-map.md`](../../01-framework/inputs/stakeholder-map.md))
> **Overview:** [`../brd.md`](../brd.md) · hiện thực REQ-001 (Socratic intake) + một phần REQ-002/006/010.
>
> Tài liệu này đặc tả **vì sao & cái gì** ở mức nghiệp vụ cho năng lực Discovery của **chính** BA Super App. Chi tiết chức năng/kỹ thuật ở [SRS](../../02-requirements/srs/01-discovery.md).

---

## 1. Business Objective & Why

Discovery là **phase 1** của pipeline BA Super App — nơi công cụ thiết lập **nền context dùng chung** cho mọi deliverable phía sau (User Story, BRD, SRS, Diagram, Sprint). Nhiệm vụ của năng lực này KHÔNG phải viết giải pháp mà là **làm rõ vấn đề**: dự án là gì, cho ai, đạt mục tiêu nào, phạm vi tới đâu, ràng buộc gì.

**Vì sao cần component này:**

- **Chống "garbage-in".** Nếu input mô tả dự án còn mơ hồ mà cứ chạy thẳng sang sinh tài liệu, mọi deliverable phía sau sẽ phải **đoán** → sai lệch lan truyền. Discovery chặn nỗi đau này ngay từ đầu.
- **Tạo gốc traceability.** Discovery Report (đặc biệt **Feature List** + **Goals/Metrics**) là nguồn để M2 đặt mã `US-[MODULE]-###` và M3 lập KPI — đặt tên Epic/Module sai từ đây sẽ làm đứt chuỗi truy vết về sau.
- **Hiện thực hard rule #1 (no-hallucination).** Thay vì tự bịa context khi thiếu, công cụ **hỏi Socratic** (options + default) rồi mới sinh tài liệu — biến nguyên tắc "không bịa" thành hành vi quan sát được.
- **Domain-adaptive từ điểm chạm đầu tiên.** Discovery suy/hỏi `[DOMAIN]` và các biến `[USER_TYPE]/[SYSTEM]/[COMPLIANCE]` để toàn pipeline thích ứng ngành, không hardcode.

Kết quả nghiệp vụ kỳ vọng: một **Discovery Report có cấu trúc** đủ để các phase sau chạy được mà không phải đoán, và **con người xác nhận** trước khi qua phase kế.

## 2. Personas & Stakeholders

| Stakeholder / Persona | Vai trò trong Discovery | Quan tâm chính |
|-----------------------|-------------------------|----------------|
| **Business Analyst / Product Owner** (người dùng chính) | Cung cấp mô tả dự án (text/brief/email/meeting-notes/URL); trả lời Socratic; **chốt** Discovery Report | Thu được context đúng & nhanh, không phải gõ template thủ công; không bị AI tự "đóng" thay |
| **Dev / QA team** (người tiêu thụ deliverable phía sau) | Không tương tác trực tiếp; thừa hưởng Feature List / scope / constraints | Context rõ để US → SRS không phải đoán; thuật ngữ & tên user type ổn định |
| **Project Manager** | Dùng Goals/Metrics & constraints (timeline/team/budget) làm đầu vào sprint | Mục tiêu đo được; phạm vi in/out tách bạch để ước lượng |
| **Doanh nghiệp (bên mua)** | Hưởng lợi gián tiếp | Rút ngắn thời gian onboarding dự án; chuẩn hoá đầu vào |

> ⚠️ Assumption: trong Discovery, **một người dùng (BA/PO) đại diện** cho các stakeholder phía khách để cung cấp & chốt thông tin; công cụ không tự liên hệ stakeholder khác. (M1 mô tả tương tác 1-1 qua hội thoại; chưa nêu multi-stakeholder review ở phase này.)

## 3. Scope (in / out)

| In scope (Discovery PHẢI làm) | Out of scope (Discovery KHÔNG làm) |
|---|---|
| Nhận **mô tả dự án sơ bộ** ở mọi dạng (text/brief/email/meeting-notes/URL) | **Giải pháp/kỹ thuật** (kiến trúc, code) — thuộc M4+ |
| **Intent extraction**: trích tên dự án, `[DOMAIN]`, mục tiêu, `[USER_TYPE]`, features sơ bộ, `[SYSTEM]`, constraints, compliance; phân biệt explicit vs inferred | Sinh **User Story / BRD / SRS / Diagram / Sprint** (M2–M6) |
| **Hỏi Socratic 3–5 câu** (mỗi câu: 1 quyết định · options · default) cho mục bắt buộc còn thiếu/mơ hồ | **Tự chốt** yêu cầu thay con người (vi phạm hard rule #2) |
| Cấu trúc hoá: Goals→Metrics, Stakeholders/Users, Feature decomposition (MoSCoW sơ bộ), Scope in/out, Constraints/Assumptions | **Tự điền giá trị giả** rồi coi là thật (vi phạm hard rule #1) |
| Sinh **Discovery Report** theo `templates/discovery-template.md` + `output-standard.md` | Phục vụ domain **ngoài 7 domain** controller hỗ trợ (báo rõ giới hạn) |
| Cung cấp **template** project-context & stakeholder-map làm khung thu thập | Tích hợp công cụ PM ngoài (Jira/Azure DevOps) |
| Chạy **Quality Gate 1 — Context Completeness** (≥ 5/7) trước khi cho qua phase | Lưu trữ/persist dài hạn (thuộc Web Workspace — Component 07) |
| **Tóm tắt + xin xác nhận**; hỗ trợ refine **≤ 3 vòng/mục** | — |

## 4. Business Requirements (`REQ-DISC-##`)

| ID | Requirement | Rationale | Priority |
|----|-------------|-----------|:--------:|
| **REQ-DISC-01** | Tiếp nhận mô tả dự án ở dạng tự do (text/brief/email/meeting-notes/URL) làm điểm vào của pipeline | Người dùng không nên phải điền form cứng; M1 nhận "raw project description" | 🔴 Must |
| **REQ-DISC-02** | **Trích intent** từ mô tả: tên dự án, `[DOMAIN]`, mục tiêu, `[USER_TYPE]`, features sơ bộ, `[SYSTEM]`, constraints, compliance — phân biệt rõ **explicit** (user nói thẳng) vs **inferred** (suy ra) | Tách dữ kiện thật khỏi suy diễn là tiền đề của no-hallucination; mọi inferred phải đánh dấu `⚠️ Assumption` | 🔴 Must |
| **REQ-DISC-03** | Khi mục **bắt buộc** còn thiếu/mơ hồ, **hỏi Socratic 3–5 câu**; mỗi câu gắn **một quyết định**, có **options** rõ và **default** khi user không chắc; adapt từ ngữ theo `[DOMAIN]` | Hiện thực hard rule #1 & REQ-001; tránh hỏi chung chung; giảm vòng lặp hội thoại | 🔴 Must |
| **REQ-DISC-04** | **Không bịa context.** Thiếu thông tin → hỏi (REQ-DISC-03); giả định bắt buộc → đánh dấu `⚠️ Assumption` + xin xác nhận; KHÔNG tự điền giá trị giả rồi coi là thật | Hard rule #1 của controller — nền tin cậy của toàn bộ deliverable | 🔴 Must |
| **REQ-DISC-05** | **Cấu trúc hoá context**: mỗi mục tiêu gắn ≥ 1 KPI đo được (metric+target); phân loại stakeholders/users; **decompose feature** theo Epic/Module với priority **MoSCoW** sơ bộ (🔴/🟡/🟢/⚪); tách **scope in/out** | Biến mô tả rời rạc thành Discovery Report dùng được; đặt nền cho US/BRD | 🔴 Must |
| **REQ-DISC-06** | Sinh **Discovery Report** theo `templates/discovery-template.md`, tuân `output-standard.md`: YAML frontmatter (`document_type: "DISCOVERY"`), các section chuẩn, prose tiếng Việt + heading/ID English, kết thúc bằng **đúng 1 câu hỏi refine** | Bám REQ-002 (một chuẩn output nhất quán); deliverable không "lệch khung" | 🔴 Must |
| **REQ-DISC-07** | Đặt **tên Epic/Module** trong Feature List nhất quán để M2 sinh được mã `US-[MODULE]-###`; giữ thuật ngữ & tên user type ổn định; không tạo feature "mồ côi" (mọi feature truy được về 1 mục tiêu/stakeholder) | Gốc của chuỗi traceability; tránh đứt liên kết US→BRD→SRS | 🔴 Must |
| **REQ-DISC-08** | Chạy **Quality Gate 1 — Context Completeness** (7 check: Project Name · Domain · ≥2 Stakeholders · Business Goal+metric · ≥1 User Type · Scope in/out · Constraints); **pass ≥ 5/7** mới được sang M2 | Một phase một lần (hard rule #5); chặn context dở dang chảy xuống phase sau | 🔴 Must |
| **REQ-DISC-09** | **Tóm tắt + xin xác nhận** cuối phase (Tên · Domain · Mục tiêu · Users · Scope → "✅ Đúng chưa?"); chỉ chuyển phase khi **con người OK** và đã qua Gate 1; **không tự đóng** Discovery | Hard rule #2 (human-in-the-loop) & REQ-010 | 🔴 Must |
| **REQ-DISC-10** | Hỗ trợ **refine** Discovery Report qua hội thoại, **giới hạn ≤ 3 vòng** cùng một mục; quá hạn → đề xuất chốt hoặc escalate | Hard rule #5 — tránh lặp vô hạn; vẫn cho người dùng tinh chỉnh | 🟡 Should |
| **REQ-DISC-11** | Cung cấp **template thu thập**: `project-context` (universal) + `stakeholder-map` (RACI / Influence-Interest / Communication Plan) để người dùng điền trực tiếp hoặc để AI tự extract | Hỗ trợ cả luồng "điền form" lẫn "conversational"; chuẩn hoá đầu vào | 🟡 Should |
| **REQ-DISC-12** | Khi domain/scope **ngoài 7 domain** controller khai báo → **báo rõ giới hạn** thay vì cố trả lời | Stop condition #5 của M1; tránh đầu ra ngoài năng lực | 🟡 Should |
| **REQ-DISC-13** | Hỗ trợ **Discovery rút gọn**: khi user nhảy thẳng phase sau ("viết BRD") mà chưa có context, hỏi đủ tối thiểu rồi mới cho qua | Controller route Discovery rút gọn trước khi cho sang phase kế | 🟢 Could |

## 5. Business Rules (`BR-DISC-##`)

- **BR-DISC-01 — No-fabrication:** Không suy diễn giá trị cho mục bắt buộc rồi coi là sự thật. Thiếu → hỏi Socratic; suy ra → `⚠️ Assumption` + chờ chốt. (kế thừa BR-CORE-02)
- **BR-DISC-02 — Explicit vs inferred:** Mọi giá trị **không do user nói thẳng** phải gắn nhãn `⚠️ Assumption` trong Discovery Report.
- **BR-DISC-03 — Socratic format:** Mỗi câu hỏi làm rõ PHẢI có (1 quyết định) + (options) + (default); tổng **3–5 câu**; bỏ câu nào input đã trả lời.
- **BR-DISC-04 — Human gate:** Không "đóng" Discovery và không chuyển phase khi **chưa** có xác nhận của người dùng. (kế thừa BR-CORE-04)
- **BR-DISC-05 — Gate-before-next:** Chưa đạt Quality Gate 1 (**< 5/7**) → KHÔNG sang M2; nêu rõ thiếu gì + đề xuất bổ sung. (kế thừa BR-CORE-03)
- **BR-DISC-06 — Refine cap:** Cùng một mục refine **> 3 vòng** → đề xuất chốt hoặc escalate, không lặp vô hạn.
- **BR-DISC-07 — Traceability seed:** Feature List phải đặt tên Epic/Module sao cho M2 đặt được `US-[MODULE]-###`; không feature nào "mồ côi".
- **BR-DISC-08 — Output-standard:** Discovery Report mang YAML header (`document_type: "DISCOVERY"`, `author: "BA Super App"`) và kết bằng **đúng 1** câu hỏi refine. (kế thừa BR-CORE-01)
- **BR-DISC-09 — Scope guard:** Ngoài 7 domain khai báo → báo giới hạn, không cố sinh Discovery Report.

## 6. KPIs

| KPI | Mục tiêu | Đo bằng |
|-----|----------|---------|
| Quality Gate 1 pass-rate | **≥ 5/7** check đạt trước khi sang M2 | Gate 1 — Context Completeness |
| Socratic hiệu quả | **≤ 3–5** câu hỏi làm rõ/phiên Discovery | Đếm câu hỏi trong B2 |
| Vòng refine | **≤ 3** vòng/mục trước khi chốt | Đếm vòng refine (BR-DISC-06) |
| No-fabrication | **0** giá trị suy diễn không gắn `⚠️ Assumption` | Soát Discovery Report |
| Traceability seed | **100%** feature truy được về ≥ 1 mục tiêu/stakeholder | Soát Feature List vs Goals/Stakeholders |
| Context completeness | Discovery Report đủ **7 section** chuẩn template | So khớp `discovery-template.md` |

> ⚠️ Assumption: các ngưỡng "≤ 3–5 câu" và "≤ 3 vòng" lấy **trực tiếp** từ M1/master_prompt; chưa có baseline đo thực tế (no-backend MVP) nên xem là **target thiết kế**, chưa phải số đã hiệu chuẩn.

## 7. Assumptions / Constraints / Dependencies

**Assumptions**
- ⚠️ Assumption: người dùng cung cấp **ít nhất một** mô tả dự án (dù sơ bộ); nếu hoàn toàn trống, Discovery mở đầu bằng B1 (xin mô tả) chứ không tự sinh.
- ⚠️ Assumption: `[DOMAIN]` của dự án nằm trong **7 domain** controller hỗ trợ (banking | insurance | fintech | ecommerce | saas | healthcare | game).
- ⚠️ Assumption: một người dùng đại diện chốt thay cho nhóm stakeholder (xem §2).

**Constraints**
- **Conversational, no-backend (MVP):** Discovery chạy như hội thoại do LLM điều khiển; chưa persist server-side (lưu trữ thuộc Component 07).
- **Output-standard bắt buộc:** Discovery Report phải theo `output-standard.md` + `discovery-template.md`, không tuỳ tiện đổi format.
- **Scale mục tiêu:** medium (15–60 user story/dự án) — định cỡ kỳ vọng của Feature List.
- **Ngôn ngữ:** prose tiếng Việt; heading/ID tiếng Anh (Output Lock).

**Dependencies**
- **master_prompt.md ①** — route input vào M1 (phát hiện phase Discovery / lệnh `/discovery`).
- **core/output-standard.md** — quy ước YAML header + ID + format.
- **core/quality-gates.md** — định nghĩa **Gate 1: Context Completeness**.
- **templates/discovery-template.md** — khung Discovery Report.
- **inputs/project-context.md, inputs/stakeholder-map.md** — template thu thập đầu vào.
- **Hạ nguồn:** **M2 (User Story)** tiêu thụ Discovery Report; M3/M4 dùng làm nguồn context.

## 8. Traceability (REQ-DISC → FR-DISC)

| REQ-DISC | Mô tả ngắn | Hiện thực bởi (FR-DISC) |
|----------|-----------|--------------------------|
| REQ-DISC-01 | Nhận mô tả dự án (đa định dạng) | FR-DISC-01 |
| REQ-DISC-02 | Intent extraction (explicit vs inferred) | FR-DISC-02 |
| REQ-DISC-03 | Socratic 3–5 câu (options + default) | FR-DISC-03 |
| REQ-DISC-04 | No-fabrication / `⚠️ Assumption` | FR-DISC-02, FR-DISC-03 |
| REQ-DISC-05 | Cấu trúc hoá context (goals/users/features/scope) | FR-DISC-04 |
| REQ-DISC-06 | Sinh Discovery Report theo chuẩn | FR-DISC-05 |
| REQ-DISC-07 | Traceability seed (tên Epic/Module) | FR-DISC-04, FR-DISC-05 |
| REQ-DISC-08 | Quality Gate 1 (≥ 5/7) | FR-DISC-06 |
| REQ-DISC-09 | Tóm tắt + xác nhận, không tự đóng | FR-DISC-07 |
| REQ-DISC-10 | Refine ≤ 3 vòng | FR-DISC-08 |
| REQ-DISC-11 | Template project-context + stakeholder-map | FR-DISC-09 |
| REQ-DISC-12 | Báo giới hạn khi ngoài 7 domain | FR-DISC-10 |
| REQ-DISC-13 | Discovery rút gọn | FR-DISC-11 |

> Chiều ngược (FR-DISC → REQ-DISC) và map xuống framework (FR-DISC → M1-discovery) nằm ở [SRS §6](../../02-requirements/srs/01-discovery.md).

## 9. Revision History

| Version | Ngày | Thay đổi | Người |
|---------|------|----------|-------|
| 1.0 | 2026-06-02 | Khởi tạo BRD Component 01 — Discovery & Context Intake (13 REQ-DISC, 9 BR-DISC) theo chuẩn AIPlat; ground từ M1-discovery + inputs/. | BA Super App |

---

*BRD Component 01 — `DISC` · 13 REQ-DISC · 1:1 với [SRS 01-discovery](../../02-requirements/srs/01-discovery.md).*
