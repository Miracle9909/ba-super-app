<!--
  Document ID: CONV-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: quy hoạch lại theo chuẩn AIPlat; hợp nhất quy ước đặt tên/ID + chuẩn header file; trỏ tới 01-framework/core/output-standard.md cho chuẩn format deliverable.
-->

# BA Super App — Conventions

> Quy ước **đặt tên, ID, header tài liệu, và bảo trì** cho toàn dự án. Chuẩn **format deliverable** (output do framework sinh ra) nằm ở [`01-framework/core/output-standard.md`](../01-framework/core/output-standard.md) — file này là quy ước cấp **dự án**.

---

## 1. Ngôn ngữ

- **Prose:** tiếng Việt. **Identifier / thuật ngữ kỹ thuật / ID:** tiếng Anh (giữ nguyên).
- Tiêu đề mục (heading) & nhãn bảng: English chuẩn cho tài liệu kỹ thuật; nội dung diễn giải tiếng Việt.

## 2. Đặt tên file & thư mục

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Thư mục top-level | `{NN}-{slug}` (numbered) | `00-project`, `01-framework`, `02-web-app` |
| File tài liệu | `kebab-case.md` | `docs-structure.md`, `ba-role.md` |
| Module pipeline | `M{n}-{slug}.md` | `M1-discovery.md`, `M3-brd.md` |
| Template | `{type}-template.md` | `srs-template.md`, `brd-template.md` |
| File governance gốc | `UPPER.md` (chuẩn cộng đồng) | `README.md`, `CHANGELOG.md`, `ROADMAP.md`, `DOCUMENT-INDEX.md` |

> **Không** trộn snake_case / Tiếng Việt có dấu trong tên file (đã dọn các `phu_luc_1_raw.txt`… vào `_archive`).

## 3. Header tài liệu (BẮT BUỘC)

**Tài liệu DỰ ÁN** (00-project, README, framework spec) — dùng **HTML comment** ở đầu file:

```markdown
<!--
  Document ID: <PREFIX>-BASUPER-<version>
  Date: YYYY-MM-DD
  Version: x.y
  Status: Draft | Review | Approved
  Source: <nguồn / lý do>
-->
```

**DELIVERABLE do framework sinh ra** (BRD/SRS/US/Sprint trong `04-outputs`) — dùng **YAML frontmatter** theo [output-standard](../01-framework/core/output-standard.md):

```yaml
---
project: "[PROJECT_NAME]"
document_type: "[BRD|SRS|US|SPRINT|DISCOVERY]"
version: "1.0"
date: "[YYYY-MM-DD]"
author: "BA Super App"
status: "[draft|review|approved]"
---
```

**File MODULE framework** (`01-framework/modules/*`) — giữ YAML frontmatter mô tả module (`module/phase/name/input/output/next`).

## 4. ID Convention (deliverable nội bộ pipeline)

| Loại | Format | Ví dụ |
|------|--------|-------|
| Epic | `EP-[MODULE]-[###]` | `EP-SALES-001` |
| User Story | `US-[MODULE]-[###]` | `US-SALES-001` |
| BRD Requirement | `BRD-REQ-[###]` | `BRD-REQ-001` |
| SRS Functional | `SRS-FR-[###]` | `SRS-FR-001` |
| SRS Non-functional | `SRS-NFR-[###]` | `SRS-NFR-001` |
| Test Case | `TC-[###]` | `TC-001` |
| Diagram | `DG-[TYPE]-[###]` | `DG-BPMN-001` |
| Sprint | `SP-[###]` | `SP-001` |

> Chuỗi traceability chuẩn: `US → BRD-REQ → SRS-FR → TC` (xem [traceability-matrix](../01-framework/tools/traceability-matrix.md)).

## 5. Lệnh (command) — một chuẩn duy nhất

- Trong **IDE/Antigravity workflow**: tiền tố `/ba` — `/ba discovery`, `/ba brd`, `/ba validate`.
- Trong **chat standalone** (đã paste master_prompt): lệnh trần — `/discovery`, `/brd`, `/validate`.
- README và master_prompt PHẢI dùng nhất quán quy ước này (đã sửa lệch ở reorg v1.0).

## 6. Diagram

- Mọi sơ đồ dùng **Mermaid** (render-ready). Nhãn chứa ký tự đặc biệt (`/ : ( ) { } > ,`) phải **quote**.
- 8 loại hỗ trợ: BPMN/flowchart, sequence, state, ERD, C4, activity, journey, mindmap (xem `M5-diagram`).

## 7. Bảo trì

- Thêm/sửa/xoá tài liệu → cập nhật [`DOCUMENT-INDEX.md`](../DOCUMENT-INDEX.md) và [`CHANGELOG.md`](../CHANGELOG.md).
- Nâng version → cập nhật cả header file lẫn dòng tương ứng trong DOCUMENT-INDEX.
- Không xoá thẳng tài liệu cũ → chuyển vào `_archive/` (giữ lịch sử).

---

*conventions.md v1.0 — naming numbered/kebab + ID convention + header chuẩn (HTML-comment cho doc dự án, YAML cho deliverable).*
