import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Fix the start of the sticky wrapper
text = re.sub(
    r'<div className="sticky top-0 h-screen flex flex-col justify-center relative" id="hiw-sticky-panel">\s*<div className="w-full h-\[500px\] relative">\s*\{\/\* ── Panel 0: Upload — Lime→Cyan gradient \+ upload mockup ── \*\/\}',
    r'''<div className="sticky top-1/2 -translate-y-1/2 h-[500px] relative" id="hiw-sticky-panel">
                {/* ── Panel 0: Upload — Lime→Cyan gradient + upload mockup ── */}''',
    text
)

# Remove the extra closing </div> that I added at the end (the extra div wrapped around Panel 0)
text = text.replace('''
                  </div>
                </div>
                </div>
              </div>
            </div>

          </div>
        </div>''', '''
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>''')

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Restored original hiw-sticky-panel structure.")
