---
module: core
type: quality
priority: P0
load: on-validate
---

# 🔍 Quality Gates — Kiểm Tra Chất Lượng

---

## Khi nào chạy Quality Gate?

| Trigger | Gate |
|---------|------|
| Sau M1 Discovery | Gate 1: Context Completeness |
| Sau M2 User Story | Gate 2: Story Quality |
| Sau M3 BRD | Gate 3: Business Completeness |
| Sau M4 SRS | Gate 4: Technical Completeness |
| Sau M5 Diagram | Gate 5: Diagram Accuracy |
| Sau M6 Sprint | Gate 6: Plan Feasibility |
| User gõ `/validate` | Full Gate (tất cả) |

---

## Gate 1: Context Completeness (sau Discovery)

| Check | Câu hỏi | Pass |
|-------|---------|------|
| Project Name | Đã có tên dự án? | ✅/❌ |
| Domain | Đã xác định domain? | ✅/❌ |
| Stakeholders | Đã liệt kê ≥2 stakeholders? | ✅/❌ |
| Business Goal | Đã có mục tiêu business rõ ràng? | ✅/❌ |
| User Types | Đã xác định ≥1 loại user? | ✅/❌ |
| Scope | Đã phân biệt in/out of scope? | ✅/❌ |
| Constraints | Đã liệt kê constraints? | ✅/❌ |

**Pass threshold:** ≥5/7

---

## Gate 2: Story Quality (sau User Story)

| Check | Tiêu chí |
|-------|---------|
| Format | Đúng format "As a / I want / So that"? |
| AC | Mỗi story có ≥1 Acceptance Criteria? |
| Given/When/Then | AC đúng format GWT? |
| INVEST | Independent, Negotiable, Valuable, Estimable, Small, Testable? |
| ID | Có ID đúng convention? |
| Priority | Đã gán priority (MoSCoW)? |
| Estimation | Đã có story points? |

**Pass threshold:** Mỗi US phải pass ≥5/7

---

## Gate 3: Business Completeness (sau BRD)

| Check | Tiêu chí |
|-------|---------|
| Scope | In-scope vs Out-of-scope rõ ràng? |
| Stakeholders | Liệt kê đầy đủ + RACI? |
| Business Rules | Đã document business rules? |
| Process Flow | Có ≥1 process flow diagram? |
| KPIs | Đã định nghĩa metrics đo lường? |
| Assumptions | Đã liệt kê assumptions? |
| Traceability | Mỗi BRD-REQ link được về US? |

---

## Gate 4: Technical Completeness (sau SRS)

| Check | Tiêu chí |
|-------|---------|
| FR Coverage | Mỗi BRD-REQ có ≥1 SRS-FR? |
| NFR | Đã có performance, security, scalability? |
| Data Model | Đã có ERD hoặc entity list? |
| API | Đã define API endpoints (nếu applicable)? |
| State Machine | Đã có state diagrams cho entities phức tạp? |
| Error Handling | Đã define error scenarios? |
| Integration | Đã define integration points? |

---

## Gate 5: Diagram Accuracy (sau Diagram)

| Check | Tiêu chí |
|-------|---------|
| Syntax | Mermaid code render được không lỗi? |
| Labeling | Tất cả nodes/edges có label rõ ràng? |
| Completeness | Diagram cover hết flow trong document? |
| Consistency | Thuật ngữ khớp với BRD/SRS? |

---

## Gate 6: Plan Feasibility (sau Sprint Planning)

| Check | Tiêu chí |
|-------|---------|
| Velocity | Tổng SP/sprint ≤ capacity team? |
| Dependencies | Đã sắp xếp theo dependency? |
| MVP First | Sprint 1-2 có deliver MVP? |
| Risk Buffer | Có buffer cho risks? |

---

## Consistency Checks (Cross-document)

Luôn kiểm tra khi có ≥2 documents:

```
1. THUẬT NGỮ: Cùng 1 concept → cùng 1 tên trong tất cả docs
2. TRACEABILITY: US → BRD → SRS chain không đứt
3. SCOPE: Không có feature trong SRS mà không có trong BRD
4. ACTORS: User types nhất quán giữa US, BRD, SRS
5. PRIORITY: Không conflict priority giữa các docs
```

---

## Output Format (khi chạy validate)

```markdown
## 🔍 Quality Gate Report

**Document:** [Tên document]
**Gate:** [Gate #]
**Date:** [YYYY-MM-DD]

### Kết quả

| # | Check | Status | Ghi chú |
|---|-------|--------|---------|
| 1 | [Check name] | ✅ Pass | — |
| 2 | [Check name] | ❌ Fail | [Lý do] |
| 3 | [Check name] | ⚠️ Warning | [Đề xuất] |

### Tổng kết
- ✅ Pass: X/Y
- ❌ Fail: X items cần fix
- ⚠️ Warning: X items nên xem xét

### Đề xuất
1. [Action item 1]
2. [Action item 2]
```
