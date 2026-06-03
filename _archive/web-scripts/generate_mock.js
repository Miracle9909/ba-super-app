const fs = require('fs');
const path = require('path');

const docsPath = 'C:\\AntiGravity\\ai-tools-main\\ai-tools-main\\docs\\MBL\\00-project';
const files = fs.readdirSync(docsPath).filter(f => f.endsWith('.md'));

let uploadedDocs = [];
for (const file of files) {
    const content = fs.readFileSync(path.join(docsPath, file), 'utf8');
    uploadedDocs.push({
        id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file,
        type: 'text/markdown',
        content: content,
        timestamp: new Date().toISOString()
    });
}

const mockProject = {
    id: 'proj_mbl_new',
    name: 'MBL',
    domain: 'insurance',
    desc: 'Dá»± Ã¡n MBL - Ä Æ°á»£c táº¡o tá»« tÃ i liá»‡u tá»•ng quan',
    pipelinePhase: 1,
    createdAt: new Date().toISOString(),
    brief: {
        rawText: '',
        uploadedDocs: uploadedDocs
    },
    docs: {
        us: [],
        brd: null,
        srs: null,
        diagrams: []
    }
};

const appJsPath = 'C:\\AntiGravity\\ai-tools-main\\ba-super-app\\web\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

// We need to replace the loadMockData() implementation and remove loadMblSeed()
// It's safer to just output the JSON and then use replace_file_content tool, or do it via regex in the script.
fs.writeFileSync('C:\\AntiGravity\\ai-tools-main\\ba-super-app\\web\\mock_project.json', JSON.stringify(mockProject, null, 2));
console.log('mock_project.json generated');
