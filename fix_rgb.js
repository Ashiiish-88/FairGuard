const fs = require('fs');

let content = fs.readFileSync('src/app/page.js', 'utf-8');
content = content.replace(/rgba\(245,158,11,/g, 'rgba(216,255,112,'); // Lime (d8ff70 = 216, 255, 112)
content = content.replace(/rgba\(16,185,129,/g, 'rgba(4,207,255,'); // Cyan (04cfff = 4, 207, 255)
content = content.replace(/rgba\(239,68,68,/g, 'rgba(255,107,122,'); // Coral (ff6b7a = 255, 107, 122)
content = content.replace(/#FCA5A5/g, '#ff6b7a'); // Lighter red to Coral
content = content.replace(/#6EE7B7/g, '#04cfff'); // Lighter green to Cyan
content = content.replace(/#EF4444/g, '#ff6b7a'); // Red
content = content.replace(/#F59E0B/g, '#d8ff70'); // Amber
content = content.replace(/#0D9488/g, '#04cfff'); // Teal
content = content.replace(/#10B981/g, '#d8ff70'); // Emerald
content = content.replace(/#3B82F6/g, '#9a77f8'); // Blue

// Change the background color logic
// the horizontal bar graph: in page.js, the stripeOffsets uses y instead of x inside a motion.div
content = content.replace(/animate=\{\{ y/g, 'animate={{ x');
// Ensure it was matched properly

fs.writeFileSync('src/app/page.js', content);

console.log("RGB fixing done.");
