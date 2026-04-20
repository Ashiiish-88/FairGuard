import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Replace inner stripe iteration for Hero Left
text = re.sub(
    r'\{stripeOffsets\.map\(\(offset, i\) => \(\s*<div\s*key=\{\`left-\$\{i\}\`\}\s*className="stripe-hover-effect"\s*style=\{\{\s*width: "120%",\s*height: "50px",\s*background: "linear-gradient\(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%\)",\s*transform: `translateX\(\$\{offset\}px\) scaleX\(-1\)`,\s*\}\}\s*\/>\s*\)\)\}',
    r'''{stripeOffsets.map((offset, i) => (
            <motion.div
              key={`left-${i}`}
              animate={{ x: [offset, offset - 70, offset] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              className="stripe-hover-effect"
                style={{
                  width: "120%",
                  height: "50px",
                  background: "linear-gradient(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%)",
                  scaleX: -1,
                }}
            />
          ))}''',
    text
)

# Replace inner stripe iteration for Hero Right
text = re.sub(
    r'\{stripeOffsets\.map\(\(offset, i\) => \(\s*<div\s*key=\{\`right-\$\{i\}\`\}\s*className="stripe-hover-effect"\s*style=\{\{\s*width: "120%",\s*height: "50px",\s*background: "linear-gradient\(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%\)",\s*transform: `translateX\(\$\{offset\}px\) scaleX\(-1\)`,\s*\}\}\s*\/>\s*\)\)\}',
    r'''{stripeOffsets.map((offset, i) => (
            <motion.div
              key={`right-${i}`}
              animate={{ x: [offset, offset - 70, offset] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
              className="stripe-hover-effect"
                style={{
                  width: "120%",
                  height: "50px",
                  background: "linear-gradient(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%)",
                  scaleX: -1,
                }}
            />
          ))}''',
    text
)

# Replace inner stripe iteration for CTA
text = re.sub(
    r'\{stripeOffsets\.map\(\(offset, i\) => \(\s*<div\s*key=\{\`cta-\$\{i\}\`\}\s*className="w-full shrink-0 stripe-hover-effect"\s*style=\{\{\s*height: "50px",\s*background: "linear-gradient\(to right, #2563EB 0%, #04cfff 30%, #caff3d 45%, transparent 65%\)",\s*transform: `translateX\(\$\{offset\}px\) scaleX\(-1\)`,\s*\}\}\s*\/>\s*\)\)\}',
    r'''{stripeOffsets.map((offset, i) => (
              <motion.div
                key={`cta-${i}`}
                animate={{ x: [offset, offset - 70, offset] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                className="w-full shrink-0 stripe-hover-effect"
                style={{
                  height: "50px",
                  background: "linear-gradient(to right, #2563EB 0%, #04cfff 30%, #caff3d 45%, transparent 65%)",
                  scaleX: -1,
                }}
              />
            ))}''',
    text
)

# Make the parent containers stationary since we do row movement now
text = text.replace('animate={{ x: [0, -15, 0] }}', '')
text = text.replace('animate={{ x: [0, 15, 0] }}', '')
text = text.replace('animate={{ x: [0, -20, 0] }}', '')
text = text.replace('transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}', '')
text = text.replace('transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}', '')

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Motions applied.")
