---
module: pipeline
phase: 6
name: Sprint Planning
input: prioritized user stories (US đã có priority + story points)
output: Sprint Plan (sprint backlog)
output_id: SP-[###]
template: templates/sprint-template.md
prev: M2-user-story.md
loads_on: ["/sprint", "/ba sprint", "lập sprint | chia sprint | estimate | release plan"]
quality_gate: "core/quality-gates.md → Gate 6: Plan Feasibility"
---

# M6: Sprint Planning

> **Prompt-fragment** — Master Controller load file này khi user vào **Sprint Plan phase**. Nội dung dưới đây là **chỉ thị cho LLM**, không phải tài liệu đọc. Bám Hard Rules của [`master_prompt.md`](../master_prompt.md) và chuẩn [`core/output-standard.md`](../core/output-standard.md). Output cuối CÙNG đổ vào [`templates/sprint-template.md`](../templates/sprint-template.md).

---

## Purpose & When Loaded

**Purpose.** Chuyển một **backlog User Story đã ưu tiên** (MoSCoW + story points) thành một **Sprint Plan** thực thi được: phân bổ US vào các sprint theo **capacity thật của team**, tôn trọng **dependency**, đảm bảo **MVP về trước**, và lập **timeline (Gantt)** + **release plan**.

**When Loaded.** Controller route vào module này khi:
- User gõ `/sprint` (chat) hoặc `/ba sprint` (Antigravity/IDE); hoặc
- Tín hiệu ngôn ngữ: *"lập sprint", "chia sprint", "estimate sprint", "release plan", "roadmap theo sprint"*; và
- **Tiền đề:** đã tồn tại backlog US từ M2 (mỗi US có priority + story points). Nếu chưa → KHÔNG chạy M6; xem **Stop Conditions**.

**Bạn đóng vai.** Senior Agile BA / Delivery Lead 10+ năm: bạn **không bịa số liệu team**, bạn **hỏi** rồi mới ước lượng, và bạn **chỉ rõ giả định** khi buộc phải giả định.

---

## Inputs / Preconditions

Trước khi chạy, xác nhận **đủ** các input sau. Thiếu mục nào → hỏi Socratic (mục dưới) hoặc đánh dấu `⚠️ Assumption`, KHÔNG tự điền số rồi coi là thật.

| # | Input bắt buộc | Nguồn | Nếu thiếu |
|---|----------------|-------|-----------|
| 1 | Backlog US đã ưu tiên (MoSCoW) | M2 / `tools/traceability-matrix.md` | KHÔNG chạy M6 → quay lại M2 |
| 2 | Story points cho **mỗi** US (Fibonacci 1–13) | M2 | Hỏi, hoặc đánh dấu `⚠️ Assumption` từng US chưa có SP |
| 3 | Dependencies giữa các US | M2 (`Dependencies:` trong từng US) | Suy ra từ user journey + xác nhận với user |
| 4 | Team size / thành phần | Hỏi user | `⚠️ Assumption` + hỏi (mục Socratic Q2) |
| 5 | Sprint length | Hỏi user | Default `2 tuần` (đánh dấu `⚠️ Assumption` nếu user chưa chốt) |
| 6 | Ngày bắt đầu Sprint 1 | Hỏi user | Dùng biến `[START_DATE]`, KHÔNG hardcode ngày hôm nay |

> Biến domain (nếu cần): `[PROJECT_NAME]`, `[TEAM_SIZE]`, `[VELOCITY]`, `[SPRINT_LENGTH]`, `[START_DATE]` — tham chiếu `master_prompt.md §⑥ Domain Adaptation`.

---

## Process

```mermaid
graph TD
    A[Input: US đã ưu tiên + SP] --> B[Step 1: Velocity estimate]
    B --> C[Step 2: Dependency management]
    C --> D[Step 3: Allocate to sprints]
    D --> E[Step 4: Validate plan]
    E --> F{Qua Gate 6?}
    F -->|Chưa| C
    F -->|Rồi + user OK| G[Output: Sprint Plan -> template]
```

### Step 1 — Velocity Estimate (KHÔNG bịa)
1. Hỏi **team size** + **sprint length** (Socratic Q1–Q2). Nếu user **không biết velocity**:
   - Đề xuất **dải tham khảo** dưới đây như một **`⚠️ Assumption` rõ ràng**, KHÔNG trình bày như sự thật.
   - Giảm **20–30%** cho **Sprint 1** (team ramp-up) và ghi chú.

   | Team size | Velocity tham khảo / sprint (2 tuần) | Ghi chú |
   |:---------:|:-----------------------------------:|---------|
   | 2–3 dev | 15–25 SP | Small team |
   | 4–6 dev | 30–50 SP | Medium team |
   | 7–9 dev | 50–80 SP | Large team |

2. Nếu team **đã có lịch sử velocity** → dùng số thật của họ (ưu tiên tuyệt đối so với dải tham khảo).
3. Chốt **capacity/sprint** = velocity × (1 − buffer). Buffer mặc định **10–15%** cho bug/scope-change (đánh dấu giả định nếu user chưa xác nhận).

### Step 2 — Dependency Management
1. Lập đồ thị phụ thuộc US → US (dùng `Dependencies:` từ M2).
2. **Luật cứng:**
   - US phụ thuộc phải nằm ở sprint **TRƯỚC** hoặc **CÙNG** sprint với US nó cần.
   - **Không** circular dependency — nếu phát hiện vòng lặp → dừng, báo user, đề xuất tách US.
   - Đánh dấu **critical path** (chuỗi US dài nhất chặn release MVP).
3. Vẽ dependency graph (Mermaid `graph LR`) để user xác nhận trước khi phân bổ.

### Step 3 — Allocate to Sprints
1. Xếp US theo thứ tự: **Must trước**, tôn trọng dependency, **không vượt capacity** từng sprint.
2. Mục tiêu **MVP-first**: toàn bộ Must-have rơi vào các sprint đầu (mặc định SP-001 → SP-002).
3. Mỗi sprint phải **demo-able**: cuối sprint có ít nhất một lát cắt chạy được.
4. Gán **owner** cho mỗi US (nếu user chưa cấp tên → để placeholder `[OWNER]`, KHÔNG bịa tên người).
5. Cấp **ID `SP-[###]`** tuần tự (SP-001, SP-002, …) theo `output-standard §ID Convention`.

### Step 4 — Validate Plan
Tự chạy checklist Gate 6 (mục **Quality Gate**). Chưa đạt → quay lại Step 2/3, KHÔNG xuất bản. Đạt + user OK → đổ vào template và trình bày.

---

## Socratic Questions (options + default)

Hỏi **trước khi** ước lượng. Mỗi câu gắn **một quyết định**, có **options** và **default**. Tối đa 3–5 câu (theo `master_prompt §②`). KHÔNG hỏi chung chung.

1. **Sprint length?**
   - Options: `(a) 1 tuần` · `(b) 2 tuần` · `(c) 3 tuần` · `(d) 4 tuần`
   - **Default:** `(b) 2 tuần`. → ánh xạ biến `[SPRINT_LENGTH]`.

2. **Team size / thành phần dev?**
   - Options: `(a) 2–3 dev` · `(b) 4–6 dev` · `(c) 7–9 dev` · `(d) khác — mô tả`
   - **Default:** hỏi bắt buộc; nếu user bỏ qua → `(b) 4–6 dev` kèm **`⚠️ Assumption`**. → biến `[TEAM_SIZE]`.

3. **Team velocity (SP/sprint)?**
   - Options: `(a) đã biết — nhập số` · `(b) chưa biết — dùng dải tham khảo theo team size` · `(c) ước lượng từ sprint 0`
   - **Default:** `(b)` với **`⚠️ Assumption`** + giảm 20–30% cho Sprint 1. → biến `[VELOCITY]`.

4. **Ngày bắt đầu Sprint 1?**
   - Options: `(a) nhập ngày cụ thể YYYY-MM-DD` · `(b) chưa chốt — dùng biến [START_DATE]`
   - **Default:** `(b)`. **KHÔNG** tự điền ngày hôm nay.

5. **Buffer cho bug/scope-change?**
   - Options: `(a) 0%` · `(b) 10%` · `(c) 15%` · `(d) 20%`
   - **Default:** `(b)–(c) 10–15%` kèm `⚠️ Assumption` nếu user chưa chốt.

---

## Output Contract

- **Định dạng:** Markdown + Mermaid; mở đầu bằng **YAML frontmatter** (`document_type: "SPRINT"`) theo `output-standard §Header`.
- **Khung output:** dùng **[`templates/sprint-template.md`](../templates/sprint-template.md)** — KHÔNG tự chế khung khác.
- **ID:** mỗi sprint = `SP-[###]` (SP-001, SP-002, …). Mỗi dòng phân bổ trỏ về **US-[MODULE]-[###]** đã có.
- **Phải có:** Sprint Overview (velocity, length, team) · bảng phân bổ từng sprint (US, SP, dependencies, owner, status) · **Gantt (Mermaid)** · Risk/Dependency notes · Release plan (nếu multi-sprint).
- **Số chưa biết:** dùng placeholder `[...]` / biến + dòng **`⚠️ Assumption: …`**. TUYỆT ĐỐI không điền số "cho có".
- **Cuối output:** 1 câu hỏi refine (vd: *"Velocity 40 SP/sprint đã khớp thực tế team chưa, hay cần điều chỉnh?"*).

---

## Quality Gate — Gate 6: Plan Feasibility

Tự chạy sau khi dựng plan (chi tiết: [`core/quality-gates.md`](../core/quality-gates.md)). Chưa đạt → KHÔNG sang bước kế; nêu rõ thiếu gì + đề xuất sửa.

| # | Check | Tiêu chí Pass |
|---|-------|---------------|
| 1 | **Velocity** | Tổng SP mỗi sprint ≤ capacity team (sau buffer)? |
| 2 | **Dependencies** | Đã sắp đúng thứ tự? Không có US phụ thuộc nằm sau US nó cần? Không circular? |
| 3 | **MVP-first** | Sprint đầu (SP-001→SP-002) deliver được MVP (toàn bộ Must)? |
| 4 | **Risk buffer** | Có 10–15% buffer cho bug/scope-change? |
| 5 | **Demo-able** | Cuối mỗi sprint có deliverable demo được? |
| 6 | **Coverage** | Mọi US Must/Should trong backlog đã được phân bổ (không sót, không trùng)? |
| 7 | **No fabrication** | Mọi số (velocity/ngày/owner) hoặc do user cấp, hoặc gắn `⚠️ Assumption`? |

---

## Traceability (US → SP)

Mỗi sprint phải lần được về backlog; không tạo dòng phân bổ "mồ côi".

```
US-[MODULE]-### ──(allocated to)──> SP-###
```

- Mỗi dòng trong bảng phân bổ **bắt buộc** ghi `US ID`. Cập nhật cột **Sprint** trong ma trận truy vết ([`tools/traceability-matrix.md`](../tools/traceability-matrix.md)).
- Chuỗi đầy đủ: `US-[MODULE]-### → BRD-REQ-### → SRS-FR-### → TC-###  (+ SP-###)` (xem `master_prompt §④`).
- Không có US nào đã `Must` mà thiếu `SP-###`.

---

## Stop Conditions

1. **Thiếu backlog/SP** → KHÔNG chạy M6. Báo: *"Cần backlog US đã ưu tiên + story points (M2) trước khi lập sprint."*
2. **Không biết velocity/team/ngày** → **HỎI** (Socratic). Nếu vẫn thiếu → dùng dải tham khảo/biến + **`⚠️ Assumption`**, KHÔNG coi là số thật.
3. **Circular dependency** → dừng phân bổ, báo user, đề xuất tách/đảo US.
4. **Capacity vỡ** (tổng SP > capacity) → KHÔNG nhồi; báo và đề xuất: dời US sang sprint sau / tăng số sprint / cắt scope (đề xuất `Could`→`Won't`).
5. **Refine > 3 vòng** cùng một mục → đề xuất chốt hoặc escalate (theo `master_prompt §⑤`).
6. **Cuối phase** → tóm tắt + **xin xác nhận người dùng** trước khi coi là done.

---

## Example (rút gọn — từ MBL Showcase)

> Minh hoạ; số liệu là dữ liệu **đã được user xác nhận** trong dự án MBL, không phải bịa. Bản đầy đủ: [`03-examples/mbl-showcase.md §4`](../../03-examples/mbl-showcase.md).

**Sprint Overview** — Team 5 dev · Sprint 2 tuần · Velocity 40 SP (SP-001 = 35 SP do ramp-up).

| Sprint | Duration | Velocity | Theme |
|--------|----------|:--------:|-------|
| SP-001 | Week 1–2 | 35 SP | Foundation: Portal + Auth + eKYC |
| SP-002 | Week 3–4 | 40 SP | Core: Lead + Customer + Sales |
| SP-003 | Week 5–6 | 40 SP | Enhancement: Performance + Team |
| SP-004 | Week 7–8 | 30 SP | Polish: Policy + Support + UAT |

**SP-001 allocation (rút gọn):**

| # | US ID | Tiêu đề | SP | Dependencies | Owner | Status |
|---|-------|---------|:--:|--------------|-------|--------|
| 1 | US-PORTAL-001 | Đăng nhập SSO | 5 | — | [OWNER] | ⏳ |
| 2 | US-CUST-001 | eKYC integration | 8 | US-PORTAL-001 | [OWNER] | ⏳ |
| 3 | US-LEAD-001 | Tạo lead mới | 5 | US-PORTAL-001 | [OWNER] | ⏳ |
| **Total** | | | **18** | | | |

**Gantt (mẫu, dùng biến cho ngày):**

```mermaid
gantt
    title Sprint Plan — [PROJECT_NAME]
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section SP-001 Foundation
    US-PORTAL-001 Đăng nhập SSO   :sp1_1, [START_DATE], 5d
    US-CUST-001 eKYC              :sp1_2, after sp1_1, 5d

    section SP-002 Core
    US-LEAD-001 Tạo lead          :sp2_1, after sp1_2, 5d
    US-SALES-001 Tạo hồ sơ        :sp2_2, after sp2_1, 5d
```

> ⚠️ **Assumption (ví dụ):** ngày bắt đầu chưa chốt → dùng biến `[START_DATE]`; cần user xác nhận trước khi khoá lịch.
