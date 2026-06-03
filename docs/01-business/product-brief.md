<!--
  Document ID: PB-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: product brief của BA Super App. Tóm tắt cho stakeholder; chi tiết ở BRD/SRS.
-->

# Product Brief — BA Super App

> Bản tóm tắt sản phẩm cho stakeholder. Sâu hơn: [vision](../../00-project/vision.md) · [BRD](brd.md) · [SRS](../02-requirements/srs.md).

## Vấn đề
Làm tài liệu BA thủ công: chậm/lặp, không nhất quán, đứt traceability, chất lượng trồi sụt, dùng AI rời rạc mất ngữ cảnh.

## Giải pháp
**BA Super App** — bộ prompt-kit + web app biến AI thành Senior BA, chạy pipeline **Discovery → User Story → BRD → SRS → Diagram → Sprint** với chuẩn output nhất quán, traceability & quality gates, domain-adaptive.

## Value proposition
- **Nhanh hơn ≥ 50%** so với viết tay; **một khuôn** cho mọi dự án.
- **Tin được**: không bịa, có quality gate + traceability, con người chốt.
- **Linh hoạt**: dùng standalone (mọi LLM) hoặc web workspace.

## Đối tượng
Business Analyst, Product Owner, Solution Consultant; domain: banking/insurance/fintech/ecommerce/saas/healthcare/game.

## Phạm vi (MVP)
Pipeline 6 phase + quality/traceability + web workspace (localStorage). **Ngoài MVP:** backend/đa người dùng/cloud, nối AI thật trong web (lộ trình P3).

## Phân biệt với "ChatGPT trần"
Pipeline có phase + auto-detect · chuẩn output doanh nghiệp (ID/header/AC/diagram) · traceability + quality gate tích hợp · dựa trên dự án thật MBL.

## Trạng thái
v2.0 — framework viết lại sâu + governance + bộ docs (BRD/SRS) chuẩn AIPlat. Lộ trình: [ROADMAP](../../ROADMAP.md).
