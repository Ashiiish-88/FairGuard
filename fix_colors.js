const fs = require('fs');
const path = require('path');

const replacements = [
  { old: /#F59E0B/gi, new: '#d8ff70' }, // Amber -> Lime
  { old: /#D97706/gi, new: '#000000' }, // Dark Amber -> Black (for text on lime badges) or Cyan
  { old: /#FEF3C7/gi, new: '#2e3139' }, // Light Amber -> Dark Card
  { old: /#FFFBEB/gi, new: '#191b20' }, // Lightest Amber -> Base Card
  { old: /#EF4444/gi, new: '#ff6b7a' }, // Red -> Coral
  { old: /#0D9488/gi, new: '#04cfff' }, // Teal -> Cyan
  { old: /#10B981/gi, new: '#d8ff70' }, // Emerald -> Lime
  { old: /#3B82F6/gi, new: '#9a77f8' }, // Blue -> Purple
  { old: /#E5E7EB/gi, new: '#2a2e39' }, // Gray-200 -> Dark Border
  { old: /#F9FAFB/gi, new: '#191b20' }, // Gray-50 -> Base Card
  { old: /#F1F5F9/gi, new: '#f5f3ee' }, // Gray-100 -> Off white
  { old: /#111827/gi, new: '#ffffff' }, // Gray-900 -> White
  { old: /#0A0A0A/gi, new: '#ffffff' }, // Blackish -> White
  { old: /#374151/gi, new: '#eaeaea' }, // Gray-700 -> Light Ash
  { old: /#4B5563/gi, new: '#eaeaea' }, // Gray-600 -> Light Ash
  { old: /#6B7280/gi, new: '#9ca3af' }, // Gray-500 -> Muted
  { old: /#9CA3AF/gi, new: '#64748b' }  // Gray-400 -> Slate
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let originalContent = content;
      
      replacements.forEach(r => {
        content = content.replace(r.old, r.new);
      });
      
      // Fix specific animation issue in page.js
      if (fullPath.endsWith('page.js')) {
        content = content.replace(/animate=\{\{ y: \[0, -10, 0\] \}\}/g, 'animate={{ x: [0, -10, 0] }}');
        content = content.replace(/animate=\{\{ y: \[0, 10, 0\] \}\}/g, 'animate={{ x: [0, 10, 0] }}');
        // Fix background opacity mapping since we use solid dark colors now
        content = content.replace(/bg-\[#d8ff70\]\/10/g, 'bg-[#d8ff70]/20');
        content = content.replace(/bg-\[#d8ff70\]\/5/g, 'bg-[#d8ff70]/10');
      }

      // Fix specific text color issues in globals.css
      if (fullPath.endsWith('globals.css')) {
        content = content.replace(/color: #0A0A0A !important;/gi, 'color: #ffffff !important;');
        content = content.replace(/color: #ffffff !important;/gi, 'color: #ffffff !important;');
        content = content.replace(/color: #FFFFFF !important;/gi, 'color: #ffffff !important;');
      }

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDir('src');
