const fs = require('fs');

let css = fs.readFileSync('src/app/globals.css', 'utf-8');

// Replace all variables in :root
css = css.replace(/:root \{[\s\S]*?(?=\n\/\* ─── Dark)/, `:root {
  /* ─── Base Surfaces (Refold Dark Theme) ─── */
  --background: #000000;
  --foreground: #f5f3ee;
  --card: #191b20;
  --card-foreground: #f5f3ee;
  --popover: #191b20;
  --popover-foreground: #f5f3ee;

  /* ─── Primary: Refold Lime ─── */
  --primary: #d8ff70;
  --primary-foreground: #000000;

  /* ─── Secondary ─── */
  --secondary: #2a2d35;
  --secondary-foreground: #ffffff;

  /* ─── Muted ─── */
  --muted: #2a2e39;
  --muted-foreground: #9ca3af;

  /* ─── Accent ─── */
  --accent: #2e3139;
  --accent-foreground: #ffffff;

  /* ─── Destructive ─── */
  --destructive: #ff6b7a;

  /* ─── Borders & Inputs ─── */
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.1);
  --ring: #d8ff70;

  /* ─── Chart Colors ─── */
  --chart-1: #d8ff70;
  --chart-2: #04cfff;
  --chart-3: #9a77f8;
  --chart-4: #ff8c42;
  --chart-5: #ff6b7a;

  /* ─── Radius ─── */
  --radius: 0.5rem;

  /* ─── Sidebar ─── */
  --sidebar: #0b0e14;
  --sidebar-foreground: #f5f3ee;
  --sidebar-primary: #d8ff70;
  --sidebar-primary-foreground: #000000;
  --sidebar-accent: #2e3139;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #d8ff70;

  /* ─── Typography & Utilities ─── */
  --fg-text-heading: #ffffff;
  --fg-text-body: #9ca3af;
  --fg-text-muted: #64748b;
  --fg-text-subtle: #475569;
  --fg-border: rgba(255, 255, 255, 0.1);
  --fg-border-strong: rgba(255, 255, 255, 0.2);

  --fg-score-critical: #ff6b7a;
  --fg-score-moderate: #ff8c42;
  --fg-score-good: #d8ff70;
  --fg-score-excellent: #04cfff;
  
  --fg-amber-vivid: #d8ff70; /* Map legacy variable to primary */
  --fg-teal-vivid: #04cfff; /* Map legacy variable to cyan */
}`);

// Dark mode overrides: set to same values
css = css.replace(/\.dark \{[\s\S]*?(?=\n\/\* ════════════════════)/, `.dark {
  --background: #000000;
  --foreground: #f5f3ee;
  --card: #191b20;
  --card-foreground: #f5f3ee;
  --popover: #191b20;
  --popover-foreground: #f5f3ee;
  --primary: #d8ff70;
  --primary-foreground: #000000;
  --secondary: #2a2d35;
  --secondary-foreground: #ffffff;
  --muted: #2a2e39;
  --muted-foreground: #9ca3af;
  --accent: #2e3139;
  --accent-foreground: #ffffff;
  --destructive: #ff6b7a;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.1);
  --ring: #d8ff70;
  --chart-1: #d8ff70;
  --chart-2: #04cfff;
  --chart-3: #9a77f8;
  --chart-4: #ff8c42;
  --chart-5: #ff6b7a;
  --sidebar: #0b0e14;
  --sidebar-foreground: #f5f3ee;
  --sidebar-primary: #d8ff70;
  --sidebar-primary-foreground: #000000;
  --sidebar-accent: #2e3139;
  --sidebar-accent-foreground: #ffffff;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #d8ff70;
}`);

// Change fonts in base/body
css = css.replace(/var\(--font-heading\), var\(--font-sans\), system-ui, sans-serif;/g, 'var(--font-sans), system-ui, sans-serif;');
css = css.replace(/--font-heading: var\(--font-heading\);/g, '--font-heading: var(--font-sans);');

// Replace gradient colors
css = css.replace(/background: linear-gradient\(135deg, #F59E0B 0%, #0D9488 100%\);/, 'background: linear-gradient(135deg, #d8ff70 0%, #04cfff 100%);');
css = css.replace(/color: #10B981;/g, 'color: #d8ff70;');
css = css.replace(/color: #EF4444;/g, 'color: #ff6b7a;');

fs.writeFileSync('src/app/globals.css', css);
console.log("globals.css patched successfully!");
