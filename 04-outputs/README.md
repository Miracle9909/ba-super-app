<!--
  Document ID: README-04OUTPUTS-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
-->

# 04-outputs — Generated Deliverables

> Nơi **deliverable do framework/web-app sinh ra** rơi vào (Discovery Report, US backlog, BRD, SRS, Diagrams, Sprint Plan). Tách khỏi `01-framework` (khung) để không lẫn "công cụ" với "sản phẩm của một dự án cụ thể".

## Quy ước tổ chức (đề xuất)

```
04-outputs/
└── {project-slug}/
    ├── 01-discovery.md
    ├── 02-user-stories.md
    ├── 03-brd.md
    ├── 04-srs.md
    ├── 05-diagrams.md
    ├── 06-sprint-plan.md
    └── traceability.md
```

- Mỗi dự án một thư mục `{project-slug}/`.
- File theo thứ tự pipeline; mỗi file có **YAML frontmatter** chuẩn [output-standard](../01-framework/core/output-standard.md).
- Đặt tên kebab-case (xem [conventions](../00-project/conventions.md)).

> Hiện trống (mới khởi tạo). Web-app sẽ tự lưu deliverable vào đây ở lộ trình **P3** ([ROADMAP](../ROADMAP.md)). Ví dụ thật tham khảo: [03-examples/mbl-showcase](../03-examples/mbl-showcase.md).
