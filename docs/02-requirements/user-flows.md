<!--
  Document ID: UF-BASUPER-2.0
  Date: 2026-06-03
  Version: 2.0
  Status: Draft — for approval
  Source: chắt lọc _v2-backbone.md (BACKBONE-BASUPER-V2-1.0 §4 UC, §7 cross-map = ID CHUẨN)
          + implementation-plan.md (IMPLPLAN-BASUPER-1.0 §3 sơ đồ 4 lớp)
          + use-cases.md (UC-BASUPER-2.0, flow này BỔ TRỢ — không mâu thuẫn).
          Nâng cấp từ UF-BASUPER-1.0 (ghi đè).
  Template: User-Flows.
  GHI CHÚ: Flow mô tả việc DÙNG BA Super App v2 ("biến AI thành Senior BA").
           ID sản phẩm (UC-/FR-/REQ-) — KHÔNG lẫn ID công cụ sinh cho khách (BRD-REQ-###, SRS-FR-###, TC-###).
-->

# User Flows — BA Super App v2

> Sơ đồ **hành trình & nhánh quyết định** (flowchart / state) theo trục **4 lớp**:
> **Input → Khai phá cùng AI chuyên gia domain → Chọn loại tác vụ → Output theo template**.
> Tài liệu này **bổ trợ** [use-cases.md](use-cases.md) (mỗi UC có sequenceDiagram chi tiết riêng);
> ở đây ta vẽ luồng **end-to-end** và các **nhánh quyết định** xuyên use-case.
>
> **Ba nguyên tắc in đậm trong mọi flow:**
> - **Không bịa** — thiếu dữ kiện thì AI **hỏi lại**, không đoán; mỗi mục tri thức **trỏ nguồn** (provenance), thiếu nguồn → cờ *"giả định"*.
> - **Gate fail-closed** — chưa PASS thì phase / tác vụ **chưa "xong"**, không cho đóng.
> - **Human chốt** — AI **đề xuất**, con người **ra quyết định cuối** (human-in-the-loop).
>
> Cross-link: use-case chi tiết → [use-cases.md](use-cases.md); REQ nghiệp vụ → [../01-business/brd.md](../01-business/brd.md).
> ID UC/FR/REQ bám **verbatim** [_v2-backbone.md](../04-planning/_v2-backbone.md) §4 & §7.

---

## Bản đồ flow → use-case (đối chiếu nhanh)

| Flow | Tên | Lớp | UC tham chiếu (use-cases.md) | REQ |
|------|-----|-----|------------------------------|-----|
| Flow 1 | Hành trình end-to-end 4 lớp | L1→L4 | UC-01..UC-13 | REQ-001..REQ-017 |
| Flow 2 | Tạo dự án & chọn domain | L1 Input | UC-01 | REQ-001, REQ-004 |
| Flow 3 | Discovery loop (evidence-grounded) | L2 Khai phá | UC-04, UC-05 | REQ-005, REQ-006, REQ-019 |
| Flow 4 | Nhánh 4 loại tác vụ | L3 Tác vụ | UC-06, UC-07, UC-08, UC-09 | REQ-007..REQ-010 |
| Flow 5 | Quality Gate fail-closed | cross | UC-11 (· UC-10) | REQ-012, REQ-013, REQ-019 |
| Flow 6 | Enhance impact | L3 Tác vụ | UC-09 | REQ-010, REQ-014 |
| Flow 7 | Export granularity | L4 Output | UC-12, UC-13 | REQ-015, REQ-016, REQ-017 |

---

## Flow 1 — Hành trình end-to-end 4 lớp

```mermaid
flowchart TD
    Start(["BA mở app · Dashboard"]) --> L1

    subgraph L1["L1 · INPUT (UC-01..UC-03)"]
        P1["Tạo dự án: tên · mục tiêu · compliance · scale"]
        P1 --> P2["Chọn domain (1/7 ngành) → nạp Domain Expert Pack"]
        P2 --> P3["Nạp nguồn: Paste / Upload / URL (+provenance)"]
        P3 --> P4{"Đính template mẫu?"}
        P4 -->|"Có (optional)"| P5["Lưu template org làm khuôn output"]
        P4 -->|"Không"| P6["Dùng template built-in của Domain Pack"]
    end

    P5 --> L2
    P6 --> L2

    subgraph L2["L2 · KHAI PHÁ cùng chuyên gia domain (UC-04..UC-05)"]
        K1["Discovery Copilot Socratic (options + default)"]
        K1 --> K2["Trích KnowledgeItem grounded trên nguồn + provenance"]
        K2 --> K3["BA review / confirm · gỡ cờ giả định"]
    end

    K3 --> L3

    subgraph L3["L3 · CHỌN LOẠI TÁC VỤ (UC-06..UC-09)"]
        T0{"Chọn tác vụ"}
        T0 -->|"Yêu cầu mới"| TA["EARS + AC Given-When-Then"]
        T0 -->|"Function list"| TB["Cây Module→Feature→Function"]
        T0 -->|"Estimate"| TC["Story/Function point + complexity → man-day"]
        T0 -->|"Enhance"| TD["Impact analysis + delta spec"]
    end

    TA --> GATE
    TB --> GATE
    TC --> GATE
    TD --> GATE

    GATE{"Quality Gate (UC-11)<br/>completeness · consistency<br/>traceability · feasibility"}
    GATE -->|"FAIL (fail-closed)"| RF["Liệt kê gap + refine ≤ 3 vòng"]
    RF --> T0
    GATE -->|"PASS + BA chốt"| L4

    subgraph L4["L4 · OUTPUT (UC-12..UC-13)"]
        O1{"Granularity"}
        O1 -->|"per-function"| O2["Render theo template"]
        O1 -->|"per-requirement"| O2
        O1 -->|"all"| O2
        O2 --> O3{"Format / đích"}
        O3 -->|"MD / Word / PDF"| O4["File xuất đúng khuôn"]
        O3 -->|"Push"| O5["Jira / Confluence"]
    end

    O4 --> Done(["Deliverable + traceability"])
    O5 --> Done
```

**Giải thích.** Bốn lớp chảy tuyến tính nhưng L3 có thể lặp nhiều tác vụ trên cùng một dự án (Project Knowledge nuôi mọi tác vụ). Giữa L3 và L4 **luôn** có Quality Gate **fail-closed** (UC-11): chưa PASS thì không xuất được. AI **không tự chốt** — mỗi vòng refine và bước đóng phase đều do **BA quyết định**. Template (mẫu org hoặc built-in domain) là "khuôn" áp ở L4 để bản xuất **đúng chuẩn doanh nghiệp**, không phải "văn AI".

---

## Flow 2 — Tạo dự án & chọn domain (L1)

```mermaid
flowchart TD
    A(["BA chọn 'Tạo dự án'"]) --> B["Nhập tên · mục tiêu · compliance · scale"]
    B --> C{"Chọn domain (bắt buộc)"}
    C -->|"Banking & Finance"| PK["Nạp Domain Expert Pack:<br/>entities · business_rules · compliance<br/>· glossary · kpi · templates · persona"]
    C -->|"Insurance"| PK
    C -->|"Fintech"| PK
    C -->|"E-commerce"| PK
    C -->|"SaaS / Platform"| PK
    C -->|"Healthcare"| PK
    C -->|"Game"| PK
    C -->|"Chưa chọn"| ASK["Hỏi lại — KHÔNG gán mặc định"]
    ASK --> C
    PK --> S{"Pack có sẵn cho ngành?"}
    S -->|"P1: Banking / Insurance đã seed"| OK["Lưu project (IndexedDB) → mở Workspace tab 'Thông tin'"]
    S -->|"5 ngành còn lại"| SOON["Hiển thị 'sắp có' · cho tạo nhưng pack rút gọn"]
    SOON --> OK
    OK --> Ready(["Sẵn sàng nạp nguồn (Flow 1 · L1)"])
```

**Giải thích.** Domain được chọn **ngay khi tạo** (REQ-001/REQ-004) để nạp Domain Expert Pack làm overlay LLM — đây là "linh hồn" v2. Hệ thống **không đoán** domain: chưa chọn thì **hỏi lại**. P1 seed thật 2 ngành (Banking/Insurance có dữ liệu BIDV/MBL); 5 ngành còn lại hiển thị "sắp có". Tham chiếu **UC-01**.

---

## Flow 3 — Discovery loop (evidence-grounded) (L2)

```mermaid
stateDiagram-v2
    [*] --> Asking: Mở tab 'Khai phá (Expert)'
    Asking --> Answered: BA trả lời câu Socratic (options + default)
    Answered --> CheckSrc: AI đối chiếu nguồn đã nạp
    CheckSrc --> Grounded: Có nguồn chứng cứ
    CheckSrc --> Missing: Thiếu dữ kiện
    CheckSrc --> NoSource: Suy luận KHÔNG có nguồn

    Grounded --> ItemMade: Trích KnowledgeItem + provenance (nguồn + vị trí)
    Missing --> Asking: AI hỏi tiếp (KHÔNG đoán)
    NoSource --> Flagged: Gắn cờ 'giả định — cần xác nhận'

    ItemMade --> Review: BA review / sửa tay
    Flagged --> Review: BA review (⚠️ assumption)
    Review --> Confirmed: BA confirm (gỡ cờ nếu bổ sung nguồn)
    Review --> Asking: Cần khai phá thêm
    Confirmed --> [*]: Project Knowledge tin cậy → input cho L3
```

**Giải thích.** Vòng khai phá là trái tim chống-bịa: mỗi câu trả lời rẽ 3 nhánh — **có nguồn** → tạo KnowledgeItem kèm **provenance**; **thiếu dữ kiện** → AI **hỏi tiếp**, không bịa; **suy luận không nguồn** → **gắn cờ "giả định"** chờ người xác nhận (UC-05). Không item nào được coi là "đã chốt" nếu chưa có nguồn **và** chưa được BA confirm — **human chốt**. Tham chiếu **UC-04, UC-05** (REQ-005/006/019).

---

## Flow 4 — Nhánh 4 loại tác vụ (L3)

```mermaid
flowchart LR
    PK[("Project Knowledge<br/>(đã confirm)")] --> Sig{"Tín hiệu / chọn tác vụ"}

    Sig -->|"'viết yêu cầu mới'"| A1["Elicit Socratic"]
    A1 --> A2["Viết EARS<br/>(Ubiquitous/Event/State/Unwanted/Optional)"]
    A2 --> A3["Sinh AC Given-When-Then + auto-map BRD-REQ/SRS-FR"]
    A3 --> A4["Quality score (EARS/INCOSE)"]

    Sig -->|"'liệt kê chức năng'"| B1["Phân rã Module → Feature → Function (FUNC-xx)"]
    B1 --> B2["Mỗi function ≥ 1 requirement (no orphan)"]

    Sig -->|"'ước lượng'"| C1["Complexity 1–10 / function"]
    C1 --> C2["Story/Function point → man-day + dải tin cậy"]
    C2 --> C3["Cờ function mơ hồ = 'estimate rủi ro cao'"]

    Sig -->|"'đổi cái đang có'"| D1["Impact analysis (→ Flow 6)"]

    Sig -->|"'không rõ'"| Q["Hỏi Socratic — KHÔNG đoán"]
    Q --> Sig

    A4 --> G(["→ Quality Gate (Flow 5)"])
    B2 --> G
    C3 --> G
    D1 --> G
```

**Giải thích.** Người dùng thật hiếm khi cần "cả bộ tài liệu" — họ cần một trong **4 tác vụ**: viết 1 requirement (EARS), liệt kê chức năng, ước lượng, hoặc enhance. Mỗi nhánh là một pipeline con nhưng đều đổ về **cùng một Quality Gate** và **cùng một trace graph**. Tín hiệu **"không rõ"** → AI **hỏi**, không tự chọn tác vụ. Tham chiếu **UC-06..UC-09** (REQ-007..REQ-010).

---

## Flow 5 — Quality Gate fail-closed (cross)

```mermaid
stateDiagram-v2
    [*] --> Running: BA chạy 'Validate' (UC-11)
    Running --> Checking: Kiểm completeness · consistency · traceability · feasibility
    Checking --> ScoreEARS: Chấm EARS/INCOSE + dựng live trace graph
    ScoreEARS --> Pass: Đủ section · nhất quán · traceable · feasible · có provenance
    ScoreEARS --> Fail: Thiếu / mâu thuẫn / orphan / thiếu nguồn

    Fail --> ListGap: Liệt kê gap + đề xuất sửa (KHÔNG bỏ qua)
    ListGap --> Refine: refine ≤ 3 vòng (chống loop)
    Refine --> Running: Chạy lại
    Refine --> Escalate: Quá 3 vòng → đề xuất chốt thủ công / escalate

    Pass --> Closable: CHO PHÉP người chốt đóng phase/tác vụ
    Closable --> [*]
    Escalate --> [*]
```

**Giải thích.** Gate **fail-closed**: chưa PASS thì phase/tác vụ **chưa "xong"**, hệ thống **không cho đóng**. Thiếu **provenance** cũng bị fail (anti-fabrication). Mọi gap được **nêu rõ + đề xuất sửa**, không "bỏ qua". Refine giới hạn **≤ 3 vòng** để chống loop vô tận; quá ngưỡng thì escalate cho người quyết. Việc **đóng** phase luôn là hành động của **BA** (human-in-the-loop). Tham chiếu **UC-11** (· UC-10) (REQ-012/013/019).

---

## Flow 6 — Enhance impact (L3)

```mermaid
flowchart TD
    CR(["BA nhập change request (UC-09)"]) --> IA["Impact analysis trên trace graph<br/>Function → US → BRD-REQ → SRS-FR → TC"]
    IA --> List["Liệt kê MỌI item downstream bị ảnh hưởng"]
    List --> Review{"BA review impact TRƯỚC khi chốt"}
    Review -->|"Lan rộng bất ngờ"| Narrow["Thu hẹp / huỷ change"]
    Narrow --> CR
    Review -->|"Chấp nhận phạm vi"| Delta["Sinh delta spec: add / modify / remove"]
    Delta --> AC["Cập nhật AC của item bị đổi"]
    AC --> Bump["Version bump (vd v1.2 → v1.3)"]
    Bump --> Gate(["→ Quality Gate (Flow 5)"])
    Gate --> Done(["Change set + impact report + AC mới + version mới<br/>(BA chốt)"])
```

**Giải thích.** Enhance **bắt buộc** chạy impact analysis trên trace graph và **liệt kê đầy đủ ảnh hưởng downstream TRƯỚC khi chốt** (live traceability, fail-closed) — đây là điểm khác biệt với "sửa tay mù". BA có thể **thu hẹp/huỷ** nếu impact lan rộng bất ngờ. Mỗi thay đổi đi kèm **delta spec** + **version bump** để giữ lịch sử truy vết. Tham chiếu **UC-09** (REQ-010/014).

---

## Flow 7 — Export granularity (L4)

```mermaid
flowchart TD
    Start(["Deliverable đã PASS gate (UC-12)"]) --> Gr{"Chọn granularity"}
    Gr -->|"per-function"| Tpl
    Gr -->|"per-requirement"| Tpl
    Gr -->|"all (bộ tài liệu)"| Tpl

    Tpl{"Nguồn template"}
    Tpl -->|"Template mẫu org (UC-03)"| Render["Render giữ ID/header convention của org"]
    Tpl -->|"Không có → built-in domain"| Render

    Render --> Out{"Format / đích xuất"}
    Out -->|"Markdown"| F1["File .md"]
    Out -->|"Word / PDF"| F2["File .docx / .pdf"]
    Out -->|"Push Jira"| J["Issue: 1/function · 1/req · epic+children"]
    Out -->|"Push Confluence"| C["Trang tài liệu"]

    F1 --> Hand(["Bàn giao Dev/QA"])
    F2 --> Hand
    J --> Hand
    C --> Hand

    F2 -.->|"Render Mermaid/Word lỗi"| Fallback["Cảnh báo · cho tải bản MD"]
    Fallback --> Hand
```

**Giải thích.** Xuất linh hoạt theo **3 granularity** (per-function / per-requirement / all) × **template** (mẫu org đã đính ở UC-03, hoặc built-in domain) × **format** (MD/Word/PDF) — phục vụ cả người cần 1 mẩu dán vào ticket lẫn người cần bộ tài liệu trình duyệt. Push Jira/Confluence ánh xạ granularity sang issue/epic. **Provenance + template-binding** đảm bảo bản xuất **đúng khuôn doanh nghiệp**. Render Word/Mermaid lỗi → **fallback** bản MD, không chặn bàn giao. Tham chiếu **UC-12, UC-13** (REQ-015/016/017).

---

## ⚠️ Open Questions & Assumptions

1. **Ranh giới Flow 1 (L3) ↔ Flow 5 (Gate) ↔ Flow 7 (Export):** flow vẽ Gate là chốt chặn duy nhất giữa L3 và L4. Giả định: pipeline UC-10 và 4 tác vụ L3 dùng **chung một Gate**, không có "đường tắt" xuất khi FAIL. Cần chốt khi viết SRS để không sinh 2 đường gate khác nhau.
2. **Đa tác vụ song song (Flow 4):** L3 cho lặp nhiều tác vụ trên cùng dự án; chưa rõ có cho **chạy song song nhiều tác vụ** (vd Function list + Estimate cùng lúc) hay tuần tự. Giả định hiện tại: tuần tự theo lựa chọn của BA.
3. **Refine ≤ 3 vòng (Flow 5):** đếm 3 vòng **per-tác-vụ** hay **per-phiên**? Giả định: per lần chạy Validate của một deliverable. Cần xác nhận để hành vi escalate nhất quán.
4. **Domain "sắp có" (Flow 2):** 5 ngành chưa seed — cho **tạo dự án với pack rút gọn** hay **chặn cứng** tới khi có pack đầy đủ? Flow đang giả định cho tạo (pack rút gọn) để không chặn người dùng; cần product chốt.
5. **Granularity × Push (Flow 7):** ánh xạ "all → epic + children" trên Jira có thể tạo số lượng issue lớn; chưa rõ có cần **xác nhận trước khi đẩy** (preview) để tránh spam project. Giả định: có bước preview trước push.
6. **Quyền gỡ cờ GAP/assumption (Flow 3, Flow 6):** chỉ **BA/PO** hay cả **PM**? Giả định bám use-cases.md: chỉ BA/PO (người chốt). Cần xác nhận khi thêm RBAC ở P4.

---

*user-flows.md v2.0 (UF-BASUPER-2.0) — 7 flow Mermaid (Flow 1 end-to-end 4 lớp · Flow 2 tạo dự án & domain · Flow 3 discovery loop evidence-grounded · Flow 4 nhánh 4 tác vụ · Flow 5 quality gate fail-closed · Flow 6 enhance impact · Flow 7 export granularity) bổ trợ use-cases.md theo trục 4 lớp; nhấn không bịa + provenance + gate fail-closed + human chốt. Trạng thái: Draft chờ duyệt.*
