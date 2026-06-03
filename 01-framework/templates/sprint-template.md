---
project: "[PROJECT_NAME]"
document_type: "SPRINT"
version: "1.0"
date: "[YYYY-MM-DD]"
author: "BA Super App"
status: "draft"
source: "User Story Backlog (M2)"
---

# Sprint Plan — [PROJECT_NAME]

> Sinh bởi **M6 — Sprint Planning**. Mọi số liệu phải do user cấp hoặc gắn `⚠️ Assumption`. Thay mọi `[...]` bằng giá trị thật trước khi khoá.

---

## Sprint Overview

| Thuộc tính | Giá trị |
|------------|---------|
| **Team size** | [TEAM_SIZE] dev |
| **Sprint length** | [SPRINT_LENGTH] (default: 2 tuần) |
| **Velocity / sprint** | [VELOCITY] SP |
| **Buffer** | [10–15]% (bug / scope-change) |
| **Start date (SP-001)** | [START_DATE] |
| **Số sprint dự kiến** | [N] |

> ⚠️ **Assumption:** [liệt kê mọi số chưa được user xác nhận — vd: velocity dùng dải tham khảo theo team size; START_DATE chưa chốt. Xoá dòng này nếu không có assumption.]

### Sprint Summary

| Sprint | Duration | Velocity Target | Theme / Goal |
|--------|----------|:---------------:|--------------|
| SP-001 | Week 1–[X] | [X] SP | [Theme — vd: Foundation + MVP Core] |
| SP-002 | Week [X]–[X] | [X] SP | [Theme] |
| SP-003 | Week [X]–[X] | [X] SP | [Theme] |
| SP-004 | Week [X]–[X] | [X] SP | [Theme] |

---

## Sprint Allocation

### SP-001: [Theme]
- **Goal:** [Sprint goal — 1 câu]
- **Capacity:** [X] SP / [Y] SP (sau buffer)

| # | US ID | Tiêu đề | SP | Dependencies | Owner | Status |
|---|-------|---------|:--:|--------------|-------|--------|
| 1 | US-[MODULE]-001 | [Title] | [SP] | — | [OWNER] | ⏳ |
| 2 | US-[MODULE]-002 | [Title] | [SP] | US-[MODULE]-001 | [OWNER] | ⏳ |
| 3 | US-[MODULE]-003 | [Title] | [SP] | [dep] | [OWNER] | ⏳ |
| **Total** | | | **[ΣSP]** | | | |

---

### SP-002: [Theme]
- **Goal:** [Sprint goal — 1 câu]
- **Capacity:** [X] SP / [Y] SP (sau buffer)

| # | US ID | Tiêu đề | SP | Dependencies | Owner | Status |
|---|-------|---------|:--:|--------------|-------|--------|
| 1 | US-[MODULE]-00X | [Title] | [SP] | [dep] | [OWNER] | ⏳ |
| 2 | US-[MODULE]-00X | [Title] | [SP] | [dep] | [OWNER] | ⏳ |
| **Total** | | | **[ΣSP]** | | | |

> Lặp khối `### SP-00X` cho mỗi sprint còn lại. Status: ⏳ chưa bắt đầu · 🔄 đang làm · ✅ xong · ❌ blocked.

---

## Dependency Graph

```mermaid
graph LR
    US1[US-[MODULE]-001: [Title]] --> US2[US-[MODULE]-002: [Title]]
    US1 --> US3[US-[MODULE]-003: [Title]]
    US2 --> US4[US-[MODULE]-004: [Title]]

    %% Highlight critical path
    style US1 fill:#ff6b6b,color:#fff
    style US2 fill:#ffd93d,color:#000
    style US4 fill:#6bcb77,color:#fff
```

> Luật: US phụ thuộc phải ở sprint TRƯỚC/CÙNG. Không circular. Tô màu **critical path**.

---

## Timeline (Gantt)

```mermaid
gantt
    title Sprint Plan — [PROJECT_NAME]
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section SP-001 [Theme]
    US-[MODULE]-001 [Title]   :sp1_1, [START_DATE], [X]d
    US-[MODULE]-002 [Title]   :sp1_2, after sp1_1, [X]d

    section SP-002 [Theme]
    US-[MODULE]-003 [Title]   :sp2_1, after sp1_2, [X]d
    US-[MODULE]-004 [Title]   :sp2_2, after sp2_1, [X]d
```

> Dùng biến `[START_DATE]` nếu ngày chưa chốt — KHÔNG hardcode ngày tuỳ tiện.

---

## Risk & Dependency Notes

| Sprint | Loại | Mô tả | Mức độ | Mitigation |
|--------|------|-------|:------:|------------|
| SP-001 | Risk | [vd: team ramp-up làm giảm velocity] | 🟡 | [giảm 20–30% velocity sprint đầu] |
| SP-00X | Dependency | [vd: chờ API bên thứ 3] | 🔴 | [xác nhận timeline integration] |
| SP-00X | Assumption | [vd: velocity chưa có lịch sử thực tế] | ⚠️ | [đo lại sau Sprint 1, re-plan] |

---

## Release Plan (Multi-Sprint)

| Release | Sprints | Scope | Target Date |
|---------|:-------:|-------|-------------|
| v1.0 MVP | SP-001 → SP-002 | [Core features — Must] | [DATE] |
| v1.1 | SP-003 → SP-004 | [Enhancements — Should] | [DATE] |
| v2.0 | SP-005+ | [Advanced — Could] | [DATE] |

---

## Lịch sử thay đổi

| Version | Ngày | Thay đổi | Người |
|---------|------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Khởi tạo Sprint Plan | BA Super App |
