---
project: "[PROJECT_NAME]"
document_type: "BRD"
version: "1.0"
date: "[YYYY-MM-DD]"
author: "BA Super App"
status: "draft"
prepared_by: "[Tên BA / team]"
approved_by: "[TBD — 1 người Accountable]"
---

# BRD — [PROJECT_NAME]

> Khung Business Requirements Document. Điền vào mọi `[...]`. Mục không có dữ liệu → ghi `[Chưa xác định]` (kèm `⚠️ Assumption` nếu là giả định), KHÔNG xoá section. Tuân thủ `core/output-standard.md`.

---

## 1. Executive Summary

[Tóm tắt 3–5 câu: dự án là gì · giải quyết vấn đề gì · cho ai · giá trị nghiệp vụ cốt lõi. Không dùng thuật ngữ kỹ thuật ở đây.]

---

## 2. Business Objectives

[2–5 mục tiêu nghiệp vụ đo được. Mỗi objective phải có metric + target + mốc thời gian.]

| # | Objective | KPI / Metric | Target | Timeline |
|---|-----------|--------------|--------|----------|
| BO-001 | [Mục tiêu nghiệp vụ] | [Chỉ số đo] | [Giá trị mục tiêu] | [Mốc] |
| BO-002 | [...] | [...] | [...] | [...] |

---

## 3. Scope

### 3.1 In-Scope

[Hạng mục có User Story tương ứng — sẽ được xây trong release này.]

| # | Feature / Module | Mô tả ngắn | Priority |
|---|------------------|------------|----------|
| 1 | [Feature] | [Mô tả] | 🔴 Must |
| 2 | [...] | [...] | 🟡 Should |

### 3.2 Out-of-Scope

[Hạng mục KHÔNG làm trong release này — nêu lý do để chặn scope creep.]

- [Feature X] — Lý do: [reason]
- [Feature Y] — Lý do: [reason]

---

## 4. Stakeholders & Users

### 4.1 Stakeholders (RACI)

[Liệt kê đầy đủ; bắt buộc có ≥1 **Accountable**. R=Responsible, A=Accountable, C=Consulted, I=Informed. Tham chiếu: `inputs/stakeholder-map.md`.]

| Stakeholder | Vai trò | RACI | Mối quan tâm chính |
|-------------|---------|:----:|--------------------|
| [Tên/role] | [Role] | A | [Quan tâm] |
| [Tên/role] | [Role] | R | [...] |

### 4.2 User Personas

[User types phải khớp với `As a ...` trong User Stories.]

| User Type | Mô tả | Số lượng | Primary Actions |
|-----------|-------|:--------:|-----------------|
| [Type] | [Mô tả] | [Count] | [Hành động chính] |

---

## 5. Business Requirements

[Mỗi nhóm User Story → 1 `BRD-REQ-###`. ID 3 chữ số, tăng dần từ 001. Bắt buộc có: Mô tả · Rationale · Priority · Source (US-ID) · Business Rules liên quan.]

### BRD-REQ-001: [Tên requirement]
- **Mô tả:** [Yêu cầu nghiệp vụ — hệ thống/quy trình cần làm gì, ở mức business.]
- **Rationale:** [Vì sao cần — liên kết về Objective BO-###.]
- **Priority:** [🔴 Must | 🟡 Should | 🟢 Could | ⚪ Won't]
- **Source:** [US-XXX-001, US-XXX-002]
- **Business Rules:** [BR-001, BR-002]

### BRD-REQ-002: [Tên requirement]
- **Mô tả:** [...]
- **Rationale:** [...]
- **Priority:** [...]
- **Source:** [...]
- **Business Rules:** [...]

---

## 6. Business Rules

[Quy tắc nghiệp vụ chi phối yêu cầu — trích/hợp nhất từ Acceptance Criteria của US. Dùng cho nhiều BRD-REQ.]

| # | Rule | Mô tả | Impact |
|---|------|-------|--------|
| BR-001 | [Tên rule] | [Điều kiện/ngưỡng nghiệp vụ] | [Module/flow bị ảnh hưởng] |
| BR-002 | [...] | [...] | [...] |

---

## 7. KPIs / Success Metrics

[Cách đo thành công của dự án. Có thể trùng KPI ở mục 2 nhưng chi tiết hơn về cách đo.]

| KPI | Mô tả | Baseline | Target | Cách đo / Tần suất |
|-----|-------|----------|--------|--------------------|
| [KPI] | [Mô tả] | [Hiện tại] | [Mục tiêu] | [Nguồn dữ liệu / Daily-Weekly] |

---

## 8. Assumptions & Constraints

### 8.1 Assumptions

[Giả định đang dựa vào. Mọi giả định chưa được nguồn xác nhận đánh dấu ⚠️.]

- ⚠️ [Assumption 1]
- [Assumption 2]

### 8.2 Constraints

[Ràng buộc: thời gian, ngân sách, công nghệ, pháp lý/tuân thủ `[COMPLIANCE]`.]

- [Constraint 1]
- [Constraint 2 — vd: tuân thủ PDPA/PCI-DSS nếu áp dụng]

---

## 9. Traceability

[Mọi BRD-REQ phải dẫn về ≥1 US; mọi US phải được phủ. Cột SRS-FR điền ở phase M4.]

| BRD-REQ | User Story (Source) | SRS-FR (M4) |
|---------|---------------------|-------------|
| BRD-REQ-001 | US-XXX-001 | [→ M4] |
| BRD-REQ-002 | US-XXX-002, US-XXX-003 | [→ M4] |

---

## Lịch sử thay đổi

| Version | Ngày | Thay đổi | Người |
|---------|------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Khởi tạo | BA Super App |
