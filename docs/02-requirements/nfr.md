<!--
  Document ID: NFR-BASUPER-2.0
  Date: 2026-06-03
  Version: 2.0
  Status: Draft — for approval
  Source: NFR sản phẩm BA Super App v2 (framework prompt-kit + web app, local-first P1–P3).
          ID nguồn CHUẨN (verbatim): BACKBONE-BASUPER-V2-1.0 §3.
          Kế thừa & nâng cấp: NFR-BASUPER-1.0. Khoá phạm vi: PSCOPE-BASUPER-P1-1.0; định hướng: IMPLPLAN-BASUPER-1.0.
  Template: NFR (ISO/IEC 25010 product-quality + AI-quality 2026).
-->

# NFR v2 — BA Super App (Non-Functional Requirements)

> Yêu cầu phi chức năng cho **cả hai phần**: Framework (prompt-kit M1–M6) và Web App (local-first P1–P3, backend tuỳ chọn P4). Phân nhóm theo **8 nhóm** của [BACKBONE §3](../04-planning/_v2-backbone.md) trên nền **ISO/IEC 25010** + trục **AI-quality** mới của v2.
>
> Quy ước mỗi NFR: `| ID | Requirement | Target / Cách kiểm |`. **Target** phải **đo được**; **Cách kiểm** nêu rõ phương pháp verify (review / manual test / smoke test / grep / log audit / render thử). `[WHY]` đi kèm các NFR **mới của v2**.
>
> Cross-link: đặc tả tóm tắt ở [SRS §4 — Non-Functional Requirements](srs.md); ràng buộc kiến trúc ở [ARCHITECTURE.md](../03-architecture/ARCHITECTURE.md).
>
> ⚠️ **Anti-fabrication:** mọi ngưỡng đánh dấu **(giả định — cần chốt)** là số hoạch định, CHƯA cam kết; sẽ hiệu chỉnh sau sprint-0 (spike copilot) và khi có dữ liệu đo thật. Không suy diễn ngưỡng ngoài backbone.

---

## 0. Bản đồ nhóm → ID → ISO/IEC 25010

| # | Nhóm (backbone §3) | Dải ID | Đặc tính ISO 25010 | Ghi chú v2 |
|---|---|---|---|---|
| 1 | Usability | U01–U05 | Usability | giữ v1, thêm U05 (signature màn Khai phá) |
| 2 | Reliability / Correctness | R01–R05 | Reliability + Functional Correctness | thêm R05 provenance |
| 3 | Maintainability | M01–M05 | Maintainability | thêm M04 tách data/logic, M05 adapter LLM |
| 4 | Portability / Compatibility | P01–P05 | Portability + Compatibility | thêm P05 export hợp lệ |
| 5 | Performance | PF01–PF04 | Performance Efficiency | thêm PF03 first-token, PF04 parse |
| 6 | Security / Privacy | S01–S07 | Security | **mới: S04–S07** |
| 7 | **AI-quality** | AI01–AI04 | (ngoài 25010 — trục AI 2026) | **toàn bộ mới ở v2** |
| 8 | Scalability | SC01–SC02 | Scalability (P4) | defer P4 |

> **Tổng: 32 NFR / 8 nhóm.** NFR **mới của v2** (so với NFR-BASUPER-1.0): **U05, R05, M04, M05, P05, PF03, PF04, S04, S05, S06, S07, AI01, AI02, AI03, AI04** (15 mục).

---

## 1. Usability (U01–U05)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-U01 | Socratic UX — mỗi câu hỏi khai phá có **options + default** | 100% câu hỏi copilot có ≥2 option + 1 default; user không "bí" khi không chắc. **Kiểm:** review kịch bản Discovery (S5.2) + spot-check 10 lượt hỏi. |
| NFR-U02 | Output đọc được cho **cả người lẫn máy** — Markdown + Mermaid render-ready | Mở được bằng bất kỳ Markdown viewer, 0 lỗi cú pháp; Mermaid render không lỗi. **Kiểm:** mở deliverable mẫu trên 2 viewer + render Mermaid. |
| NFR-U03 | Web: **3-state** (loading / empty / error) cho mọi tác vụ nạp/sinh dữ liệu | 100% màn có data-fetch hiển thị đủ 3 state (Dashboard, Nguồn dữ liệu, Khai phá). **Kiểm:** manual test workspace, ngắt mạng để ép error-state. |
| NFR-U04 | Trả lời copilot dạng **streaming** (khi adapter hỗ trợ) để giảm cảm nhận chờ | Token hiển thị dần, không "đơ" chờ trọn câu. **Kiểm:** quan sát phiên chat khai phá có stream. |
| NFR-U05 | **Màn Khai phá (Expert) là signature** — panel chat chuyên gia + khung "Tri thức dự án" (entities/rules/glossary) sinh dần, rõ ràng | Người dùng phân biệt được vùng hội thoại vs vùng tri thức; mỗi knowledge item thấy rõ **nguồn**. **Kiểm:** usability walkthrough 1 BA thật theo DoD P1. **[WHY]** Khai phá-cùng-chuyên-gia là khác biệt cốt lõi v2 so với "trình tạo tài liệu tuyến tính" v1 — màn này phải tự giải thích được. |

---

## 2. Reliability / Correctness (R01–R05)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-R01 | **No-hallucination**: thiếu thông tin → hỏi, không bịa; giả định gắn cờ `⚠️` | 0 dữ kiện bịa trong output không có nguồn; mục thiếu nguồn bị đánh dấu *"giả định"*. **Kiểm:** spot-check 20 output đối chiếu nguồn (DoD P1 #2). |
| NFR-R02 | **Quality gate fail-closed** — chưa đạt thì KHÔNG sang phase/tác vụ kế | Gate thiếu (completeness/consistency/traceability/feasibility) ⇒ chặn, hiển thị lý do. **Kiểm:** test kịch bản thiếu section → gate phải chặn (không "lọt"). |
| NFR-R03 | **Refine ≤ 3 vòng**/mục rồi escalate (chống loop) | Đếm vòng refine ≤ 3, vòng 4 → dừng + yêu cầu người quyết. **Kiểm:** review stop-condition trong pipeline (PIPE-05). |
| NFR-R04 | **Persistence sống qua reload** — dữ liệu dự án không mất khi tải lại | Reload trình duyệt → project/source/knowledge còn nguyên (IndexedDB). **Kiểm:** reload test sau khi tạo dữ liệu (DoD P1 #3). |
| NFR-R05 | **Provenance trên mọi knowledge item** — entity/rule/term đều trỏ nguồn (tài liệu + vị trí) | 100% KnowledgeItem có `ProvenanceRef` hoặc cờ *"giả định"*; 0 item "mồ côi nguồn" không gắn cờ. **Kiểm:** audit store ProvenanceRef (ENT-03) trên dữ liệu mẫu. **[WHY]** Provenance là rào chống "văn AI"/trôi-spec của v2; không có nó thì gate R01 không kiểm chứng được. |

---

## 3. Maintainability (M01–M05)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-M01 | **Module-as-prompt**: thêm phase = thêm `modules/M{n}` + `templates/`, không sửa controller | Thêm 1 phase không chạm orchestrator core. **Kiểm:** code/doc review diff khi thêm module. |
| NFR-M02 | **Config-over-code**: domain pack = **data**; thêm ngành = thêm **1 file** pack, không sửa lõi | Ngành thứ 3 chỉ thêm `/domain-packs/<industry>.yaml`; **grep không thấy hardcode domain** trong logic. **Kiểm:** grep tên ngành + thử seed pack giả lập. **[WHY]** "Linh hồn v2" là Domain Expert Pack; chi phí mở rộng phải ~ 1 file thì 7 ngành mới khả thi. |
| NFR-M03 | **Naming / ID / header conventions** thống nhất (header doc, ID sản phẩm vs ID công cụ tách bạch) | 100% doc v2 dùng đúng ID backbone; không tự đặt ID top-level mới. **Kiểm:** lint/review theo [conventions](../00-project/conventions.md) (nếu có) + đối chiếu backbone. |
| NFR-M04 | **Tách `data/` khỏi logic**; gom mock/seed về tầng dữ liệu | Domain pack, template, seed nằm ngoài code xử lý; UI không nhúng dữ liệu ngành. **Kiểm:** review cấu trúc thư mục. **[WHY]** Tách data/logic là tiền đề để M02 (thêm ngành bằng file) và để swap seed thật ↔ mẫu mà không sửa lõi. |
| NFR-M05 | **Adapter cô lập LLM** — mọi lời gọi LLM đi qua 1 lớp adapter provider-agnostic | 0 lời gọi provider trực tiếp ngoài adapter; đổi provider chỉ sửa adapter. **Kiểm:** grep SDK provider + review điểm gọi (PLAT-02). **[WHY]** Quyết định P1 #2 chọn cloud Claude nhưng phải cắm được on-prem (Banking/Health) ở P4 mà không sửa lõi (đỡ S07). |

---

## 4. Portability / Compatibility (P01–P05)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-P01 | Framework (prompt-kit) chạy trên **nhiều LLM** (Claude/GPT/Gemini) + công cụ agent | Smoke test pass trên ≥2 LLM cho 1 phase mẫu. **Kiểm:** smoke test prompt-kit ≥2 tool. |
| NFR-P02 | Dùng được **standalone** (paste prompt-kit) HOẶC qua web | Cả 2 đường cho ra deliverable tương đương. **Kiểm:** chạy 1 case theo cả 2 đường. |
| NFR-P03 | Web **static / local** — mở bằng trình duyệt (khuyên local server cho URL fetch) | Khởi chạy không cần backend ở P1–P3; URL fetch hoạt động qua proxy/local server. **Kiểm:** mở app local + thử URL fetch. |
| NFR-P04 | **Mermaid hợp lệ** (quote nhãn đặc biệt; `erDiagram` type không ngoặc) | 100% sơ đồ M5 render không lỗi trên Mermaid Live + GitLab. **Kiểm:** render thử từng sơ đồ sinh ra. |
| NFR-P05 | **Export Word/PDF/MD hợp lệ** — mở được bằng công cụ chuẩn, giữ heading/ID | File .docx/.pdf/.md mở không lỗi trên Word/Acrobat/viewer; cấu trúc heading + ID giữ nguyên. **Kiểm:** export bộ mẫu 3 format → mở kiểm (P3). **[WHY]** Cam kết "xuất đúng khuôn doanh nghiệp" (OUTPUT) chỉ có giá trị nếu file mở được và giữ ID/header — nếu vỡ cấu trúc thì mất tin cậy bàn giao. |

---

## 5. Performance (PF01–PF04)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-PF01 | Web client-side → **dashboard tải nhanh** | Dashboard tương tác được **< 2s** (máy dev tiêu chuẩn, dữ liệu ~20 dự án). **Kiểm:** đo bằng DevTools Performance, 3 lần lấy trung vị. |
| NFR-PF02 | **Prompt-kit vừa context window** LLM phổ thông | master_prompt ≲ **~12KB** (giả định — cần chốt theo model đích). **Kiểm:** đo kích thước prompt-kit khi build. |
| NFR-PF03 | **Copilot first-token** đủ nhanh để giữ cảm nhận "đang chạy" | First-token mục tiêu **≤ 3s** *(giả định — cần chốt, phụ thuộc provider/độ trễ mạng)*. **Kiểm:** đo thời gian tới token đầu trên ≥10 lượt chat. **[WHY]** Khai phá là hội thoại nhiều lượt; độ trễ token đầu quyết định trải nghiệm hơn tổng thời lượng → tách metric riêng. |
| NFR-PF04 | **Parse nguồn** (Upload .docx/.pdf/.md → text) trong ngưỡng chấp nhận | File ≤ ~5MB parse xong **≤ 5s** *(giả định — cần chốt; PDF-scan ảnh ngoài P1)*. **Kiểm:** đo parse trên file mẫu mỗi loại. **[WHY]** Ingestion 3 kênh là cửa vào P1; parse chậm/treo chặn toàn bộ luồng khai phá phía sau. |

---

## 6. Security / Privacy (S01–S07)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-S01 | **Không lưu secret trong repo** (`.gitignore` chặn `.env`, `*.key`) | 0 secret commit; CI/grep không phát hiện key. **Kiểm:** grep + secret-scan trước commit. |
| NFR-S02 | **Dữ liệu dự án ở máy người dùng** (IndexedDB) — không gửi đi đâu khi standalone | 0 lời gọi mạng mang nội dung dự án ngoài lời gọi LLM người dùng chủ động. **Kiểm:** review + quan sát Network tab phiên standalone. |
| NFR-S03 | **Sanitize URL import** — cảnh báo/khử rủi ro khi fetch qua proxy | URL fetch qua CORS proxy có cảnh báo; production cần backend sanitize. **Kiểm:** review luồng URL fetch + thông báo người dùng. |
| NFR-S04 | **Secret qua env / vault** — API key giữ ở **BYO-key (Cài đặt) hoặc thin proxy**, không nhúng client bundle | Key không xuất hiện trong source/bundle; lưu ở vault/env hoặc nhập runtime. **Kiểm:** grep bundle build + review luồng cấu hình key. **[WHY]** Quyết định P1 #2 + Open Question còn lại (BYO-key vs proxy): lộ key = rủi ro chi phí/bảo mật trực tiếp; phải chốt nơi giữ key trước khi ship. |
| NFR-S05 | **PII redaction ở log** — không log PII thô (nguồn nghiệp vụ thật chứa dữ liệu khách) | Log không chứa PII nhận dạng được (CMND/SĐT/STK…); redaction/masking bật mặc định. **Kiểm:** audit mẫu log + test với nguồn chứa PII giả lập. **[WHY]** Seed Banking (BIDV) / Insurance (MBL) là dữ liệu thật → log lộ PII là rủi ro pháp lý (NHNN/Luật KDBH/bảo vệ dữ liệu cá nhân). |
| NFR-S06 | **Prompt-injection guard cho nội dung NẠP VÀO** — coi Source/URL/template là **dữ liệu không tin cậy**, không phải lệnh | Nội dung ingest không thể ghi đè system-overlay/đổi hành vi copilot; chỉ thị nhúng trong nguồn bị vô hiệu/cô lập. **Kiểm:** red-team test chèn câu lệnh độc trong file/URL → copilot không tuân. **[WHY]** v2 chủ động nạp tài liệu/URL bên ngoài vào prompt; đây là bề mặt tấn công injection lớn nhất — phải tách "dữ liệu" khỏi "chỉ thị" để giữ R01/R02. |
| NFR-S07 | **Residency / on-prem** cho ngành nhạy cảm (Banking/Health) — tuỳ chọn LLM on-prem + dữ liệu không rời biên giới | Khách nhạy cảm cấu hình được provider on-prem qua adapter (M05); dữ liệu dự án không gửi cloud khi bật chế độ này. **Kiểm:** review điểm cấu hình provider + đường đi dữ liệu (defer thực thi P4). **[WHY]** Compliance pack Banking (NHNN/PCI-DSS) & Health (HIPAA) thường cấm dữ liệu rời hạ tầng kiểm soát; phải để ngỏ on-prem từ thiết kế, kích hoạt ở P4. |

---

## 7. AI-quality (AI01–AI04) — trục mới của v2

> Ngoài ISO/IEC 25010: đo **chất lượng đầu ra AI** đặc thù spec-driven 2026. Toàn bộ nhóm này **mới ở v2**.

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-AI01 | **Grounding / provenance ratio** — tỷ lệ phát biểu có nguồn trên tổng phát biểu của deliverable | Grounded ratio **≥ 90%** *(giả định — cần chốt)*; phần còn lại bắt buộc gắn cờ *"giả định"*. **Kiểm:** đếm câu-có-ProvenanceRef / tổng câu trên bộ deliverable mẫu. **[WHY]** Định lượng hoá R01/R05 thành một con số gác cổng — "không bịa" phải đo được, không chỉ định tính. |
| NFR-AI02 | **EARS score ngưỡng để qua gate** — requirement phải đạt điểm EARS/INCOSE tối thiểu | EARS quality score **≥ 0.8 / 1.0** *(giả định — cần chốt)*; dưới ngưỡng ⇒ gate chặn requirement. **Kiểm:** chạy scorer (rule-based + LLM) trên tập requirement mẫu, đối chiếu ngưỡng (QUAL-02). **[WHY]** Học Jama Advisor: chuẩn hoá AC bằng EARS chỉ có lực nếu có ngưỡng fail-closed; nếu không, "score" thành trang trí. |
| NFR-AI03 | **Token budget / dự án** — có hạn mức + metering, cảnh báo khi gần/vượt | Mỗi dự án có `TokenBudget` (ENT-13) + đo thực dùng; cảnh báo tại **80%**, chặn/yêu cầu xác nhận khi **100%** *(ngưỡng giả định — cần chốt)*. **Kiểm:** mô phỏng tiêu thụ token → quan sát cảnh báo/guard (PLAT-03). **[WHY]** Khai phá nhiều lượt + nạp tài liệu dài dễ "đốt" token; thiếu guard là rủi ro chi phí vận hành (Open Question còn lại ở P1). |
| NFR-AI04 | **Output-standard tất định** — header/ID/cấu trúc deliverable **ổn định, lặp lại được** | Cùng input → cùng khung header + ID scheme; 0 sai lệch cấu trúc giữa các lần sinh. **Kiểm:** sinh 2 lần cùng input → diff phần khung phải rỗng (chỉ khác nội dung). **[WHY]** Bàn giao client cần khung tất định để trace REQ→FR→TC và bám template doanh nghiệp; output "tự do" mỗi lần thì không export/push ổn định được. |

---

## 8. Scalability (SC01–SC02) — P4 (defer)

| ID | Requirement | Target / Cách kiểm |
|----|-------------|--------------------|
| NFR-SC01 | **Multi-user** — backend + RBAC khi lên quy mô | Nhiều người dùng cùng truy cập, phân quyền theo Role (ENT-15). **Kiểm:** *(defer P4)* test đồng thời + ma trận quyền. |
| NFR-SC02 | **Nhiều dự án đồng thời** — chịu tải nhiều dự án/người dùng song song | Hệ thống ổn định với N dự án hoạt động *(N — cần chốt P4)*. **Kiểm:** *(defer P4)* load test sau khi có backend. |

> **Phạm vi:** SC01–SC02 **ngoài P1–P3** (local-first, single-user theo Quyết định P1 #1). Đưa vào để giữ tính đầy đủ và tránh nợ kiến trúc — adapter (M05) + tách data/logic (M04) là chuẩn bị trước cho bước này.

---

## 9. Traceability NFR → REQ / FR (tóm tắt)

| NFR | REQ / FR liên quan (backbone) | Nhóm |
|---|---|---|
| U01, U05 | DISC-01, DISC-05 / REQ-005 | Usability |
| R01, R05 | DISC-04, QUAL-06 / REQ-006 | Reliability |
| R02 | QUAL-01 / REQ-012 | Reliability |
| M02, M04 | DOMAIN-01..04 / REQ-004 | Maintainability |
| M05 | PLAT-02 / REQ-021 | Maintainability |
| P05 | OUTPUT-03 / REQ-017 | Portability |
| PF04 | INGEST-03 / REQ-002 | Performance |
| S04, S07 | PLAT-04, PLAT-02 / REQ-021 | Security |
| S06 | INGEST-02..05 / REQ-002 | Security |
| AI01 | DISC-02, QUAL-06 / REQ-006 | AI-quality |
| AI02 | NEWREQ-04, QUAL-02 / REQ-013 | AI-quality |
| AI03 | PLAT-03 / REQ-021 | AI-quality |
| AI04 | PIPE-02 / REQ-011 | AI-quality |
| SC01, SC02 | PLAT-05..06 / REQ-022 | Scalability |

---

## ⚠️ Open Questions & Assumptions

**Ngưỡng cần chốt (giả định hoạch định, chưa cam kết):**
1. **AI01 grounded ratio ≥ 90%** — ngưỡng khả thi? Cách định nghĩa "1 phát biểu" để đếm tử/mẫu cho nhất quán?
2. **AI02 EARS score ≥ 0.8** — thang điểm & trọng số (completeness/atomic/không mơ hồ/đo được) lấy từ đâu? Rule-based + LLM phối hợp ra sao?
3. **AI03 token budget** — hạn mức mặc định/dự án là bao nhiêu? Cảnh báo 80% / chặn 100% có phù hợp ngân sách thật?
4. **PF02 ~12KB · PF03 first-token ≤3s · PF04 parse ≤5s** — phụ thuộc model đích & độ trễ provider; cần đo thật ở sprint-0 (spike copilot).
5. **S04 nơi giữ key** — **BYO-key (Cài đặt)** hay **thin proxy**? (P1 đề xuất BYO-key cho đơn giản, không lộ key server — chốt trước khi code adapter).

**Phụ thuộc / phạm vi:**
6. **S07 on-prem residency** — thực thi ở **P4**; P1–P3 chỉ giữ thiết kế (adapter M05). Cần xác nhận danh sách khách bắt buộc on-prem.
7. **S05 PII redaction** — danh mục PII cần mask cho seed thật (BIDV/MBL) do BA ngành rà; PDF-scan (ảnh) ngoài P1 → PII trong ảnh chưa phủ.
8. **S06 prompt-injection guard** — mức độ guard ở P1 (cô lập nguồn như "dữ liệu") vs guard nâng cao (detector) ở P2+; cần red-team checklist riêng.
9. **SC01/SC02** — defer P4; ngưỡng tải N (dự án/người dùng đồng thời) chốt khi có backend.

**Nội dung pack (ảnh hưởng R01/R05/AI01):** rule & compliance trong 2 pack seed là **mẫu minh hoạ** — phải được **1 BA ngành rà** (DoD P1 #4) trước khi dùng đo grounding thật.

---

*NFR v2.0 — 32 NFR / 8 nhóm theo ISO/IEC 25010 + AI-quality; bám ID verbatim BACKBONE §3. Gắn vào [SRS §4](srs.md) và [ARCHITECTURE.md](../03-architecture/ARCHITECTURE.md). Trạng thái: Draft chờ duyệt.*
