---
module: pipeline
phase: 5
name: Diagram
input: any document (BRD/SRS/US)
output: Mermaid diagrams
format: mermaid
---

# 📐 M5: Diagram — Tạo Sơ Đồ & Diagrams

---

## Mục đích
Generate các loại diagram từ documents có sẵn — sử dụng Mermaid syntax.

---

## Supported Diagram Types

| Type | Mục đích | Khi nào dùng |
|------|---------|-------------|
| BPMN (Flowchart) | Process flow với swimlanes | Mô tả quy trình nghiệp vụ |
| Sequence | Tương tác giữa actors/systems | API flow, integration |
| State Machine | Trạng thái entity | Order states, ticket lifecycle |
| ERD | Entity relationships | Data model |
| C4 Context | System context | Architecture overview |
| C4 Container | Container-level | Deployment architecture |
| Activity | Quy trình với decision points | Complex business logic |
| User Journey | User experience flow | UX analysis |
| Mind Map | Phân rã concept | Brainstorming, feature breakdown |

---

## 1. BPMN-style (Process Flow với Swimlanes)

```mermaid
graph TD
    subgraph "👤 Khách hàng"
        A[Gửi yêu cầu] --> B[Điền thông tin]
    end
    
    subgraph "💻 Hệ thống"
        C{Validate dữ liệu}
        D[Tạo hồ sơ]
        E[Gửi notification]
    end
    
    subgraph "👔 Manager"
        F{Duyệt?}
        G[Phê duyệt]
        H[Từ chối + lý do]
    end
    
    B --> C
    C -->|Valid| D
    C -->|Invalid| A
    D --> F
    F -->|Đồng ý| G --> E
    F -->|Từ chối| H --> E
```

### Conventions BPMN:
- Mỗi swimlane = 1 actor/system
- Dùng emoji prefix cho dễ đọc (👤👔💻🏦)
- Decision: hình thoi `{}`
- Start/End: hình tròn `([])` hoặc `[*]`

---

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    actor U as 👤 User
    participant FE as 💻 Frontend
    participant BE as ⚙️ Backend
    participant DB as 🗄️ Database
    participant EXT as 🌐 External API
    
    U->>FE: Click "Tạo đơn"
    FE->>BE: POST /api/orders
    
    BE->>BE: Validate request
    
    alt Valid
        BE->>DB: INSERT order
        DB-->>BE: order_id
        BE->>EXT: Notify external system
        EXT-->>BE: ACK
        BE-->>FE: 201 Created {order_id}
        FE-->>U: Hiển thị "Tạo thành công"
    else Invalid
        BE-->>FE: 400 Bad Request {errors}
        FE-->>U: Hiển thị lỗi validation
    end
```

### Conventions Sequence:
- Actor = user thực (có emoji)
- Participant = system component
- `->>`  = request (đường liền)
- `-->>` = response (đường đứt)
- `alt/else` = conditional flow
- `loop` = repeated action
- `Note` = ghi chú quan trọng

---

## 3. State Machine

```mermaid
stateDiagram-v2
    [*] --> Draft: Tạo mới
    
    Draft --> Submitted: User submit
    Draft --> Cancelled: User hủy
    
    Submitted --> UnderReview: Auto assign reviewer
    
    UnderReview --> Approved: Reviewer approve
    UnderReview --> Rejected: Reviewer reject
    UnderReview --> NeedInfo: Cần bổ sung
    
    NeedInfo --> Submitted: User bổ sung
    
    Rejected --> Draft: User chỉnh sửa
    
    Approved --> InProgress: Bắt đầu xử lý
    InProgress --> Completed: Hoàn thành
    InProgress --> OnHold: Tạm dừng
    OnHold --> InProgress: Resume
    
    Completed --> [*]
    Cancelled --> [*]
```

---

## 4. ERD

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : "đặt hàng"
    ORDER ||--|{ ORDER_ITEM : "chứa"
    ORDER_ITEM }o--|| PRODUCT : "tham chiếu"
    CUSTOMER ||--o{ ADDRESS : "có"
    ORDER }o--|| ADDRESS : "giao tại"
    
    CUSTOMER {
        int id PK
        string name "Tên KH"
        string phone "SĐT"
        string email "Email"
        date created_at "Ngày tạo"
    }
    
    ORDER {
        int id PK
        int customer_id FK
        string status "Trạng thái"
        decimal total_amount "Tổng tiền"
        datetime order_date "Ngày đặt"
    }
```

---

## 5. C4 Context

```mermaid
graph TB
    subgraph "System Context"
        U[👤 End User<br/>Sử dụng hệ thống] --> S[🖥️ TARGET SYSTEM<br/>Hệ thống chính]
        A[👔 Admin<br/>Quản trị] --> S
        S --> P[💳 Payment Gateway<br/>Thanh toán]
        S --> E[📧 Email Service<br/>Gửi thông báo]
        S --> T[🏦 3rd Party API<br/>Tích hợp]
    end
    
    style S fill:#1168bd,stroke:#0b4884,color:#fff
```

---

## 6. User Journey

```mermaid
journey
    title User Journey: Mua hàng online
    section Tìm kiếm
        Truy cập website: 5: User
        Tìm sản phẩm: 3: User
        Xem chi tiết: 4: User
    section Mua hàng
        Thêm vào giỏ: 5: User
        Điền thông tin: 2: User
        Thanh toán: 3: User, System
    section Sau mua
        Nhận xác nhận: 5: System
        Theo dõi đơn: 4: User
        Nhận hàng: 5: User
```

---

## 7. Mind Map (Feature Decomposition)

```mermaid
mindmap
  root((Dự án))
    Module 1
      Feature 1.1
      Feature 1.2
    Module 2
      Feature 2.1
      Feature 2.2
      Feature 2.3
    Module 3
      Feature 3.1
```

---

## Cách sử dụng

### Command
```
/diagram bpmn [tên quy trình]     → BPMN flowchart
/diagram sequence [tên flow]       → Sequence diagram  
/diagram state [tên entity]        → State machine
/diagram erd [scope]               → ERD
/diagram c4 [level]                → C4 model
/diagram journey [tên scenario]    → User journey
/diagram mindmap [topic]           → Mind map
```

### Từ document có sẵn
```
/diagram from-brd                  → Auto-detect và tạo process flows
/diagram from-srs                  → Auto-detect và tạo sequence + ERD
/diagram from-us [US-ID]           → Tạo flow cho US cụ thể
```
