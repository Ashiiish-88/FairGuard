/**
 * FairGuard Bias Detection Engine (JavaScript)
 * =============================================
 * Pure JS port of the Python bias engine.
 * No external dependencies — just arrays and math.
 *
 * Metrics:
 *  1. Disparate Impact Ratio
 *  2. Demographic Parity Difference
 *  3. Equalized Odds Approximation
 *  4. Proxy Detection (Cramér's V / Correlation)
 *  5. Intersectional Analysis
 *  + Composite Fairness Score
 *  + What-If Simulator
 *  + Column Auto-Detection
 */

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

function mean(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function unique(arr) {
  return [...new Set(arr)];
}

function countWhere(arr, predicate) {
  return arr.filter(predicate).length;
}

function groupBy(data, key) {
  const groups = {};
  for (const row of data) {
    const val = String(row[key]);
    if (!groups[val]) groups[val] = [];
    groups[val].push(row);
  }
  return groups;
}

// ─────────────────────────────────────────────
//  METRIC 1: Disparate Impact Ratio
// ─────────────────────────────────────────────
export function disparateImpactRatio(data, outcomeCol, groupCol, positiveOutcome = 1) {
  const groups = groupBy(data, groupCol);
  const rates = {};

  for (const [g, rows] of Object.entries(groups)) {
    if (rows.length === 0) continue;
    const positiveCount = rows.filter(r => String(r[outcomeCol]) === String(positiveOutcome)).length;
    rates[g] = positiveCount / rows.length;
  }

  if (Object.keys(rates).length === 0) {
    return { ratio: null, rates: {}, violation: false };
  }

  const maxRate = Math.max(...Object.values(rates));
  const minRate = Math.min(...Object.values(rates));
  const ratio = maxRate > 0 ? minRate / maxRate : 0;

  const majorityGroup = Object.entries(rates).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  const minorityGroup = Object.entries(rates).reduce((a, b) => b[1] < a[1] ? b : a)[0];

  return {
    ratio: Math.round(ratio * 10000) / 10000,
    rates: Object.fromEntries(Object.entries(rates).map(([k, v]) => [k, Math.round(v * 10000) / 10000])),
    majority_group: majorityGroup,
    minority_group: minorityGroup,
    violation: ratio < 0.8,
    severity: ratio < 0.6 ? "CRITICAL" : ratio < 0.8 ? "HIGH" : "OK",
  };
}

// ─────────────────────────────────────────────
//  METRIC 2: Demographic Parity Difference
// ─────────────────────────────────────────────
export function demographicParityDiff(data, outcomeCol, groupCol, positiveOutcome = 1) {
  const groups = groupBy(data, groupCol);
  const rates = {};

  for (const [g, rows] of Object.entries(groups)) {
    if (rows.length === 0) continue;
    const positiveCount = rows.filter(r => String(r[outcomeCol]) === String(positiveOutcome)).length;
    rates[g] = positiveCount / rows.length;
  }

  if (Object.keys(rates).length < 2) {
    return { difference: 0, rates };
  }

  const sorted = Object.entries(rates).sort((a, b) => a[1] - b[1]);
  const diff = sorted[sorted.length - 1][1] - sorted[0][1];

  return {
    difference: Math.round(diff * 10000) / 10000,
    rates: Object.fromEntries(Object.entries(rates).map(([k, v]) => [k, Math.round(v * 10000) / 10000])),
    advantaged_group: sorted[sorted.length - 1][0],
    disadvantaged_group: sorted[0][0],
    severity: diff > 0.3 ? "CRITICAL" : diff > 0.15 ? "HIGH" : diff > 0.05 ? "MODERATE" : "OK",
  };
}

// ─────────────────────────────────────────────
//  METRIC 3: Equalized Odds Approximation
// ─────────────────────────────────────────────
export function equalizedOddsDiff(data, outcomeCol, groupCol, qualCol = null, positiveOutcome = 1) {
  if (qualCol) {
    const qualValues = data.map(r => Number(r[qualCol])).filter(v => !isNaN(v));
    if (qualValues.length === 0) {
      return demographicParityDiff(data, outcomeCol, groupCol, positiveOutcome);
    }
    const medianQual = qualValues.sort((a, b) => a - b)[Math.floor(qualValues.length / 2)];
    const qualifiedData = data.filter(r => Number(r[qualCol]) >= medianQual);

    const groups = groupBy(qualifiedData, groupCol);
    const qualifiedRates = {};

    for (const [g, rows] of Object.entries(groups)) {
      if (rows.length === 0) continue;
      const positiveCount = rows.filter(r => String(r[outcomeCol]) === String(positiveOutcome)).length;
      qualifiedRates[g] = positiveCount / rows.length;
    }

    if (Object.keys(qualifiedRates).length < 2) {
      return { difference: 0, qualified_rates: qualifiedRates };
    }

    const vals = Object.values(qualifiedRates);
    const diff = Math.max(...vals) - Math.min(...vals);

    return {
      difference: Math.round(diff * 10000) / 10000,
      qualified_rates: Object.fromEntries(Object.entries(qualifiedRates).map(([k, v]) => [k, Math.round(v * 10000) / 10000])),
      severity: diff > 0.25 ? "CRITICAL" : diff > 0.15 ? "HIGH" : "OK",
    };
  }

  const result = demographicParityDiff(data, outcomeCol, groupCol, positiveOutcome);
  return {
    difference: result.difference,
    qualified_rates: result.rates,
    severity: result.severity,
    note: "No qualification score provided — using overall rates as proxy",
  };
}

// ─────────────────────────────────────────────
//  METRIC 4: Proxy Detection
// ─────────────────────────────────────────────
export function detectProxies(data, protectedCols, excludeCols = []) {
  const allCols = Object.keys(data[0] || {});
  const candidateCols = allCols.filter(c => !protectedCols.includes(c) && !excludeCols.includes(c));
  const proxies = [];

  for (const protectedCol of protectedCols) {
    for (const candidateCol of candidateCols) {
      try {
        const protectedVals = data.map(r => String(r[protectedCol]));
        const candidateVals = data.map(r => r[candidateCol]);

        // Check if candidate is numeric
        const numericVals = candidateVals.map(Number);
        const isNumeric = numericVals.every(v => !isNaN(v));

        let score = 0;
        let method = "";

        if (isNumeric) {
          // Pearson correlation with encoded protected attribute
          const uniqueProtected = unique(protectedVals);
          const encodedProtected = protectedVals.map(v => uniqueProtected.indexOf(v));
          score = Math.abs(pearsonCorrelation(numericVals, encodedProtected));
          method = "correlation";
        } else {
          // Cramér's V for categorical
          score = cramersV(candidateVals.map(String), protectedVals);
          method = "cramers_v";
        }

        if (isNaN(score)) score = 0;
        score = Math.round(score * 10000) / 10000;

        if (score > 0.3) {
          proxies.push({
            feature: candidateCol,
            protected_attribute: protectedCol,
            score,
            method,
            severity: score > 0.6 ? "CONFIRMED PROXY ⚠️" : "POTENTIAL PROXY",
          });
        }
      } catch {
        continue;
      }
    }
  }

  proxies.sort((a, b) => b.score - a.score);
  return proxies;
}

function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n === 0) return 0;
  const meanX = mean(x);
  const meanY = mean(y);
  let num = 0, denX = 0, denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  const den = Math.sqrt(denX * denY);
  return den === 0 ? 0 : num / den;
}

function cramersV(col1, col2) {
  // Build contingency table
  const u1 = unique(col1);
  const u2 = unique(col2);
  if (u1.length < 2 || u2.length < 2) return 0;

  const table = {};
  for (const v1 of u1) {
    table[v1] = {};
    for (const v2 of u2) table[v1][v2] = 0;
  }
  for (let i = 0; i < col1.length; i++) {
    table[col1[i]][col2[i]]++;
  }

  const n = col1.length;
  const rowTotals = {};
  const colTotals = {};
  for (const v1 of u1) {
    rowTotals[v1] = Object.values(table[v1]).reduce((a, b) => a + b, 0);
  }
  for (const v2 of u2) {
    colTotals[v2] = u1.reduce((sum, v1) => sum + table[v1][v2], 0);
  }

  let chi2 = 0;
  for (const v1 of u1) {
    for (const v2 of u2) {
      const expected = (rowTotals[v1] * colTotals[v2]) / n;
      if (expected > 0) {
        chi2 += Math.pow(table[v1][v2] - expected, 2) / expected;
      }
    }
  }

  const minDim = Math.min(u1.length, u2.length) - 1;
  return minDim > 0 ? Math.sqrt(chi2 / (n * minDim)) : 0;
}

// ─────────────────────────────────────────────
//  METRIC 5: Intersectional Analysis
// ─────────────────────────────────────────────
export function intersectionalAnalysis(data, outcomeCol, protectedCols, positiveOutcome = 1) {
  if (protectedCols.length < 2) {
    return { intersections: [], note: "Need at least 2 protected attributes" };
  }

  const overallRate = data.filter(r => String(r[outcomeCol]) === String(positiveOutcome)).length / data.length;
  const results = [];

  // All 2-way combinations
  for (let i = 0; i < protectedCols.length; i++) {
    for (let j = i + 1; j < protectedCols.length; j++) {
      const colA = protectedCols[i];
      const colB = protectedCols[j];

      const groups = {};
      for (const row of data) {
        const key = `${row[colA]} × ${row[colB]}`;
        if (!groups[key]) groups[key] = { rows: [], attrs: { [colA]: row[colA], [colB]: row[colB] } };
        groups[key].rows.push(row);
      }

      for (const [groupName, { rows, attrs }] of Object.entries(groups)) {
        if (rows.length < 10) continue;
        const rate = rows.filter(r => String(r[outcomeCol]) === String(positiveOutcome)).length / rows.length;
        const gap = overallRate - rate;
        results.push({
          group: groupName,
          attributes: Object.fromEntries(Object.entries(attrs).map(([k, v]) => [k, String(v)])),
          rate: Math.round(rate * 10000) / 10000,
          count: rows.length,
          gap_from_average: Math.round(gap * 10000) / 10000,
          severity: gap > 0.3 ? "CRITICAL" : gap > 0.15 ? "HIGH" : gap > 0.05 ? "MODERATE" : "OK",
        });
      }
    }
  }

  results.sort((a, b) => b.gap_from_average - a.gap_from_average);
  
  return {
    overall_rate: Math.round(overallRate * 10000) / 10000,
    intersections: results.slice(0, 15),
    worst_group: results[0] || null,
  };
}

// ─────────────────────────────────────────────
//  COMPOSITE FAIRNESS SCORE (0-100)
// ─────────────────────────────────────────────
export function computeFairnessScore(disparateImpact, demographicParity, proxies, intersectional) {
  const diRatio = disparateImpact?.ratio ?? 1;
  const diScore = Math.min(100, Math.max(0, diRatio * 100));

  const dpd = demographicParity?.difference ?? 0;
  const dpdScore = Math.max(0, 100 - dpd * 200);

  const confirmedProxies = proxies.filter(p => (p.score || 0) > 0.6).length;
  const potentialProxies = proxies.filter(p => (p.score || 0) > 0.3 && (p.score || 0) <= 0.6).length;
  const proxyScore = Math.max(0, 100 - confirmedProxies * 25 - potentialProxies * 10);

  const worst = intersectional?.worst_group;
  const interScore = worst ? Math.max(0, 100 - Math.abs(worst.gap_from_average || 0) * 200) : 100;

  const composite = Math.round((diScore * 0.3 + dpdScore * 0.25 + proxyScore * 0.25 + interScore * 0.2) * 10) / 10;

  let grade, label;
  if (composite >= 90) { grade = "A"; label = "FAIR ✅"; }
  else if (composite >= 70) { grade = "B"; label = "MINOR ISSUES ⚠️"; }
  else if (composite >= 50) { grade = "C"; label = "SIGNIFICANT BIAS 🔴"; }
  else { grade = "F"; label = "CRITICAL — LEGAL RISK 🚨"; }

  return {
    score: composite,
    grade,
    label,
    breakdown: {
      disparate_impact_score: Math.round(diScore * 10) / 10,
      demographic_parity_score: Math.round(dpdScore * 10) / 10,
      proxy_score: Math.round(proxyScore * 10) / 10,
      intersectional_score: Math.round(interScore * 10) / 10,
    },
  };
}

// ─────────────────────────────────────────────
//  COLUMN AUTO-DETECTION
// ─────────────────────────────────────────────
export function autoDetectColumns(data) {
  if (!data || data.length === 0) return { decision_columns: [], protected_columns: [], proxy_candidates: [], feature_columns: [] };

  const columns = Object.keys(data[0]);
  const decisionKw = ["decision", "outcome", "result", "approved", "rejected", "hired", "selected", "accepted", "denied", "granted", "label", "target", "class", "y", "default", "loan_status", "income"];
  const protectedKw = ["gender", "sex", "race", "ethnicity", "age", "religion", "disability", "marital", "nationality", "color", "caste"];
  const proxyKw = ["zip", "zipcode", "zip_code", "postal", "county", "neighborhood", "school", "college", "university", "name"];

  const detected = { decision_columns: [], protected_columns: [], proxy_candidates: [], feature_columns: [] };

  for (const col of columns) {
    const colLower = col.toLowerCase().replace(/\s+/g, "_");
    const sampleVals = unique(data.slice(0, 100).map(r => r[col])).slice(0, 10);
    const isBinary = sampleVals.length <= 5;
    const isDecision = decisionKw.some(kw => colLower.includes(kw));

    if (isBinary && isDecision) {
      detected.decision_columns.push({ column: col, unique_values: sampleVals.map(String), confidence: "HIGH" });
    } else if (protectedKw.some(kw => colLower.includes(kw))) {
      detected.protected_columns.push({ column: col, unique_values: sampleVals.map(String), confidence: "HIGH" });
    } else if (proxyKw.some(kw => colLower.includes(kw))) {
      detected.proxy_candidates.push({ column: col, unique_values: sampleVals.slice(0, 5).map(String), confidence: "MEDIUM" });
    } else {
      detected.feature_columns.push({ column: col, unique_count: unique(data.map(r => r[col])).length });
    }
  }

  return detected;
}

// ─────────────────────────────────────────────
//  FULL ANALYSIS PIPELINE
// ─────────────────────────────────────────────
export function runFullAnalysis(data, outcomeCol, protectedCols, positiveOutcome = 1, qualCol = null) {
  const results = {
    dataset_info: {
      total_rows: data.length,
      total_columns: Object.keys(data[0] || {}).length,
      columns: Object.keys(data[0] || {}),
    },
    per_attribute: {},
  };

  let worstDI = { ratio: 1 };
  let worstDPD = { difference: 0 };

  for (const protected_col of protectedCols) {
    const di = disparateImpactRatio(data, outcomeCol, protected_col, positiveOutcome);
    const dpd = demographicParityDiff(data, outcomeCol, protected_col, positiveOutcome);
    const eo = equalizedOddsDiff(data, outcomeCol, protected_col, qualCol, positiveOutcome);

    const groupCounts = {};
    const groups = groupBy(data, protected_col);
    for (const [g, rows] of Object.entries(groups)) groupCounts[g] = rows.length;

    results.per_attribute[protected_col] = {
      disparate_impact: di,
      demographic_parity: dpd,
      equalized_odds: eo,
      group_counts: groupCounts,
    };

    if ((di.ratio ?? 1) < (worstDI.ratio ?? 1)) worstDI = di;
    if ((dpd.difference ?? 0) > (worstDPD.difference ?? 0)) worstDPD = dpd;
  }

  const exclude = [outcomeCol, ...protectedCols];
  const proxies = detectProxies(data, protectedCols, exclude);
  results.proxies = proxies;

  const intersectional = intersectionalAnalysis(data, outcomeCol, protectedCols, positiveOutcome);
  results.intersectional = intersectional;

  results.fairness_score = computeFairnessScore(worstDI, worstDPD, proxies, intersectional);

  return results;
}
