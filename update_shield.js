const fs = require('fs');
let code = fs.readFileSync('src/app/shield/page.js', 'utf8');

// Add Missing States
const stateReg = /const \[domainInfo, setDomainInfo\] = useState\(null\);/;
const stateRep = \`const [domainInfo, setDomainInfo] = useState(null);
  const [detected, setDetected] = useState(null);
  const [config, setConfig] = useState({ outcome: "", protected: [], positiveOutcome: "1", qualColumn: "" });
  const [step, setStep] = useState(0);\`;
  
code = code.replace(stateReg, stateRep);

// Update processData
const processReg = /const processData = async \\(parsedData\\) => \\{[\\s\\S]*?catch \\(e\\) \\{\\}\\n    \\};/;
const processRep = \`const processData = async (parsedData) => {
      setData(parsedData);
      try {
        const res = await fetch("/api/audit/detect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: parsedData.slice(0, 100) }),
        });
        const det = await res.json();
        setDetected(det.detected);
        if (det.domain) setDomainInfo(det.domain);

        const autoOutcome = det.detected?.decision_columns?.[0]?.column || "";
        const autoProtected = (det.detected?.protected_columns || []).map(c => c.column);
        setConfig(prev => ({
          ...prev,
          outcome: autoOutcome,
          protected: autoProtected,
        }));
        setStep(1);
      } catch (e) {}
    };\`;
code = code.replace(processReg, processRep);

// Update startStream payload
code = code.replace(
  'body: JSON.stringify({ source_data: data, domain: domainInfo?.domain || "hiring" }),',
  'body: JSON.stringify({ source_data: data, domain: domainInfo?.domain || "hiring", config: config }),'
);

// Update UI
const fallbackNotStarted = \`
      {/* Not started state */}
      {!isStreaming && !currentMetrics && (
        <Card className="bg-card/50 border-border/50 py-20">\`;
        
// The current code has the old Not started state and the new upload UI block. Wait, the old Not started state was replaced completely?
// Let's check what UI block exists. I remember I patched it with "1. Select Data Stream"
