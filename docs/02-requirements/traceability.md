<!--
  Document ID: TRACE-BASUPER-2.0
  Date: 2026-06-03
  Version: 2.0
  Status: Draft — for approval
  Source: tổng hợp từ BACKBONE-BASUPER-V2-1.0 §7 + bộ tài liệu v2 (BRD/SRS/NFR/UC/UF/ARCH/DATA/API/EPICS).
  Template: Traceability-Matrix.
-->

# Traceability Matrix — BA Super App v2

> Ma trận truy vết **một chiều xuôi** (REQ→FR→UC→Epic→Story→NFR) và **kiểm phủ ngược** (FR/NFR→REQ), đảm bảo không sót/đứt liên kết.
>
> **Lưu ý ID:** đây truy vết cho **CHÍNH sản phẩm** BA Super App (REQ-/FR-/NFR-/UC-/EPIC-/STORY-/ENT-). KHÔNG lẫn với `BRD-REQ-### · SRS-FR-### · TC-###` là ID mà công cụ **sinh ra cho dự án khách**.

## 1. Nguồn & quy ước

| Loại | Khoảng ID | Tài liệu chủ |
|---|---|---|
| Business Requirement | REQ-001..022 | [brd.md](../01-business/brd.md) |
| Functional Requirement | FR-{PREFIX}-## (49) | [srs.md](srs.md) |
| Non-Functional | NFR-{U/R/M/P/PF/S/AI/SC}## (32) | [nfr.md](nfr.md) |
| Use Case | UC-01..15 | [use-cases.md](use-cases.md) |
| Flow | Flow 1..7 | [user-flows.md](user-flows.md) |
| Epic / Story | EPIC-01..17 / STORY-x.y | [../04-planning/epics-stories.md](../04-planning/epics-stories.md) |
| Entity | ENT-01..15 | [../03-architecture/data-model.md](../03-architecture/data-model.md) |
| Capability | C01..12 | [../04-planning/_v2-backbone.md](../04-planning/_v2-backbone.md) |

## 2. Ma trận xuôi — REQ → FR → UC → Epic → Story(P1) → NFR

| REQ | FR chính | UC | Epic | Story P1 | NFR | Release |
|---|---|---|---|---|---|:--:|
| REQ-001 | INGEST-01 | UC-01 | EPIC-02 | STORY-2.1 | U03, PF01 | P1 |
| REQ-002 | INGEST-02..05 | UC-02 | EPIC-02 | STORY-2.2/2.3/2.4/2.5 | S03, S06, PF04 | P1 |
| REQ-003 | TPL-01..03 | UC-03 | EPIC-03/11 | STORY-3.1 | M02 | P1/P3 |
| REQ-004 | DOMAIN-01..04 | UC-01 | EPIC-04 | STORY-4.1..4.4 | M02 | P1 |
| REQ-005 | DISC-01..05 | UC-04 | EPIC-05 | STORY-5.1..5.4 | U01, U05, R05, AI01 | P1 |
| REQ-006 | DISC-04, QUAL-06 | UC-05 | EPIC-05/10 | STORY-5.3 | R01, R05, AI01 | P1 |
| REQ-007 | NEWREQ-01..04 | UC-06 | EPIC-06 | — | AI02 | P2 |
| REQ-008 | FUNC-01..03 | UC-07 | EPIC-07 | — | — | P2 |
| REQ-009 | EST-01..05 | UC-08 | EPIC-08 | — | — | P2 |
| REQ-010 | ENH-01..04 | UC-09 | EPIC-09 | — | R02 | P2 |
| REQ-011 | PIPE-01..05 | UC-10 | EPIC-06..09 | — | U02, P04 | P2 |
| REQ-012 | QUAL-01 | UC-11 | EPIC-10 | — | R02 | P2 |
| REQ-013 | QUAL-02 | UC-11 | EPIC-10 | — | AI02 | P2 |
| REQ-014 | QUAL-03..04 | UC-09/11 | EPIC-10 | — | — | P2 |
| REQ-015 | OUTPUT-01 | UC-12 | EPIC-11 | — | M02, P05 | P3 |
| REQ-016 | OUTPUT-02 | UC-12 | EPIC-11 | — | — | P3 |
| REQ-017 | OUTPUT-03..04 | UC-12/13 | EPIC-12 | — | P05 | P3 |
| REQ-018 | OUTPUT-05 | UC-12 | EPIC-13 | — | — | P3 |
| REQ-019 | QUAL-01, DISC-01 | UC-05/11 | cross | STORY-5.2 | R01 | mọi P |
| REQ-020 | PLAT-01 | UC-15 | EPIC-01 | STORY-1.2 | R04 | P1 |
| REQ-021 | PLAT-02..04 | UC-14 | EPIC-05/16 | STORY-5.1 | S04, S07, AI03 | P1 |
| REQ-022 | PLAT-05..06 | UC-15 | EPIC-15 | — | SC01, SC02 | P4 |

## 3. Phủ theo Capability (C01–C12)

| Cap | FR | REQ | Epic | Release chính |
|---|---|---|---|:--:|
| C01 Ingestion | INGEST-01..06 | 001,002 | EPIC-02 | P1 |
| C02 Template Intake | TPL-01..03 | 003 | EPIC-03/11 | P1/P3 |
| C03 Domain Packs | DOMAIN-01..04 | 004 | EPIC-04 | P1 |
| C04 Discovery Copilot | DISC-01..05 | 005,006,019 | EPIC-05 | P1 |
| C05 New Requirement | NEWREQ-01..04 | 007 | EPIC-06 | P2 |
| C06 Function List | FUNC-01..03 | 008 | EPIC-07 | P2 |
| C07 Estimate | EST-01..05 | 009 | EPIC-08 | P2 |
| C08 Enhance | ENH-01..04 | 010 | EPIC-09 | P2 |
| C09 Pipeline M1–M6 | PIPE-01..05 | 011 | EPIC-06..09 | P2 |
| C10 Traceability & Quality | QUAL-01..06 | 012,013,014,019 | EPIC-10 | P2 |
| C11 Template & Output | OUTPUT-01..05 | 015,016,017,018 | EPIC-11..13 | P3 |
| C12 Platform | PLAT-01..06 | 020,021,022 | EPIC-01/15/16/17 | P1/P4 |

## 4. Kiểm phủ ngược — không orphan

- **FR → REQ:** mọi prefix FR (INGEST/TPL/DOMAIN/DISC/NEWREQ/FUNC/EST/ENH/PIPE/QUAL/OUTPUT/PLAT) đều gắn ≥1 REQ ở §2/§3 → **0 FR mồ côi**.
- **REQ → FR:** REQ-001..022 đều có ≥1 FR hiện thực → **0 REQ chưa phủ**.
- **REQ → Epic:** REQ-001..022 đều thuộc ≥1 Epic (EPIC-01..17) → **0 REQ thiếu backlog**.
- **UC → FR:** UC-01..15 đều trỏ FR (xem [use-cases.md](use-cases.md) mục "FR liên quan").
- **Function → Requirement (sản phẩm khách):** ràng buộc no-orphan thực thi bởi FR-FUNC-02 (mỗi function ≥1 requirement).

## 5. NFR → REQ/FR (phủ phi chức năng)

| Nhóm NFR | Gắn vào | REQ/FR tiêu biểu |
|---|---|---|
| Usability U01–U05 | Discovery UX, output | REQ-005 (DISC), REQ-011 (PIPE) |
| Reliability R01–R05 | anti-hallucination, gate, persistence | REQ-006, REQ-012, REQ-020 |
| Maintainability M01–M05 | pack=data, adapter | REQ-004, REQ-021 |
| Portability P01–P05 | multi-LLM, export | REQ-011, REQ-017 |
| Performance PF01–PF04 | dashboard, copilot, parse | REQ-001, REQ-002, REQ-005 |
| Security S01–S07 | secret/PII/injection/residency | REQ-002, REQ-021 |
| AI-quality AI01–AI04 | grounding, EARS, token budget | REQ-005, REQ-007/013, REQ-021 |
| Scalability SC01–SC02 | multi-user (P4) | REQ-022 |

## 6. Tổng kết phủ (coverage summary)

| Hạng mục | Số lượng | Phủ |
|---|---|:--:|
| Business Requirement (REQ) | 22 | 100% có FR + Epic |
| Functional Requirement (FR) | 49 | 100% gắn REQ |
| Non-Functional (NFR) | 32 | 100% gắn REQ/FR |
| Use Case (UC) | 15 | 100% gắn FR |
| Flow | 7 | gắn UC |
| Epic / Story | 17 / 49 | P1 chi tiết (16 story, 64 SP) |
| Entity (ENT) | 15 | trong data-model |

## 7. Test Cases — forward note

`TC-###` cho **chính sản phẩm** sẽ sinh ở giai đoạn QA (test-plan riêng), mở rộng ma trận thành `REQ→FR→UC→Story→TC`. Mỗi AC Given-When-Then trong [srs.md](srs.md)/[epics-stories.md](../04-planning/epics-stories.md) là hạt giống ≥1 TC. (Khác với `TC-###` mà công cụ sinh cho deliverable khách.)

## ⚠️ Open Questions & Assumptions
- Ma trận ở mức REQ→FR→UC→Epic; **story-level đầy đủ P2–P4** sẽ bổ sung khi vào từng phase (hiện chỉ P1 chi tiết).
- TC chưa tồn tại (giai đoạn QA) → cột TC để trống có chủ đích.
- Một REQ map nhiều FR/Epic (vd REQ-011 → PIPE-* qua nhiều Epic tác vụ) — chấp nhận quan hệ n-n.
- Khi đổi backbone ID → **phải cập nhật lại ma trận này trước tiên** (nguồn phái sinh).

---
*traceability.md v2.0 — phủ 22 REQ · 49 FR · 32 NFR · 15 UC · 17 EPIC/49 story · 15 ENT; 0 orphan. Nguồn ID: [_v2-backbone.md](../04-planning/_v2-backbone.md).*
