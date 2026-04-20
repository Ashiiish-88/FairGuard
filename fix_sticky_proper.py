import re

with open("src/app/page.js", "r") as f:
    text = f.read()

# Instead of changing it with complex nested <div>, let's achieve the centering gracefully:
text = text.replace(
    '<div className="sticky top-1/2 -translate-y-1/2 h-[500px] relative" id="hiw-sticky-panel">',
    '<div className="sticky top-0 h-screen flex flex-col justify-center relative" id="hiw-sticky-panel"><div className="w-full h-[500px] relative">'
)

# Now we MUST close that internal <div className="w-full h-[500px] relative"> exactly after Panel 2.
# Find the end of Panel 2:
replacement = """
                        <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 bg-[#1C2029] text-[9px] font-semibold tracking-[0.12em] uppercase text-[#64748b]">
                          <span>Name</span><span>Power Adj</span><span>Status</span>
                        </div>
                        {[
                          { name: "Brian", pct: "73%", color: "#ff6b7a" },
                          { name: "Anjali", pct: "31%", color: "#0057ff" },
                          { name: "Kwame", pct: "28%", color: "#0057ff" },
                        ].map((r) => (
                          <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 border-t border-[#252932] items-center text-[11px] text-[#9CA3AF]">
                            <span>{r.name}</span>
                            <span className="font-bold" style={{ color: r.color }}>{r.pct}</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#ff6b7a]/10 text-[#ff6b7a]">Biased</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>"""

original = """
                        <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 bg-[#1C2029] text-[9px] font-semibold tracking-[0.12em] uppercase text-[#64748b]">
                          <span>Name</span><span>Power Adj</span><span>Status</span>
                        </div>
                        {[
                          { name: "Brian", pct: "73%", color: "#ff6b7a" },
                          { name: "Anjali", pct: "31%", color: "#0057ff" },
                          { name: "Kwame", pct: "28%", color: "#0057ff" },
                        ].map((r) => (
                          <div key={r.name} className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2 border-t border-[#252932] items-center text-[11px] text-[#9CA3AF]">
                            <span>{r.name}</span>
                            <span className="font-bold" style={{ color: r.color }}>{r.pct}</span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-[#ff6b7a]/10 text-[#ff6b7a]">Biased</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>"""

text = text.replace(original, replacement)

with open("src/app/page.js", "w") as f:
    f.write(text)

print("Applied proper centering fix.")
