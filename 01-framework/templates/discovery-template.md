---
project: "[PROJECT_NAME]"
document_type: "DISCOVERY"
version: "1.0"
date: "[YYYY-MM-DD]"
author: "BA Super App"
status: "draft"
---

# Discovery Report — [PROJECT_NAME]

> Khung output của phase **M1: Discovery**. Thay mọi `[...]` bằng nội dung thật.
> Giá trị suy diễn (không do user nói thẳng) phải đánh dấu `⚠️ Assumption`.

---

## 1. Project Context

```yaml
project_name: "[PROJECT_NAME]"
domain:       "[DOMAIN]"          # banking | insurance | fintech | ecommerce | saas | healthcare | game
system_type:  "[SYSTEM]"          # web-app | mobile-app | api-platform | data-pipeline | crm | erp
project_type: "[greenfield | replace-legacy | extend-existing]"
client:       "[CLIENT_NAME]"
compliance:   "[COMPLIANCE]"      # PDPA | PCI-DSS | HIPAA | SOC2 | none
```

Mô tả 2–3 câu về dự án: bối cảnh, vấn đề cần giải quyết. [...]

---

## 2. Goals & Success Metrics

| # | Mục tiêu (Goal) | KPI / Metric | Target |
|---|-----------------|--------------|--------|
| 1 | [Primary goal] | [Metric đo được] | [Value] |
| 2 | [Secondary goal] | [Metric] | [Value] |

---

## 3. Users & Stakeholders

### 3.1 User Types

| User (`[USER_TYPE]`) | Mô tả | Số lượng ước tính |
|----------------------|-------|-------------------|
| [Type] | [Description] | [Count] |

### 3.2 Stakeholders

| Tên / Role | Vai trò (dùng / quyết định / ảnh hưởng) | Ảnh hưởng | Kênh liên lạc |
|------------|------------------------------------------|:---------:|---------------|
| [Name/Role] | [Role] | High / Med / Low | [Channel] |

---

## 4. Scope

### 4.1 In-scope
- [Feature / phạm vi 1]
- [Feature / phạm vi 2]

### 4.2 Out-of-scope
- [Hạng mục KHÔNG làm ở release này]

---

## 5. Assumptions & Constraints

### 5.1 Constraints
- **Timeline:** [...]
- **Team size:** [nhỏ <5 | vừa 5–15 | lớn >15]
- **Budget:** [thấp | trung bình | cao]
- **Tech:** [ràng buộc công nghệ nếu có]

### 5.2 Assumptions
- `⚠️ Assumption` — [Giả định 1, chờ xác nhận]
- `⚠️ Assumption` — [Giả định 2]

---

## 6. Feature List (sơ bộ)

| # | Epic / Module | Features | Priority | Ghi chú |
|---|---------------|----------|:--------:|---------|
| 1 | [Epic/Module] | [Features] | 🔴 Must | [Notes] |
| 2 | [Epic/Module] | [Features] | 🟡 Should | [Notes] |
| 3 | [Epic/Module] | [Features] | 🟢 Could | [Notes] |
| 4 | [Epic/Module] | [Features] | ⚪ Won't | [Out of scope] |

> Đặt tên Epic/Module ở đây sao cho M2 sinh được mã `US-[MODULE]-###` nhất quán.

---

## 7. Open Questions

| # | Câu hỏi cần làm rõ | Liên quan tới | Trạng thái |
|---|--------------------|---------------|:----------:|
| 1 | [Question] | [Scope / Integration / Constraint] | ⏳ Chờ chốt |

---

## Next Steps
- [ ] Review Discovery Report
- [ ] Confirm scope, users & priority
- [ ] Resolve Open Questions / Assumptions
- [ ] → Chuyển sang **M2: User Story**

---

## Lịch sử thay đổi

| Version | Ngày | Thay đổi | Người |
|---------|------|----------|-------|
| 1.0 | [YYYY-MM-DD] | Khởi tạo | BA Super App |
