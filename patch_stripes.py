import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Pattern 1 & 2 (hero left and right)
text = re.sub(
    r'className="stripe-hover-effect"\s+style={{\s+width: "120%",\s+height: "50px",\s+background: "linear-gradient\(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%\)",\s+transform: `translateX\(\$\{offset\}px\) scaleX\(-1\)`,\s+}}',
    r'''className={`stripe-hover-effect animate-stripe`}
                style={{
                  width: "120%",
                  height: "50px",
                  background: "linear-gradient(to right, transparent 0%, #2563EB 20%, #04cfff 60%, #caff3d 80%, transparent 100%)",
                  transform: `translateX(${offset}px) scaleX(-1)`,
                }}''',
    text
)

# Pattern 3 (CTA)
text = re.sub(
    r'className="w-full shrink-0 stripe-hover-effect"\s+style={{\s+height: "50px",\s+background: "linear-gradient\(to right, #2563EB 0%, #04cfff 30%, #caff3d 45%, transparent 65%\)",\s+transform: `translateX\(\$\{offset\}px\) scaleX\(-1\)`,\s+}}',
    r'''className={`w-full shrink-0 stripe-hover-effect animate-stripe`}
                style={{
                  height: "50px",
                  background: "linear-gradient(to right, transparent 0%, #2563EB 15%, #04cfff 30%, #caff3d 45%, transparent 65%, transparent 100%)",
                  transform: `translateX(${offset}px) scaleX(-1)`,
                }}''',
    text
)

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Patched.")
