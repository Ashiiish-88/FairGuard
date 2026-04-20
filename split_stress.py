import re
with open('src/app/page.js', 'r') as f: content = f.read()

content = re.sub(
    r'<section className="bg-white w-full border-t border-\[#EAEAEA\]">\s*<div className="max-w-\[1200px\] mx-auto w-full border-l border-r border-\[#EAEAEA\] py-24">\s*<div className="text-center max-w-\[600px\] mx-auto mb-16 px-6">',
    '''<section className="bg-white w-full" id="stress-test">
        <div className="w-full border-t border-[#EAEAEA]">
          <div className="max-w-[1200px] mx-auto w-full border-l border-r border-[#EAEAEA] pt-24 pb-16">
            <div className="text-center max-w-[600px] mx-auto px-6">''',
    content, flags=re.DOTALL
)

content = re.sub(
    r'          </div>\n\n          <div className="w-full border-t border-\[#EAEAEA\]">\n            <div className="grid md:grid-cols-3">',
    '''          </div>
          </div>
        </div>

        <div className="w-full border-t border-[#EAEAEA]">
          <div className="max-w-[1200px] mx-auto w-full border-l border-r border-[#EAEAEA]">
            <div className="grid md:grid-cols-3">''',
    content, flags=re.DOTALL
)

content = re.sub(
    r'            \}\)}\n            </div>\n          </div>\n\n          <div className="text-center mt-10">',
    '''            })}
            </div>
          </div>
        </div>

        <div className="w-full border-t border-[#EAEAEA]">
          <div className="max-w-[1200px] mx-auto w-full border-l border-r border-[#EAEAEA] py-10">
            <div className="text-center">''',
    content, flags=re.DOTALL
)

with open('src/app/page.js', 'w') as f: f.write(content)
