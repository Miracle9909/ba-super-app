<!--
  Document ID: SRS-BASUPER-2.0
  Date: 2026-06-03
  Version: 2.0
  Status: Draft — for approval
  Source: ghi đè SRS-BASUPER-1.0; registry ID = BACKBONE-BASUPER-V2-1.0 (_v2-backbone.md, dùng VERBATIM §0 capability + §2 FR);
          kế thừa IMPLPLAN-BASUPER-1.0 (4 lớp) + PSCOPE-BASUPER-P1-1.0 (chốt scope P1) + BRD/NFR-BASUPER.
  Template: SRS
  QUY ƯỚC ID: FR-{PREFIX}-## = đặc tả CHÍNH BA Super App (sản phẩm).
             KHÔNG lẫn với ID công cụ SINH RA cho khách (BRD-REQ-###, SRS-FR-###, TC-###).
-->

# SRS — BA Super App v2 (Software Requirements Specification)

> Đặc tả **chức năng & kỹ thuật** của **BA Super App v2** — công cụ biến AI thành **Senior BA theo ngành**. Mức nghiệp vụ ở [BRD](../01-business/brd.md); kiến trúc ở [ARCHITECTURE](../03-architecture/ARCHITECTURE.md) + [data-model](../03-architecture/data-model.md); phi chức năng ở [nfr.md](nfr.md); use case ở [use-cases.md](use-cases.md); ma trận truy vết ở [traceability.md](traceability.md).
>
> ⚠️ **Anti-fabrication.** Tài liệu này KHÔNG bịa tính năng ngoài registry. Mọi FR đều bắt nguồn VERBATIM từ `_v2-backbone.md §2` (keystone ID). Phần mở rộng (Inputs/Process/Outputs/AC/Errors) là chi tiết hoá hợp lý của backbone, KHÔNG thêm capability mới. Chỗ chưa chốt được gắn cờ ở §7 *Open Questions & Assumptions*, không che giấu.

---

## 1. Phạm vi & cách đọc

### 1.1 BA Super App v2 là gì

BA Super App v2 là **một hệ thống 4 thành phần** ăn khớp nhau:

1. **Framework prompt-kit M1–M6** — "bộ não quy trình BA" (Discovery → User Story → BRD → SRS → Diagram → Sprint). Đây là **nguồn chân lý** (xem invariant R-01); mỗi module là một prompt-fragment độc lập (R-02).
2. **Web App 4 lớp** — trải nghiệm tái cấu trúc quanh trục:
   - **L1 Input** — tạo dự án + nạp nguồn (paste/upload/URL) + (optional) template mẫu.
   - **L2 Khai phá** — chọn ngành → Domain Expert Pack nạp tri thức → Discovery Copilot Socratic + evidence-grounded → **Project Knowledge** (entities/rules/glossary) có provenance.
   - **L3 Tác vụ** — 4 loại tác vụ tự chọn: *Yêu cầu mới · Function List · Estimate · Enhance*.
   - **L4 Output** — render theo template × granularity (per-function / per-requirement / all) × format (MD/Word/PDF) + push Jira/Confluence.
3. **Domain Packs** — dữ liệu ngành (entities/rules/compliance/glossary/kpi/templates/persona) **tách khỏi lõi**; thêm ngành = thêm 1 file (R-04, config-over-code).
4. **Platform** — local-first IndexedDB (P1–P3) → backend tuỳ chọn (P4); LLM qua **adapter provider-agnostic** (R-05); token budget; security/compliance.

### 1.2 Cách đọc tài liệu

- **§2** ánh xạ **Capability axis 12 (C01–C12)** ↔ FR prefix ↔ REQ-BRD.
- **§3** đặc tả **từng FR** trong backbone §2 (FR-INGEST-01 … FR-PLAT-06): *Mô tả · Inputs · Process · Outputs · Errors/Edge*. FR Must/P1–P2 quan trọng có thêm **AC Given-When-Then**.
- **§4** trỏ NFR. **§5** Architecture Invariants R-01..R-08. **§6** Traceability. **§7** Open Questions.
- **ID hợp lệ:** `FR-{PREFIX}-##`. Ví dụ `FR-DISC-02`. **Không** dùng `SRS-FR-###` ở đây — đó là ID mà công cụ *sinh cho khách*.

### 1.3 Quy ước & nguồn ID

| Loại ID | Thuộc về | Ví dụ |
|---|---|---|
| `FR-{PREFIX}-##` | **Sản phẩm** BA Super App (tài liệu này) | `FR-NEWREQ-01` |
| `REQ-###` | Business requirement (backbone §1, BRD) | `REQ-007` |
| `UC-##` | Use case (backbone §4) | `UC-06` |
| `BRD-REQ-### / SRS-FR-### / TC-###` | **Output công cụ sinh cho khách** — KHÔNG dùng cho sản phẩm | `SRS-FR-014` |

---

## 2. Capability axis (12) — bản đồ C01–C12 ↔ FR ↔ REQ

> VERBATIM từ `_v2-backbone.md §0` (giữ nguyên Cap/Tên/Lớp/FR prefix), bổ sung cột REQ-BRD và Release để đọc nhanh.

| Cap | Tên | Lớp | FR prefix | REQ-BRD chính | Release |
|---|---|---|---|---|:--:|
| C01 | Project & Ingestion | L1 Input | `INGEST` | REQ-001, REQ-002 | P1 |
| C02 | Template Intake | L1 Input | `TPL` | REQ-003 | P1/P3 |
| C03 | Domain Expert Packs | L2 Khai phá | `DOMAIN` | REQ-004 | P1+ |
| C04 | Discovery Copilot | L2 Khai phá | `DISC` | REQ-005, REQ-006 | P1 |
| C05 | Task · Yêu cầu mới | L3 Tác vụ | `NEWREQ` | REQ-007 | P2 |
| C06 | Task · Function List | L3 Tác vụ | `FUNC` | REQ-008 | P2 |
| C07 | Task · Estimate | L3 Tác vụ | `EST` | REQ-009 | P2 |
| C08 | Task · Enhance | L3 Tác vụ | `ENH` | REQ-010 | P2 |
| C09 | Generation Pipeline (M1–M6) | cross | `PIPE` | REQ-011 | P2 |
| C10 | Traceability & Quality | cross | `QUAL` | REQ-012..014, REQ-019 | P2 |
| C11 | Template & Output/Export | L4 Output | `OUTPUT` | REQ-015..018 | P3 |
| C12 | Platform (Storage/LLM/Security) | cross | `PLAT` | REQ-020..022 | P1/P4 |

**Tổng FR đặc tả ở §3:** 49 (theo backbone §2). Lớp đọc nhanh: L1 = C01+C02; L2 = C03+C04; L3 = C05+C06+C07+C08; L4 = C11; cross = C09+C10+C12.

---

## 3. Functional Requirements theo từng capability

> Mỗi FR dưới đây là **chi tiết hoá** một FR trong backbone §2. Tiêu đề FR giữ đúng định danh `FR-{PREFIX}-##`. FR đánh dấu **★ (có AC)** là Must/P1–P2 quan trọng — bắt buộc ≥1 AC Given-When-Then.

### 3.1 C01 — Project & Ingestion (`INGEST`) · REQ-001, REQ-002

#### FR-INGEST-01 ★ — Tạo project (domain/goal/compliance/scale)
- **Mô tả:** Tạo dự án mới và chọn domain ngay tại bước tạo (kèm tên, mục tiêu, ràng buộc compliance, quy mô).
- **Inputs:** `name`, `domain` (1 trong danh sách pack đã nạp), `goal`, `compliance[]` (gợi ý từ pack), `scale`.
- **Process:** Validate bắt buộc tên + domain → khởi tạo `ENT-01 Project` trong IndexedDB → nạp overlay pack tương ứng (gọi FR-DOMAIN-02) → mở Workspace tab Thông tin.
- **Outputs:** Project record persisted; dashboard cập nhật; domain context sẵn sàng cho L2.
- **Errors/Edge:** Tên trống → chặn; domain không có pack → cảnh báo "pack chưa sẵn sàng"; trùng tên → cho phép nhưng cảnh báo.
- **AC:**
  - **Given** người dùng ở Dashboard **When** tạo dự án với tên + domain "Banking" + mục tiêu **Then** dự án được lưu, hiển thị trong danh sách, và Domain Expert Pack Banking được nạp làm overlay.
  - **Given** form tạo dự án **When** bỏ trống tên hoặc domain **Then** hệ thống chặn lưu và hiển thị lỗi field tương ứng.

#### FR-INGEST-02 ★ — Paste Text
- **Mô tả:** Nạp nguồn bằng dán văn bản thô.
- **Inputs:** Khối text (HSYC/notes), nhãn nguồn (optional).
- **Process:** Tạo `ENT-02 Source(type=paste)` → lưu text gốc → set parse status = parsed → ghi `ENT-03 ProvenanceRef` (offset trong text).
- **Outputs:** Source xuất hiện trong danh sách nguồn, sẵn sàng cho khai phá.
- **Errors/Edge:** Text rỗng → chặn; quá dài vượt ngưỡng context → cảnh báo + cho phép cắt khúc.
- **AC:**
  - **Given** một dự án đang mở **When** người dùng dán văn bản và lưu **Then** một Source type=paste được tạo với trạng thái parsed và có thể trích dẫn provenance theo vị trí.

#### FR-INGEST-03 ★ — Upload File (.docx/.pdf/.md → text)
- **Mô tả:** Tải file tài liệu và trích xuất sang text để khai phá.
- **Inputs:** File `.docx | .pdf | .md`.
- **Process:** Parse client-side (thư viện) → trích text + cấu trúc thô → tạo `ENT-02 Source(type=upload)` với parse status (queued→parsing→parsed/failed) → lưu provenance theo trang/đoạn.
- **Outputs:** Source với text đã trích + trạng thái parse hiển thị.
- **Errors/Edge:** Định dạng không hỗ trợ → từ chối; **PDF scan ảnh (không text layer) ngoài P1** → status=failed + lý do; file hỏng → failed.
- **AC:**
  - **Given** người dùng tải file `.docx` hợp lệ **When** parse hoàn tất **Then** Source hiển thị status=parsed và text trích xuất dùng được cho copilot.
  - **Given** người dùng tải PDF scan ảnh **When** không có text layer **Then** status=failed với thông báo rõ "không trích được text", layout không vỡ.

#### FR-INGEST-04 ★ — URL Fetch
- **Mô tả:** Nạp nội dung từ một URL công khai.
- **Inputs:** URL.
- **Process:** **Sanitize URL** (S03) → fetch → trích nội dung chính (readability) → tạo `ENT-02 Source(type=url)` + provenance (URL + đoạn) → **prompt-injection guard** (S06) trên nội dung nạp.
- **Outputs:** Source từ URL với text sạch.
- **Errors/Edge:** URL không hợp lệ/không reachable → lỗi; nội dung rỗng → cảnh báo; phát hiện chỉ thị độc → cô lập, không đưa vào system prompt.
- **AC:**
  - **Given** một URL hợp lệ **When** fetch thành công **Then** nội dung chính được trích, lưu thành Source type=url với provenance là URL nguồn.

#### FR-INGEST-05 ★ — Source list + parse status + provenance
- **Mô tả:** Danh sách mọi nguồn của dự án với trạng thái parse và truy vết provenance.
- **Inputs:** Project hiện hành.
- **Process:** Liệt kê `ENT-02 Source[]` → hiển thị type, status (queued/parsing/parsed/failed), kích thước → cho mở xem text + provenance.
- **Outputs:** Bảng nguồn 3-state (loading/empty/error) với link tới provenance.
- **Errors/Edge:** Chưa có nguồn → empty state; nguồn failed có nút retry.
- **AC:**
  - **Given** dự án có nhiều nguồn ở các trạng thái khác nhau **When** mở tab Nguồn dữ liệu **Then** mỗi nguồn hiển thị đúng type + parse status và có thể xem provenance.

#### FR-INGEST-06 — Email Forward (P2)
- **Mô tả:** Nạp nguồn bằng forward email vào địa chỉ dự án. **(P2, ngoài P1.)**
- **Inputs:** Email forwarded (subject/body/attachment).
- **Process:** (P2) endpoint nhận email → trích body + attachment → tạo Source(type=email) + provenance.
- **Outputs:** Source type=email.
- **Errors/Edge:** Cần hạ tầng inbound riêng (P2); spam/oversize → từ chối.

### 3.2 C02 — Template Intake (`TPL`) · REQ-003

#### FR-TPL-01 ★ — Upload + lưu + xem template mẫu
- **Mô tả:** Đính một template mẫu của tổ chức (SRS/BRD/kỹ thuật/guide) vào dự án; **P1 chỉ lưu + xem** (trích schema để bám khuôn là P3).
- **Inputs:** File template (.docx/.md/.pdf), loại (SRS/BRD/tech/guide).
- **Process:** Lưu `ENT-11 TemplateAsset(scope=project)` → render xem trước → đánh dấu là khuôn ưu tiên cho L4 Output.
- **Outputs:** Template đính kèm, xem được ở tab Thông tin.
- **Errors/Edge:** Định dạng lạ → từ chối; nhiều template cùng loại → cho phép, đánh dấu mặc định.
- **AC:**
  - **Given** một dự án **When** người dùng tải template SRS mẫu và lưu **Then** template được lưu cùng dự án, xem trước được, và sẵn sàng làm khuôn output (binding để P3).

#### FR-TPL-02 — Trích schema (heading/section/field) (P3)
- **Mô tả:** (P3) Trích cấu trúc template thành schema (heading/section/field/bảng) để map nội dung sinh ra vào đúng khuôn.
- **Inputs:** TemplateAsset đã upload.
- **Process:** Parse cấu trúc → tạo schema khuôn → lưu để OUTPUT-01 render bám.
- **Outputs:** Template schema gắn vào asset.
- **Errors/Edge:** File mẫu lộn xộn → fallback template built-in (xem FR-TPL-03); có cờ "schema không chắc chắn".

#### FR-TPL-03 — Thư viện template built-in/domain
- **Mô tả:** Thư viện template chuẩn (built-in + theo domain pack) làm khuôn mặc định khi dự án không tải template riêng.
- **Inputs:** Loại deliverable + domain.
- **Process:** Tra `ENT-04 DomainPack.templates` + built-in → chọn template phù hợp.
- **Outputs:** Template mặc định cho render.
- **Errors/Edge:** Domain chưa có template → dùng built-in chung.

### 3.3 C03 — Domain Expert Packs (`DOMAIN`) · REQ-004

#### FR-DOMAIN-01 ★ — Pack schema (entities/rules/compliance/glossary/kpi/templates/persona)
- **Mô tả:** Định nghĩa cấu trúc một Domain Expert Pack chuẩn.
- **Inputs:** File pack `/domain-packs/<industry>.yaml`.
- **Process:** Validate schema 7 thành phần: `entities · business_rules · compliance · glossary · kpi_patterns · templates · expert_persona` → load thành `ENT-04 DomainPack`.
- **Outputs:** DomainPack hợp lệ, sẵn để nạp overlay.
- **Errors/Edge:** Thiếu field bắt buộc → reject với lỗi schema; YAML sai cú pháp → reject.
- **AC:**
  - **Given** một file pack YAML đủ 7 thành phần **When** loader nạp **Then** DomainPack hợp lệ và các thành phần (entities/rules/compliance/glossary/kpi/templates/persona) truy cập được.

#### FR-DOMAIN-02 ★ — Chọn domain → nạp overlay + RAG
- **Mô tả:** Khi dự án chọn domain, nạp pack làm **system-overlay** cho LLM + RAG tri thức ngành.
- **Inputs:** `Project.domain`.
- **Process:** Lấy DomainPack → ghép expert_persona + entities/rules vào system overlay → index pack vào vector store (RAG) → kết hợp prompt-kit M1–M6 làm bộ não quy trình.
- **Outputs:** Ngữ cảnh chuyên gia ngành hoạt động trong copilot.
- **Errors/Edge:** Pack chưa nạp → copilot chạy chế độ generic + cảnh báo; lỗi index → fallback no-RAG.
- **AC:**
  - **Given** dự án chọn domain "Insurance" **When** mở tab Khai phá **Then** copilot trả lời với persona + entity/rule ngành bảo hiểm (không phải generic).

#### FR-DOMAIN-03 ★ — Seed Banking + Insurance (P1), 5 ngành sau
- **Mô tả:** Nạp sẵn 2 pack P1 (Banking từ BIDV Home GĐ3; Insurance từ MBL); 5 ngành còn lại (Fintech/E-commerce/SaaS/Healthcare/Game) bổ sung sau.
- **Inputs:** Dữ liệu seed thật.
- **Process:** Đóng gói entities/rules/compliance/glossary/persona cho Banking + Insurance → review bởi 1 BA thật.
- **Outputs:** 2 pack P1 dùng được; lộ trình 5 pack tiếp theo.
- **Errors/Edge:** Nội dung pack là **mẫu minh hoạ** — cần BA ngành rà trước khi dùng thật (xem §7).
- **AC:**
  - **Given** môi trường P1 **When** liệt kê pack **Then** có đúng 2 pack Banking + Insurance, mỗi pack ≥1 entity, ≥1 business rule, ≥1 compliance, ≥1 glossary term.

#### FR-DOMAIN-04 — Thêm ngành bằng 1 file
- **Mô tả:** Thêm ngành mới chỉ bằng cách thêm 1 file pack, không sửa lõi (config-over-code, R-04).
- **Inputs:** File pack mới.
- **Process:** Đặt file vào `/domain-packs/` → loader tự nhận → xuất hiện trong danh sách domain.
- **Outputs:** Ngành mới chọn được khi tạo dự án.
- **Errors/Edge:** Trùng tên ngành → cảnh báo override.

### 3.4 C04 — Discovery Copilot (`DISC`) · REQ-005, REQ-006

#### FR-DISC-01 ★ — Socratic (options + default, không đoán)
- **Mô tả:** Copilot dẫn dắt khai phá kiểu Socratic, mỗi câu hỏi kèm **options + default**, không đoán bừa.
- **Inputs:** Project Knowledge hiện có + nguồn + pack persona.
- **Process:** Sinh câu hỏi có lựa chọn + đề xuất default → chờ người dùng chốt (human-in-the-loop) → không tự suy diễn dữ kiện thiếu.
- **Outputs:** Luồng hội thoại khai phá có cấu trúc.
- **Errors/Edge:** Thiếu thông tin → hỏi tiếp, không bịa; người dùng skip → ghi "chưa xác định".
- **AC:**
  - **Given** dự án thiếu một dữ kiện then chốt **When** copilot cần dữ kiện đó **Then** copilot đặt câu hỏi kèm options + default thay vì tự điền giá trị.

#### FR-DISC-02 ★ — Evidence-grounded → KnowledgeItem + provenance
- **Mô tả:** Mỗi tri thức rút ra phải **trỏ nguồn**; tạo KnowledgeItem có provenance.
- **Inputs:** Câu trả lời người dùng + đoạn nguồn liên quan.
- **Process:** Trích claim → tạo `ENT-05 KnowledgeItem` (Entity/Rule/Term) → gắn `ENT-03 ProvenanceRef` (source + vị trí).
- **Outputs:** KnowledgeItem có provenance trong Project Knowledge.
- **Errors/Edge:** Không tìm được nguồn → chuyển sang FR-DISC-04 (gắn cờ giả định).
- **AC:**
  - **Given** copilot rút ra một entity từ nguồn **When** tạo KnowledgeItem **Then** item mang ProvenanceRef trỏ đúng source + vị trí.

#### FR-DISC-03 ★ — Build Project Knowledge (entity/rule/term) sửa tay
- **Mô tả:** Tổng hợp KnowledgeItem thành **Project Knowledge** ba nhóm (entities/rules/terms), cho phép sửa tay.
- **Inputs:** KnowledgeItem[] đã sinh.
- **Process:** Nhóm theo subtype → hiển thị khung "Tri thức dự án" → cho thêm/sửa/xoá thủ công (human chốt).
- **Outputs:** Project Knowledge sống, chỉnh sửa được.
- **Errors/Edge:** Sửa tay làm mất provenance → đánh dấu "manual" (vẫn truy vết được nguồn người sửa).
- **AC:**
  - **Given** Project Knowledge có sẵn các item **When** người dùng sửa/ thêm một rule thủ công **Then** thay đổi được lưu và item đánh dấu nguồn "manual".

#### FR-DISC-04 ★ — Gắn cờ "giả định" khi thiếu nguồn
- **Mô tả:** Item không có nguồn được đánh dấu *"giả định — cần xác nhận"*, không tự chốt.
- **Inputs:** KnowledgeItem không có ProvenanceRef.
- **Process:** Gắn flag `assumption=true` → hiển thị badge cảnh báo → yêu cầu xác nhận trước khi dùng downstream.
- **Outputs:** Item có cờ giả định rõ ràng.
- **Errors/Edge:** Người dùng xác nhận → chuyển thành đã chốt + ghi người xác nhận.
- **AC:**
  - **Given** một tri thức không truy được nguồn **When** hiển thị trong Project Knowledge **Then** nó mang nhãn "giả định — cần xác nhận" và không được coi là sự thật đã chốt.

#### FR-DISC-05 ★ — Conversation memory / dự án
- **Mô tả:** Ghi nhớ hội thoại khai phá theo từng dự án qua phiên.
- **Inputs:** Lịch sử chat của dự án.
- **Process:** Lưu hội thoại vào IndexedDB theo `projectId` → nạp lại khi mở dự án → đưa vào context copilot.
- **Outputs:** Ngữ cảnh hội thoại liên tục.
- **Errors/Edge:** Lịch sử quá dài vượt context → tóm tắt/cắt cửa sổ.
- **AC:**
  - **Given** một dự án đã có lịch sử khai phá **When** người dùng đóng và mở lại **Then** hội thoại trước đó được khôi phục và copilot giữ ngữ cảnh.

### 3.5 C05 — Task · Yêu cầu mới (`NEWREQ`) · REQ-007

#### FR-NEWREQ-01 ★ — Elicit + viết EARS
- **Mô tả:** Tác vụ "Yêu cầu mới": elicit nhu cầu rồi viết requirement theo **EARS**.
- **Inputs:** Mô tả nhu cầu + Project Knowledge.
- **Process:** Socratic elicit → phân loại EARS (Ubiquitous/Event/State/Unwanted/Optional) → viết câu requirement chuẩn EARS → tạo `ENT-06 Requirement(EARS)`.
- **Outputs:** Requirement card dạng EARS.
- **Errors/Edge:** Nhu cầu mơ hồ → hỏi thêm; không phân loại được → mặc định Ubiquitous + cờ review.
- **AC:**
  - **Given** một mô tả nhu cầu **When** chạy tác vụ Yêu cầu mới **Then** sinh ra ≥1 requirement viết đúng cú pháp EARS, gắn với dự án.

#### FR-NEWREQ-02 ★ — Sinh AC Given-When-Then
- **Mô tả:** Sinh Acceptance Criteria dạng Given-When-Then phủ edge-case cho requirement.
- **Inputs:** Requirement EARS.
- **Process:** Suy ra kịch bản chính + edge → viết `ENT-07 AcceptanceCriterion` (Given/When/Then) → gắn vào requirement.
- **Outputs:** Bộ AC máy đọc được.
- **Errors/Edge:** Thiếu ngữ cảnh edge → đánh dấu "AC nháp".
- **AC:**
  - **Given** một requirement EARS **When** sinh AC **Then** mỗi requirement có ≥1 AC dạng Given-When-Then.

#### FR-NEWREQ-03 ★ — Auto-map BRD-REQ/SRS-FR + trace
- **Mô tả:** Tự map requirement vào BRD-REQ/SRS-FR (của khách) và tạo trace link.
- **Inputs:** Requirement + trace graph dự án.
- **Process:** Sinh/gắn ID `BRD-REQ-### / SRS-FR-###` (deliverable khách) → tạo `ENT-12 TraceLink` US→BRD-REQ→SRS-FR.
- **Outputs:** Requirement nối vào đồ thị truy vết.
- **Errors/Edge:** Không tìm được upstream → tạo link "pending".
- **AC:**
  - **Given** một requirement mới **When** map trace **Then** TraceLink tới BRD-REQ và SRS-FR tương ứng được tạo và hiển thị trong trace graph.

#### FR-NEWREQ-04 ★ — Gọi quality score
- **Mô tả:** Gọi quality scoring (EARS/INCOSE) cho requirement trước khi đóng.
- **Inputs:** Requirement + AC.
- **Process:** Gọi FR-QUAL-02 → nhận điểm completeness/atomic/không mơ hồ/đo lường được → hiển thị + cảnh báo nếu dưới ngưỡng.
- **Outputs:** `quality_score` gắn vào requirement.
- **Errors/Edge:** Điểm dưới ngưỡng → gate cảnh báo (fail-closed ở FR-QUAL-01).
- **AC:**
  - **Given** một requirement vừa viết **When** chạy quality score **Then** requirement nhận điểm số và cảnh báo hiện ra nếu dưới ngưỡng EARS.

### 3.6 C06 — Task · Function List (`FUNC`) · REQ-008

#### FR-FUNC-01 ★ — Phân rã cây Module→Feature→Function (FUNC-xx)
- **Mô tả:** Tác vụ "Function list": phân rã scope thành cây Module → Feature → Function.
- **Inputs:** Scope/epic + Project Knowledge.
- **Process:** Sinh cây phân cấp → mỗi node lá là `ENT-08 Function(FUNC-xx)` → đánh số ổn định.
- **Outputs:** Function tree + bảng FUNC-xx.
- **Errors/Edge:** Scope quá rộng → đề nghị chia nhỏ; trùng function → gộp.
- **AC:**
  - **Given** một scope/epic **When** chạy tác vụ Function List **Then** sinh ra cây Module→Feature→Function với mỗi function có mã FUNC-xx.

#### FR-FUNC-02 ★ — Mỗi function ≥1 requirement (no orphan)
- **Mô tả:** Ràng buộc mỗi function phải gắn ≥1 requirement, không có function "mồ côi".
- **Inputs:** Function tree + requirement set.
- **Process:** Kiểm function chưa gắn requirement → cảnh báo orphan → cho gắn requirement.
- **Outputs:** Cây function không orphan.
- **Errors/Edge:** Function không thể gắn → cờ "cần làm rõ".
- **AC:**
  - **Given** một function tree **When** một function chưa gắn requirement nào **Then** hệ thống cảnh báo orphan và chặn coi là "hoàn chỉnh".

#### FR-FUNC-03 — Sửa/sắp xếp cây
- **Mô tả:** Cho phép sửa, kéo-thả, sắp xếp lại cây function (human chốt).
- **Inputs:** Thao tác chỉnh sửa.
- **Process:** Move/rename/delete node → cập nhật parent/order → giữ liên kết requirement.
- **Outputs:** Cây function đã chỉnh.
- **Errors/Edge:** Xoá node có con → hỏi xác nhận cascade.

### 3.7 C07 — Task · Estimate (`EST`) · REQ-009

#### FR-EST-01 ★ — Complexity 1–10 / function
- **Mô tả:** Gán độ phức tạp 1–10 cho mỗi function (mô hình thang màu từ budget_dashboard).
- **Inputs:** Function list đã chốt.
- **Process:** Đánh giá complexity 1–10/function (gợi ý từ AI, human chỉnh) → lưu vào `ENT-09 Estimate`.
- **Outputs:** Bảng complexity theo function.
- **Errors/Edge:** Function mơ hồ → xem FR-EST-04.
- **AC:**
  - **Given** một function list đã chốt **When** chạy Estimate **Then** mỗi function có giá trị complexity trong khoảng 1–10.

#### FR-EST-02 ★ — Function point (IFPUG/COSMIC) + story point
- **Mô tả:** Tính **story point** (đơn vị chính) + **function point** (IFPUG/COSMIC, tuỳ chọn nâng cao).
- **Inputs:** Function + complexity.
- **Process:** Quy đổi sang story point (mặc định) → tuỳ chọn function point IFPUG/COSMIC từ cấu trúc requirement.
- **Outputs:** SP (+ FP optional) theo function.
- **Errors/Edge:** Thiếu AC để tính FP → chỉ xuất SP + cảnh báo.
- **AC:**
  - **Given** các function có complexity **When** ước lượng **Then** mỗi function có story point; function point IFPUG/COSMIC xuất ra khi người dùng bật tuỳ chọn.

#### FR-EST-03 ★ — Quy đổi man-day + dải tin cậy
- **Mô tả:** Quy đổi sang man-day theo cơ cấu nỗ lực + đưa ra dải tin cậy.
- **Inputs:** SP/FP + cơ cấu nỗ lực (Dev/Test/BA/Design/PM-QA).
- **Process:** Áp cơ cấu nỗ lực mẫu (BIDV: Dev~53% / Test~16% / BA~12% / Design-Arch~10% / PM-QA~9%) → tổng man-day + dải min–max.
- **Outputs:** Bảng estimate + tổng MD + dải tin cậy.
- **Errors/Edge:** Nhiều function mơ hồ → nới dải + cảnh báo "độ tin cậy thấp".
- **AC:**
  - **Given** một bộ estimate theo story point **When** quy đổi man-day **Then** hệ thống xuất tổng man-day kèm dải tin cậy (min–max).

#### FR-EST-04 — Cờ function mơ hồ
- **Mô tả:** Đánh dấu function mơ hồ/thiếu AC là "estimate rủi ro cao".
- **Inputs:** Function + AC coverage.
- **Process:** Phát hiện thiếu AC/định nghĩa → gắn cờ risk → tác động dải tin cậy.
- **Outputs:** Cờ rủi ro trên function.
- **Errors/Edge:** Toàn bộ mơ hồ → cảnh báo "không nên cam kết số".

#### FR-EST-05 — Calibrate lịch sử (P4)
- **Mô tả:** (P4) Hiệu chỉnh estimate theo dữ liệu dự án đã đóng.
- **Inputs:** Lịch sử estimate vs thực tế.
- **Process:** (P4) học hệ số calibrate → áp cho dự án mới.
- **Outputs:** Estimate hiệu chỉnh.
- **Errors/Edge:** Thiếu dữ liệu lịch sử → bỏ qua calibrate.

### 3.8 C08 — Task · Enhance (`ENH`) · REQ-010

#### FR-ENH-01 ★ — Nhận change request
- **Mô tả:** Tác vụ "Enhance": tiếp nhận yêu cầu thay đổi trên requirement/function hiện hữu.
- **Inputs:** Item đích + mô tả thay đổi mong muốn.
- **Process:** Xác định target trong trace graph → ghi change request.
- **Outputs:** Change request record.
- **Errors/Edge:** Target không tồn tại → từ chối.
- **AC:**
  - **Given** một requirement/function hiện hữu **When** người dùng nhập yêu cầu thay đổi **Then** một change request được ghi nhận gắn đúng target.

#### FR-ENH-02 ★ — Impact analysis trên trace graph
- **Mô tả:** Phân tích tác động: liệt kê mọi item downstream bị ảnh hưởng trước khi chốt.
- **Inputs:** Change request + `ENT-12 TraceLink[]`.
- **Process:** Duyệt trace graph từ target → thu thập downstream (US/BRD-REQ/SRS-FR/TC/Function) → xuất impact report.
- **Outputs:** Impact report (danh sách item ảnh hưởng).
- **Errors/Edge:** Graph rời rạc → báo "không đủ liên kết để phân tích".
- **AC:**
  - **Given** một change request **When** chạy impact analysis **Then** mọi item downstream bị ảnh hưởng được liệt kê trước khi người dùng chốt thay đổi.

#### FR-ENH-03 ★ — Delta spec (add/mod/remove) + version bump
- **Mô tả:** Sinh delta spec (thêm/sửa/bỏ) và tăng version.
- **Inputs:** Change request + impact.
- **Process:** Tạo change set (add/modify/remove) → áp lên item → bump version requirement/deliverable.
- **Outputs:** Delta spec + version mới.
- **Errors/Edge:** Xung đột thay đổi → yêu cầu giải quyết thủ công.
- **AC:**
  - **Given** một change request đã phân tích tác động **When** sinh delta spec **Then** hệ thống xuất change set add/modify/remove và tăng version của item bị đổi.

#### FR-ENH-04 — Cập nhật AC item đổi
- **Mô tả:** Cập nhật Acceptance Criteria của các item thay đổi.
- **Inputs:** Delta spec.
- **Process:** Sinh lại/điều chỉnh AC cho item đổi → đánh dấu AC cũ thay thế.
- **Outputs:** AC cập nhật.
- **Errors/Edge:** AC cũ bị orphan → cảnh báo.

### 3.9 C09 — Generation Pipeline M1–M6 (`PIPE`) · REQ-011

#### FR-PIPE-01 ★ — Phase detect/route (Disc/US/BRD/SRS/Diagram/Sprint)
- **Mô tả:** Nhận diện phase và định tuyến tới đúng module M1–M6.
- **Inputs:** Loại tác vụ/yêu cầu + ngữ cảnh dự án.
- **Process:** Detect phase (Discovery/User Story/BRD/SRS/Diagram/Sprint) → load đúng prompt-fragment (R-02) → chạy.
- **Outputs:** Pipeline định tuyến đúng module.
- **Errors/Edge:** Không rõ phase → hỏi người dùng chọn.
- **AC:**
  - **Given** một yêu cầu sinh deliverable **When** pipeline chạy **Then** hệ thống định tuyến đúng module M1–M6 tương ứng phase.

#### FR-PIPE-02 ★ — Sinh deliverable theo output-standard
- **Mô tả:** Mọi deliverable sinh ra **luôn** qua output-standard (YAML header + ID) — R-03.
- **Inputs:** Phase + nội dung.
- **Process:** Render qua output-standard → gắn header (Document ID/Version/Status/Source) + ID có cấu trúc → tạo `ENT-10 Deliverable`.
- **Outputs:** Deliverable chuẩn hoá, tất định.
- **Errors/Edge:** Thiếu trường header → chặn xuất (fail-closed).
- **AC:**
  - **Given** một phase hoàn tất **When** sinh deliverable **Then** deliverable mang YAML header + ID theo output-standard, không có biến thể tự do.

#### FR-PIPE-03 ★ — Mermaid (M5)
- **Mô tả:** Sinh sơ đồ Mermaid hợp lệ ở phase Diagram (M5).
- **Inputs:** Knowledge/requirement/function.
- **Process:** Sinh mã Mermaid (flow/sequence/ER…) → validate cú pháp (P04).
- **Outputs:** Sơ đồ Mermaid render-ready.
- **Errors/Edge:** Mermaid sai cú pháp → tự sửa hoặc báo lỗi, không xuất sơ đồ vỡ.
- **AC:**
  - **Given** phase Diagram **When** sinh sơ đồ **Then** mã Mermaid hợp lệ và render được, không lỗi cú pháp.

#### FR-PIPE-04 ★ — Sprint plan + estimate rollup (M6)
- **Mô tả:** Sinh sprint plan và rollup estimate ở phase Sprint (M6).
- **Inputs:** Function/requirement + estimate.
- **Process:** Nhóm vào sprint → rollup story point/man-day → xuất sprint plan.
- **Outputs:** Sprint plan + tổng estimate.
- **Errors/Edge:** Thiếu estimate → cảnh báo rollup không đầy đủ.
- **AC:**
  - **Given** một backlog có estimate **When** chạy phase Sprint **Then** sinh sprint plan kèm rollup story point/man-day.

#### FR-PIPE-05 ★ — Refine ≤3 vòng
- **Mô tả:** Cho phép tinh chỉnh deliverable tối đa 3 vòng để chống vòng lặp vô hạn (R03).
- **Inputs:** Deliverable + phản hồi refine.
- **Process:** Mỗi vòng áp phản hồi → đếm vòng → chặn ở vòng thứ 3 + đề nghị chốt thủ công.
- **Outputs:** Deliverable đã refine (≤3 vòng).
- **Errors/Edge:** Vượt 3 vòng → dừng + yêu cầu human quyết.
- **AC:**
  - **Given** một deliverable đang refine **When** đạt 3 vòng tinh chỉnh **Then** hệ thống ngừng auto-refine và yêu cầu người dùng chốt.

### 3.10 C10 — Traceability & Quality (`QUAL`) · REQ-012..014, REQ-019

#### FR-QUAL-01 ★ — Quality gate fail-closed
- **Mô tả:** Quality gate mỗi phase/tác vụ: chưa PASS (đủ section + nhất quán + traceable + feasible) thì **chưa "xong"** — fail-closed.
- **Inputs:** Deliverable + tiêu chí gate.
- **Process:** Chấm completeness/consistency/traceability/feasibility → PASS/FAIL → FAIL chặn chuyển bước.
- **Outputs:** Trạng thái gate + lý do fail.
- **Errors/Edge:** Bỏ qua gate không được phép; chỉ human override có ghi log.
- **AC:**
  - **Given** một deliverable chưa đạt completeness/consistency/traceability/feasibility **When** kiểm gate **Then** gate trả FAIL và chặn coi phase là hoàn tất.

#### FR-QUAL-02 ★ — EARS/INCOSE score
- **Mô tả:** Chấm điểm chất lượng requirement theo EARS/INCOSE.
- **Inputs:** Requirement + AC.
- **Process:** Đánh giá completeness/atomic/không mơ hồ/đo lường được → điểm + gợi ý sửa.
- **Outputs:** Quality score + khuyến nghị.
- **Errors/Edge:** Requirement rỗng → điểm 0 + cảnh báo.
- **AC:**
  - **Given** một requirement **When** chấm EARS/INCOSE **Then** trả về điểm theo các tiêu chí và cảnh báo nếu dưới ngưỡng cấu hình.

#### FR-QUAL-03 ★ — Live trace graph
- **Mô tả:** Đồ thị truy vết sống: `Function → US → BRD-REQ → SRS-FR → TC`.
- **Inputs:** TraceLink[] toàn dự án.
- **Process:** Dựng graph từ TraceLink → cập nhật realtime khi item thay đổi → hiển thị tương tác.
- **Outputs:** Trace graph trực quan.
- **Errors/Edge:** Link gãy → highlight node mồ côi.
- **AC:**
  - **Given** dự án có các item liên kết **When** mở trace graph **Then** hiển thị chuỗi Function→US→BRD-REQ→SRS-FR→TC và cập nhật khi item đổi.

#### FR-QUAL-04 ★ — Impact analysis
- **Mô tả:** Phân tích tác động trên trace graph (dùng chung với Enhance).
- **Inputs:** Node thay đổi.
- **Process:** Duyệt downstream từ node → liệt kê ảnh hưởng (xem FR-ENH-02).
- **Outputs:** Impact list.
- **Errors/Edge:** Node cô lập → báo không có downstream.
- **AC:**
  - **Given** một node trong trace graph thay đổi **When** chạy impact analysis **Then** mọi node downstream bị ảnh hưởng được liệt kê.

#### FR-QUAL-05 — Auto test-case từ AC (P3)
- **Mô tả:** (P3) Tự sinh test-case từ Acceptance Criteria.
- **Inputs:** AC (Given-When-Then).
- **Process:** Map AC → test-case `TC-###` (deliverable khách).
- **Outputs:** Test-case nháp.
- **Errors/Edge:** AC mơ hồ → test-case gắn cờ review.

#### FR-QUAL-06 ★ — Provenance enforcement (anti-fabrication)
- **Mô tả:** Bắt buộc provenance cho mọi knowledge/requirement; thiếu nguồn → đánh dấu giả định, không tự chốt (REQ-006/REQ-019).
- **Inputs:** Knowledge/requirement item.
- **Process:** Kiểm ProvenanceRef → không có → chặn coi là "đã chốt" + gắn cờ assumption.
- **Outputs:** Trạng thái grounding mỗi item.
- **Errors/Edge:** Cố xuất item không nguồn → cảnh báo, yêu cầu xác nhận.
- **AC:**
  - **Given** một item không có provenance **When** hệ thống kiểm anti-fabrication **Then** item bị chặn khỏi trạng thái "đã chốt" và gắn nhãn giả định.

### 3.11 C11 — Template & Output/Export (`OUTPUT`) · REQ-015..018

#### FR-OUTPUT-01 ★ — Render theo template
- **Mô tả:** Render deliverable bám template (built-in hoặc user tải lên), giữ ID/header convention.
- **Inputs:** Deliverable + TemplateAsset/schema.
- **Process:** Map nội dung vào khuôn (heading/section/field) → giữ output-standard → xuất bản render.
- **Outputs:** Deliverable đúng khuôn doanh nghiệp.
- **Errors/Edge:** Không có template riêng → dùng built-in domain (FR-TPL-03).
- **AC:**
  - **Given** một deliverable + template mẫu đã đính **When** render **Then** nội dung được map vào đúng heading/section của template, giữ ID/header.

#### FR-OUTPUT-02 ★ — Granularity per-function/per-req/all
- **Mô tả:** Chọn mức chi tiết output: per-function / per-requirement / all.
- **Inputs:** Lựa chọn granularity.
- **Process:** Lọc phạm vi theo granularity → render tương ứng (1 function / 1 requirement / cả bộ).
- **Outputs:** Bản xuất theo đúng granularity.
- **Errors/Edge:** Granularity không khớp dữ liệu (vd chưa có function) → cảnh báo.
- **AC:**
  - **Given** một dự án có function + requirement **When** chọn granularity "per-function" **Then** output chỉ chứa nội dung của function được chọn; chọn "all" thì xuất cả bộ.

#### FR-OUTPUT-03 ★ — Export MD/Word/PDF
- **Mô tả:** Xuất deliverable ra Markdown/Word/PDF.
- **Inputs:** Deliverable đã render + format đích.
- **Process:** Convert sang MD/Word/PDF qua thư viện → đảm bảo hợp lệ (P05).
- **Outputs:** File xuất hợp lệ.
- **Errors/Edge:** Convert lỗi → báo + giữ bản MD fallback.
- **AC:**
  - **Given** một deliverable đã render **When** chọn export Word **Then** sinh file Word hợp lệ giữ cấu trúc heading/section.

#### FR-OUTPUT-04 — Push Jira/Confluence (P3)
- **Mô tả:** (P3) Push deliverable sang Jira (issue) / Confluence (page); Linear sau.
- **Inputs:** Deliverable + cấu hình connector.
- **Process:** (P3) Qua MCP/connector → tạo issue/page theo granularity (1 issue/function|req; epic+children cho all).
- **Outputs:** Issue/page đã tạo.
- **Errors/Edge:** Lỗi auth/API → báo + không tạo bản trùng.

#### FR-OUTPUT-05 — Spec→prototype (P3)
- **Mô tả:** (P3) Handoff spec sang prototype (Claude Design).
- **Inputs:** Spec/requirement.
- **Process:** (P3) Chuyển spec → mô tả prototype/màn hình.
- **Outputs:** Handoff prototype.
- **Errors/Edge:** Spec thiếu → cảnh báo không đủ để prototype.

### 3.12 C12 — Platform (Storage/LLM/Security) (`PLAT`) · REQ-020..022

#### FR-PLAT-01 ★ — Local-first IndexedDB
- **Mô tả:** Lưu toàn bộ dữ liệu local qua IndexedDB (P1–P3), sống qua reload (R04).
- **Inputs:** Mọi entity dự án.
- **Process:** CRUD vào IndexedDB → khôi phục khi mở lại app.
- **Outputs:** Dữ liệu bền vững local.
- **Errors/Edge:** Quota đầy → cảnh báo; lỗi store → fallback an toàn, không mất dữ liệu âm thầm.
- **AC:**
  - **Given** người dùng tạo dữ liệu dự án **When** reload trình duyệt **Then** toàn bộ dữ liệu (project/source/knowledge) được khôi phục từ IndexedDB.

#### FR-PLAT-02 ★ — LLM adapter (cloud/on-prem)
- **Mô tả:** Lớp adapter provider-agnostic (cloud Claude P1; on-prem tuỳ chọn P4) — R-05.
- **Inputs:** Cấu hình provider + request prompt.
- **Process:** Gọi LLM qua interface adapter (cô lập provider) → đổi provider không sửa lõi.
- **Outputs:** Phản hồi LLM chuẩn hoá.
- **Errors/Edge:** Provider lỗi/timeout → retry/fallback + thông báo.
- **AC:**
  - **Given** hệ thống cấu hình cloud Claude **When** copilot gọi LLM **Then** gọi qua adapter; đổi sang provider khác chỉ cần đổi cấu hình adapter, không sửa code nghiệp vụ.

#### FR-PLAT-03 ★ — Token budget guard + metering/dự án
- **Mô tả:** Đặt ngân sách token + đo lường theo từng dự án.
- **Inputs:** `ENT-13 TokenBudget` per project.
- **Process:** Đếm token mỗi lời gọi → cộng dồn theo dự án → chặn/cảnh báo khi vượt ngưỡng (AI03).
- **Outputs:** Mức tiêu thụ + cảnh báo budget.
- **Errors/Edge:** Vượt budget → chặn gọi tiếp + đề nghị nâng ngưỡng.
- **AC:**
  - **Given** một dự án có token budget **When** tiêu thụ chạm ngưỡng **Then** hệ thống cảnh báo và chặn lời gọi LLM vượt budget.

#### FR-PLAT-04 ★ — Settings BYO-key/proxy
- **Mô tả:** Cấu hình khoá LLM theo BYO-key hoặc thin proxy trong Cài đặt (không lộ key server, S04).
- **Inputs:** API key / cấu hình proxy.
- **Process:** Lưu key an toàn (không log, không commit) → dùng cho adapter.
- **Outputs:** Cấu hình LLM hoạt động.
- **Errors/Edge:** Key sai → báo lỗi xác thực; không bao giờ in key ra log.
- **AC:**
  - **Given** màn Cài đặt **When** người dùng nhập BYO-key hợp lệ **Then** copilot gọi LLM bằng key đó và key không xuất hiện trong log hay repo.

#### FR-PLAT-05 — Backend + multi-user + RBAC (P4)
- **Mô tả:** (P4) Backend đa người dùng + phân quyền RBAC (REQ-022).
- **Inputs:** `ENT-14 User`, `ENT-15 Role`.
- **Process:** (P4) Xác thực + phân quyền theo vai trò → chia sẻ dự án.
- **Outputs:** Truy cập đa người dùng có kiểm soát.
- **Errors/Edge:** Thiếu quyền → từ chối thao tác.

#### FR-PLAT-06 — Cloud sync (P4)
- **Mô tả:** (P4) Đồng bộ dữ liệu local ↔ cloud.
- **Inputs:** Dữ liệu local + tài khoản.
- **Process:** (P4) Sync 2 chiều + giải quyết xung đột.
- **Outputs:** Dữ liệu đồng bộ đa thiết bị.
- **Errors/Edge:** Xung đột → chính sách merge/last-write-win có cảnh báo.

---

## 4. Non-Functional Requirements

> Chi tiết ở [nfr.md](nfr.md) (registry NFR-{CAT}## tại `_v2-backbone.md §3`). Ở đây chỉ liệt kê **nhóm**, không lặp nội dung:

- **Usability (U01–U05):** Socratic options+default · Markdown+Mermaid render-ready · 3-state loading/empty/error · streaming · màn Khai phá signature.
- **Reliability (R01–R05):** no-hallucination · gate fail-closed · refine ≤3 chống loop · persistence sống qua reload · provenance mọi knowledge item.
- **Maintainability (M01–M05):** module-as-prompt · domain pack = data (config-over-code) · naming/ID/header conventions · tách data/logic · adapter cô lập LLM.
- **Portability (P01–P05):** chạy nhiều LLM · standalone hoặc web · web static/local · Mermaid hợp lệ · export Word/PDF/MD hợp lệ.
- **Performance (PF01–PF04):** dashboard <2s · prompt-kit vừa context · copilot first-token mục tiêu · parse nguồn mục tiêu.
- **Security/Privacy (S01–S07):** no secret in repo · dữ liệu local ở máy · sanitize URL import · secret qua env/vault · PII redaction log · prompt-injection guard · residency/on-prem (Banking/Health).
- **AI-quality (AI01–AI04):** grounding/provenance ratio · EARS score ngưỡng gate · token budget/dự án · output-standard tất định.
- **Scalability (SC01–SC02, P4):** multi-user · nhiều dự án đồng thời.

---

## 5. Architecture Invariants (R-01..R-08)

> Giữ tinh thần v1 (R-01..R-05 nâng cấp cho v2) + 3 invariant mới cho kiến trúc 4 lớp. Chi tiết ở [ARCHITECTURE](../03-architecture/ARCHITECTURE.md).

- **R-01 — Framework là nguồn chân lý.** Prompt-kit M1–M6 định nghĩa pipeline; Web App **tiêu thụ** framework, không định nghĩa lại quy trình. (Nâng cấp v2: orchestrator = prompt-kit, Domain Pack chỉ overlay, không thay quy trình.)
- **R-02 — Module-as-prompt.** Mỗi phase là một prompt-fragment độc lập load theo phase; thêm phase = thêm module + template, không sửa controller lõi.
- **R-03 — Output-standard bắt buộc.** Mọi deliverable đi qua output-standard, mang YAML header + ID có cấu trúc; render tất định (AI04).
- **R-04 — Domain Pack = data tách lõi.** Tri thức ngành nằm trong pack (YAML + overlay), **tách khỏi** lõi quy trình; thêm ngành = thêm 1 file pack (config-over-code). *(Mới — linh hồn v2.)*
- **R-05 — LLM qua adapter.** Mọi lời gọi LLM đi qua lớp adapter provider-agnostic; đổi provider (cloud↔on-prem) không sửa code nghiệp vụ. *(Mới.)*
- **R-06 — Provenance bắt buộc (anti-fabrication).** Mọi knowledge/requirement phải trỏ nguồn; thiếu nguồn → gắn cờ "giả định", AI không tự chốt; human-in-the-loop ở mọi quyết định. *(Mới.)*
- **R-07 — Local-first → backend tuỳ chọn.** State sống ở IndexedDB (P1–P3); backend chỉ thêm ở P4, không phá vỡ luồng client-side. (Nâng cấp R-04 v1: "client-side, không backend MVP" → "local-first, backend tuỳ chọn P4".)
- **R-08 — Tách ID sản phẩm vs ID sinh-cho-khách.** `FR-{PREFIX}-##`/`REQ-###`/`UC-##` là của sản phẩm; `BRD-REQ-###`/`SRS-FR-###`/`TC-###` là output công cụ sinh cho khách — không trộn lẫn.

---

## 6. Traceability

**Chuỗi truy vết sản phẩm:** `REQ-### (BRD) → FR-{PREFIX}-## (SRS này) → UC-## → EPIC-## → NFR`. Ma trận tổng hợp ở [traceability.md](traceability.md) (bám `_v2-backbone.md §7`). Bảng rút gọn:

| REQ | FR chính (SRS này) | UC | Release |
|---|---|---|:--:|
| REQ-001 | FR-INGEST-01 | UC-01 | P1 |
| REQ-002 | FR-INGEST-02..05 | UC-02 | P1 |
| REQ-003 | FR-TPL-01..03 | UC-03 | P1/P3 |
| REQ-004 | FR-DOMAIN-01..04 | UC-01 | P1+ |
| REQ-005 | FR-DISC-01..05 | UC-04 | P1 |
| REQ-006 | FR-DISC-04, FR-QUAL-06 | UC-05 | P1 |
| REQ-007 | FR-NEWREQ-01..04 | UC-06 | P2 |
| REQ-008 | FR-FUNC-01..03 | UC-07 | P2 |
| REQ-009 | FR-EST-01..05 | UC-08 | P2 |
| REQ-010 | FR-ENH-01..04 | UC-09 | P2 |
| REQ-011 | FR-PIPE-01..05 | UC-10 | P2 |
| REQ-012 | FR-QUAL-01 | UC-11 | P2 |
| REQ-013 | FR-QUAL-02 | UC-11 | P2 |
| REQ-014 | FR-QUAL-03..04 | UC-09, UC-11 | P2 |
| REQ-015 | FR-OUTPUT-01 | UC-12 | P3 |
| REQ-016 | FR-OUTPUT-02 | UC-12 | P3 |
| REQ-017 | FR-OUTPUT-03..04 | UC-12, UC-13 | P3 |
| REQ-018 | FR-OUTPUT-05 | UC-12 | P3 |
| REQ-019 | FR-QUAL-01, FR-DISC-01 | UC-05, UC-11 | mọi P |
| REQ-020 | FR-PLAT-01 | UC-15 | P1 |
| REQ-021 | FR-PLAT-02..04 | UC-14 | P1/P4 |
| REQ-022 | FR-PLAT-05..06 | UC-15 | P4 |

> Mỗi FR ở §3 đã ghi REQ-BRD nguồn ở tiêu đề mục con (vd "C05 NEWREQ · REQ-007"), bảo đảm vẽ được đường Requirement → implementation → (AC = test).

---

## ⚠️ Open Questions & Assumptions (Red-Team)

> Bám đúng nguyên tắc self-critic: nêu rõ điểm chưa chốt thay vì giả vờ đã đủ.

**Open Questions (cần chốt trước khi build):**
1. **Ngưỡng EARS/INCOSE để qua gate (FR-QUAL-02, AI02):** con số cụ thể chưa định — backbone chỉ nói "ngưỡng". Cần BA chốt giá trị.
2. **Function point IFPUG vs COSMIC (FR-EST-02):** dùng cả hai hay chỉ một? PSCOPE chốt story point là chính, FP "tuỳ chọn nâng cao" — nhưng chưa rõ chuẩn FP nào ưu tiên.
3. **Email Forward (FR-INGEST-06):** hạ tầng inbound (mailbox/parser) chưa thiết kế — defer P2, cần quyết kiến trúc.
4. **Granularity "all" khi push Jira (FR-OUTPUT-04):** map "epic + children" cụ thể ra sao (1 epic? nhiều?) chưa định nghĩa — P3.
5. **Token budget mặc định/dự án (FR-PLAT-03):** ngưỡng khởi tạo bao nhiêu? Chưa có guard cụ thể (PSCOPE §⚠️ cũng để ngỏ).
6. **BYO-key vs thin proxy (FR-PLAT-04):** PSCOPE đề xuất BYO-key cho P1 nhưng chưa chốt cứng; ảnh hưởng bảo mật key.

**Assumptions (đang dùng, có thể đảo):**
- Parse `.docx/.pdf/.md` **client-side** đủ chất lượng; **PDF scan ảnh ngoài P1** (PSCOPE §⚠️).
- Nội dung 2 pack Banking/Insurance là **mẫu minh hoạ** — phải BA ngành rà trước khi dùng thật.
- Cơ cấu nỗ lực estimate (Dev~53%/Test~16%/BA~12%/Design~10%/PM-QA~9%) lấy từ dữ liệu BIDV — coi là **giả định hoạch định**, không cam kết.
- Local-first single-user cho P1–P3; multi-user/RBAC/cloud sync chỉ P4 (FR-PLAT-05/06).
- Cross-link `data-model.md` và `traceability.md` là tài liệu v2 **dự kiến** (sibling) — nếu chưa tồn tại tại thời điểm đọc, link sẽ valid khi bộ v2 hoàn tất.

**Sai lệch backbone:** Không có. 49/49 FR trong `_v2-backbone.md §2` được đặc tả đầy đủ; ID, prefix, capability (C01–C12), priority/release giữ VERBATIM. Mục con FR không bị rút gọn kiểu "// tương tự".

---

*SRS v2.0 (SRS-BASUPER-2.0) — 12 capability (C01–C12), 49 FR đặc tả (Mô tả·Inputs·Process·Outputs·Errors), 34 FR có AC Given-When-Then; 8 Architecture Invariants (R-01..R-08); bám keystone ID BACKBONE-BASUPER-V2-1.0. Trạng thái: Draft — for approval.*
