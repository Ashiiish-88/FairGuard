import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Fix overflow
text = re.sub(
    r'className="sm:h-\[450px\] h-\[550px\] w-full bg-white flex relative overflow-x-clip"',
    r'className="sm:h-[450px] h-[550px] w-full bg-white flex relative overflow-hidden"',
    text
)

# Fix background shorthand overriding background-size
text = re.sub(
    r'background: "linear-gradient',
    r'backgroundImage: "linear-gradient',
    text
)

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Patched.")
