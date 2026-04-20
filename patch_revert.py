import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Revert Hero Left/Right
text = re.sub(
    r'className=\{\`stripe-hover-effect animate-stripe\`\}\s+style=\{\{\s+width: "120%",\s+height: "50px",\s+backgroundImage: "linear-gradient\(to right, transparent 0%, #2563EB 20%, #04cfff 60%, #caff3d 80%, transparent 100%\)",',
    r'''className="stripe-hover-effect"
                style={{
                  width: "120%",
                  height: "50px",
                  background: "linear-gradient(to right, #2563EB 0%, #04cfff 60%, #caff3d 85%, transparent 100%)",''',
    text
)

# Revert CTA
text = re.sub(
    r'className=\{\`w-full shrink-0 stripe-hover-effect animate-stripe\`\}\s+style=\{\{\s+height: "50px",\s+backgroundImage: "linear-gradient\(to right, transparent 0%, #2563EB 15%, #04cfff 30%, #caff3d 45%, transparent 65%, transparent 100%\)",',
    r'''className="w-full shrink-0 stripe-hover-effect"
                style={{
                  height: "50px",
                  background: "linear-gradient(to right, #2563EB 0%, #04cfff 30%, #caff3d 45%, transparent 65%)",''',
    text
)

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Reverted gradients.")
