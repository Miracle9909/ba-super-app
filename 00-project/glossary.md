<!--
  Document ID: GLOSSARY-BASUPER-1.0
  Date: 2026-06-02
  Version: 1.0
  Status: Draft
  Source: quy hoạch lại theo chuẩn AIPlat — từ điển thuật ngữ tập trung.
-->

# BA Super App — Glossary

> Định nghĩa thuật ngữ & định danh dùng chung. Sắp theo nhóm.

## Sản phẩm & cấu trúc

| Term | Nghĩa |
|------|-------|
| **BA Super App** | Hệ thống AI hỗ trợ Business Analyst: bộ prompt-kit + web app sinh tài liệu BA chuẩn hoá. |
| **Framework / Prompt Kit** | `01-framework` — bộ prompt standalone (master_prompt + core + inputs + modules + tools + templates). Nguồn chân lý của hệ thống. |
| **Web App** | `02-web-app` — prototype vanilla JS + localStorage hiện thực hoá framework (dashboard, workspace). |
| **Master Controller** | `master_prompt.md` — điều phối: auto-detect phase, load module, quản conversation loop. |
| **Module (M1–M6)** | 6 mắt xích pipeline: Discovery, User Story, BRD, SRS, Diagram, Sprint Planning. |
| **Deliverable** | Tài liệu đầu ra do framework sinh (Discovery Report, US backlog, BRD, SRS, Diagrams, Sprint Plan) — rơi vào `04-outputs`. |

## Pipeline & deliverable

| Term | Nghĩa |
|------|-------|
| **Discovery Report** | Output M1: tổng hợp context dự án (goal, users, scope, features) sau khi hỏi Socratic. |
| **User Story (US)** | "As a … I want … so that …" + Acceptance Criteria; ID `US-[MODULE]-[###]`. |
| **BRD** | Business Requirements Document — yêu cầu nghiệp vụ; requirement ID `BRD-REQ-[###]`. |
| **SRS** | Software Requirements Specification — đặc tả kỹ thuật; FR `SRS-FR-[###]`, NFR `SRS-NFR-[###]`. |
| **Acceptance Criteria (AC)** | Tiêu chí nghiệm thu, LUÔN dạng **Given / When / Then**. |
| **Sprint Plan** | Output M6: backlog chia sprint + estimate (story points); sprint ID `SP-[###]`. |
| **Diagram (DG)** | Sơ đồ Mermaid; ID `DG-[TYPE]-[###]` (BPMN/sequence/state/ERD/C4/activity/journey/mindmap). |

## Chất lượng & truy vết

| Term | Nghĩa |
|------|-------|
| **Traceability** | Chuỗi liên kết `US → BRD-REQ → SRS-FR → TC` đảm bảo không sót/đứt yêu cầu. |
| **Traceability Matrix** | Bảng ánh xạ các ID xuyên tài liệu (tool `traceability-matrix`). |
| **Quality Gate** | "Cổng" kiểm tra sau mỗi phase: completeness, consistency, traceability, feasibility, gaps. |
| **INVEST** | Tiêu chí US tốt: Independent, Negotiable, Valuable, Estimable, Small, Testable. |

## Cách làm việc

| Term | Nghĩa |
|------|-------|
| **Phase Detection** | master_prompt tự nhận diện user đang ở phase nào để load đúng module. |
| **Socratic questioning** | Hỏi 3–5 câu có **option + default** để làm rõ yêu cầu, không hỏi chung chung. |
| **Conversation / Edit mode** | Vòng generate → "muốn sửa gì không?" → refine qua `tools/chatbot-edit`. |
| **Domain-adaptive** | Framework không hardcode ngành; dùng biến `[DOMAIN] [USER_TYPE] [SYSTEM] [COMPLIANCE]`. |

## Tham chiếu

| Term | Nghĩa |
|------|-------|
| **MBL** | MB Life Insurance — dự án thật (~195 tài liệu, 9 module) làm nền thiết kế framework; mẫu ở `03-examples/mbl-showcase.md`. |
| **Antigravity** | Bộ kit/IDE agent-first (Gemini 3 Pro) — môi trường chạy workflow `/ba`. |
| **prompt-master** | Skill chuẩn hoá việc viết prompt (intent extraction, tool-routing, output-lock, stop conditions) — dùng để viết lại sâu framework. |

---

*glossary.md v1.0*
