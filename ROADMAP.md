<!--
  Document ID: ROADMAP-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
-->

# Roadmap — BA Super App

> Lộ trình cho **cả hai mảng**: Framework (prompt-kit) và Web App. Định vị: [vision](00-project/vision.md).

## Now — v2.0 (2026-06-02) 🟢

- [x] Reorg theo chuẩn AIPlat (numbered folders + governance + doc-index).
- [x] Viết lại sâu `master_prompt` v2.0 + M1–M6 + tách `templates/` (prompt-master).
- [x] Governance: vision, docs-structure, conventions, glossary, CHANGELOG, ROADMAP, .gitignore.
- [x] Dọn rác/trùng vào `_archive/`.

## Next — Framework hoàn thiện + Web Phase 2

- [ ] **Web app — Phase 2 Quality Gates**: validation engine (`App.runFullQualityValidation`), `/validate` report, UI `#page-quality` (dở từ v1.0 — xem [`_archive/plans/task.md`](_archive/plans/task.md)).
- [ ] **Render Mermaid** trong web (tab Pipeline/Báo cáo) — dùng [diagram-catalog](01-framework/templates/diagram-catalog.md).
- [ ] Bổ sung sample output đầy đủ vào `03-examples/` (mỗi template một mẫu thật).
- [ ] Flesh thêm `inputs/stakeholder-map` + ví dụ điền `project-context`.

## Later — Tích hợp & tự động hoá

- [ ] **Nối AI thật** (ChatGPT/Claude/Gemini API) để web chạy được pipeline `/discovery … /sprint` thực sự (không chỉ mock).
- [ ] **Auto-save deliverable** vào `04-outputs/{project}/` theo cấu trúc đã định.
- [ ] **Traceability matrix trực quan** (tab Báo cáo) + change-impact.
- [ ] Export Word/PDF; thư viện template theo domain (banking/insurance/…).
- [ ] Hợp nhất 3 nguồn mock của web (`app.js` + `data/*`); thêm test.

> Trạng thái pipeline tài liệu: [docs-structure §Lộ trình](00-project/docs-structure.md). Lịch sử: [CHANGELOG](CHANGELOG.md).
