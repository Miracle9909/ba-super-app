<!--
  Document ID: INDEX-DOCS-BASUPER-2.0
  Date: 2026-06-03
  Version: 2.0
  Status: Draft — for approval
  Source: master index cho docs/ — cập nhật lên v2 (trục 12 capability + 4 lớp). Thay trục 7-component v1.
-->

# Document Index — `docs/` (BA Super App v2 Product Specs)

> Mục lục **tài liệu đặc tả sản phẩm** BA Super App **v2**. Trục mới = **12 capability** ánh xạ **4 lớp** (Input → Khai phá cùng AI chuyên gia domain → 4 loại tác vụ → Output theo template). Tư tưởng v2 & roadmap: [`04-planning/implementation-plan.md`](04-planning/implementation-plan.md).

## 1. Bảng chỉ mục (v2)

| Folder | Document | Path | Version |
|--------|----------|------|---------|
| 00-project | Vision & Positioning | `../00-project/vision.md` | 1.0 |
| 01-business | Product Brief | `01-business/product-brief.md` | 1.0 |
| | **BRD** | `01-business/brd.md` | **2.0** |
| | BRD per-component (7) — *v1 legacy* | `01-business/brd/{01…07}.md` | 1.0 ⚠️ |
| 02-requirements | **SRS** | `02-requirements/srs.md` | **2.0** |
| | **NFR** | `02-requirements/nfr.md` | **2.0** |
| | **Use Cases** | `02-requirements/use-cases.md` | **2.0** |
| | **User Flows** | `02-requirements/user-flows.md` | **2.0** |
| | **Traceability Matrix** 🆕 | `02-requirements/traceability.md` | **2.0** |
| | SRS per-component (7) — *v1 legacy* | `02-requirements/srs/{01…07}.md` | 1.0 ⚠️ |
| 03-architecture | **ARCHITECTURE** | `03-architecture/ARCHITECTURE.md` | **2.0** |
| | **Data Model** 🆕 | `03-architecture/data-model.md` | **2.0** |
| | **API Contract** 🆕 | `03-architecture/api-contract.md` | **2.0** |
| 04-planning | Implementation Plan | `04-planning/implementation-plan.md` | 1.0 |
| | P1 Scope | `04-planning/p1-scope.md` | 1.0 |
| | **Epics & User Stories** 🆕 | `04-planning/epics-stories.md` | **2.0** |
| | _Backbone ID (internal)_ | `04-planning/_v2-backbone.md` | 1.0 |

## 2. Trục Capability v2 (12) — ánh xạ 4 lớp

| Cap | Tên | Lớp | FR prefix |
|---|---|---|---|
| C01 | Project & Ingestion | L1 Input | `INGEST` |
| C02 | Template Intake | L1 Input | `TPL` |
| C03 | Domain Expert Packs | L2 Khai phá | `DOMAIN` |
| C04 | Discovery Copilot | L2 Khai phá | `DISC` |
| C05 | Task · Yêu cầu mới | L3 Tác vụ | `NEWREQ` |
| C06 | Task · Function List | L3 Tác vụ | `FUNC` |
| C07 | Task · Estimate | L3 Tác vụ | `EST` |
| C08 | Task · Enhance | L3 Tác vụ | `ENH` |
| C09 | Generation Pipeline (M1–M6) | cross | `PIPE` |
| C10 | Traceability & Quality | cross | `QUAL` |
| C11 | Template & Output/Export | L4 Output | `OUTPUT` |
| C12 | Platform (Storage/LLM/Security) | cross | `PLAT` |

> Nguồn ID gốc: [`04-planning/_v2-backbone.md`](04-planning/_v2-backbone.md). Map đầy đủ REQ→FR→UC→Epic→NFR: [`02-requirements/traceability.md`](02-requirements/traceability.md).

## 3. ID scheme

- **Sản phẩm:** REQ-### (business) · FR-{PREFIX}-## (functional) · NFR-{U/R/M/P/PF/S/AI/SC}## · UC-## · EPIC-##/STORY-x.y · ENT-## · C01–C12 (capability) · R-01..R-08 (architecture invariant) · ADR-0x.
- **Công cụ sinh cho khách (KHÔNG lẫn):** BRD-REQ-### · SRS-FR-### · TC-###.

## 4. Lưu ý chuyển v1 → v2

- **BRD/SRS/NFR/Use-Cases/User-Flows/ARCHITECTURE** đã nâng lên **2.0** (trục 12 capability, REQ-001..022, FR-{PREFIX}, R-01..R-08).
- ⚠️ **Subfolder `brd/{01…07}` và `srs/{01…07}`** vẫn là **v1 (trục 7-component M1–M6 + Web)** — **chưa** chuyển sang trục capability v2; coi là *tài liệu tham chiếu legacy*, sẽ archive/viết lại theo capability khi cần. Bản overview `brd.md`/`srs.md` v2 KHÔNG còn phụ thuộc các subfolder này.
- **product-brief.md / vision.md** (1.0) vẫn đúng ở mức định vị; tư tưởng v2 mở rộng nằm ở `implementation-plan.md`.

## 5. Quan hệ với phần còn lại của repo

```
00-project/ (governance + vision) ─ docs/ (đặc tả SẢN PHẨM v2) ─ 01-framework/ (prompt-kit M1–M6) ─ 02-web-app/ (web + _design-src prompts)
```

> `docs/` đặc tả **chính BA Super App**; deliverable công cụ *sinh cho khách* nằm ở [`../04-outputs/`](../04-outputs/). Mục lục toàn repo: [`../DOCUMENT-INDEX.md`](../DOCUMENT-INDEX.md).

---
*INDEX v2.0 — 9 tài liệu v2 (BRD/SRS/NFR/UC/UF/ARCH/DATA/API/EPICS + Traceability) trên trục 12 capability; subfolder brd/srs giữ v1 legacy.*
