const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let originalContent = content;
      
      content = content.replace(/className="min-h-screen bg-white"/g, 'className="min-h-screen bg-[#000000]"');
      content = content.replace(/className="py-20 bg-white"/g, 'className="py-20 bg-[#000000]"');
      content = content.replace(/className="py-24 bg-white"/g, 'className="py-24 bg-[#000000]"');
      content = content.replace(/className="relative bg-white overflow-hidden"/g, 'className="relative bg-[#000000] overflow-hidden"');
      content = content.replace(/className="bg-white border-t/g, 'className="bg-[#000000] border-t');
      content = content.replace(/bg-white/g, 'bg-[#191b20]');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('src');
