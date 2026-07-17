// api/simulate.js — Vercel Serverless Function (Google Gemini)
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { proposal } = req.body || {};
  if (!proposal || proposal.trim().length < 10) {
    return res.status(400).json({ error: "Proposal too short" });
  }

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const systemPrompt = `You are a Stakeholder Simulator. Given a product proposal or decision, you predict how five corporate stakeholders will react.

You MUST respond with ONLY valid JSON — no markdown, no backticks, no explanation. The JSON must follow this exact structure:

{
  "predict": [
    { "role": "Engineering", "level": "high|medium|low|positive", "label": "High concern|Medium concern|Low concern|Positive" },
    { "role": "Legal", "level": "...", "label": "..." },
    { "role": "Sales", "level": "...", "label": "..." },
    { "role": "Security", "level": "...", "label": "..." },
    { "role": "Executive", "level": "...", "label": "..." }
  ],
  "diagnose": [
    { "who": "Engineering", "what": "The specific objection in their voice — 2-4 sentences, realistic, with concrete concerns (not vague). Write as if you ARE that stakeholder pushing back in a meeting." },
    { "who": "Security", "what": "..." },
    { "who": "Legal", "what": "..." },
    { "who": "Executive", "what": "..." },
    { "who": "Sales", "what": "..." }
  ],
  "reframe": [
    { "target": "Engineering", "msg": "A concrete reframe or mitigation — what to propose, how to position it. Be specific (name a phased rollout, a focused audit, a design-partner program — not 'address their concerns'). Use <em>italic</em> for the key tactic." },
    { "target": "Security", "msg": "..." },
    { "target": "Legal", "msg": "..." },
    { "target": "Executive", "msg": "..." }
  ],
  "sequence": [
    { "n": "1", "who": "StakeholderName", "why": "Why talk to them FIRST — what does their buy-in unlock for the next conversation? 2-3 sentences." },
    { "n": "2", "who": "...", "why": "..." },
    { "n": "3", "who": "...", "why": "..." },
    { "n": "4", "who": "...", "why": "..." }
  ]
}

Rules:
- diagnose: include only 4 stakeholders (skip the one who is most positive — they don't need diagnosis). Order by concern level, highest first.
- reframe: include only the stakeholders who had concerns (skip the positive one).
- sequence: order ALL 5 stakeholders by the optimal alignment order. The one whose buy-in de-risks the most conversations goes first.
- Be specific to the proposal. Reference details from the input. Never be generic.
- level values must be exactly: "high", "medium", "low", or "positive"`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent?key=${GEMINI_KEY}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: [
          { role: "user", parts: [{ text: proposal }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2500,
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(502).json({ error: "Gemini error", detail: err });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: "Failed", detail: err.message });
  }
}
