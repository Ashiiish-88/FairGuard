# 🎬 FAIRGUARD — 2-Minute Demo Video Script

> **Duration:** 2:00  
> **Format:** Screen recording with voiceover  
> **Resolution:** 1920×1080  
> **Tone:** Confident, urgent, slightly provocative — like a product keynote, not a classroom lecture

---

## 🎥 SHOT 1: The Hook (0:00 – 0:05)
**[BLACK SCREEN → FairGuard logo fades in]**

**VOICEOVER:**
> "Hundreds of companies are deploying AI that makes decisions about people. Most have no idea if that AI is fair."

---

## 🎥 SHOT 2: Audit Mode — Content Moderation (0:05 – 0:40)
**[Screen: Landing page → Click "Audit Mode"]**

**VOICEOVER:**
> "FairGuard changes that. In under 60 seconds."

**[Click "📱 Content Moderation" demo button]**

> "We load a real-world content moderation dataset — 200 posts, two user demographics, seven content types."

**[System auto-detects columns → Shows detected domain badge "📱 Content Moderation"]**

> "FairGuard auto-detects the domain, identifies protected attributes, and finds the outcome column."

**[Click "Analyze for Bias" → Loading animation → Results appear]**

> "The Fairness Score: 43 out of 100. Grade F. Critical legal risk."

**[Pan down to Bias Fingerprint radar chart]**

> "This is FairGuard's Bias Fingerprint — a unique shape showing exactly WHERE fairness fails. Look at that collapsed Demographic Parity axis."

**[Pan to per-group bar chart]**

> "Minority users are flagged 2.3 times more than majority users — same content, different outcome. This platform is silencing minority voices."

---

## 🎥 SHOT 3: Stress Test — Pricing Bias (0:40 – 1:10)
**[Navigate to "Stress Test" from navbar]**

**VOICEOVER:**
> "But FairGuard doesn't just detect existing bias — it can hunt for hidden bias."

**[Select "Pricing Decision" → Select "gender" + "location_type" → Click "Run Penetration Test"]**

> "We generate 100 synthetic customers with identical qualifications but different demographics. Then we run them through a model."

**[Results appear — bar chart shows approval rates by group]**

> "Same product. Same qualifications. But rural customers pay premium prices 40% more often than urban customers. That's not market dynamics — that's algorithmic discrimination."

---

## 🎥 SHOT 4: Shield Mode — Real-Time Monitoring (1:10 – 1:40)
**[Navigate to "Shield Mode" from navbar]**

**VOICEOVER:**
> "Bias isn't a one-time problem. It drifts. FairGuard monitors it in real-time."

**[Click "Start Monitoring" → Live chart begins streaming]**

> "Watch the fairness score stream in live — every decision tracked, every disparity measured."

**[Chart shows a bias spike → Alert fires in the feed]**

> "There — a bias spike detected. Male approval rate jumped while female approval dropped. Caught in real-time, before it becomes a lawsuit."

**[Point to alert feed showing "CRITICAL: Approval rate gap exceeded 20%"]**

---

## 🎥 SHOT 5: Fairness Debt — The Business Case (1:40 – 2:00)
**[Navigate back to Audit results → Scroll to Fairness Debt card]**

**VOICEOVER:**
> "And here's why your CEO should care."

**[Highlight the Fairness Debt card showing ₹2.5 Cr / €8M / $500K]**

> "FairGuard translates bias into money. ₹2.5 Crore in potential fines under India's DPDP Act. €8 Million under the EU AI Act. This isn't a technical problem — it's a business risk."

**[Zoom out to full results page]**

> "One tool. Any domain. Sixty seconds. FairGuard — because fair AI shouldn't be optional."

**[FairGuard logo + tagline: "Know if your AI is fair."]**

---

## 📝 RECORDING NOTES

### Before Recording
- [ ] Run `npm run dev` and verify all 3 demo datasets work
- [ ] Clear browser history/cache for clean URL bar
- [ ] Set browser zoom to 100%
- [ ] Close all other tabs
- [ ] Disable notifications (Do Not Disturb)

### Screen Flow (exact clicks)
1. `localhost:3000` → Landing page (2 sec pause)
2. Click "Audit Mode" card
3. Click "📱 Content Moderation" demo button
4. Wait for auto-detect → Click "Analyze for Bias"
5. Scroll slowly through results (Score → Fingerprint → Charts → Debt)
6. Click "Stress Test" in navbar
7. Select options → Click "Run Penetration Test"
8. Scroll results
9. Click "Shield Mode" in navbar
10. Click "Start Monitoring" → wait 15 seconds
11. Click "Stop"
12. Navigate back to Audit → scroll to Fairness Debt card
13. Hold 3 seconds → end

### Audio
- Record voiceover separately in a quiet room
- Use a confident, measured pace — not rushed
- Emphasize numbers: "2.3 times", "₹2.5 Crore", "40% more"
- Slight pause before each section transition
