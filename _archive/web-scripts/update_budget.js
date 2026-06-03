const fs = require('fs');
let content = fs.readFileSync('c:/AntiGravity/ai-tools-main/ba-super-app/web/budget_data.js', 'utf8');

const projectSummaryNew = `const PROJECT_SUMMARY = [
    { stt: 'I', name: 'Quản lý dự án', md: 40.0, rateKey: 'PM' },
    { stt: '', name: 'Đảm bảo chất lượng', md: 10.0, rateKey: 'QA' },
    { stt: 'II', name: 'Khảo sát, phân tích', md: 65.0, rateKey: 'BA' },
    { stt: 'III', name: 'Thiết kế hệ thống', md: 55.0, rateKey: 'SA' },
    { stt: '', name: 'Kiểm thử SIT', md: 84.0, rateKey: 'SIT' },
    { stt: 'IV', name: 'Lập trình (bao gồm cả kiểm thử nội bộ UT, chuyển giao kỹ thuật)', md: 290.0, rateKey: 'DEV' }
];`;

content = content.replace(/const PROJECT_SUMMARY = \[[\s\S]*?\];/, projectSummaryNew);

content = content.replace(/totalMD: [\d\.]+/, 'totalMD: 290.0');

// Now we need to parse ALL_SECTIONS and scale the 'md' values
const sectionsMatch = content.match(/const ALL_SECTIONS = (\[[\s\S]*\]);/);
if (sectionsMatch) {
    let sections = eval(sectionsMatch[1]);
    
    // First find current total to scale properly
    let currentTotal = 0;
    sections.forEach(s => {
        s.groups.forEach(g => {
            g.subs.forEach(sub => {
                sub.items.forEach(item => {
                    currentTotal += item.md;
                });
            });
        });
    });

    const targetTotal = 290.0;
    const scale = targetTotal / currentTotal;
    
    let newTotal = 0;
    sections.forEach(s => {
        s.groups.forEach(g => {
            g.subs.forEach(sub => {
                sub.items.forEach(item => {
                    item.md = Number((item.md * scale).toFixed(1));
                    if (item.md === 0) item.md = 0.1; // Ensure no zero MD
                    newTotal += item.md;
                });
            });
        });
    });
    
    // adjust rounding error to exactly 290.0
    let diff = targetTotal - newTotal;
    if (Math.abs(diff) > 0.01) {
        // Find the first item and add the diff
        outer: for (let s of sections) {
            for (let g of s.groups) {
                for (let sub of g.subs) {
                    for (let item of sub.items) {
                        item.md = Number((item.md + diff).toFixed(1));
                        break outer;
                    }
                }
            }
        }
    }

    const newSectionsStr = 'const ALL_SECTIONS = ' + JSON.stringify(sections, null, 2) + ';';
    content = content.replace(/const ALL_SECTIONS = \[[\s\S]*\];/, newSectionsStr);
}

fs.writeFileSync('c:/AntiGravity/ai-tools-main/ba-super-app/web/budget_data.js', content, 'utf8');
console.log('Updated budget_data.js to 544 total MD');
