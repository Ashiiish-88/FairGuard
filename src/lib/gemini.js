/**
 * FairGuard Gemini AI Layer
 * ==========================
 * Server-side only — used in API routes.
 * Uses @google/generative-ai (official JS SDK).
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key") {
      return null; // No API key configured
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return model;
}

function extractJSON(text) {
  // Try to extract JSON from Gemini's response (may be wrapped in ```json blocks)
  let cleaned = text.trim();
  if (cleaned.includes("```json")) {
    cleaned = cleaned.split("```json")[1].split("```")[0].trim();
  } else if (cleaned.includes("```")) {
    cleaned = cleaned.split("```")[1].split("```")[0].trim();
  }
  return JSON.parse(cleaned);
}

// ─── Explain Bias in Plain English ───
export async function explainBias(metrics) {
  const m = getModel();
  if (!m) {
    return {
      summary: "Bias analysis complete — see metrics for details.",
      explanation: "AI explanation unavailable (no API key configured). Review the statistical metrics directly.",
      affected_groups: [],
      legal_references: [],
      urgency: "UNKNOWN",
    };
  }

  const prompt = `You are FairGuard, an AI bias auditing assistant.
Given these bias analysis metrics, write a clear, compassionate, plain-English explanation 
that a non-technical HR manager can understand.

METRICS:
${JSON.stringify(metrics, null, 2)}

RULES:
- Start with a one-sentence summary
- Explain what each finding MEANS for real people
- Use concrete examples (e.g., "a woman with the same qualifications is X times less likely to be hired")
- Reference relevant laws (India DPDP Act 2023, EU AI Act, US EEOC 80% Rule)
- Keep under 200 words
- Be empathetic but professional

Return ONLY valid JSON:
{
  "summary": "one sentence summary",
  "explanation": "detailed plain English explanation",
  "affected_groups": ["list of groups most impacted"],
  "legal_references": ["relevant laws"],
  "urgency": "CRITICAL/HIGH/MODERATE/LOW"
}`;

  try {
    const result = await m.generateContent(prompt);
    return extractJSON(result.response.text());
  } catch (e) {
    return {
      summary: "Bias analysis complete — see metrics for details.",
      explanation: `AI explanation failed: ${e.message}. Please review the statistical metrics.`,
      affected_groups: [],
      legal_references: [],
      urgency: "UNKNOWN",
    };
  }
}

// ─── Legal Compliance Check ───
export async function checkCompliance(metrics) {
  const m = getModel();
  if (!m) {
    return { regulations: [], overall_risk: "UNKNOWN", error: "No API key" };
  }

  const prompt = `You are a legal compliance AI. Check these bias metrics against:
1. India DPDP Act 2023
2. US EEOC 80% Rule
3. EU AI Act 2025
4. India Equal Remuneration Act

METRICS:
${JSON.stringify(metrics, null, 2)}

Return ONLY valid JSON:
{
  "regulations": [
    { "name": "regulation", "status": "COMPLIANT/NON-COMPLIANT/WARNING", "violations": ["list"], "exposure": "penalty range" }
  ],
  "overall_risk": "HIGH/MEDIUM/LOW"
}`;

  try {
    const result = await m.generateContent(prompt);
    return extractJSON(result.response.text());
  } catch (e) {
    return { regulations: [], overall_risk: "UNKNOWN", error: e.message };
  }
}

// ─── Fix Recommendations ───
export async function getRecommendations(metrics) {
  const m = getModel();
  if (!m) {
    return [{ action: "Review and remove proxy features", feature: "detected proxies", expected_fairness_gain: 20, difficulty: "EASY", explanation: "No API key configured." }];
  }

  const prompt = `You are FairGuard. Given these bias analysis results, suggest 3-5 specific, actionable fixes ranked by impact.

RESULTS:
${JSON.stringify(metrics, null, 2)}

Return ONLY valid JSON array:
[
  { "action": "what to do", "feature": "which feature", "expected_fairness_gain": 15, "accuracy_tradeoff": "minimal", "difficulty": "EASY/MEDIUM/HARD", "explanation": "why" }
]`;

  try {
    const result = await m.generateContent(prompt);
    return extractJSON(result.response.text());
  } catch (e) {
    return [{ action: "Review proxy features", feature: "detected proxies", expected_fairness_gain: 20, difficulty: "EASY", explanation: `AI unavailable: ${e.message}` }];
  }
}

// ─── Synthetic Candidate Generation ───
export async function generateSyntheticCandidates(decisionType, count = 100, demographicAxes = ["gender", "age_group"]) {
  const m = getModel();
  if (!m) {
    return generateFallbackCandidates(decisionType, count, demographicAxes);
  }

  const prompt = `Generate ${count} synthetic ${decisionType} applicant profiles as valid JSON array.

REQUIREMENTS:
1. Create groups with IDENTICAL qualifications but VARYING demographics
2. Demographics to vary: ${demographicAxes.join(", ")}
3. Professional attributes MATCHED across groups
4. This is for bias testing

For "${decisionType}", include relevant fields (e.g., education, experience_years, skill_score, qualification_score + demographics).
Create 4 demographic groups with ${Math.floor(count / 4)} candidates each.

Return ONLY a JSON array of objects. No other text.`;

  try {
    const result = await m.generateContent(prompt);
    return extractJSON(result.response.text());
  } catch {
    return generateFallbackCandidates(decisionType, count, demographicAxes);
  }
}

// ─── Fallback Candidate Generator ───
function generateFallbackCandidates(decisionType, count, axes) {
  const genders = ["Male", "Female"];
  const ageGroups = ["18-25", "25-35", "35-45", "45+"];
  const locations = ["Urban", "Rural"];
  const candidates = [];

  for (let i = 0; i < count; i++) {
    const candidate = {
      id: i + 1,
      qualification_score: 60 + Math.floor(Math.random() * 35),
      experience_years: 1 + Math.floor(Math.random() * 20),
      skill_score: Math.round((0.5 + Math.random() * 0.5) * 100) / 100,
    };
    if (axes.includes("gender")) candidate.gender = genders[i % 2];
    if (axes.includes("age_group")) candidate.age_group = ageGroups[i % 4];
    if (axes.includes("location_type")) candidate.location_type = locations[i % 2];
    candidates.push(candidate);
  }
  return candidates;
}

// ─── Biased Model Simulation ───
export function runBiasedModel(candidates) {
  return candidates.map(c => {
    const qual = Number(c.qualification_score || c.skill_score || 70);
    const exp = Number(c.experience_years || c.employment_years || 5);
    const genderNum = (c.gender === "Female" || c.gender === "female" || c.gender === "F") ? 1 : 0;
    const ageNum = c.age_group === "45+" ? 3 : c.age_group === "35-45" ? 2 : c.age_group === "25-35" ? 1 : 0;

    // Deliberately biased scoring
    const biasSignal = qual * 0.5 + exp * 2
      - genderNum * 10        // Women penalized
      - (ageNum === 3 ? 12 : 0) // Older penalized
      - (genderNum * (ageNum === 3 ? 8 : 0)) // Intersectional
      + (Math.random() - 0.5) * 16;

    const decision = biasSignal > 40 ? 1 : 0;
    const confidence = Math.round(Math.min(1, Math.max(0, (biasSignal - 20) / 40)) * 1000) / 1000;

    return {
      ...c,
      decision: decision === 1 ? "Approved" : "Rejected",
      decision_numeric: decision,
      confidence,
    };
  });
}
