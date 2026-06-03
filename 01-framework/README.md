<!--
  Document ID: README-01FRAMEWORK-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
-->

# 01-framework — BA Super App Prompt Kit

> Bộ **prompt-kit** (sản phẩm lõi). Dùng standalone (paste vào ChatGPT/Claude/Gemini) hoặc qua web-app. Bắt đầu ở [`master_prompt.md`](master_prompt.md).

## Cách dùng nhanh

1. **Standalone:** copy toàn bộ [`master_prompt.md`](master_prompt.md) vào AI tool → paste mô tả dự án → AI tự nhận diện phase và dẫn pipeline.
2. **Antigravity/IDE:** gọi `/ba` (xem [conventions §5](../00-project/conventions.md)).

## Cấu trúc

```
01-framework/
├── master_prompt.md      ← Master Controller v2.0 (entry, route phase)
├── core/                 ← luật chung (load trước)
│   ├── ba-role.md            persona Senior BA
│   ├── output-standard.md    chuẩn format + ID convention
│   └── quality-gates.md      6 gate kiểm chất lượng
├── inputs/               ← template thu thập đầu vào
│   ├── project-context.md
│   └── stakeholder-map.md
├── modules/              ← pipeline 6 phase (prompt-fragment)
│   ├── M1-discovery.md … M6-sprint-planning.md
├── tools/                ← chatbot-edit · traceability-matrix
└── templates/            ← khung output (module "đổ đầy")
    ├── discovery-template.md · user-story-template.md · brd-template.md
    └── srs-template.md · diagram-catalog.md · sprint-template.md
```

## Pipeline

| Phase | Module | Input | Output | Template |
|-------|--------|-------|--------|----------|
| 1 | [M1-discovery](modules/M1-discovery.md) | Mô tả dự án | Discovery Report | discovery-template |
| 2 | [M2-user-story](modules/M2-user-story.md) | Feature list | US + AC | user-story-template |
| 3 | [M3-brd](modules/M3-brd.md) | User Stories | BRD (`BRD-REQ-###`) | brd-template |
| 4 | [M4-srs](modules/M4-srs.md) | BRD | SRS (`SRS-FR/NFR-###`) | srs-template |
| 5 | [M5-diagram](modules/M5-diagram.md) | Bất kỳ tài liệu | 8 loại Mermaid (`DG-###`) | diagram-catalog |
| 6 | [M6-sprint-planning](modules/M6-sprint-planning.md) | US ưu tiên | Sprint backlog (`SP-###`) | sprint-template |

> Mỗi module là **prompt-fragment** viết theo prompt-master: Purpose · Inputs · Process · Socratic Q · Output Contract (trỏ template) · Quality Gate · Traceability · Stop Conditions · Example. Quy ước & ID: [conventions](../00-project/conventions.md). Định vị & lộ trình: [vision](../00-project/vision.md).

## Thứ tự load (controller tự xử lý)

`master_prompt → core/ba-role → core/output-standard → inputs/project-context → modules/M{n} → templates/* → tools/chatbot-edit → core/quality-gates`
