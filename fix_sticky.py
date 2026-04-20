import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Change sticky top margin to be dynamically centered based on viewport height
text = re.sub(
    r'<div className="sticky top-\[80px\] h-\[500px\] relative" id="hiw-sticky-panel">',
    r'<div className="sticky top-1/2 -translate-y-1/2 h-[500px] relative" id="hiw-sticky-panel">',
    text
)

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Fixed sticky positioning to center.")
