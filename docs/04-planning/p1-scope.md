<!--
  Document ID: PSCOPE-BASUPER-P1-1.0
  Date: 2026-06-03
  Version: 1.0
  Status: Draft — proposed decisions for sign-off
  Source: chốt 7 Open Questions của IMPLPLAN-BASUPER-1.0 → khoá scope Phase 1.
  Template: phase-scope (decisions + scope-in/out + backlog + estimate + DoD).
-->

# P1 Scope — BA Super App v2 · Phase 1 "Nền tảng & Khai phá"

> Tài liệu này (1) **chốt 7 Open Questions** của [implementation-plan.md](implementation-plan.md) bằng quyết định khuyến nghị, rồi (2) **khoá phạm vi P1 chi tiết** để bắt tay làm. Các quyết định là *đề xuất có thể đảo* — bạn veto chỗ nào tôi chỉnh chỗ đó.

---

## A. Quyết định chốt (trả lời Open Questions)

| # | Câu hỏi | ✅ Quyết định (đề xuất) | [WHY] | Đảo được? |
|---|---|---|---|---|
| 1 | Local-first hay SaaS đa người dùng? | **Local-first, single-user** cho P1–P3 (IndexedDB); backend để P4 | Kế thừa v1 (localStorage) + thói quen làm local của bạn; ship nhanh, không chặn bởi hạ tầng | Khó đảo (định hình kiến trúc) |
| 2 | LLM cloud hay on-prem? | **Cloud Claude** qua **lớp adapter provider-agnostic**; key giữ ở **thin proxy / BYO-key** trong Cài đặt | Nhanh & rẻ để bắt đầu; adapter cho phép cắm on-prem (Banking/Health) ở P4 mà không sửa lõi | Dễ đảo (đổi provider sau adapter) |
| 3 | Mức "AI chuyên gia"? | **Guided copilot** (Socratic, gợi ý + đề xuất, **human chốt từng bước**) — KHÔNG agent tự chạy nhiều bước | Đúng nguyên tắc v1 "không tự chốt"; tránh guardrail phức tạp sớm; agent đa bước để P4 | Dễ đảo (nâng cấp dần) |
| 4 | Estimate: function point hay story point? | **Story point** là đơn vị chính + **complexity 1–10**; function point (IFPUG/COSMIC) là tuỳ chọn nâng cao | BA/PO quen story point + sprint; tái dùng mô hình complexity ở `budget_dashboard` | Dễ đảo (engine ở P2) |
| 5 | P1 chốt 2 ngành nào? | **Banking** (seed từ BIDV Home GĐ3) + **Insurance** (seed từ MBL) | Có **dữ liệu thật** → pack chất lượng, demo thuyết phục | Đảo được (đổi ngành seed) |
| 6 | Tích hợp ưu tiên (P3)? | **Confluence (xuất) + Jira (push issue)** trước; Linear sau | Khách VN/EvoTek dùng Atlassian phổ biến | Dễ đảo (P3 mới làm) |
| 7 | P1 chốt cứng ingestion? | **3 kênh: Paste Text · Upload File · URL Fetch**; Email Forward + Template-as-source để P2/P3 | 3 kênh phủ ~90% nhu cầu; Email cần hạ tầng riêng | Đảo được |

---

## B. Mục tiêu & phạm vi P1

**Mục tiêu (1 câu):** từ một dự án trống → **nạp nguồn → chọn ngành → chuyên gia ngành khai phá Socratic → ra "Tri thức dự án" (entities/rules/glossary) có provenance**, chạy được **local, không backend**.

**Trong P1 (IN)**
- FEAT-01 — Project setup + **Ingestion 3 kênh** (Paste/Upload/URL) + danh sách nguồn + trạng thái parse.
- FEAT-02 *(rút gọn)* — **Upload & lưu template mẫu** (SRS/BRD/kỹ thuật/guide) đính vào dự án; *chỉ lưu + xem*, phần "trích schema để bám khuôn" để P3.
- FEAT-03 — **Domain Expert Pack** cho **2 ngành** (Banking, Insurance): nạp tri thức + chọn ngành cho dự án.
- FEAT-04 — **Discovery Copilot**: hội thoại Socratic (option + default) + **evidence-grounded** → sinh **Project Knowledge** (entities/rules/glossary), mỗi mục **trỏ nguồn**.
- App shell + 4 màn (Dashboard + Workspace 3 tab dùng được + 1 panel Expert) + **lưu local (IndexedDB)**.

**Ngoài P1 (OUT — defer rõ ràng)**
- 4 pipeline tác vụ (Yêu cầu mới/Function list/Estimate/Enhance) → **P2**.
- EARS quality score, Live Traceability graph, auto test-case → **P2**.
- Template engine + Output granularity + Export/Push Jira/Confluence + spec→prototype → **P3**.
- Backend, đa người dùng, RBAC, LLM-trong-web nhiều provider, estimate học lịch sử → **P4**.

---

## C. Domain Expert Pack — nội dung 2 pack P1

Cấu trúc chung (`/domain-packs/<industry>.yaml`): `entities · business_rules · compliance · glossary · kpi_patterns · templates · expert_persona`.

**Banking pack (seed: BIDV Home GĐ3 — vay mua nhà)**
- entities: Khách hàng · Hồ sơ vay · Khoản vay · Tài sản đảm bảo (TSĐB) · Lịch trả nợ · Giải ngân.
- rules (mẫu): BR-01 LTV ≤ 70% giá trị TSĐB · BR-02 Tuổi ≤ 65 khi tất toán · BR-03 Bắt buộc chứng minh thu nhập.
- compliance: NHNN, PCI-DSS (thanh toán), nguyên tắc KYC/AML.
- glossary: HSYC · TSĐB · LTV · Giải ngân · Tất toán.
- expert_persona: "Chuyên gia tín dụng bán lẻ" — hỏi về sản phẩm vay, điều kiện, quy trình thẩm định.

**Insurance pack (seed: MBL — bảo hiểm nhân thọ)**
- entities: Bên mua BH · Người được BH · Hợp đồng · Quyền lợi · Phí BH · Yêu cầu bồi thường (Claim).
- rules (mẫu): BR-01 Thẩm định sức khoẻ theo tuổi/STBH · BR-02 Thời gian chờ (waiting period) · BR-03 Loại trừ bồi thường.
- compliance: Luật KDBH, IFRS 17 (ghi nhận hợp đồng), bảo vệ dữ liệu cá nhân.
- glossary: STBH · Phí BH · Quyền lợi · Loại trừ · Thời gian chờ.
- expert_persona: "Chuyên gia nghiệp vụ bảo hiểm nhân thọ".

> **[WHY]** Pack chỉ là **dữ liệu + prompt-overlay**, tách khỏi lõi quy trình → ngành thứ 3 chỉ cần thêm 1 file, không đụng code.

---

## D. Màn hình P1 (kế thừa design Stitch/Material 3)

| Màn / tab | Trạng thái P1 | Nội dung |
|---|---|---|
| **Dashboard** | Dùng được | Danh sách dự án + stats + tạo dự án (chọn ngành ngay khi tạo) |
| Workspace · **Thông tin** | Dùng được | Tổng quan dự án + ngành đã chọn + (optional) template mẫu đã đính |
| Workspace · **Nguồn dữ liệu** | Dùng được | Ingestion 3 kênh + danh sách nguồn + trạng thái |
| Workspace · **Khai phá (Expert)** | Dùng được | **Panel chat chuyên gia ngành** (Socratic) + khung "Tri thức dự án" (entities/rules/glossary) sinh dần, có nguồn |
| Workspace · Tác vụ / Báo cáo-Xuất | **Placeholder "P2/P3"** | Hiển thị khoá + nhãn "sắp có" |

---

## E. Backlog P1 (epic → story, story point)

| Epic | Story | SP |
|---|---|---|
| **E1 App shell & local store** | S1.1 App shell (sidebar/header/routing state) | 3 |
| | S1.2 Persistence IndexedDB (Project CRUD) | 5 |
| **E2 Project & Ingestion** | S2.1 Tạo dự án + chọn domain | 3 |
| | S2.2 Ingestion Paste Text | 2 |
| | S2.3 Ingestion Upload File (.docx/.pdf/.md → text) | 5 |
| | S2.4 Ingestion URL Fetch | 3 |
| | S2.5 Danh sách nguồn + trạng thái + provenance store | 3 |
| **E3 Template intake (rút gọn)** | S3.1 Upload & lưu template mẫu + xem | 3 |
| **E4 Domain Expert Pack** | S4.1 Schema pack + loader | 3 |
| | S4.2 Seed Banking pack | 3 |
| | S4.3 Seed Insurance pack | 3 |
| | S4.4 Gắn pack → overlay prompt cho LLM | 5 |
| **E5 Discovery Copilot** | S5.1 LLM adapter (cloud Claude, BYO-key/proxy) | 5 |
| | S5.2 Chat Socratic (option+default, không đoán) | 5 |
| | S5.3 Evidence-grounded: trích entity/rule/term + trỏ nguồn | 8 |
| | S5.4 Khung "Tri thức dự án" hiển thị + sửa tay | 5 |
| | **Tổng** | **64 SP** |

---

## F. Estimate P1 (refined)

- **Tổng:** **64 story point** (cộng từng story ở §E). Quy đổi ~**0.7 MD/SP** (giả định team 2–3, có FE prototype) → **≈ 45 MD** — khớp dải **40–55 MD** ở plan.
- **Đường găng (critical path):** S5.1 → S5.2 → S5.3 (copilot + evidence-grounding) là phần khó & rủi ro nhất; nên làm spike sớm.
- ⚠️ *Giả định, không cam kết.* Sẽ chốt lại sau sprint-0 (spike copilot).

---

## G. Definition of Done — P1

1. Tạo dự án → chọn 1 trong 2 ngành → nạp ≥1 nguồn (mỗi kênh test ≥1) → chạy khai phá → ra **Project Knowledge** có **≥1 entity + ≥1 rule + ≥1 term**, mỗi mục **trỏ nguồn**.
2. Copilot **không tự bịa**: thiếu thông tin thì hỏi (Socratic), không đoán; mục không có nguồn bị đánh dấu *"giả định"*.
3. Dữ liệu **lưu local** qua reload (IndexedDB).
4. 2 pack ngành review bởi 1 BA thật (sanity nội dung).
5. Màn placeholder Tác vụ/Xuất hiển thị "sắp có", không vỡ layout.
6. README cập nhật cách chạy + cấu hình key LLM.

---

## ⚠️ Giả định còn lại / cần xác nhận
- **Key LLM**: dùng thin proxy hay BYO-key trong Cài đặt? (P1 đề xuất BYO-key cho đơn giản, không lộ key server).
- **Parse file**: .docx/.pdf parse client-side (thư viện) đủ chất lượng? PDF scan (ảnh) **ngoài P1**.
- **Nội dung pack**: rule/compliance là **mẫu minh hoạ** — cần BA ngành rà trước khi dùng thật.
- **Ngân sách token** cho copilot khai phá (mỗi dự án) — cần đặt guard.

*p1-scope.md v1.0 — chốt 7 quyết định + khoá P1 "Nền tảng & Khai phá": 2 ngành (Banking/Insurance), ingestion 3 kênh, Discovery copilot evidence-grounded, local-first. 64 SP ≈ 45 MD. Trạng thái: Draft chờ duyệt.*
