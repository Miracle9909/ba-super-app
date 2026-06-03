---
project: "[PROJECT_NAME]"
document_type: "US"
version: "1.0"
date: "[YYYY-MM-DD]"
author: "BA Super App"
status: "draft"
domain: "[DOMAIN]"
source: "Discovery Report (M1)"
---

# User Story Backlog — [PROJECT_NAME]

> Template output của M2. Thay mọi `[...]` bằng nội dung thật từ Feature List / Discovery.
> Giữ ID convention: Epic `EP-[MODULE]-[###]`, Story `US-[MODULE]-[###]` (`[MODULE]` viết HOA, `[###]` = 3 chữ số).
> AC LUÔN dạng Given / When / Then. Giả định chưa xác nhận → đánh `⚠️ Assumption`.

---

## 1. Overview

| Metric | Value |
|--------|-------|
| Total Epics | [X] |
| Total User Stories | [X] |
| Total Story Points | [X] |
| Must-have | [X] US ([Y] SP) |
| Should-have | [X] US ([Y] SP) |
| Could-have | [X] US ([Y] SP) |

---

## 2. Backlog

| ID | Tiêu đề | Epic | Priority | SP | Sprint |
|----|---------|------|:--------:|:--:|:------:|
| US-[MODULE]-001 | [Tiêu đề] | EP-[MODULE]-001 | 🔴 Must | [SP] | SP-001 |
| US-[MODULE]-002 | [Tiêu đề] | EP-[MODULE]-001 | 🟡 Should | [SP] | SP-002 |
| US-[MODULE]-003 | [Tiêu đề] | EP-[MODULE]-002 | 🟢 Could | [SP] | SP-003 |

> Priority: 🔴 Must · 🟡 Should · 🟢 Could · ⚪ Won't — Story Points (Fibonacci): 1 · 2 · 3 · 5 · 8 · 13 (13 = phải tách nhỏ).

---

## 3. User Stories (chi tiết)

### Epic: EP-[MODULE]-[###] — [Tên Epic]

#### US-[MODULE]-[###]: [Tiêu đề ngắn]

**Epic:** EP-[MODULE]-[###]

**As a** [user type]
**I want** [chức năng mong muốn]
**So that** [giá trị / lợi ích nhận được]

**Acceptance Criteria:**

- **AC1:** Given [precondition — trạng thái ban đầu], When [action — hành động user], Then [expected result — kết quả mong đợi]
- **AC2:** Given [precondition], When [invalid input], Then [error handling]
- **AC3:** Given [edge condition], When [action], Then [specific behavior]

**Business Rules:** [quy tắc nghiệp vụ áp dụng — gắn nguồn; nếu suy luận: ⚠️ Assumption]
**UI Notes:** [ghi chú giao diện nếu có]
**Dependencies:** [US-[MODULE]-[###] cần hoàn thành trước / —]

**Priority:** [🔴 Must | 🟡 Should | 🟢 Could | ⚪ Won't]   **Story Points:** [1|2|3|5|8|13]   **Module:** [Module name]

---

<!-- Lặp lại khối #### US-... cho từng story trong Epic; lặp lại khối ### Epic cho từng Epic -->

---

## 4. INVEST Self-Check

| US ID | I | N | V | E | S | T | Pass (≥5/6) |
|-------|:-:|:-:|:-:|:-:|:-:|:-:|:-----------:|
| US-[MODULE]-001 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| US-[MODULE]-002 | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ |

> I=Independent · N=Negotiable · V=Valuable · E=Estimable · S=Small · T=Testable.

---

## 5. Open Questions / Assumptions

- ⚠️ Assumption: [giả định cần user xác nhận]
- ❓ [câu hỏi còn mở chặn việc chốt backlog]

---

## Lịch sử thay đổi

| Version | Ngày | Thay đổi | Người |
|---------|------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Khởi tạo backlog | BA Super App |
