<!--
  Document ID: BACKBONE-BASUPER-V2-1.0
  Date: 2026-06-03
  Version: 1.0
  Status: Internal registry (keystone ID) — nguồn ID chung cho toàn bộ tài liệu v2.
  Source: chắt lọc IMPLPLAN-BASUPER-1.0 + PSCOPE-BASUPER-P1-1.0 + bộ v1 (BRD/SRS/NFR-BASUPER-1.0).
  QUY ƯỚC: ID SẢN PHẨM (REQ-/FR-/NFR-/UC-/EPIC-/STORY-) đặc tả CHÍNH BA Super App.
           KHÔNG lẫn với ID công cụ SINH RA cho khách (BRD-REQ-###, SRS-FR-###, TC-###).
-->

# Backbone ID — BA Super App v2 (registry chung)

> File nội bộ: **mọi tài liệu v2 PHẢI dùng đúng ID ở đây**, không tự đặt ID top-level mới. Mở rộng chi tiết (Inputs/Process/AC/Errors) trong từng tài liệu đích.

## 0. Capability axis (12) — ánh xạ 4 lớp

| Cap | Tên | Lớp | FR prefix |
|---|---|---|---|
| C01 | Project & Ingestion | L1 Input | `INGEST` |
| C02 | Template Intake | L1 Input | `TPL` |
| C03 | Domain Expert Packs | L2 Khai phá | `DOMAIN` |
| C04 | Discovery Copilot | L2 Khai phá | `DISC` |
| C05 | Task · Yêu cầu mới | L3 Tác vụ | `NEWREQ` |
| C06 | Task · Function List | L3 Tác vụ | `FUNC` |
| C07 | Task · Estimate | L3 Tác vụ | `EST` |
| C08 | Task · Enhance | L3 Tác vụ | `ENH` |
| C09 | Generation Pipeline (M1–M6) | cross | `PIPE` |
| C10 | Traceability & Quality | cross | `QUAL` |
| C11 | Template & Output/Export | L4 Output | `OUTPUT` |
| C12 | Platform (Storage/LLM/Security) | cross | `PLAT` |

## 1. Business Requirements (REQ-###)

| ID | Requirement | Cap | Priority | Release |
|---|---|---|:--:|:--:|
| REQ-001 | Tạo dự án + chọn domain ngay khi tạo (tên/mục tiêu/compliance/scale) | C01 | Must | P1 |
| REQ-002 | Nạp nguồn đa kênh (Paste/Upload/URL; Email sau) | C01 | Must | P1 |
| REQ-003 | (Optional) Đính **template mẫu** (SRS/BRD/kỹ thuật/guide) làm khuôn output | C02 | Should | P1/P3 |
| REQ-004 | **Domain Expert Pack** mỗi ngành (7) nạp sẵn entity/rule/compliance/glossary | C03 | Must | P1+ |
| REQ-005 | **Discovery Copilot** Socratic + evidence-grounded → Project Knowledge có provenance | C04 | Must | P1 |
| REQ-006 | Anti-fabrication: thiếu→hỏi, giả định gắn cờ, mỗi mục trỏ nguồn | C04/C10 | Must | P1 |
| REQ-007 | Tác vụ **Yêu cầu mới** (EARS + AC Given-When-Then) | C05 | Must | P2 |
| REQ-008 | Tác vụ **Function List** (cây Module→Feature→Function) | C06 | Must | P2 |
| REQ-009 | Tác vụ **Estimate** (function/story point + complexity → man-day) | C07 | Should | P2 |
| REQ-010 | Tác vụ **Enhance** (impact analysis + delta spec) | C08 | Should | P2 |
| REQ-011 | **Pipeline M1–M6** sinh deliverable theo một chuẩn output | C09 | Must | P2 |
| REQ-012 | **Quality gate** mỗi phase/tác vụ (completeness/consistency/traceability/feasibility) fail-closed | C10 | Must | P2 |
| REQ-013 | **EARS/INCOSE** requirement quality score | C10 | Should | P2 |
| REQ-014 | **Live traceability** US→BRD-REQ→SRS-FR→TC + impact | C10 | Must | P2 |
| REQ-015 | **Template engine** bám template (built-in hoặc user tải lên) | C11 | Must | P3 |
| REQ-016 | **Output granularity**: per-function / per-requirement / all | C11 | Must | P3 |
| REQ-017 | **Export** MD/Word/PDF + **push** Jira/Confluence | C11 | Should | P3 |
| REQ-018 | **Spec→prototype** handoff (Claude Design) | C11 | Could | P3 |
| REQ-019 | **Human-in-the-loop** — AI đề xuất, người chốt; không tự chốt | C10 | Must | mọi P |
| REQ-020 | **Local-first** (IndexedDB) P1–P3; backend tuỳ chọn P4 | C12 | Must | P1 |
| REQ-021 | **LLM adapter** provider-agnostic (cloud Claude; on-prem tuỳ chọn) + token budget/dự án | C12 | Must | P1 |
| REQ-022 | **Đa người dùng + RBAC** | C12 | Must (scale) | P4 |

## 2. Functional Requirements (FR-{PREFIX}-##)

**C01 INGEST:** FR-INGEST-01 tạo project(domain/goal/compliance/scale) · -02 Paste Text · -03 Upload File(.docx/.pdf/.md→text) · -04 URL Fetch · -05 source list+parse status+provenance · -06 (P2) Email Forward.
**C02 TPL:** FR-TPL-01 upload+lưu+xem template mẫu · -02 (P3) trích schema heading/section/field · -03 thư viện template built-in/domain.
**C03 DOMAIN:** FR-DOMAIN-01 pack schema(entities/rules/compliance/glossary/kpi/templates/persona) · -02 chọn domain→nạp overlay+RAG · -03 seed Banking+Insurance(P1), 5 ngành sau · -04 thêm ngành bằng 1 file.
**C04 DISC:** FR-DISC-01 Socratic(options+default, không đoán) · -02 evidence-grounded→KnowledgeItem+provenance · -03 build Project Knowledge(entity/rule/term) sửa tay · -04 gắn cờ "giả định" khi thiếu nguồn · -05 conversation memory/dự án.
**C05 NEWREQ:** FR-NEWREQ-01 elicit+viết EARS · -02 sinh AC Given-When-Then · -03 auto-map BRD-REQ/SRS-FR+trace · -04 gọi quality score.
**C06 FUNC:** FR-FUNC-01 phân rã cây Module→Feature→Function(FUNC-xx) · -02 mỗi function ≥1 requirement(no orphan) · -03 sửa/sắp xếp cây.
**C07 EST:** FR-EST-01 complexity 1–10/function · -02 function point(IFPUG/COSMIC)+story point · -03 quy đổi man-day+dải tin cậy · -04 cờ function mơ hồ · -05 (P4) calibrate lịch sử.
**C08 ENH:** FR-ENH-01 nhận change request · -02 impact analysis trên trace graph · -03 delta spec(add/mod/remove)+version bump · -04 cập nhật AC item đổi.
**C09 PIPE:** FR-PIPE-01 phase detect/route(Disc/US/BRD/SRS/Diagram/Sprint) · -02 sinh deliverable theo output-standard · -03 Mermaid(M5) · -04 sprint plan+estimate rollup(M6) · -05 refine ≤3 vòng.
**C10 QUAL:** FR-QUAL-01 quality gate fail-closed · -02 EARS/INCOSE score · -03 live trace graph · -04 impact analysis · -05 (P3) auto test-case từ AC · -06 provenance enforcement(anti-fabrication).
**C11 OUTPUT:** FR-OUTPUT-01 render theo template · -02 granularity per-function/per-req/all · -03 export MD/Word/PDF · -04 (P3) push Jira/Confluence(Linear sau) · -05 (P3) spec→prototype.
**C12 PLAT:** FR-PLAT-01 local-first IndexedDB · -02 LLM adapter(cloud/on-prem) · -03 token budget guard+metering/dự án · -04 settings BYO-key/proxy · -05 (P4) backend+multi-user+RBAC · -06 (P4) cloud sync.

## 3. NFR (ISO/IEC 25010 + AI) — NFR-{CAT}##

- **Usability U:** U01 Socratic options+default · U02 Markdown+Mermaid render-ready · U03 3-state loading/empty/error · U04 streaming · U05 màn Khai phá rõ ràng (signature).
- **Reliability R:** R01 no-hallucination · R02 gate fail-closed · R03 refine ≤3 chống loop · R04 persistence sống qua reload · R05 provenance mọi knowledge item.
- **Maintainability M:** M01 module-as-prompt · M02 domain pack = data, thêm ngành bằng file (config-over-code) · M03 naming/ID/header conventions · M04 tách data/logic · M05 adapter cô lập LLM.
- **Portability P:** P01 framework chạy nhiều LLM · P02 standalone hoặc web · P03 web static/local · P04 Mermaid hợp lệ · P05 export Word/PDF/MD hợp lệ.
- **Performance PF:** PF01 dashboard <2s · PF02 prompt-kit vừa context · PF03 copilot first-token mục tiêu · PF04 parse nguồn mục tiêu.
- **Security/Privacy S:** S01 no secret in repo · S02 dữ liệu local ở máy(standalone) · S03 sanitize URL import · S04 secret qua env/vault · S05 PII redaction log · S06 prompt-injection guard nội dung nạp · S07 residency/on-prem(Banking/Health).
- **AI-quality AI:** AI01 grounding/provenance ratio · AI02 EARS score ngưỡng để qua gate · AI03 token budget/dự án · AI04 output-standard tất định(header/ID).
- **Scalability SC (P4):** SC01 multi-user · SC02 nhiều dự án đồng thời.

## 4. Use Cases (UC-##)

UC-01 Tạo dự án & chọn domain · UC-02 Nạp nguồn(paste/file/URL) · UC-03 Đính template mẫu(optional) · UC-04 Khai phá cùng chuyên gia→build Project Knowledge · UC-05 Review/confirm knowledge(provenance/assumption) · UC-06 Tạo yêu cầu mới(EARS) · UC-07 Lập function list · UC-08 Sinh estimate · UC-09 Yêu cầu enhance(impact) · UC-10 Chạy pipeline sinh deliverable · UC-11 Validate qua quality gate · UC-12 Export deliverable(granularity×template×format) · UC-13 Push Jira/Confluence · UC-14 Cấu hình LLM/key & token budget · UC-15 Quản lý dự án(dashboard).

## 5. Epics & Stories (EPIC-## / STORY-##) theo phase

- **P1** (xem PSCOPE-BASUPER-P1): EPIC-01 App shell & local store · EPIC-02 Project & Ingestion · EPIC-03 Template intake(rút gọn) · EPIC-04 Domain Expert Pack · EPIC-05 Discovery Copilot. (STORY-1.1…5.4, 64 SP)
- **P2:** EPIC-06 Task Yêu cầu mới · EPIC-07 Task Function List · EPIC-08 Task Estimate · EPIC-09 Task Enhance · EPIC-10 EARS Quality + Live Traceability.
- **P3:** EPIC-11 Template engine + Output granularity · EPIC-12 Export + Push integrations · EPIC-13 Spec→prototype · EPIC-14 Auto test-case.
- **P4:** EPIC-15 Backend + multi-user + RBAC · EPIC-16 LLM-in-web + provider · EPIC-17 Estimate calibration + cloud sync.

## 6. Data entities (ENT-##)

ENT-01 Project · ENT-02 Source · ENT-03 ProvenanceRef · ENT-04 DomainPack · ENT-05 KnowledgeItem(subtype Entity/Rule/Term) · ENT-06 Requirement(EARS) · ENT-07 AcceptanceCriterion · ENT-08 Function · ENT-09 Estimate · ENT-10 Deliverable · ENT-11 TemplateAsset · ENT-12 TraceLink · ENT-13 TokenBudget · ENT-14 User(P4) · ENT-15 Role(P4).

## 7. Cross-map (REQ → FR → UC → Epic → NFR)

| REQ | FR chính | UC | Epic | NFR liên quan |
|---|---|---|---|---|
| 001 | INGEST-01 | UC-01 | EPIC-02 | U03, PF01 |
| 002 | INGEST-02..05 | UC-02 | EPIC-02 | S03, S06, PF04 |
| 003 | TPL-01..03 | UC-03 | EPIC-03/11 | M02 |
| 004 | DOMAIN-01..04 | UC-01 | EPIC-04 | M02 |
| 005 | DISC-01..05 | UC-04 | EPIC-05 | U01,U05,R05,AI01 |
| 006 | DISC-04, QUAL-06 | UC-05 | EPIC-05/10 | R01,R05,AI01 |
| 007 | NEWREQ-01..04 | UC-06 | EPIC-06 | AI02 |
| 008 | FUNC-01..03 | UC-07 | EPIC-07 | — |
| 009 | EST-01..05 | UC-08 | EPIC-08 | — |
| 010 | ENH-01..04 | UC-09 | EPIC-09 | R02 |
| 011 | PIPE-01..05 | UC-10 | EPIC-06..09 | U02,P04 |
| 012 | QUAL-01 | UC-11 | EPIC-10 | R02 |
| 013 | QUAL-02 | UC-11 | EPIC-10 | AI02 |
| 014 | QUAL-03..04 | UC-09,11 | EPIC-10 | — |
| 015 | OUTPUT-01 | UC-12 | EPIC-11 | M02,P05 |
| 016 | OUTPUT-02 | UC-12 | EPIC-11 | — |
| 017 | OUTPUT-03..04 | UC-12,13 | EPIC-12 | P05 |
| 018 | OUTPUT-05 | UC-12 | EPIC-13 | — |
| 019 | QUAL-01, DISC-01 | UC-05,11 | cross | R01 |
| 020 | PLAT-01 | UC-15 | EPIC-01 | R04 |
| 021 | PLAT-02..04 | UC-14 | EPIC-05/16 | S04,S07,AI03 |
| 022 | PLAT-05..06 | UC-15 | EPIC-15 | SC01,SC02 |

---
*Backbone v2 v1.0 — keystone ID cho 9 tài liệu v2. Giữ tách bạch ID sản phẩm vs ID công cụ sinh cho khách.*
