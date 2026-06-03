const fs = require('fs');

const appJsPath = 'C:\\AntiGravity\\ai-tools-main\\ba-super-app\\web\\app.js';
let appJs = fs.readFileSync(appJsPath, 'utf8');

const mockProjectJson = fs.readFileSync('C:\\AntiGravity\\ai-tools-main\\ba-super-app\\web\\mock_project.json', 'utf8');

// Find loadMblSeed and remove it
const loadMblSeedRegex = /\/\/ --- RESET & LOAD MBL SEED ---[\s\S]*?loadMblSeed\(\) \{[\s\S]*?\},/g;
appJs = appJs.replace(loadMblSeedRegex, '');

// Find loadMockData and replace it
const loadMockDataRegex = /\/\/ --- MOCK DATA FOR FIRST LOAD \(MBL INSURANCE PLATFORM\) ---[\s\S]*?this\.state\.activePage = 'brief';\s*\}/g;

const newLoadMockData = `// --- DEFAULT DATA FOR FIRST LOAD ---
  loadMockData() {
    const mockProject = ${mockProjectJson};

    this.state.projects.push(mockProject);
    this.state.currentProjectId = mockProject.id;
    this.state.activePage = 'brief'; // Start at brief phase
  }`;

appJs = appJs.replace(loadMockDataRegex, newLoadMockData);

fs.writeFileSync(appJsPath, appJs);
console.log('app.js updated');
