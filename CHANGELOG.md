<!--
  Document ID: CHANGELOG-BASUPER
  Date: 2026-06-02
  Status: Living
-->

# Changelog — BA Super App

> Theo tinh thần [Keep a Changelog](https://keepachangelog.com/). Mọi thay đổi tài liệu/cấu trúc ghi ở đây.

## [2.0.0] — 2026-06-02 — Reorg theo chuẩn AIPlat + viết lại sâu framework

### Added
- **Governance `00-project/`**: `vision.md`, `docs-structure.md`, `conventions.md`, `glossary.md`, `README.md`.
- **Root**: `DOCUMENT-INDEX.md`, `CHANGELOG.md`, `ROADMAP.md`, `.gitignore`.
- **`01-framework/templates/`** (6): `discovery-`, `user-story-`, `brd-`, `srs-template.md`, `diagram-catalog.md`, `sprint-template.md` — tách khung output khỏi module.
- **README per-folder**: `01-framework/`, `02-web-app/`, `03-examples/`, `04-outputs/`.
- **`04-outputs/`**: thư mục đích cho deliverable sinh ra.

### Changed
- **Cấu trúc numbered** (theo AIPlat): `00-project / 01-framework / 02-web-app / 03-examples / 04-outputs / _archive`.
- **`master_prompt.md` → v2.0**: viết lại sâu theo prompt-master (PRIMACY zone, intent→phase routing, output-lock, stop conditions, path mới).
- **M1–M6 modules**: viết lại sâu thành prompt-fragment chuẩn (Purpose · Inputs · Process · Socratic · Output Contract · Quality Gate · Traceability · Stop Conditions · Example).
- **Naming chuẩn hoá** kebab-case: `ba_role.md → core/ba-role.md`, `M4_srs.md → modules/M4-srs.md`, …
- **Web app** dời vào `02-web-app/` (+ `data/` gom mock); `traceability-matrix` enhanced.
- Sửa lệch framework: `04_templates` (cũ trỏ nhưng thiếu) nay là `templates/`; thống nhất command prefix (`/ba` IDE vs `/` standalone).

### Archived (chuyển `_archive/`, không xoá)
- `v1.0-framework/`: bản gốc `master_prompt` + `00_core/01_input/02_modules/03_tools`.
- `prototype/`: `ba-super-app-prototype.html` (bản Tailwind cũ, trùng web/).
- `web-scripts/`: `generate_*`, `update_*`, `*_raw.txt`, `mbl-seed.js`, `test-project.md`.
- `plans/`: `implementation_plan.md`, `task.md` (kế hoạch web Phase 1/2).

## [1.0.0] — 2026 — Bản đầu (AntiGravity)
- Framework prompt + web prototype; pipeline Discovery→Sprint; dựa trên dự án MBL.
