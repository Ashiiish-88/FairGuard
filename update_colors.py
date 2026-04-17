import re

with open("src/app/page.js", "r", encoding="utf-8") as f:
    content = f.read()

# Replace final CTAs section buttons
content = content.replace(
    'className="group inline-flex items-stretch rounded-md overflow-hidden transition-all duration-150 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]"',
    'className="inline-flex items-center justify-center font-bold px-6 py-3 transition-all duration-300 bg-[#0057ff] text-[#ffffff] hover:shadow-[0_0_20px_rgba(0,87,255,0.4)] group rounded-md"'
)

# And remove the spans inside the final CTAs that block the background color
content = content.replace(
    '<span className="bg-[#F59E0B] px-3.5 py-3 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors">',
    '<span className="mr-2 text-white">'
)
content = content.replace(
    '<span className="bg-[#0A0A0A] text-white text-[11px] font-bold tracking-[0.12em] uppercase px-5 py-3 flex items-center group-hover:bg-[#1a1a1a] transition-colors">',
    '<span className="text-[12px] tracking-[0.12em] uppercase text-white">'
)

# Stress test CTA spans
content = content.replace(
    '<span className="bg-[#F59E0B] px-4 py-3.5 flex items-center justify-center text-black group-hover:bg-[#D97706] transition-colors">',
    '<span className="mr-2 text-white">'
)
content = content.replace(
    '<span className="bg-[#0A0A0A] text-white text-[12px] font-bold tracking-[0.12em] uppercase px-6 py-3.5 flex items-center group-hover:bg-[#1a1a1a] transition-colors">',
    '<span className="text-[12px] tracking-[0.12em] uppercase text-white">'
)

content = content.replace(
    'className="inline-flex items-center px-6 py-3 border border-[#D1D5DB] rounded-md text-[11px] font-bold tracking-[0.12em] uppercase text-refold-text-dark hover:border-[#9CA3AF] hover:bg-[#F9FAFB] transition-all"',
    'className="inline-flex items-center justify-center px-6 py-3 transition-all duration-300 bg-[#191b20] text-[#f5f3ee] border border-[#eaeaea]/20 hover:bg-[#2e3139] rounded-md font-mono text-[12px] tracking-[0.1em] uppercase"'
)

# Write back
with open("src/app/page.js", "w", encoding="utf-8") as f:
    f.write(content)
