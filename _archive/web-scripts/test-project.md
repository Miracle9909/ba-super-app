# MBL Sale Platform — Module M09: Hỗ trợ Lực lượng Bán hàng (SAL-4295)

## Giới thiệu
**MBL (M-Bro)** là nền tảng bán bảo hiểm số của **MB Ageas Life (MBAL)** — liên doanh giữa MB Bank (Việt Nam) và Ageas (Bỉ). Module M09-SFSupport (Salesforce Support) thuộc Epic SAL-1319 "Module Hỗ trợ Lực lượng bán hàng", cụ thể ticket SAL-4295 "Quản lý yêu cầu LLBH phase 2 (Sales to IT)".

**Mục tiêu:** Cho phép IC/LLBH tạo yêu cầu hỗ trợ về hệ thống, lỗi, hợp đồng trên M-Bro và nhận phản hồi từ IT Support, theo dõi trạng thái ticket (tích hợp Jira Service Management).

## Quản lý Ticket IT (Sales to IT)
- IC/LLBH tạo ticket hỗ trợ trên M-Bro App với category (PRODUCT, TECHNICAL, ACCOUNT, COMMISSION, OTHER)
- Mô tả chi tiết vấn đề (min 20, max 2000 ký tự) kèm file đính kèm (max 5 files, 10MB/file, image+PDF)
- Auto-assign ticket cho HO IT Support team theo round-robin by category
- Ticket Dashboard: danh sách ticket + filter theo status/priority, phân quyền theo role (IC xem own, DOB xem team, HO xem queue)
- Real-time chat trong ticket (IC ↔ HO Support) qua WebSocket, delivery < 500ms
- SLA tracking với business hours (08:00-18:00 ICT, Mon-Fri): P1 Critical 4h, P2 High 8h, P3 Medium 24h, P4 Low 72h
- Auto-escalate khi SLA consumed ≥ 50% (warning), ≥ 80% (escalate to supervisor), ≥ 100% (breach → manager)
- IC confirm resolution hoặc auto-close sau 7 ngày không phản hồi
- CSAT survey sau khi close ticket (bắt buộc cho P1/P2, rating 1-5)

## Knowledge Base & FAQ
- Searchable Knowledge Base với category navigation và full-text search (Elasticsearch, Vietnamese analyzer)
- HO CRUD bài viết KB với visibility: PUBLIC, INTERNAL, DRAFT
- Track view count + helpfulness rating
- Render markdown articles + related articles (top-3)
- Self-service: IC tìm câu trả lời trước khi tạo ticket

## Xác thực & Phân quyền
- IC/CVTV: tạo ticket, xem KB, chat (own tickets)
- DOB/SDOB: tạo ticket, xem KB, chat (team tickets)
- HO Support Agent: xem KB, chat (assigned), CRUD KB articles, re-assign tickets
- HO Admin: view all, CRUD KB, override assignment, SLA config

## Tích hợp Hệ thống
- M01-Portal: Push notification cho ticket updates (Firebase)
- M06-Sales: Ticket category PRODUCT links to specific HSYCBH
- M08-Policy: Ticket category PRODUCT links to policy number
- M04-Performance: Support ticket volume per IC as KPI metric
- Jira Service Management: Đồng bộ ticket trạng thái 2 chiều
- Elasticsearch: Full-text search cho KB
- Redis: WebSocket queue, session cache
- S3/MinIO: File attachments storage

## Ticket Lifecycle (State Machine)
- NEW → ASSIGNED (auto round-robin) → IN_PROGRESS (agent picks up)
- IN_PROGRESS → WAITING_CUSTOMER (agent requests info) → IN_PROGRESS (IC provides info)
- IN_PROGRESS → RESOLVED (agent resolves) → CLOSED (IC confirms / auto 7d)
- RESOLVED → REOPENED (IC disputes, max 2 reopens) → IN_PROGRESS
- ANY_ACTIVE → ESCALATED (SLA breach) → IN_PROGRESS (supervisor reassigns)
- WAITING_CUSTOMER → AUTO_CLOSED (no response 14 days)

## Ràng buộc nghiệp vụ
- Ticket number format: TK-YYYY-NNNNNN
- SLA tính theo business hours: 08:00-18:00 ICT, Mon-Fri, loại trừ ngày lễ
- Escalation: 50% SLA → warning agent, 80% SLA → escalate supervisor, 100% SLA → breach → manager
- Auto-close: Resolved + no response 7 days → close; Waiting customer + no response 14 days → auto-close
- Attachment: max 5 files × 10MB, chỉ image (PNG/JPEG) và PDF
- CSAT: Rating 1-5, bắt buộc comment khi score ≤ 2 (min 10 chars)
- Agent performance: avg CSAT 30d < 3.5 → warning, < 3.0 → critical → supervisor alert
- Reopen limit: max 2 lần, sau đó auto-escalate

## Technology Stack
- Mobile App: Flutter (M-Bro App - iOS + Android)
- Web Admin: React + Ant Design
- Backend (BFF): Spring Boot 3.x (Java 17+)
- Middleware: Digital Platform (DP) — microservices
- Core Insurance: eBao PAS
- Database: PostgreSQL 15
- Messaging: Apache Kafka (async events)
- Real-time: WebSocket (chat)
- Search: Elasticsearch (KB full-text search)
- Cache: Redis
- Storage: S3/MinIO
- CI/CD: Harness
- API Gateway: Kong + Ingress

## Stakeholders
- IC/CVTV (End user - ticket creator): High interest, Medium influence
- HO Support Team (Agent - ticket handler): High interest, High influence
- Support Supervisor (Escalation manager): High interest, High influence
- Product Owner M09 (Feature prioritization): High interest, High influence
- IT Infra Team (Infrastructure): Medium interest, Medium influence
- Compliance Officer (PDPA/data privacy): Medium interest, High influence

## Success Criteria (KPIs)
- Avg response time: < 4h (Phase 1), < 2h (Phase 2)
- Resolution time P1: < 8h (Phase 1), < 4h (Phase 2)
- CSAT score: > 3.5/5 (Phase 1), > 4.0/5 (Phase 2)
- Self-service resolution: 10% (Phase 1), 25% (Phase 2)
- SLA compliance: ≥ 95%
- KB article views: ≥ 500/month
- Estimated ticket volume: ~200/month

## Links
- Jira: SAL-4295 (Quản lý yêu cầu LLBH phase 2 - Sales to IT)
- Epic: SAL-1319 (Module Hỗ trợ Lực lượng bán hàng)
- BRD Confluence: Ticket Management IT M-Bro
- Figma: MBro - Bancas (node 88349-114259)
- Admin HO Figma: Admin Portal - BANCAS | MBAL (node 36754-6957)
