<!--
  Document ID: INDEX-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: quy hoạch lại theo chuẩn AIPlat — master index toàn dự án.
-->

# Document Index — BA Super App

> Mục lục tổng. BA Super App = **Framework prompt-kit** (`01-framework`) + **Web App** (`02-web-app`), tổ chức theo chuẩn AIPlat (numbered folders + governance). Bắt đầu đọc từ [`00-project/README.md`](00-project/README.md). Mọi tài liệu đang **Draft** (reorg v2.0).

## 1. Bảng chỉ mục

| Folder | Document | Path | Version | Status |
|--------|----------|------|---------|--------|
| **root** | README — landing + quickstart | `README.md` | 2.0 | Draft |
| | Document Index (file này) | `DOCUMENT-INDEX.md` | 1.0 | Draft |
| | Changelog | `CHANGELOG.md` | 2.0.0 | Living |
| | Roadmap | `ROADMAP.md` | 1.0 | Draft |
| **00-project** | README — điều hướng governance | `00-project/README.md` | 1.0 | Draft |
| | Vision — định vị, USP, roadmap | `00-project/vision.md` | 1.0 | Draft |
| | Docs-Structure — bản đồ tài liệu, trục component | `00-project/docs-structure.md` | 1.0 | Draft |
| | Conventions — naming, ID, header, lệnh | `00-project/conventions.md` | 1.0 | Draft |
| | Glossary — thuật ngữ | `00-project/glossary.md` | 1.0 | Draft |
| **01-framework** | README — prompt-kit overview + pipeline | `01-framework/README.md` | 1.0 | Draft |
| | **Master Controller** v2.0 | `01-framework/master_prompt.md` | 2.0 | Draft |
| | core: BA Role | `01-framework/core/ba-role.md` | 1.0 | keep |
| | core: Output Standard | `01-framework/core/output-standard.md` | 1.0 | keep |
| | core: Quality Gates | `01-framework/core/quality-gates.md` | 1.0 | keep |
| | inputs: Project Context | `01-framework/inputs/project-context.md` | 1.0 | keep |
| | inputs: Stakeholder Map | `01-framework/inputs/stakeholder-map.md` | 1.0 | keep |
| | **M1 Discovery** | `01-framework/modules/M1-discovery.md` | 2.0 | Draft |
| | **M2 User Story** | `01-framework/modules/M2-user-story.md` | 2.0 | Draft |
| | **M3 BRD** | `01-framework/modules/M3-brd.md` | 2.0 | Draft |
| | **M4 SRS** | `01-framework/modules/M4-srs.md` | 2.0 | Draft |
| | **M5 Diagram** | `01-framework/modules/M5-diagram.md` | 2.0 | Draft |
| | **M6 Sprint Planning** | `01-framework/modules/M6-sprint-planning.md` | 2.0 | Draft |
| | tools: Chatbot Edit | `01-framework/tools/chatbot-edit.md` | 1.0 | keep |
| | tools: Traceability Matrix | `01-framework/tools/traceability-matrix.md` | 1.1 | Draft |
| | templates: discovery / user-story / brd / srs / diagram-catalog / sprint | `01-framework/templates/*.md` | 1.0 | Draft |
| **02-web-app** | README — setup, pages, framework mapping | `02-web-app/README.md` | 1.0 | Draft |
| | App (UI + logic + style) | `index.html · workspace.html · budget_dashboard.html · app.js · styles.css` | — | prototype |
| | Mock data | `02-web-app/data/mock_project.json · budget_data.js` | — | mock |
| **03-examples** | README + MBL showcase | `03-examples/README.md · mbl-showcase.md` | 1.0 | Draft |
| **04-outputs** | README — nơi deliverable sinh ra | `04-outputs/README.md` | 1.0 | Draft |
| **docs** ★ | **Đặc tả sản phẩm BA Super App** (BRD/SRS/NFR/UC/UF/Architecture) — trục 7 component (M1–M6 + Web-App), BRD↔SRS 1:1, 79 REQ / 65 FR | `docs/**` (xem [docs/DOCUMENT-INDEX.md](docs/DOCUMENT-INDEX.md)) | 1.0 | Draft |
| **_archive** | v1.0-framework · prototype · web-scripts · plans | `_archive/**` | 1.0 | Archived |

## 2. Trục component (pipeline)

`M1 Discovery → M2 User Story → M3 BRD → M4 SRS → M5 Diagram → M6 Sprint` — refine bất kỳ lúc nào qua `tools/chatbot-edit`. Chi tiết: [docs-structure](00-project/docs-structure.md).

## 3. Status legend

| Status | Nghĩa |
|--------|-------|
| **Living** | cập nhật liên tục |
| **Draft** | đang thực hiện, chưa duyệt |
| **keep** | giữ từ v1.0 (chưa cần sửa) |
| **prototype/mock** | code/dữ liệu demo |
| **Archived** | lịch sử, giữ tham khảo |

## 4. Bảo trì

Thêm/sửa/xoá tài liệu → cập nhật index này + [CHANGELOG](CHANGELOG.md). Không xoá thẳng → chuyển `_archive/`.
