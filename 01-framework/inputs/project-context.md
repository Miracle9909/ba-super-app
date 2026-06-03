---
module: input
type: template
priority: P0
load: on-init
---

# 📥 Project Context — Universal Template

> Điền template này khi bắt đầu dự án mới. Hoặc paste mô tả dự án và để AI tự extract.

---

## Thông tin cơ bản

```yaml
project_name: ""
domain: ""                    # banking | insurance | fintech | game | saas | ecommerce | healthcare
system_type: ""               # web-app | mobile-app | api-platform | data-pipeline | crm | erp
project_type: ""              # greenfield | enhancement | migration | integration
client: ""                    # Tên khách hàng / tổ chức
```

## Mục tiêu business

```yaml
business_goal: ""             # Mô tả mục tiêu chính (1-2 câu)
success_metrics:              # KPIs đo lường thành công
  - metric: ""
    target: ""
  - metric: ""
    target: ""
pain_points:                  # Vấn đề hiện tại cần giải quyết
  - ""
  - ""
```

## Users & Stakeholders

```yaml
user_types:
  - name: ""                  # Tên loại user
    description: ""           # Mô tả ngắn
    count: ""                 # Số lượng ước tính
  - name: ""
    description: ""
    count: ""

key_stakeholders:
  - name: ""
    role: ""                  # Product Owner | Sponsor | SME | Tech Lead
    influence: ""             # high | medium | low
```

## Scope

```yaml
in_scope:                     # Features trong scope
  - ""
  - ""

out_of_scope:                 # Features NGOÀI scope
  - ""

assumptions:                  # Giả định
  - ""

constraints:
  timeline: ""                # Deadline / duration
  budget: ""                  # low | medium | high
  team_size: ""               # Số người
  tech_stack: ""              # Technologies đã chọn
```

## Compliance & Regulations

```yaml
compliance:                   # Quy định cần tuân thủ
  - ""                        # PDPA | PCI-DSS | HIPAA | SOC2 | Thông tư XX
regulations_notes: ""         # Ghi chú thêm
```

## Existing Systems (nếu có)

```yaml
current_systems:              # Hệ thống hiện tại
  - name: ""
    purpose: ""
    integration: ""           # Cần tích hợp không? yes/no
    
legacy_notes: ""              # Ghi chú về legacy
```

---

## Cách sử dụng

### Option 1: Điền trực tiếp
Copy template trên, điền thông tin, paste vào chat.

### Option 2: Conversational (khuyên dùng)
Paste mô tả dự án bất kỳ (email, meeting notes, brief) → AI sẽ:
1. Extract thông tin tự động
2. Hỏi thêm những gì thiếu
3. Tạo filled context template
4. Confirm với bạn trước khi tiếp

### Option 3: Copy từ dự án cũ
Copy context từ dự án tương tự → chỉnh sửa khác biệt.
