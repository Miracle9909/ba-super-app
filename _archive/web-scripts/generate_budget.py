"""
Generate budget_data.js with complexity scoring (1-10)
Complexity criteria:
  1-2: Simple display/delete (xem, xóa, count)
  3-4: Standard CRUD list/detail, basic API
  5-6: Forms with validation, approval workflows, search+filter
  7-8: Complex integrations, file import/export, reports with calculations
  9-10: AI features, real-time processing, multi-system integration, security-critical
"""
import json, datetime
from docx import Document

DOC_PATH = r'C:\AntiGravity\ai-tools-main\ai-tools-main\docs\BIDV\Req 3\HSYC-BIDV Home GD3.docx'
OUT_PATH = r'C:\AntiGravity\ai-tools-main\ba-super-app\web\budget_data.js'

doc = Document(DOC_PATH)

def norm(s):
    return s.strip().replace('\n', ' ').replace('\r', '')[:80].strip()

# BM2 items (needs RSD)
bm2_items = set()
for row in doc.tables[4].rows[1:]:
    n = norm(row.cells[1].text) if len(row.cells) > 1 else ''
    if n: bm2_items.add(n)

# BM3 items (needs SIT)
bm3_items = set()
for row in doc.tables[5].rows[1:]:
    n = norm(row.cells[1].text) if len(row.cells) > 1 else ''
    if n: bm3_items.add(n)

def score_complexity(name):
    """Score 1-10 based on function characteristics and return reasons"""
    n = name.lower()
    score = 3  # baseline
    reasons = []

    # === BOOST factors ===
    # Integration / 3rd party (high complexity)
    if any(k in n for k in ['tích hợp', 'dynamic link', 'seo', 'otp', 'ott']):
        score += 4
        reasons.append('Tích hợp hệ thống/3rd party phức tạp')
    if any(k in n for k in ['ai tư vấn', 'tính toán', 'dư nợ', 'trả hàng tháng']):
        score += 5  # AI/calculation = very complex
        reasons.append('Logic tính toán/AI tư vấn chuyên sâu')
    if 'watermark' in n:
        score += 4  # video processing
        reasons.append('Xử lý media/watermark nặng')
    if any(k in n for k in ['qr code', 'scan', 'đọc thông tin qr']):
        score += 3
        reasons.append('Tương tác thiết bị (Camera/QR)')

    # File processing
    if any(k in n for k in ['import', 'upload file', 'upload', 'validate thông tin']):
        score += 3
        reasons.append('Upload và validate file')
    if any(k in n for k in ['export', 'download']):
        score += 2
        reasons.append('Xuất/tải file báo cáo')

    # Complex UI / multi-field forms
    if any(k in n for k in ['thêm mới', 'đăng ký', 'nhập thông tin']):
        score += 2
        reasons.append('Form nhập liệu nhiều field')
    if any(k in n for k in ['chỉnh sửa', 'cập nhật']):
        score += 1
        reasons.append('Form cập nhật thông tin')

    # Workflow / approval
    if any(k in n for k in ['duyệt', 'phê duyệt', 'từ chối', 'đổi trạng thái']):
        score += 2
        reasons.append('Quy trình phê duyệt nhiều step')
    if any(k in n for k in ['đẩy duyệt']):
        score += 1
        reasons.append('Chuyển trạng thái quy trình')

    # Reports / aggregation
    if any(k in n for k in ['báo cáo', 'thống kê']):
        score += 2
        reasons.append('Tổng hợp dữ liệu/Báo cáo')

    # Search / filter (moderate)
    if any(k in n for k in ['danh sách', 'tìm kiếm', 'điều kiện lọc']):
        score += 1
        reasons.append('Truy vấn/Lọc dữ liệu')

    # Notifications / messaging
    if any(k in n for k in ['gửi', 'sms', 'email tự động', 'thông báo', 'noti']):
        score += 2
        reasons.append('Gửi thông báo/SMS/Email')
    if 'job' in n:
        score += 3  # scheduled jobs = complex
        reasons.append('Job chạy ngầm tự động')

    # Navigation / layout (moderate)
    if any(k in n for k in ['navigation', 'header', 'slide', 'layout', 'framework', 'base']):
        score += 2
        reasons.append('Cấu trúc UI/Layout base')

    # Multi-field API modifications
    if any(k in n for k in ['sửa api danh sách/chi tiết/thêm mới/sửa', 'sửa api danh sách/chi tiết/thêm']):
        score += 2  # multi-endpoint changes
        reasons.append('Tác động nhiều API (CRUD)')
    elif any(k in n for k in ['sửa api', 'sửa mà']):
        score += 1
        reasons.append('Điều chỉnh API')

    # Permission / role-based
    if any(k in n for k in ['phân quyền', 'role', 'check role']):
        score += 2
        reasons.append('Phân quyền truy cập')

    # === REDUCE factors ===
    # Simple operations
    if any(k in n for k in ['xóa', 'xoá']):
        score -= 1
        reasons.append('Thao tác xóa đơn giản')
    if any(k in n for k in ['count', 'đánh dấu đọc', 'đã đọc']):
        score -= 2
        reasons.append('Update field trạng thái đơn giản')
    if any(k in n for k in ['chi tiết', 'xem chi tiết']) and score > 4:
        score -= 1
        reasons.append('View data đơn thuần')
    if any(k in n for k in ['lấy danh sách', 'dropdown']) and not any(k in n for k in ['điều kiện', 'tìm kiếm']):
        score -= 1
        reasons.append('Load data không logic phức tạp')

    # Clamp to 1-10
    final_score = max(1, min(10, score))
    if not reasons:
        reasons.append('CRUD cơ bản / Luồng tiêu chuẩn')

    return final_score, ' + '.join(reasons)

def estimate_md(name, complexity):
    """MD based on complexity score"""
    if complexity <= 2: return 0.5
    if complexity <= 3: return 1.0
    if complexity <= 4: return 1.5
    if complexity <= 5: return 2.0
    if complexity <= 6: return 2.5
    if complexity <= 7: return 3.0
    if complexity <= 8: return 4.0
    if complexity <= 9: return 5.0
    return 6.0  # 10

# Parse BM1 (Table 3)
t3 = doc.tables[3]
sections = []
current_section = None
current_group = None
current_sub = None

for row in t3.rows[1:]:
    cells = [norm(c.text) for c in row.cells]
    tt = cells[0]
    name = cells[1] if len(cells) > 1 else ''
    if not name: continue

    if tt in ('I', 'II', 'III', 'IV', 'V'):
        current_section = {'name': f"{tt}. {name}", 'groups': []}
        sections.append(current_section)
        current_group = None
        current_sub = None
        continue
    if tt in ('A', 'B', 'C', 'D'):
        current_group = {'name': f"{tt}. {name}", 'subs': []}
        if current_section:
            current_section['groups'].append(current_group)
        current_sub = None
        continue
    if tt.replace('.', '').isdigit() and '.' in tt:
        current_sub = {'id': tt, 'name': name, 'items': []}
        if current_group:
            current_group['subs'].append(current_sub)
        continue
    if tt.isdigit():
        current_sub = {'id': tt, 'name': name, 'items': []}
        if current_group:
            current_group['subs'].append(current_sub)
        continue
    if current_sub is not None:
        has_rsd = name in bm2_items
        has_sit = name in bm3_items
        status = 'rsd' if has_rsd else 'done'
        
        phases = ['DEV']
        if has_sit: phases.append('SIT')
        if has_rsd: phases.append('RSD')
        phase_label = ' + '.join(phases)
        
        cx, reason = score_complexity(name)
        md = estimate_md(name, cx)
        current_sub['items'].append({
            'name': name, 'md': md, 'status': status, 'cx': cx, 'reason': reason, 'phases': phase_label
        })

# Stats
total = done_n = rsd_n = total_md = 0
cx_dist = {i: 0 for i in range(1, 11)}
for sec in sections:
    for g in sec['groups']:
        for s in g['subs']:
            for item in s['items']:
                total += 1
                total_md += item['md']
                cx_dist[item['cx']] += 1
                if item['status'] == 'done': done_n += 1
                else: rsd_n += 1

print(f"Total: {total} items | Done: {done_n} | RSD: {rsd_n} | MD: {total_md}")
print(f"\nComplexity distribution:")
for i in range(1, 11):
    bar = '█' * cx_dist[i]
    label = ['', 'Trivial', 'Simple', 'Basic', 'Standard', 'Moderate',
             'Complex', 'Advanced', 'Expert', 'Critical', 'Extreme'][i]
    print(f"  {i:2d} ({label:8s}): {cx_dist[i]:3d} {bar}")

avg_cx = sum(item['cx'] for sec in sections for g in sec['groups'] for s in g['subs'] for item in s['items']) / total
print(f"\nAvg complexity: {avg_cx:.1f}/10")

js = f"""// Auto-generated from HSYC-BIDV Home GD3.docx
// Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}
// BM1 = Full scope | BM2 = Can BA lam RSD | BM3 = SIT (= BM1)
// Status: done = Da co RSD, rsd = Can BA+Design
// cx = Complexity score 1-10

const RATES = {{ DEV: 2800000, BA: 2500000, QA: 2200000, PM: 3500000 }};
const RATIOS = {{ BA: 0.40, QA: 0.35, PM: 0.10 }};
const BUFFER_RATE = 0.08;
const CX_LABELS = ['','Trivial','Simple','Basic','Standard','Moderate','Complex','Advanced','Expert','Critical','Extreme'];

const STATS = {{
    total: {total},
    done: {done_n},
    rsd: {rsd_n},
    totalMD: {total_md},
    avgCx: {avg_cx:.1f}
}};

const ALL_SECTIONS = {json.dumps(sections, ensure_ascii=False, indent=2)};
"""

with open(OUT_PATH, 'w', encoding='utf-8') as f:
    f.write(js)
print(f"\nWritten to {OUT_PATH}")
