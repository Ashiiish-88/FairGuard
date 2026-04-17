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
      
      // Revert backgrounds and borders to light mode
      content = content.replace(/bg-\[#000000\]/g, 'bg-white');
      content = content.replace(/bg-\[#191b20\]/g, 'bg-white');
      content = content.replace(/border-\[#2a2e39\]/g, 'border-[#E5E7EB]');
      
      // Revert text colors back to dark text for light mode
      // Note: we selectively converted #111827 (gray-900), #0A0A0A to #ffffff
      content = content.replace(/text-\[#ffffff\]/g, 'text-[#111827]');
      content = content.replace(/text-\[#eaeaea\]/g, 'text-[#4B5563]');
      content = content.replace(/text-\[#9ca3af\]/g, 'text-[#6B7280]');
      content = content.replace(/text-\[#64748b\]/g, 'text-[#9CA3AF]');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Reverted light mode for ${fullPath}`);
      }
    }
  }
}

// Revert globals.css :root variables to light
function fixGlobals() {
  const fullPath = 'src/app/globals.css';
  let css = fs.readFileSync(fullPath, 'utf-8');
  
  // Revert :root back to light
  css = css.replace(/--background: #000000;/gi, '--background: #ffffff;');
  css = css.replace(/--foreground: #f5f3ee;/gi, '--foreground: #0a0a0a;');
  css = css.replace(/--card: #191b20;/gi, '--card: #ffffff;');
  css = css.replace(/--card-foreground: #f5f3ee;/gi, '--card-foreground: #0a0a0a;');
  css = css.replace(/--popover: #191b20;/gi, '--popover: #ffffff;');
  css = css.replace(/--popover-foreground: #f5f3ee;/gi, '--popover-foreground: #0a0a0a;');
  
  css = css.replace(/--secondary: #2a2d35;/gi, '--secondary: #f3f4f6;');
  css = css.replace(/--secondary-foreground: #ffffff;/gi, '--secondary-foreground: #0a0a0a;');
  
  css = css.replace(/--muted: #2a2e39;/gi, '--muted: #f3f4f6;');
  css = css.replace(/--muted-foreground: #9ca3af;/gi, '--muted-foreground: #6b7280;');
  
  css = css.replace(/--accent: #2e3139;/gi, '--accent: #f3f4f6;');
  css = css.replace(/--accent-foreground: #ffffff;/gi, '--accent-foreground: #0a0a0a;');
  
  css = css.replace(/--border: rgba\(255, 255, 255, 0\.1\);/gi, '--border: #e5e7eb;');
  css = css.replace(/--input: rgba\(255, 255, 255, 0\.1\);/gi, '--input: #e5e7eb;');
  css = css.replace(/--sidebar-border: rgba\(255, 255, 255, 0\.1\);/gi, '--sidebar-border: #e5e7eb;');
  
  css = css.replace(/--sidebar: #0b0e14;/gi, '--sidebar: #ffffff;');
  css = css.replace(/--sidebar-foreground: #f5f3ee;/gi, '--sidebar-foreground: #0a0a0a;');
  css = css.replace(/--sidebar-primary-foreground: #000000;/gi, '--sidebar-primary-foreground: #000000;');
  css = css.replace(/--sidebar-accent: #2e3139;/gi, '--sidebar-accent: #f3f4f6;');
  css = css.replace(/--sidebar-accent-foreground: #ffffff;/gi, '--sidebar-accent-foreground: #0a0a0a;');

  css = css.replace(/--fg-text-heading: #ffffff;/gi, '--fg-text-heading: #0a0a0a;');
  css = css.replace(/--fg-text-body: #9ca3af;/gi, '--fg-text-body: #374151;');
  css = css.replace(/--fg-text-muted: #64748b;/gi, '--fg-text-muted: #6b7280;');
  css = css.replace(/--fg-text-subtle: #475569;/gi, '--fg-text-subtle: #9ca3af;');
  css = css.replace(/--fg-border: rgba\(255, 255, 255, 0\.1\);/gi, '--fg-border: #e5e7eb;');
  css = css.replace(/--fg-border-strong: rgba\(255, 255, 255, 0\.2\);/gi, '--fg-border-strong: #d1d5db;');
  
  fs.writeFileSync(fullPath, css);
  console.log('globals.css reverted to light backgrounds');
}

processDir('src');
fixGlobals();
