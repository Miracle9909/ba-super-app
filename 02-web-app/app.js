/**
 * BA Super App - Core Logic
 */

class ProjectStore {
  constructor() {
    this.storageKey = 'ba_super_app_projects';
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      // Mock initial data
      const initialData = [
        {
          id: 'p_1',
          name: 'BIDV Home GĐ3',
          domain: 'Banking',
          phase: 'Discovery (1/6)',
          progress: 16,
          readiness: 65,
          updatedAt: '2 giờ trước',
          sources: [
            { id: 's_1', name: 'HSYC-BIDV Home GD3.docx', type: 'RFP', size: '15,018 ký tự', date: '28/05/2026', status: 'parsed', icon: 'description' },
            { id: 's_2', name: 'Meeting Notes - Kick-off', type: 'Notes', size: '2,300 ký tự', date: '27/05/2026', status: 'pending', icon: 'speaker_notes' },
            { id: 's_3', name: 'https://jira.bidv.com/wiki/HSYC', type: 'URL', size: '8,500 ký tự', date: '26/05/2026', status: 'parsed', icon: 'link' }
          ],
          knowledge: {
            entities: [],
            rules: [],
            glossary: []
          }
        },
        {
          id: 'p_2',
          name: 'MBL Insurance Platform',
          domain: 'Insurance',
          phase: 'BRD (3/6)',
          progress: 50,
          readiness: 85,
          updatedAt: '1 ngày trước',
          sources: [],
          knowledge: {}
        }
      ];
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  getProjects() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || [];
  }

  getProject(id) {
    const projects = this.getProjects();
    return projects.find(p => p.id === id);
  }

  updateProject(id, updates) {
    let projects = this.getProjects();
    projects = projects.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem(this.storageKey, JSON.stringify(projects));
  }
}

const store = new ProjectStore();

document.addEventListener('DOMContentLoaded', () => {
  // Navigation active states
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if(this.getAttribute('href') === '#') {
        e.preventDefault();
        navItems.forEach(n => n.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Tab switching in workspace
  const tabItems = document.querySelectorAll('.tab-bar .tab-item');
  if (tabItems.length > 0) {
    tabItems.forEach(tab => {
      tab.addEventListener('click', function() {
        tabItems.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Mock tab switching visually
        const tabText = this.textContent.trim();
        if (tabText.includes('Tri thức')) {
          showKnowledgeTab();
        } else if (tabText.includes('Nguồn dữ liệu')) {
          showSourceTab();
        } else {
          // Hide both for other tabs as placeholder
          const mainContent = document.querySelector('.main-canvas > div:not(.workspace-header):not(.tab-bar)');
          if(mainContent) mainContent.innerHTML = `<div class="empty-state-area mt-16">
            <span class="material-symbols-rounded" style="font-size: 48px; color: var(--text-disabled);">construction</span>
            <h2>Đang xây dựng</h2>
            <p>Tính năng ${tabText} đang được phát triển.</p>
          </div>`;
        }
      });
    });
  }

  // Mock Parse AI
  const parseBtns = document.querySelectorAll('button[title="Parse AI"], button[title="Parse tất cả"]');
  parseBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const originalText = this.innerHTML;
      this.innerHTML = `<span class="material-symbols-rounded" style="animation: spin 1s linear infinite;">sync</span> Đang phân tích...`;
      this.disabled = true;
      
      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
        
        // Find closest source item and change status
        const item = this.closest('.source-item');
        if (item) {
          const statusEl = item.querySelector('.source-status');
          if (statusEl) {
            statusEl.textContent = 'Đã xử lý';
            statusEl.className = 'source-status status-parsed';
          }
          this.setAttribute('title', 'Parse lại');
        }
        
        alert('Phân tích AI hoàn tất! Hệ thống đã trích xuất các quy tắc nghiệp vụ (Business Rules) và thực thể (Entities).');
      }, 1500);
    });
  });
});

// Helper to inject keyframes for spinning
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleSheet);

function showSourceTab() {
  const container = document.querySelector('.main-canvas > div:not(.workspace-header):not(.tab-bar)');
  if (!container) return;
  
  // Restore original Source UI
  container.innerHTML = `
    <h3 class="section-title">Trung tâm nạp dữ liệu</h3>
    <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">Nạp tài liệu thô, HSYC, meeting notes để AI tự động phân tích và trích xuất tri thức.</p>
    
    <div class="ingestion-channels">
      <div class="channel-card ingestion-trigger" data-type="text"><span class="material-symbols-rounded">edit_document</span><span>Paste Text</span></div>
      <div class="channel-card ingestion-trigger" data-type="file"><span class="material-symbols-rounded">upload_file</span><span>Upload File</span></div>
      <div class="channel-card ingestion-trigger" data-type="url"><span class="material-symbols-rounded">link</span><span>URL Fetch</span></div>
      <div class="channel-card ingestion-trigger" data-type="email"><span class="material-symbols-rounded">forward_to_inbox</span><span>Email Forward</span></div>
      <div class="channel-card ingestion-trigger" data-type="template"><span class="material-symbols-rounded">library_books</span><span>Template</span></div>
    </div>

    <div class="source-list" id="main-source-list">
      <div class="source-header">
        <span id="source-count">Tài liệu đã nạp (3)</span>
        <button class="secondary-btn" style="padding: 6px 12px; font-size: 13px;"><span class="material-symbols-rounded" style="font-size: 16px;">psychology</span> Parse tất cả</button>
      </div>
      
      <!-- List would normally be rendered from ProjectStore -->
      <div class="source-item">
        <div class="source-info">
          <div class="source-icon"><span class="material-symbols-rounded">description</span></div>
          <div class="source-details">
            <div class="source-name">HSYC-BIDV Home GD3.docx</div>
            <div class="source-meta">Loại: RFP · 15,018 ký tự · Nạp: 28/05/2026</div>
          </div>
        </div>
        <div class="source-status status-parsed">Đã xử lý</div>
        <div class="source-actions">
          <button class="icon-btn" title="Xem"><span class="material-symbols-rounded">visibility</span></button>
          <button class="icon-btn" title="Parse lại"><span class="material-symbols-rounded">psychology</span></button>
          <button class="icon-btn" title="Xóa"><span class="material-symbols-rounded">delete</span></button>
        </div>
      </div>
      
      <div class="source-item">
        <div class="source-info">
          <div class="source-icon"><span class="material-symbols-rounded">speaker_notes</span></div>
          <div class="source-details">
            <div class="source-name">Meeting Notes - Kick-off</div>
            <div class="source-meta">Loại: Notes · 2,300 ký tự · Nạp: 27/05/2026</div>
          </div>
        </div>
        <div class="source-status status-pending">Chờ xử lý</div>
        <div class="source-actions">
          <button class="icon-btn" title="Xem"><span class="material-symbols-rounded">visibility</span></button>
          <button class="icon-btn" title="Parse AI"><span class="material-symbols-rounded">psychology</span></button>
          <button class="icon-btn" title="Xóa"><span class="material-symbols-rounded">delete</span></button>
        </div>
      </div>
    </div>
  `;

  // Attach modal trigger logic
  initIngestionModal();
}

function initIngestionModal() {
  let modal = document.getElementById('ingestion-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'ingestion-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title">Nạp tri thức mới</div>
          <button class="icon-btn" onclick="closeIngestionModal()"><span class="material-symbols-rounded">close</span></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Loại tài liệu (Phân loại tri thức)</label>
            <select class="form-control" id="ingest-doc-type">
              <option value="BRD">Business Requirements Document (BRD)</option>
              <option value="SRS">System Requirements Specification (SRS)</option>
              <option value="RFP">Request for Proposal (RFP)</option>
              <option value="Meeting Notes">Meeting Notes / Biên bản họp</option>
              <option value="User Story">User Story</option>
              <option value="Reference">Tài liệu tham khảo (Reference)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Template phân tích AI (Nhận diện)</label>
            <select class="form-control" id="ingest-template">
              <option value="BIDV-Standard">BIDV Standard Template</option>
              <option value="Agile-Scrum">Agile Scrum Standard</option>
              <option value="Free-text">Tự do (Không dùng template)</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mô tả / Ghi chú thêm</label>
            <textarea class="form-control" id="ingest-desc" placeholder="Ví dụ: Tài liệu này mô tả luồng đăng nhập và đăng ký..."></textarea>
          </div>
          
          <div class="form-group" id="ingest-upload-area">
            <label class="form-label">Tải lên file hoặc cung cấp dữ liệu</label>
            <div class="file-drop-area">
              <span class="material-symbols-rounded">cloud_upload</span>
              <div class="file-drop-text">Kéo thả file vào đây hoặc click để chọn</div>
              <div class="file-drop-hint">Hỗ trợ: PDF, DOCX, XLSX, TXT, MD (Max: 50MB)</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary-btn" onclick="closeIngestionModal()">Hủy</button>
          <button class="primary-btn" onclick="submitIngestion()"><span class="material-symbols-rounded">upload</span> Bắt đầu nạp</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Attach click listeners to trigger cards
  document.querySelectorAll('.ingestion-trigger').forEach(card => {
    card.addEventListener('click', () => {
      openIngestionModal(card.getAttribute('data-type'));
    });
  });
}

window.openIngestionModal = function(type) {
  const modal = document.getElementById('ingestion-modal');
  if (modal) {
    // Customize modal based on type if needed
    const uploadArea = document.getElementById('ingest-upload-area');
    if (type === 'url') {
      uploadArea.innerHTML = `
        <label class="form-label">Đường dẫn URL</label>
        <input type="text" class="form-control" placeholder="https://jira.bidv.com/wiki/..." id="ingest-file-name" />
      `;
    } else if (type === 'text') {
      uploadArea.innerHTML = `
        <label class="form-label">Nội dung văn bản</label>
        <textarea class="form-control" style="min-height: 120px;" placeholder="Dán nội dung vào đây..." id="ingest-file-name"></textarea>
      `;
    } else {
      uploadArea.innerHTML = `
        <label class="form-label">Tải lên file</label>
        <div class="file-drop-area" onclick="document.getElementById('mock-file-input').click()">
          <span class="material-symbols-rounded">cloud_upload</span>
          <div class="file-drop-text" id="mock-file-text">Kéo thả file vào đây hoặc click để chọn</div>
          <div class="file-drop-hint">Hỗ trợ: PDF, DOCX, XLSX, TXT, MD (Max: 50MB)</div>
          <input type="file" id="mock-file-input" style="display: none;" onchange="document.getElementById('mock-file-text').innerText = this.files[0] ? this.files[0].name : 'Kéo thả file vào đây...'">
        </div>
      `;
    }
    
    modal.classList.add('active');
  }
};

window.closeIngestionModal = function() {
  const modal = document.getElementById('ingestion-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.submitIngestion = function() {
  const docType = document.getElementById('ingest-doc-type').value;
  const template = document.getElementById('ingest-template').value;
  const descInput = document.getElementById('ingest-desc');
  const desc = descInput ? descInput.value : '';
  const fileInput = document.getElementById('mock-file-input');
  const textInput = document.getElementById('ingest-file-name');
  
  let sourceName = "Tài liệu mới nạp";
  let icon = "description";
  
  if (fileInput && fileInput.files[0]) {
    sourceName = fileInput.files[0].name;
  } else if (textInput && textInput.tagName === 'INPUT') {
    sourceName = textInput.value || "URL Document";
    icon = "link";
  } else if (textInput && textInput.tagName === 'TEXTAREA') {
    sourceName = "Pasted Text Document";
    icon = "text_snippet";
  }
  
  // Add mock item to list
  const list = document.getElementById('main-source-list');
  if (list) {
    const newItem = document.createElement('div');
    newItem.className = 'source-item';
    newItem.innerHTML = `
      <div class="source-info">
        <div class="source-icon"><span class="material-symbols-rounded">${icon}</span></div>
        <div class="source-details">
          <div class="source-name">${sourceName}</div>
          <div class="source-meta">Loại: ${docType} · Template: ${template} · Nạp: Vừa xong</div>
          ${desc ? `<div class="source-desc" style="font-size: 13px; color: var(--text-secondary); margin-top: 4px; font-style: italic;">${desc}</div>` : ''}
        </div>
      </div>
      <div class="source-status status-pending">Chờ xử lý</div>
      <div class="source-actions">
        <button class="icon-btn" title="Xem"><span class="material-symbols-rounded">visibility</span></button>
        <button class="icon-btn" title="Parse AI"><span class="material-symbols-rounded">psychology</span></button>
        <button class="icon-btn" title="Xóa"><span class="material-symbols-rounded">delete</span></button>
      </div>
    `;
    
    // Insert after header
    list.insertBefore(newItem, list.children[1]);

    // Bind event for the new Parse AI button
    const newParseBtn = newItem.querySelector('button[title="Parse AI"]');
    if (newParseBtn) {
      newParseBtn.addEventListener('click', function() {
        const originalText = this.innerHTML;
        this.innerHTML = '<span class="material-symbols-rounded" style="animation: spin 1s linear infinite;">sync</span>';
        this.disabled = true;
        
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
          
          const statusEl = newItem.querySelector('.source-status');
          if (statusEl) {
            statusEl.textContent = 'Đã xử lý';
            statusEl.className = 'source-status status-parsed';
          }
          this.setAttribute('title', 'Parse lại');
          
          alert('Phân tích AI hoàn tất! Hệ thống đã trích xuất các quy tắc nghiệp vụ (Business Rules) và thực thể (Entities) theo mẫu ' + template + '.');
        }, 1500);
      });
    }
    
    // Update count
    const countEl = document.getElementById('source-count');
    if (countEl) {
      const match = countEl.innerText.match(/\d+/);
      const currentCount = match ? parseInt(match[0]) : 3;
      countEl.innerText = `Tài liệu đã nạp (${currentCount + 1})`;
    }
  }
  
  closeIngestionModal();
  alert('Đã nạp tri thức thành công! Tài liệu đang chờ Parse AI để áp dụng ' + template + '.');
};

function showKnowledgeTab() {
  const container = document.querySelector('.main-canvas > div:not(.workspace-header):not(.tab-bar)');
  if (!container) return;
  
  // Create wrapper
  container.innerHTML = `
    <h3 class="section-title">Tri thức dự án được trích xuất</h3>
    <div class="knowledge-tabs" style="display: flex; gap: 16px; margin-bottom: 24px;">
      <button class="primary-btn k-tab" data-target="entities" style="padding: 8px 16px; font-size: 13px;">Entities (12)</button>
      <button class="secondary-btn k-tab" data-target="rules" style="padding: 8px 16px; font-size: 13px; border-color: transparent; color: var(--text-secondary);">Business Rules (45)</button>
      <button class="secondary-btn k-tab" data-target="glossary" style="padding: 8px 16px; font-size: 13px; border-color: transparent; color: var(--text-secondary);">Glossary (8)</button>
    </div>
    <div id="knowledge-content"></div>
  `;

  const tabs = container.querySelectorAll('.k-tab');
  const content = container.querySelector('#knowledge-content');

  function renderKnowledge(type) {
    if (type === 'entities') {
      content.innerHTML = `
        <div class="widget-grid" style="grid-template-columns: repeat(2, 1fr);">
          <div class="widget-card">
            <div class="project-header">
              <div class="project-name" style="color: var(--primary);">Khách hàng (Customer)</div>
              <span class="material-symbols-rounded">account_circle</span>
            </div>
            <div class="widget-desc" style="margin-bottom: 12px;">Thực thể đại diện cho cá nhân hoặc tổ chức sử dụng dịch vụ BIDV Home.</div>
            <div class="domain-badge" style="display: inline-block;">Nguồn: HSYC-BIDV Home GD3.docx</div>
          </div>
          
          <div class="widget-card">
            <div class="project-header">
              <div class="project-name" style="color: var(--primary);">Khoản vay (Loan)</div>
              <span class="material-symbols-rounded">account_balance_wallet</span>
            </div>
            <div class="widget-desc" style="margin-bottom: 12px;">Đại diện cho hợp đồng tín dụng giữa BIDV và Khách hàng.</div>
            <div class="domain-badge" style="display: inline-block;">Nguồn: 2 tài liệu</div>
          </div>
          
          <div class="widget-card">
            <div class="project-header">
              <div class="project-name" style="color: var(--primary);">Tài sản đảm bảo (Collateral)</div>
              <span class="material-symbols-rounded">real_estate_agent</span>
            </div>
            <div class="widget-desc" style="margin-bottom: 12px;">Tài sản được thế chấp để đảm bảo cho Khoản vay.</div>
            <div class="domain-badge" style="display: inline-block;">Nguồn: HSYC-BIDV Home GD3.docx</div>
          </div>
        </div>
      `;
    } else if (type === 'rules') {
      content.innerHTML = `
        <div class="source-list">
          <div class="source-item" style="align-items: flex-start; padding: 20px;">
            <div class="source-info" style="align-items: flex-start;">
              <div class="source-icon" style="background-color: #fef7e0; color: #b06000;"><span class="material-symbols-rounded">rule</span></div>
              <div class="source-details">
                <div class="source-name" style="font-size: 15px;">BR-LOAN-01: Hạn mức vay tối đa</div>
                <div class="widget-desc" style="margin-top: 4px; margin-bottom: 8px;">Khách hàng cá nhân chỉ được vay tối đa 70% giá trị tài sản đảm bảo, trừ khi có xếp hạng tín dụng hạng A.</div>
                <div class="source-meta">Nguồn: HSYC-BIDV Home GD3.docx (Trang 12)</div>
              </div>
            </div>
          </div>
          <div class="source-item" style="align-items: flex-start; padding: 20px;">
            <div class="source-info" style="align-items: flex-start;">
              <div class="source-icon" style="background-color: #e8f0fe; color: #1967d2;"><span class="material-symbols-rounded">rule</span></div>
              <div class="source-details">
                <div class="source-name" style="font-size: 15px;">BR-CUST-05: Độ tuổi vay vốn</div>
                <div class="widget-desc" style="margin-top: 4px; margin-bottom: 8px;">Khách hàng phải từ 18 tuổi trở lên tại thời điểm vay và không quá 65 tuổi tại thời điểm tất toán khoản vay.</div>
                <div class="source-meta">Nguồn: Meeting Notes - Kick-off</div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'glossary') {
      content.innerHTML = `
        <div class="widget-grid" style="grid-template-columns: repeat(3, 1fr);">
          <div class="widget-card">
            <div class="project-name" style="margin-bottom: 8px;">LTV (Loan-to-Value)</div>
            <div class="widget-desc">Tỷ lệ số tiền cho vay so với giá trị tài sản đảm bảo. LTV càng cao rủi ro càng lớn.</div>
          </div>
          <div class="widget-card">
            <div class="project-name" style="margin-bottom: 8px;">CIC</div>
            <div class="widget-desc">Trung tâm Thông tin Tín dụng Quốc gia Việt Nam. Nơi tra cứu lịch sử tín dụng của Khách hàng.</div>
          </div>
          <div class="widget-card">
            <div class="project-name" style="margin-bottom: 8px;">Giải ngân (Disbursement)</div>
            <div class="widget-desc">Quá trình ngân hàng chuyển tiền vay cho khách hàng hoặc bên thứ ba theo thỏa thuận.</div>
          </div>
        </div>
      `;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Reset styles
      tabs.forEach(t => {
        t.className = 'secondary-btn k-tab';
        t.style.borderColor = 'transparent';
        t.style.color = 'var(--text-secondary)';
      });
      // Active style
      this.className = 'primary-btn k-tab';
      this.style.borderColor = '';
      this.style.color = '';
      
      renderKnowledge(this.getAttribute('data-target'));
    });
  });

  // Initial render
  renderKnowledge('entities');
}
