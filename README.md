<!--
  Document ID: README-BASUPER-2.0
  Date: 2026-06-02
  Version: 2.0
  Status: Draft
-->

# 🧠 BA Super App v2.0

> Hệ thống AI hỗ trợ **Business Analyst** toàn diện: bộ **prompt-kit + web app** chạy pipeline **Discovery → User Story → BRD → SRS → Diagram → Sprint**, với chuẩn output nhất quán và traceability xuyên suốt. Định vị đầy đủ: [00-project/vision.md](00-project/vision.md).

---

## ⚡ Quick Start

**Cách 1 — Standalone (mọi AI tool):** copy toàn bộ [`01-framework/master_prompt.md`](01-framework/master_prompt.md) vào ChatGPT/Claude/Gemini → paste mô tả dự án → AI tự nhận diện phase và dẫn pipeline.

**Cách 2 — Antigravity/IDE:** gọi `/ba` để bắt đầu (`/ba discovery`, `/ba brd`, `/ba validate`…).

**Cách 3 — Chạy React Web App (Local First - Phase 1):**
1. Mở terminal và chạy lệnh:
   ```bash
   cd v2-web-app
   npm install
   npm run dev
   ```
2. Truy cập `http://localhost:5173`
3. Cấu hình **Anthropic API Key**: Mở tab "Cài đặt" (Settings), nhập API Key của bạn. Key được lưu an toàn tại Local Storage của trình duyệt.

---

## 📁 Cấu trúc dự án (numbered — chuẩn AIPlat)

```
ba-super-app/
├── 00-project/      ★ Governance: vision · docs-structure · conventions · glossary
├── 01-framework/    ★ Prompt Kit: master_prompt + core/inputs/modules/tools/templates
├── 02-web-app/      Web prototype (vanilla JS + localStorage)
├── v2-web-app/      React App (Vite + Tailwind + Dexie) - Ứng dụng P1 Local-first
├── 03-examples/     Ví dụ thật (MBL)
├── 04-outputs/      Deliverable sinh ra rơi vào đây
├── _archive/        Lịch sử v1.0 + file đã dọn
└── README · DOCUMENT-INDEX · CHANGELOG · ROADMAP · .gitignore
```

> Bản đồ chi tiết: [00-project/docs-structure.md](00-project/docs-structure.md) · Mục lục: [DOCUMENT-INDEX.md](DOCUMENT-INDEX.md).

---

## 📋 Pipeline

| Phase | Module | Input | Output |
|-------|--------|-------|--------|
| 1 | [M1 Discovery](01-framework/modules/M1-discovery.md) | Mô tả dự án | Discovery Report |
| 2 | [M2 User Story](01-framework/modules/M2-user-story.md) | Feature list | US + AC |
| 3 | [M3 BRD](01-framework/modules/M3-brd.md) | User Stories | BRD |
| 4 | [M4 SRS](01-framework/modules/M4-srs.md) | BRD | SRS |
| 5 | [M5 Diagram](01-framework/modules/M5-diagram.md) | Bất kỳ tài liệu | 8 loại Mermaid |
| 6 | [M6 Sprint](01-framework/modules/M6-sprint-planning.md) | US ưu tiên | Sprint backlog |

Refine bất kỳ lúc nào qua [`tools/chatbot-edit`](01-framework/tools/chatbot-edit.md); truy vết qua [`traceability-matrix`](01-framework/tools/traceability-matrix.md).

---

## 🎯 Domain hỗ trợ

Banking & Finance · Insurance · Fintech · E-commerce · SaaS/Platform · Healthcare · Game — qua biến, không hardcode.

## 🔧 Lệnh chính

`/discovery` · `/us [feature]` · `/brd` · `/srs` · `/diagram [type]` · `/sprint` · `/rewrite` · `/validate` · `/trace` · `/status` (tiền tố `/ba` khi dùng trong IDE — xem [conventions §5](00-project/conventions.md)).

---

## 🏗️ Dựa trên dự án thật

Chắt lọc từ **MBL** (MB Life Insurance, ~195 tài liệu, 9 module) — xem [03-examples/mbl-showcase.md](03-examples/mbl-showcase.md).

---

*BA Super App v2.0 — reorg theo chuẩn AIPlat + framework viết lại sâu theo prompt-master | 2026-06-02. Lịch sử: [CHANGELOG](CHANGELOG.md).*
