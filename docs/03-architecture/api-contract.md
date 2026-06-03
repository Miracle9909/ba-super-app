<!--
  Document ID: API-BASUPER-2.0
  Date: 2026-06-03
  Version: 2.0
  Status: Draft — for approval
  Source: chắt lọc BACKBONE-BASUPER-V2-1.0 (_v2-backbone.md §2 FR + §6 entities là nguồn CHUẨN);
          kế thừa SRS-BASUPER-2.0 (FR đặc tả) + IMPLPLAN-BASUPER-1.0 (kiến trúc 4 lớp).
  Template: API-Contract
  QUY ƯỚC ID: FR-{PREFIX}-## = chức năng sản phẩm (từ backbone §2). DTO trỏ thực thể ENT-## ở data-model.md.
             KHÔNG lẫn với ID công cụ SINH RA cho khách (BRD-REQ-###, SRS-FR-###, TC-###).
-->

# API Contract — BA Super App v2

> Hợp đồng giao tiếp của **BA Super App v2**. Phủ đúng các FR ở [SRS](../02-requirements/srs.md); DTO ánh xạ thực thể ở [data-model](./data-model.md); kiến trúc lớp ở [ARCHITECTURE](./ARCHITECTURE.md).
>
> ⚠️ **Anti-fabrication.** Mọi endpoint/op dưới đây phủ một FR có thật trong `_v2-backbone.md §2`. Không thêm chức năng ngoài registry. Cột **FR** truy ngược về backbone. Chỗ chưa chốt gắn cờ ở §cuối *Open Questions*.

---

## 1. Mô hình giao tiếp & ranh giới lớp

> **[WHY]** Theo R-07 (local-first → backend tuỳ chọn P4): P1–P3 chạy **client-side**, nên "API" ở các lớp này là **service layer interface** (TypeScript-style) gọi nội bộ trên IndexedDB + LLM adapter — KHÔNG phải HTTP. Chỉ **P4** mới expose **REST** tương ứng khi có backend đa người dùng.

| Lớp / Capability | Phase | Kiểu giao tiếp | Lưu ý |
|---|---|---|---|
| **L1 Input** (C01,C02) · **L2 Khai phá** (C03,C04) · **L3 Tác vụ** (C05–C08) · **L4 Output** (C11) · Platform local (C12: PLAT-01..04) | **P1–P3** | **Service layer client-side** — interface TypeScript-style, gọi sync/async trên store + adapter | Không có network; "Path/Signature" = chữ ký hàm |
| **Auth/Users/Sync** (C12: PLAT-05..06) + mirror toàn bộ service P1–P3 | **P4** | **REST** (`/api/v1/...`) | Khi bật backend; cùng DTO, bọc HTTP |

**Quy ước chung cho cả service-call lẫn REST:**

- **Envelope `ApiResponse<T>`** — mọi op trả về thống nhất:

```ts
interface ApiResponse<T> {
  data: T | null;
  error: { code: string; message: string; details?: unknown } | null;
  meta: {
    correlationId: string;     // X-Correlation-Id — truy vết xuyên lớp
    timestamp: string;         // ISO-8601
    pagination?: { page: number; pageSize: number; total: number };
  };
}
```

- **`Idempotency-Key`** — bắt buộc cho thao tác **tạo** (create project/source/requirement/deliverable, push Jira/Confluence) để chống tạo trùng. Ở service layer là tham số `idempotencyKey`; ở REST là header.
- **`X-Correlation-Id`** — gắn mọi op (header REST / field `meta`), nối log FE↔LLM↔(BE P4).
- **Lỗi chuẩn:** `error.code` dạng `DOMAIN_REASON` (vd `INGEST_EMPTY_TEXT`, `QUAL_GATE_FAILED`, `PLAT_BUDGET_EXCEEDED`, `AUTH_FORBIDDEN`).
- **Phân trang:** list trả `meta.pagination`; tham số `page`, `pageSize`.

---

## 2. Projects (CRUD) · C01

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Create | `POST /api/v1/projects` · `ProjectService.create(dto, idempotencyKey)` | `{ name, domain, goal, compliance[], scale }` | `ApiResponse<Project>` | FR-INGEST-01 |
| Get | `GET /api/v1/projects/:id` · `ProjectService.get(id)` | `id` | `ApiResponse<Project>` | FR-PLAT-01 |
| List | `GET /api/v1/projects` · `ProjectService.list(query)` | `{ status?, page, pageSize }` | `ApiResponse<Project[]>` | FR-PLAT-01 |
| Update | `PATCH /api/v1/projects/:id` · `ProjectService.update(id, patch)` | partial Project | `ApiResponse<Project>` | FR-INGEST-01 |
| Archive | `DELETE /api/v1/projects/:id` · `ProjectService.archive(id)` | `id` | `ApiResponse<{ id }>` | FR-PLAT-01 |

## 3. Sources / Ingestion · C01

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Paste | `POST /api/v1/projects/:pid/sources/paste` · `SourceService.paste(pid, dto, idemKey)` | `{ text, label? }` | `ApiResponse<Source>` | FR-INGEST-02 |
| Upload | `POST /api/v1/projects/:pid/sources/upload` · `SourceService.upload(pid, file, idemKey)` | multipart `.docx/.pdf/.md` | `ApiResponse<Source>` | FR-INGEST-03 |
| URL | `POST /api/v1/projects/:pid/sources/url` · `SourceService.fetchUrl(pid, dto, idemKey)` | `{ url }` (sanitize+guard) | `ApiResponse<Source>` | FR-INGEST-04 |
| List + status | `GET /api/v1/projects/:pid/sources` · `SourceService.list(pid)` | `pid` | `ApiResponse<Source[]>` (parse status + provenance) | FR-INGEST-05 |
| Re-parse | `POST /api/v1/sources/:id/parse` · `SourceService.parse(id)` | `id` | `ApiResponse<Source>` (queued→parsed/failed) | FR-INGEST-03/05 |
| Email forward (P2) | `POST /api/v1/inbound/email` | forwarded email | `ApiResponse<Source>` | FR-INGEST-06 |

## 4. Packs (list/load domain) · C03

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| List packs | `GET /api/v1/packs` · `PackService.list()` | — | `ApiResponse<DomainPack[]>` (Banking/Insurance seeded) | FR-DOMAIN-03 |
| Get pack | `GET /api/v1/packs/:industry` · `PackService.get(industry)` | `industry` | `ApiResponse<DomainPack>` (7 thành phần) | FR-DOMAIN-01 |
| Load overlay | `POST /api/v1/projects/:pid/pack/load` · `PackService.loadOverlay(pid)` | `{ industry }` | `ApiResponse<{ overlayReady, ragIndexed }>` | FR-DOMAIN-02 |
| Register pack | `PUT /api/v1/packs/:industry` · `PackService.register(file)` | pack YAML | `ApiResponse<DomainPack>` (thêm ngành = 1 file) | FR-DOMAIN-04 |

## 5. Discovery / Chat · C04

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Send message | `POST /api/v1/projects/:pid/discovery/messages` · `DiscoveryService.send(pid, dto, idemKey)` | `{ message }` | `ApiResponse<DiscoveryTurn>` (câu hỏi Socratic: options+default) | FR-DISC-01 |
| Extract knowledge | `POST /api/v1/projects/:pid/discovery/extract` · `DiscoveryService.extract(pid, turnId)` | `{ turnId }` | `ApiResponse<KnowledgeItem[]>` (có ProvenanceRef) | FR-DISC-02 |
| Get history | `GET /api/v1/projects/:pid/discovery/messages` · `DiscoveryService.history(pid)` | `pid` | `ApiResponse<DiscoveryTurn[]>` (conversation memory) | FR-DISC-05 |

## 6. Knowledge (CRUD entity/rule/term) · C04

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Build/list | `GET /api/v1/projects/:pid/knowledge` · `KnowledgeService.list(pid, subtype?)` | `{ subtype? }` | `ApiResponse<KnowledgeItem[]>` (3 nhóm) | FR-DISC-03 |
| Create | `POST /api/v1/projects/:pid/knowledge` · `KnowledgeService.create(pid, dto)` | `{ subtype, name, body, provenanceRefId? }` | `ApiResponse<KnowledgeItem>` | FR-DISC-03 |
| Update (manual) | `PATCH /api/v1/knowledge/:id` · `KnowledgeService.update(id, patch)` | partial | `ApiResponse<KnowledgeItem>` (origin=manual) | FR-DISC-03 |
| Confirm assumption | `POST /api/v1/knowledge/:id/confirm` · `KnowledgeService.confirm(id, by)` | `{ confirmedBy }` | `ApiResponse<KnowledgeItem>` (assumption→chốt) | FR-DISC-04 |
| Delete | `DELETE /api/v1/knowledge/:id` · `KnowledgeService.remove(id)` | `id` | `ApiResponse<{ id }>` | FR-DISC-03 |

## 7. Tasks — Requirements (EARS + AC) · C05

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| New requirement | `POST /api/v1/projects/:pid/requirements` · `RequirementService.create(pid, dto, idemKey)` | `{ need }` | `ApiResponse<Requirement>` (EARS) | FR-NEWREQ-01 |
| Generate AC | `POST /api/v1/requirements/:id/ac` · `RequirementService.genAC(id)` | `id` | `ApiResponse<AcceptanceCriterion[]>` (G-W-T) | FR-NEWREQ-02 |
| Map trace | `POST /api/v1/requirements/:id/trace` · `RequirementService.mapTrace(id)` | `id` | `ApiResponse<TraceLink[]>` (US→BRD-REQ→SRS-FR) | FR-NEWREQ-03 |
| Quality score | `POST /api/v1/requirements/:id/score` · `RequirementService.score(id)` | `id` | `ApiResponse<{ qualityScore }>` | FR-NEWREQ-04 |

## 8. Tasks — Functions (tree) · C06

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Decompose | `POST /api/v1/projects/:pid/functions/decompose` · `FunctionService.decompose(pid, dto)` | `{ scope }` | `ApiResponse<Function[]>` (cây Module→Feature→Function) | FR-FUNC-01 |
| Check orphan | `GET /api/v1/projects/:pid/functions/orphans` · `FunctionService.orphans(pid)` | `pid` | `ApiResponse<Function[]>` (no-orphan guard) | FR-FUNC-02 |
| Reorder/edit | `PATCH /api/v1/functions/:id` · `FunctionService.update(id, patch)` | `{ parentId?, order?, name?, requirementIds? }` | `ApiResponse<Function>` | FR-FUNC-03 |

## 9. Tasks — Estimate · C07

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Set complexity | `POST /api/v1/functions/:id/complexity` · `EstimateService.complexity(id, dto)` | `{ complexity (1-10) }` | `ApiResponse<Estimate>` | FR-EST-01 |
| Compute points | `POST /api/v1/projects/:pid/estimate/points` · `EstimateService.points(pid, opts)` | `{ useFunctionPoint?, method? }` | `ApiResponse<Estimate[]>` (SP + FP optional) | FR-EST-02 |
| Convert man-day | `POST /api/v1/projects/:pid/estimate/manday` · `EstimateService.manDay(pid)` | `{ effortBreakdown? }` | `ApiResponse<{ totalMd, confidence }>` | FR-EST-03 |
| Calibrate (P4) | `POST /api/v1/projects/:pid/estimate/calibrate` | history | `ApiResponse<Estimate[]>` | FR-EST-05 |

## 10. Tasks — Enhance (impact/delta) · C08

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Change request | `POST /api/v1/projects/:pid/enhance` · `EnhanceService.request(pid, dto, idemKey)` | `{ targetType, targetId, change }` | `ApiResponse<ChangeRequest>` | FR-ENH-01 |
| Impact analysis | `POST /api/v1/enhance/:id/impact` · `EnhanceService.impact(id)` | `id` | `ApiResponse<ImpactReport>` (downstream trước khi chốt) | FR-ENH-02 |
| Delta spec | `POST /api/v1/enhance/:id/delta` · `EnhanceService.delta(id)` | `id` | `ApiResponse<{ changeSet, newVersion }>` | FR-ENH-03 |
| Update AC | `POST /api/v1/enhance/:id/ac` · `EnhanceService.updateAC(id)` | `id` | `ApiResponse<AcceptanceCriterion[]>` | FR-ENH-04 |

## 11. Quality (gate / EARS score / traceability) · C09/C10

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Run gate | `POST /api/v1/deliverables/:id/gate` · `QualityService.gate(id)` | `id` | `ApiResponse<{ status, reasons[] }>` (fail-closed) | FR-QUAL-01 |
| EARS/INCOSE score | `POST /api/v1/requirements/:id/quality` · `QualityService.earsScore(id)` | `id` | `ApiResponse<{ qualityScore, recommendations }>` | FR-QUAL-02 |
| Trace graph | `GET /api/v1/projects/:pid/trace-graph` · `QualityService.traceGraph(pid)` | `pid` | `ApiResponse<{ nodes, edges }>` (Function→US→BRD-REQ→SRS-FR→TC) | FR-QUAL-03 |
| Impact (node) | `POST /api/v1/projects/:pid/impact` · `QualityService.impact(nodeRef)` | `{ nodeType, nodeRef }` | `ApiResponse<ImpactReport>` | FR-QUAL-04 |
| Provenance check | `POST /api/v1/projects/:pid/provenance/verify` · `QualityService.verifyProvenance(pid)` | `pid` | `ApiResponse<{ ungrounded[] }>` (anti-fabrication) | FR-QUAL-06 |
| Pipeline run | `POST /api/v1/projects/:pid/pipeline/run` · `PipelineService.run(pid, dto)` | `{ phase?, refine? }` | `ApiResponse<Deliverable>` (M1–M6, refine ≤3) | FR-PIPE-01..05 |
| Auto test-case (P3) | `POST /api/v1/requirements/:id/test-cases` | `id` | `ApiResponse<TestCaseDraft[]>` (TC-### khách) | FR-QUAL-05 |

## 12. Deliverables / Export · C11

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Render | `POST /api/v1/projects/:pid/deliverables/render` · `ExportService.render(pid, dto, idemKey)` | `{ kind, templateAssetId?, granularity }` | `ApiResponse<Deliverable>` | FR-OUTPUT-01/02 |
| Export file | `POST /api/v1/deliverables/:id/export` · `ExportService.export(id, format)` | `{ format: md\|word\|pdf }` | `ApiResponse<{ fileUrl }>` | FR-OUTPUT-03 |
| Push Jira/Confluence (P3) | `POST /api/v1/deliverables/:id/push` · `ExportService.push(id, dto, idemKey)` | `{ target: jira\|confluence, granularity }` | `ApiResponse<{ externalRefs[] }>` | FR-OUTPUT-04 |
| Spec→prototype (P3) | `POST /api/v1/deliverables/:id/prototype` | `id` | `ApiResponse<{ handoff }>` | FR-OUTPUT-05 |

## 13. Settings (LLM key / provider / token budget) · C12

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Set LLM config | `PUT /api/v1/settings/llm` · `SettingsService.setLLM(dto)` | `{ provider, byoKey?\|proxyUrl? }` | `ApiResponse<{ provider, ok }>` (không log key) | FR-PLAT-02/04 |
| Get token budget | `GET /api/v1/projects/:pid/token-budget` · `SettingsService.getBudget(pid)` | `pid` | `ApiResponse<TokenBudget>` | FR-PLAT-03 |
| Set token budget | `PUT /api/v1/projects/:pid/token-budget` · `SettingsService.setBudget(pid, dto)` | `{ limitTokens }` | `ApiResponse<TokenBudget>` (guard+metering) | FR-PLAT-03 |

## 14. Auth / Users (P4) · C12

| Method/Op | Path/Signature | Input | Output | FR |
|---|---|---|---|---|
| Login | `POST /api/v1/auth/login` | `{ email, password }` | `ApiResponse<{ token, user }>` | FR-PLAT-05 |
| List users | `GET /api/v1/users` | `{ page, pageSize }` | `ApiResponse<User[]>` (RBAC) | FR-PLAT-05 |
| Assign role | `PUT /api/v1/users/:id/role` | `{ roleId }` | `ApiResponse<User>` | FR-PLAT-05 |
| Share project | `POST /api/v1/projects/:pid/members` | `{ userId, roleId }` | `ApiResponse<{ membership }>` | FR-PLAT-05 |
| Cloud sync | `POST /api/v1/sync` | `{ since }` | `ApiResponse<{ applied, conflicts[] }>` | FR-PLAT-06 |

---

## 15. Ví dụ request/response (op lõi)

### 15.1 Tạo project (FR-INGEST-01)

```json
// → POST /api/v1/projects   (Idempotency-Key: 9f1c-... , X-Correlation-Id: c-001)
{
  "name": "BIDV Home Loan GĐ3",
  "domain": "banking",
  "goal": "Số hoá quy trình thẩm định hồ sơ vay mua nhà",
  "compliance": ["NHNN", "PCI-DSS"],
  "scale": "large"
}
```
```json
// ← 201
{
  "data": {
    "id": "prj_01HX...",
    "name": "BIDV Home Loan GĐ3",
    "domain": "banking",
    "goal": "Số hoá quy trình thẩm định hồ sơ vay mua nhà",
    "compliance": ["NHNN", "PCI-DSS"],
    "scale": "large",
    "tokenBudgetId": "tb_01HX...",
    "status": "active"
  },
  "error": null,
  "meta": { "correlationId": "c-001", "timestamp": "2026-06-03T09:00:00Z" }
}
```

### 15.2 Gửi discovery message → câu hỏi Socratic (FR-DISC-01)

```json
// → POST /api/v1/projects/prj_01HX.../discovery/messages   (X-Correlation-Id: c-014)
{ "message": "Hệ thống cần quản lý hồ sơ vay và tài sản đảm bảo." }
```
```json
// ← 200  — copilot KHÔNG đoán, trả options + default
{
  "data": {
    "turnId": "turn_07",
    "role": "assistant",
    "socratic": {
      "question": "Tài sản đảm bảo (TSĐB) gồm loại nào trong phạm vi GĐ3?",
      "options": ["Bất động sản", "Phương tiện", "Sổ tiết kiệm", "Khác"],
      "default": "Bất động sản"
    },
    "extractedCandidates": [
      { "subtype": "entity", "name": "Hồ sơ vay", "provenanceRefId": "pv_03" },
      { "subtype": "entity", "name": "Tài sản đảm bảo", "provenanceRefId": "pv_04" }
    ]
  },
  "error": null,
  "meta": { "correlationId": "c-014", "timestamp": "2026-06-03T09:05:00Z" }
}
```

### 15.3 Export deliverable (FR-OUTPUT-02/03)

```json
// → POST /api/v1/projects/prj_01HX.../deliverables/render  (Idempotency-Key: r-77, X-Correlation-Id: c-090)
{ "kind": "srs", "templateAssetId": "tpl_acme_srs", "granularity": "per-requirement" }
```
```json
// ← 200  (render) → tiếp theo export Word
{
  "data": {
    "id": "dlv_21",
    "kind": "srs",
    "granularity": "per-requirement",
    "gateStatus": "pass",
    "headerMeta": { "documentId": "SRS-FR-014", "version": "1.0", "status": "Draft", "source": "BA Super App" }
  },
  "error": null,
  "meta": { "correlationId": "c-090", "timestamp": "2026-06-03T09:10:00Z" }
}
```
```json
// → POST /api/v1/deliverables/dlv_21/export  { "format": "word" }
// ← 200
{ "data": { "fileUrl": "blob:.../SRS-FR-014.docx" }, "error": null,
  "meta": { "correlationId": "c-090", "timestamp": "2026-06-03T09:10:05Z" } }
```

**Ví dụ lỗi (fail-closed gate, FR-QUAL-01):**
```json
// ← 422
{ "data": null,
  "error": { "code": "QUAL_GATE_FAILED", "message": "Thiếu traceability cho 2 function",
             "details": { "missingTrace": ["FUNC-03", "FUNC-07"] } },
  "meta": { "correlationId": "c-091", "timestamp": "2026-06-03T09:11:00Z" } }
```

---

## 16. Cross-link

- DTO ↔ thực thể: [./data-model.md](./data-model.md)
- Kiến trúc tổng & ADR: [./ARCHITECTURE.md](./ARCHITECTURE.md)
- Đặc tả chức năng (FR-{PREFIX}-##): [../02-requirements/srs.md](../02-requirements/srs.md)
- Registry ID (FR/ENT keystone): `../04-planning/_v2-backbone.md`

---

## ⚠️ Open Questions & Assumptions (Red-Team)

> Self-critic: nêu rõ điểm chưa chốt thay vì giả vờ đã đủ.

**Open Questions (cần chốt trước khi hiện thực):**
1. **REST style ở P4:** dùng REST thuần (như mô tả) hay tRPC để dùng lại trực tiếp interface service P1–P3? IMPLPLAN §9 nêu "REST/tRPC" — chưa chốt.
2. **Streaming discovery:** `discovery/messages` trả một lần hay **SSE/stream** token (U04 yêu cầu streaming)? Hợp đồng stream chưa định nghĩa.
3. **Idempotency scope:** `Idempotency-Key` lưu bao lâu, theo project hay toàn cục? Ảnh hưởng chống trùng khi retry.
4. **Push "all" → Jira (FR-OUTPUT-04):** map "epic + children" cụ thể (1 epic? nhiều?) chưa định nghĩa (trùng SRS Open Q#4) — P3.
5. **Versioning API:** prefix `/api/v1` cho P4; service layer P1–P3 versioning ra sao khi schema đổi (migration IndexedDB)?
6. **Mã lỗi chuẩn hoá:** danh mục `error.code` đầy đủ chưa liệt kê hết — cần catalog riêng trước khi code.
7. **Token budget chặn cứng:** khi `PLAT_BUDGET_EXCEEDED`, op trả lỗi đồng bộ hay vẫn cho thao tác không-LLM? Ngưỡng mặc định chưa chốt (trùng SRS Open Q#5).

**Assumptions (đang dùng, có thể đảo):**
- P1–P3 **không có HTTP**; "Path" REST chỉ kích hoạt khi backend P4 bật. Cùng DTO/envelope để mirror 1-1.
- `ApiResponse<T>` áp **cho cả** service-call (trả object) lẫn REST (body) để FE xử lý đồng nhất.
- `Idempotency-Key` chỉ bắt buộc cho **tạo**; read/update idempotent tự nhiên.
- ID khách (`BRD-REQ-###`/`SRS-FR-###`/`TC-###`) chỉ xuất hiện trong **payload deliverable**, không phải route param sản phẩm (R-08).

**Sai lệch backbone:** Không có. Mọi nhóm endpoint phủ FR trong `_v2-backbone.md §2` (C01–C12); cột FR truy ngược chính xác; không thêm capability ngoài registry.

---

*API Contract v2.0 (API-BASUPER-2.0) — 13 nhóm endpoint/op (Projects · Sources/Ingestion · Packs · Discovery · Knowledge · Requirements · Functions · Estimate · Enhance · Quality · Deliverables/Export · Settings · Auth/Users), envelope ApiResponse<T> + Idempotency-Key + X-Correlation-Id, 3 ví dụ JSON lõi; service layer P1–P3 + REST P4; bám keystone ID BACKBONE-BASUPER-V2-1.0. Trạng thái: Draft — for approval.*
