const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf-8');
css = css.replace(/\.bg-base-100 \{ background-color: #[0-9A-Fa-f]+; \}/g, '.bg-base-100 { background-color: #ffffff; }');
fs.writeFileSync('src/app/globals.css', css);
console.log('Fixed bg-base-100 in globals.css');

let page = fs.readFileSync('src/app/page.js', 'utf-8');
// Fix the section at line 486 which has bg-[#0C0E12]
page = page.replace(/className="relative py-28 bg-\[#0C0E12\] overflow-hidden"/g, 'className="relative py-28 bg-[#F8F9FA] overflow-hidden"');
fs.writeFileSync('src/app/page.js', page);
console.log('Fixed hardcoded dark backgrounds in page.js');
