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
      
      content = content.replace(/text-\[#f5f3ee\]/g, 'text-[#111827]');
      content = content.replace(/hover:bg-\[#2e3139\]/g, 'hover:bg-[#F9FAFB]');
      content = content.replace(/border-\[#eaeaea\]\/20/g, 'border-[#E5E7EB]');
      content = content.replace(/text-\[#eaeaea\]/g, 'text-[#4B5563]');
      content = content.replace(/text-refold-text-dark/g, 'text-[#111827]');
      content = content.replace(/text-refold-text-primary/g, 'text-[#111827]');
      content = content.replace(/text-refold-text-secondary/g, 'text-[#4B5563]');
      
      fs.writeFileSync(fullPath, content);
    }
  }
}

processDir('src');
