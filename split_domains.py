import re
with open('src/app/page.js', 'r') as f: content = f.read()
content = re.sub(
    r'  \);\n            \}\)}\n          </div>\n\n        </div>\n      </section>',
    '''  );
            })}
            </div>
          </div>
        </div>
      </section>''', content)
with open('src/app/page.js', 'w') as f: f.write(content)
