<!--
  Document ID: README-02WEBAPP-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
-->

# 02-web-app — BA Super App Web Prototype

> Prototype **client-side** (vanilla JS + localStorage) hiện thực hoá [framework](../01-framework/). Mục tiêu: dashboard quản nhiều dự án + workspace nạp dữ liệu → chạy pipeline BA.

## Chạy thử

Pure static — **không cần build**. Mở trực tiếp [`index.html`](index.html) bằng trình duyệt (khuyên dùng Live Server / `python -m http.server` để tránh hạn chế `file://` khi fetch).

```
python -m http.server 8080   # rồi mở http://localhost:8080
```

## Cấu trúc

```
02-web-app/
├── index.html             ← Dashboard (danh sách project, stats)
├── workspace.html         ← Project workspace (5 tab: Thông tin/Nguồn/Tri thức/Pipeline/Báo cáo)
├── budget_dashboard.html  ← Phân tích budget (dark theme)
├── app.js                 ← Logic: ProjectStore (localStorage), tab, ingestion, parse mock
├── styles.css             ← Design system (Google Stitch) — hoàn chỉnh
└── data/                  ← mock_project.json · budget_data.js (dữ liệu mẫu)
```

## State & dữ liệu

- Lưu ở **localStorage** key `ba_super_app_projects`; không backend, không cloud sync (MVP).
- Dữ liệu mẫu: 2 project (BIDV Home GĐ3, MBL Insurance) ở `data/` + seed trong `app.js`.

## Ánh xạ Web ↔ Framework

| Web (tab/feature) | Framework tương ứng |
|-------------------|---------------------|
| Workspace → "Nguồn dữ liệu" (ingestion) | inputs/project-context (M1 Discovery input) |
| Workspace → "Tri thức" (entities/rules/glossary) | M1 Discovery → domain model |
| Workspace → "Pipeline" tab | M1→M6 ([modules](../01-framework/modules/)) |
| Workspace → "Báo cáo" | deliverable → [`../04-outputs`](../04-outputs/) |
| (chưa có) validation engine | [quality-gates](../01-framework/core/quality-gates.md) |

## Trạng thái (theo `_archive/plans/`)

| Phase | Hạng mục | Trạng thái |
|---|---|---|
| 1 | Input Processing & Domain Extraction (URL import, domain model CRUD) | 🟢 xong |
| 2 | Quality Gates & Consistency Check (validation engine, `/validate` report) | 🟡 dở |
| 3+ | Render Mermaid · nối AI thật (ChatGPT/Claude API) · lưu `04-outputs` | ⏳ chưa |

> Kế hoạch chi tiết Phase 1/2 (bản gốc) lưu ở [`../_archive/plans/`](../_archive/plans/). Lộ trình tổng: [ROADMAP](../ROADMAP.md).

## Nợ kỹ thuật cần dọn (P3)

- Hợp nhất 3 nguồn mock (hardcode `app.js` + `data/mock_project.json` + `data/budget_data.js`).
- Chưa có test; chưa render Mermaid; "Pipeline"/"Báo cáo" còn placeholder.
- Các script generator một-lần đã chuyển sang [`../_archive/web-scripts/`](../_archive/web-scripts/).
