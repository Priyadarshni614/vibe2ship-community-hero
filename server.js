import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Firestore } from "@google-cloud/firestore";
import path from "path";
import { fileURLToPath } from "url";

// Community Hero - Hyperlocal Problem Solver
// Node.js + Express + Gemini API + optional Firestore storage.

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || "";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

app.use(cors());
app.use(express.json({ limit: "12mb" }));
app.use(express.static(publicDir));

let reports = [];
let firestore = null;
const collectionName = "communityHeroReports";

try {
  if (GOOGLE_CLOUD_PROJECT) {
    firestore = new Firestore({ projectId: GOOGLE_CLOUD_PROJECT });
    console.log(`Firestore enabled for project: ${GOOGLE_CLOUD_PROJECT}`);
  } else {
    console.log("Firestore not configured. Using in-memory demo storage.");
  }
} catch (error) {
  console.warn("Firestore initialization failed. Falling back to memory:", error.message);
  firestore = null;
}

function nowIso() {
  return new Date().toISOString();
}

function safeId() {
  return `CH-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function normalizeReport(doc) {
  return {
    id: doc.id || safeId(),
    title: doc.title || "Untitled Issue",
    description: doc.description || "",
    locationName: doc.locationName || "Unknown location",
    lat: doc.lat || null,
    lng: doc.lng || null,
    mediaType: doc.mediaType || "none",
    imageData: doc.imageData || "",
    category: doc.category || "Public Infrastructure",
    severity: doc.severity || "Medium",
    priorityScore: Number(doc.priorityScore || 50),
    department: doc.department || "Local civic team",
    summary: doc.summary || "Issue submitted by citizen.",
    suggestedAction: doc.suggestedAction || "Review and assign to the responsible team.",
    citizenMessage: doc.citizenMessage || "Thank you. Your report has been recorded.",
    reporterName: doc.reporterName || "Anonymous Citizen",
    reporterEmail: doc.reporterEmail || "",
    status: doc.status || "Reported",
    verifiedCount: Number(doc.verifiedCount || 0),
    supportCount: Number(doc.supportCount || 0),
    thoughts: Array.isArray(doc.thoughts) ? doc.thoughts : [],
    verificationSummary: doc.verificationSummary || null,
    feedback: Array.isArray(doc.feedback) ? doc.feedback : [],
    createdAt: doc.createdAt || nowIso(),
    updatedAt: doc.updatedAt || nowIso()
  };
}

async function listReports() {
  if (!firestore) return reports.sort((a, b) => b.priorityScore - a.priorityScore);

  const snapshot = await firestore.collection(collectionName).orderBy("createdAt", "desc").limit(100).get();
  return snapshot.docs.map((doc) => normalizeReport({ id: doc.id, ...doc.data() }));
}

async function saveReport(report) {
  const normalized = normalizeReport(report);
  if (!firestore) {
    reports.unshift(normalized);
    return normalized;
  }

  await firestore.collection(collectionName).doc(normalized.id).set(normalized, { merge: true });
  return normalized;
}

async function getReportById(id) {
  const all = await listReports();
  return all.find((item) => item.id === id) || null;
}

async function updateReport(id, patch) {
  if (!firestore) {
    reports = reports.map((report) =>
      report.id === id ? normalizeReport({ ...report, ...patch, updatedAt: nowIso() }) : report
    );
    return reports.find((report) => report.id === id) || null;
  }

  const ref = firestore.collection(collectionName).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  await ref.set({ ...patch, updatedAt: nowIso() }, { merge: true });
  const updated = await ref.get();
  return normalizeReport({ id: updated.id, ...updated.data() });
}

function keywordFallback({ title = "", description = "" }) {
  const text = `${title} ${description}`.toLowerCase();
  const rules = [
    { match: ["pothole", "road", "street", "accident"], category: "Road Damage", department: "Roads and Highways", severity: "High", score: 82 },
    { match: ["water", "leak", "pipe", "drainage", "flood"], category: "Water Leakage", department: "Water Supply Board", severity: "High", score: 85 },
    { match: ["light", "streetlight", "lamp", "dark"], category: "Streetlight Issue", department: "Electricity / Streetlight Team", severity: "Medium", score: 62 },
    { match: ["garbage", "waste", "trash", "dump", "smell"], category: "Waste Management", department: "Sanitation Department", severity: "Medium", score: 67 },
    { match: ["tree", "fallen", "branch"], category: "Tree / Public Safety", department: "Parks and Safety Team", severity: "High", score: 78 }
  ];

  const found = rules.find((rule) => rule.match.some((word) => text.includes(word)));
  return {
    category: found?.category || "Public Infrastructure",
    severity: found?.severity || "Medium",
    priorityScore: found?.score || 50,
    department: found?.department || "Local civic team",
    summary: "AI fallback analysis based on the citizen description.",
    suggestedAction: "Inspect the location, verify with nearby citizens, and assign the issue to the responsible department.",
    duplicateHint: "Check nearby reports with the same category before assigning.",
    citizenMessage: "Your report has been recorded and categorized for review."
  };
}

function stripDataUrl(dataUrl = "") {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function requestedLanguageName(language = "English") {
  const clean = String(language || "English")
    .trim()
    .slice(0, 60)
    .replace(/[^\p{L}\p{N}\s\-()]/gu, "");
  return clean || "English";
}

function userFacingLanguageInstruction(language = "English", keepSystemEnums = true) {
  const outputLanguage = requestedLanguageName(language);
  if (outputLanguage === "English") {
    return keepSystemEnums
      ? "Use English for citizen-facing text. Keep category, severity, and status enum values in English."
      : "Write the user-facing response in English.";
  }
  return keepSystemEnums
    ? `Write citizen-facing text such as title, description, summary, suggestedAction, citizenMessage, recommendation, awarenessMessage, evidenceSummary, officialNote, and callToAction in ${outputLanguage}. Keep system enum fields such as category, severity, status, validationStatus, sentiment, and boolean/number values in English exactly as requested by the schema.`
    : `Write all user-facing string fields in ${outputLanguage}. Keep JSON keys, numbers, booleans, and required enum labels exactly as requested by the schema.`;
}

async function translateUiLabelsWithGemini(labels = {}, language = "English") {
  const outputLanguage = requestedLanguageName(language);
  if (!GEMINI_API_KEY || outputLanguage === "English") return labels;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `You are translating UI text for a civic reporting web app called Community Hero.
Translate every value in the JSON object into ${outputLanguage}.
Keep every JSON key exactly the same.
Keep emojis, numbers, and placeholders such as {visible}, {total}, and {action} exactly as they are.
Keep the product name "Community Hero" unchanged unless a natural transliteration is needed.
Use short, simple citizen-friendly wording.
Return ONLY a valid JSON object. Do not include markdown.

JSON to translate:
${JSON.stringify(labels)}`
        }]
      }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn("Gemini UI translation failed:", response.status, errorText.slice(0, 300));
    return labels;
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("Could not parse UI translation:", error.message);
    return labels;
  }
}

app.post("/api/translate-ui", async (req, res) => {
  try {
    const { labels, language } = req.body;
    if (!labels || typeof labels !== "object") {
      return res.status(400).json({ error: "labels object is required" });
    }
    const translated = await translateUiLabelsWithGemini(labels, language);
    res.json({ labels: translated });
  } catch (error) {
    console.error("UI translation route failed:", error);
    res.status(500).send("UI translation failed");
  }
});

async function analyzeWithGemini({ title, description, locationName, imageData, language = "English" }) {
  if (!GEMINI_API_KEY) return keywordFallback({ title, description });

  const image = stripDataUrl(imageData);
  const parts = [
    {
      text: `You are an AI civic issue triage assistant for a hyperlocal problem-solving platform called Community Hero.
Return ONLY valid JSON. Do not include markdown.
${userFacingLanguageInstruction(language)}

Citizen issue:
Title: ${title}
Description: ${description}
Location: ${locationName || "Unknown"}

Analyze the issue for a city/community authority dashboard. Use this JSON schema exactly:
{
  "category": "Road Damage | Water Leakage | Streetlight Issue | Waste Management | Public Safety | Public Infrastructure | Other",
  "severity": "Low | Medium | High | Critical",
  "priorityScore": number from 1 to 100,
  "department": "responsible local department name",
  "summary": "one sentence summary",
  "suggestedAction": "clear next action for officials",
  "duplicateHint": "what nearby duplicate reports may look like",
  "citizenMessage": "friendly confirmation message for the citizen"
}`
    }
  ];

  if (image?.mimeType?.startsWith("image/")) {
    parts.push({ inline_data: { mime_type: image.mimeType, data: image.data } });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn("Gemini API failed:", response.status, errorText.slice(0, 300));
    return keywordFallback({ title, description });
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  try {
    const parsed = JSON.parse(text);
    return {
      category: parsed.category || "Public Infrastructure",
      severity: parsed.severity || "Medium",
      priorityScore: Number(parsed.priorityScore || 50),
      department: parsed.department || "Local civic team",
      summary: parsed.summary || "Issue analyzed by AI.",
      suggestedAction: parsed.suggestedAction || "Verify and assign to responsible team.",
      duplicateHint: parsed.duplicateHint || "Check nearby similar reports.",
      citizenMessage: parsed.citizenMessage || "Your report has been analyzed and submitted."
    };
  } catch (error) {
    console.warn("Could not parse Gemini JSON:", text.slice(0, 300));
    return keywordFallback({ title, description });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    app: "Community Hero",
    ai: GEMINI_API_KEY ? "Gemini enabled" : "Fallback mode: add GEMINI_API_KEY",
    storage: firestore ? "Firestore" : "In-memory demo"
  });
});

app.get("/api/reports", async (_req, res) => {
  try {
    res.json(await listReports());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function autofillWithGemini({ title = "", description = "", locationName = "", imageData = "", language = "English" }) {
  const fallbackAnalysis = keywordFallback({ title, description });

  if (!GEMINI_API_KEY) {
    return {
      title: title || `${fallbackAnalysis.category} reported in community area`,
      description: description || "A civic issue appears to be present. Please edit this description with exact details before submitting.",
      ...fallbackAnalysis
    };
  }

  const image = stripDataUrl(imageData);
  const parts = [
    {
      text: `You are an AI assistant that auto-fills a citizen civic issue report form for Community Hero.
Return ONLY valid JSON. Do not include markdown.
${userFacingLanguageInstruction(language)}

Existing user input, if any:
Title: ${title || "empty"}
Description: ${description || "empty"}
Location name: ${locationName || "empty"}

Task:
1. If an image is provided, inspect it carefully.
2. Auto-generate only a short issue title and a clear citizen-friendly description.
3. Also classify the issue for the authority dashboard.
4. Do NOT generate, guess, or auto-fill the location. The citizen must provide location by GPS or manual typing.
5. Keep the description editable and practical.

Use this JSON schema exactly:
{
  "title": "short issue title suitable for the form",
  "description": "2 to 3 sentence citizen report description",
  "category": "Road Damage | Water Leakage | Streetlight Issue | Waste Management | Public Safety | Public Infrastructure | Other",
  "severity": "Low | Medium | High | Critical",
  "priorityScore": number from 1 to 100,
  "department": "responsible local department name",
  "summary": "one sentence summary",
  "suggestedAction": "clear next action for officials",
  "duplicateHint": "what nearby duplicate reports may look like",
  "citizenMessage": "friendly confirmation message for the citizen"
}`
    }
  ];

  if (image?.mimeType?.startsWith("image/")) {
    parts.push({ inline_data: { mime_type: image.mimeType, data: image.data } });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.25,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn("Gemini autofill failed:", response.status, errorText.slice(0, 300));
    return {
      title: title || `${fallbackAnalysis.category} reported in community area`,
      description: description || "A civic issue appears to be present. Please edit this description with exact details before submitting.",
      ...fallbackAnalysis
    };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  try {
    const parsed = JSON.parse(text);
    return {
      title: parsed.title || title || "Community issue reported",
      description: parsed.description || description || "A civic issue has been identified and needs review.",
      category: parsed.category || fallbackAnalysis.category,
      severity: parsed.severity || fallbackAnalysis.severity,
      priorityScore: Number(parsed.priorityScore || fallbackAnalysis.priorityScore),
      department: parsed.department || fallbackAnalysis.department,
      summary: parsed.summary || fallbackAnalysis.summary,
      suggestedAction: parsed.suggestedAction || fallbackAnalysis.suggestedAction,
      duplicateHint: parsed.duplicateHint || fallbackAnalysis.duplicateHint,
      citizenMessage: parsed.citizenMessage || fallbackAnalysis.citizenMessage
    };
  } catch (error) {
    console.warn("Could not parse Gemini autofill JSON:", text.slice(0, 300));
    return {
      title: title || `${fallbackAnalysis.category} reported in community area`,
      description: description || "A civic issue appears to be present. Please edit this description with exact details before submitting.",
      ...fallbackAnalysis
    };
  }
}

app.post("/api/analyze", async (req, res) => {
  try {
    const { title, description, locationName, imageData, language } = req.body;
    if (!title && !description && !imageData) {
      return res.status(400).json({ error: "Please provide title, description, or image." });
    }
    const analysis = await analyzeWithGemini({ title, description, locationName, imageData, language });
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


app.post("/api/autofill", async (req, res) => {
  try {
    const { title, description, locationName, imageData, language } = req.body;
    if (!title && !description && !imageData) {
      return res.status(400).json({ error: "Please upload an image or add at least one detail before auto-fill." });
    }
    const filled = await autofillWithGemini({ title, description, locationName, imageData, language });
    res.json(filled);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

function fallbackEnhancedFeedback(feedbackText = "", rating = "") {
  const clean = String(feedbackText).trim();
  if (!clean) return "The citizen feedback is empty. Please ask the citizen to add more details.";
  return `Rating: ${rating || "Not specified"}/5. Citizen feedback: ${clean}. This feedback has been recorded for resolution quality review.`;
}

async function enhanceFeedbackWithGemini({ feedbackText = "", rating = "", report = null, language = "English" }) {
  if (!GEMINI_API_KEY) {
    return {
      enhancedFeedback: fallbackEnhancedFeedback(feedbackText, rating),
      sentiment: "Neutral",
      followUpNeeded: false,
      officialNote: "Fallback enhancement was used because Gemini API key is not configured."
    };
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI assistant for Community Hero.
A citizen is giving feedback after a civic issue was marked resolved.
Improve the feedback without changing its meaning.
Make it clear, polite, specific, and useful for local officials.
${userFacingLanguageInstruction(language)}
Do not invent facts. Do not add location if it is not present.
Return ONLY valid JSON. No markdown.

Issue title: ${report?.title || "Unknown"}
Issue category: ${report?.category || "Unknown"}
Issue location: ${report?.locationName || "Unknown"}
Citizen rating: ${rating || "Not specified"}/5
Original feedback: ${feedbackText}

Use this JSON schema exactly:
{
  "enhancedFeedback": "improved citizen feedback in 2 to 4 sentences",
  "sentiment": "Positive | Neutral | Negative | Mixed",
  "followUpNeeded": true or false,
  "officialNote": "one short note for officials"
}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.25,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn("Gemini feedback enhancement failed:", response.status, errorText.slice(0, 300));
    return {
      enhancedFeedback: fallbackEnhancedFeedback(feedbackText, rating),
      sentiment: "Neutral",
      followUpNeeded: false,
      officialNote: "Fallback enhancement was used because Gemini was unavailable."
    };
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  try {
    const parsed = JSON.parse(text);
    return {
      enhancedFeedback: parsed.enhancedFeedback || fallbackEnhancedFeedback(feedbackText, rating),
      sentiment: parsed.sentiment || "Neutral",
      followUpNeeded: Boolean(parsed.followUpNeeded),
      officialNote: parsed.officialNote || "Review feedback for resolution quality."
    };
  } catch (error) {
    console.warn("Could not parse Gemini feedback JSON:", text.slice(0, 300));
    return {
      enhancedFeedback: fallbackEnhancedFeedback(feedbackText, rating),
      sentiment: "Neutral",
      followUpNeeded: false,
      officialNote: "Fallback enhancement was used because the AI response could not be parsed."
    };
  }
}

app.post("/api/feedback/enhance", async (req, res) => {
  try {
    const { reportId, feedbackText, rating, language } = req.body;
    if (!feedbackText || !String(feedbackText).trim()) {
      return res.status(400).json({ error: "Please type feedback before enhancing it." });
    }

    const report = reportId ? await getReportById(reportId) : null;
    const enhanced = await enhanceFeedbackWithGemini({ feedbackText, rating, report, language });
    res.json(enhanced);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


function compactReport(report) {
  return {
    id: report.id,
    title: report.title,
    description: report.description,
    locationName: report.locationName,
    category: report.category,
    severity: report.severity,
    priorityScore: report.priorityScore,
    department: report.department,
    status: report.status,
    verifiedCount: report.verifiedCount || 0,
    supportCount: report.supportCount || 0,
    thoughtCount: Array.isArray(report.thoughts) ? report.thoughts.length : 0,
    recentThoughts: Array.isArray(report.thoughts) ? report.thoughts.slice(-3).map((item) => item.thought) : []
  };
}

function wordSet(text = "") {
  return new Set(String(text).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((word) => word.length > 2));
}

function jaccardSimilarity(a = "", b = "") {
  const setA = wordSet(a);
  const setB = wordSet(b);
  if (!setA.size || !setB.size) return 0;
  let intersection = 0;
  for (const word of setA) if (setB.has(word)) intersection += 1;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

function fallbackDuplicateCheck(newReport, existingReports = []) {
  const newText = `${newReport.title || ""} ${newReport.description || ""} ${newReport.locationName || ""} ${newReport.category || ""}`;
  const scored = existingReports.map((report) => {
    const existingText = `${report.title || ""} ${report.description || ""} ${report.locationName || ""} ${report.category || ""}`;
    const categoryBoost = report.category && newReport.category && report.category === newReport.category ? 0.2 : 0;
    const locationBoost = report.locationName && newReport.locationName && String(newReport.locationName).toLowerCase().includes(String(report.locationName).toLowerCase().slice(0, 8)) ? 0.15 : 0;
    return { report, score: Math.min(1, jaccardSimilarity(newText, existingText) + categoryBoost + locationBoost) };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const likely = Boolean(best && best.score >= 0.42);
  return {
    likelyDuplicate: likely,
    similarity: best ? Math.round(best.score * 100) : 0,
    matchedReportId: best?.report?.id || null,
    matchedTitle: best?.report?.title || "",
    reason: likely ? "A similar category, description, or nearby location already exists." : "No strong duplicate found in the current issue list.",
    recommendation: likely ? "Ask the citizen to support or verify the existing report instead of creating another duplicate, unless this is a different location." : "Create this as a new report.",
    mode: "fallback"
  };
}

async function checkDuplicateWithGemini(newReport, existingReports = []) {
  const fallback = fallbackDuplicateCheck(newReport, existingReports);
  if (!GEMINI_API_KEY || !existingReports.length) return fallback;

  const candidates = existingReports.slice(0, 20).map(compactReport);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `You are the duplicate detection AI for Community Hero.
Compare a new civic report with existing reports. Do not mark as duplicate only because the category is same; location and issue details should also be similar.
Return ONLY valid JSON. No markdown.
${userFacingLanguageInstruction(newReport.language || "English")}

New report:
${JSON.stringify(compactReport(normalizeReport(newReport)), null, 2)}

Existing reports:
${JSON.stringify(candidates, null, 2)}

Use this JSON schema exactly:
{
  "likelyDuplicate": true or false,
  "similarity": number from 0 to 100,
  "matchedReportId": "id of the closest report or empty string",
  "matchedTitle": "title of closest report or empty string",
  "reason": "short reason",
  "recommendation": "what the citizen should do next"
}`
        }]
      }],
      generationConfig: { temperature: 0.15, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    console.warn("Gemini duplicate check failed:", response.status, (await response.text()).slice(0, 300));
    return fallback;
  }

  try {
    const data = await response.json();
    const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return {
      likelyDuplicate: Boolean(parsed.likelyDuplicate),
      similarity: Number(parsed.similarity || fallback.similarity),
      matchedReportId: parsed.matchedReportId || fallback.matchedReportId,
      matchedTitle: parsed.matchedTitle || fallback.matchedTitle,
      reason: parsed.reason || fallback.reason,
      recommendation: parsed.recommendation || fallback.recommendation,
      mode: "gemini"
    };
  } catch (error) {
    console.warn("Could not parse Gemini duplicate JSON:", error.message);
    return fallback;
  }
}

function fallbackDashboardInsights(allReports = []) {
  if (!allReports.length) {
    return {
      headline: "No reports yet",
      mostDiscussedIssue: "No community discussion yet.",
      highRiskArea: "Add reports with locations to identify risk areas.",
      trendSummary: "The dashboard will show trends after citizens start reporting.",
      recommendedAction: "Encourage citizens to submit photo-based reports with exact location.",
      awarenessMessage: "Be a Community Hero: report civic issues with clear photos and location.",
      topIssueId: null
    };
  }

  const top = [...allReports].sort((a, b) =>
    ((b.supportCount || 0) * 5 + (b.thoughts?.length || 0) * 4 + (b.verifiedCount || 0) * 3 + (b.priorityScore || 0)) -
    ((a.supportCount || 0) * 5 + (a.thoughts?.length || 0) * 4 + (a.verifiedCount || 0) * 3 + (a.priorityScore || 0))
  )[0];

  const categoryCounts = allReports.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Public Infrastructure";

  return {
    headline: `Community focus: ${topCategory}`,
    mostDiscussedIssue: top ? `${top.title} has ${top.supportCount || 0} supports and ${top.thoughts?.length || 0} citizen thoughts.` : "No discussion yet.",
    highRiskArea: top?.locationName || "Location trends are not available yet.",
    trendSummary: `${topCategory} is currently the most frequent issue category in the report list.`,
    recommendedAction: top ? `Review “${top.title}” first because it has priority score ${top.priorityScore}/100 and current community activity data.` : "Prioritize high severity reports first.",
    awarenessMessage: top ? `Community attention: “${top.title}” needs responsible verification. Nearby residents should support or comment only if they have directly observed the issue, and avoid creating duplicate reports.` : "Ask citizens to support existing reports to improve transparency.",
    topIssueId: top?.id || null
  };
}

async function generateDashboardInsights(allReports = [], language = "English") {
  const fallback = fallbackDashboardInsights(allReports);
  if (!GEMINI_API_KEY || !allReports.length) return fallback;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `You are a civic intelligence assistant for Community Hero.
Analyze community issue reports, likes/support, comments/thoughts, priority scores, status, and feedback.
Find the most liked/commented issue and produce awareness guidance for citizens and action guidance for officials.
Return ONLY valid JSON. No markdown.
${userFacingLanguageInstruction(language, false)}

Reports:
${JSON.stringify(allReports.slice(0, 40).map(compactReport), null, 2)}

Use this JSON schema exactly:
{
  "headline": "short dashboard headline",
  "mostDiscussedIssue": "issue receiving highest citizen attention",
  "highRiskArea": "location or area needing attention",
  "trendSummary": "2 sentence trend summary",
  "recommendedAction": "clear recommendation for officials",
  "awarenessMessage": "message to increase citizen awareness and responsible participation",
  "topIssueId": "id of most important/highly supported issue"
}`
        }]
      }],
      generationConfig: { temperature: 0.25, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    console.warn("Gemini dashboard insight failed:", response.status, (await response.text()).slice(0, 300));
    return fallback;
  }

  try {
    const data = await response.json();
    const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return {
      headline: parsed.headline || fallback.headline,
      mostDiscussedIssue: parsed.mostDiscussedIssue || fallback.mostDiscussedIssue,
      highRiskArea: parsed.highRiskArea || fallback.highRiskArea,
      trendSummary: parsed.trendSummary || fallback.trendSummary,
      recommendedAction: parsed.recommendedAction || fallback.recommendedAction,
      awarenessMessage: parsed.awarenessMessage || fallback.awarenessMessage,
      topIssueId: parsed.topIssueId || fallback.topIssueId
    };
  } catch (error) {
    console.warn("Could not parse Gemini dashboard insight JSON:", error.message);
    return fallback;
  }
}

function issueImportanceScore(report) {
  const severity = String(report.severity || "").toLowerCase();
  const severityBoost = severity === "critical" ? 35 : severity === "high" ? 25 : severity === "medium" ? 12 : 5;
  const unresolvedBoost = report.status === "Resolved" ? -20 : 10;
  return Math.round(
    Number(report.priorityScore || 0) +
    severityBoost +
    Number(report.supportCount || 0) * 5 +
    (Array.isArray(report.thoughts) ? report.thoughts.length : 0) * 4 +
    Number(report.verifiedCount || 0) * 3 +
    unresolvedBoost
  );
}

function simpleLocationKey(locationName = "") {
  const cleaned = String(locationName).toLowerCase().replace(/gps:\s*/g, "").replace(/[^a-z0-9\s]/g, " ").trim();
  const words = cleaned.split(/\s+/).filter((word) => word.length > 2);
  return words.slice(0, 3).join(" ") || "unknown area";
}

function fallbackIssueGroups(allReports = []) {
  const buckets = new Map();
  for (const report of allReports) {
    const key = `${report.category || "Other"}__${simpleLocationKey(report.locationName)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(report);
  }

  const groups = [...buckets.values()]
    .filter((items) => items.length >= 1)
    .map((items) => {
      const sorted = [...items].sort((a, b) => issueImportanceScore(b) - issueImportanceScore(a));
      const top = sorted[0];
      const supports = items.reduce((sum, item) => sum + Number(item.supportCount || 0), 0);
      const thoughts = items.reduce((sum, item) => sum + (Array.isArray(item.thoughts) ? item.thoughts.length : 0), 0);
      const score = Math.min(100, Math.round(items.reduce((sum, item) => sum + issueImportanceScore(item), 0) / items.length));
      return {
        groupName: `${top.category || "Community issue"} near ${top.locationName || "reported area"}`,
        commonProblem: `${items.length} report(s), ${supports} support(s), and ${thoughts} citizen thought(s) point to a similar civic concern in this area.`,
        reportCount: items.length,
        priorityScore: score,
        representativeIssueId: top.id,
        recommendedAction: score >= 80 ? "Treat this cluster as urgent and assign officials quickly." : "Review the representative issue and merge duplicate citizen reports where needed."
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 6);

  return {
    headline: allReports.length ? "Similar issue clusters ranked for faster action" : "No reports to group yet",
    groups
  };
}

async function generateIssueGroups(allReports = [], language = "English") {
  const fallback = fallbackIssueGroups(allReports);
  if (!GEMINI_API_KEY || allReports.length < 2) return fallback;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `You are an AI issue clustering assistant for Community Hero.
Group similar civic reports so a dashboard with many reports does not show repeated duplicate cards.
Group only when location, category, and issue details are meaningfully related.
Rank groups by public impact using severity, priority score, support count, thoughts, verification count, and unresolved status.
Return ONLY valid JSON. No markdown.
${userFacingLanguageInstruction(language, false)}

Reports:
${JSON.stringify(allReports.slice(0, 60).map(compactReport), null, 2)}

Use this JSON schema exactly:
{
  "headline": "short headline about grouped reports",
  "groups": [
    {
      "groupName": "short group title",
      "commonProblem": "what these reports have in common",
      "reportCount": number,
      "priorityScore": number from 0 to 100,
      "representativeIssueId": "id of the best representative report",
      "recommendedAction": "what officials should do next"
    }
  ]
}`
        }]
      }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    console.warn("Gemini issue grouping failed:", response.status, (await response.text()).slice(0, 300));
    return fallback;
  }

  try {
    const data = await response.json();
    const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return {
      headline: parsed.headline || fallback.headline,
      groups: Array.isArray(parsed.groups) ? parsed.groups.slice(0, 6).map((group, index) => ({
        groupName: group.groupName || fallback.groups[index]?.groupName || "Issue group",
        commonProblem: group.commonProblem || fallback.groups[index]?.commonProblem || "Similar civic reports were grouped together.",
        reportCount: Number(group.reportCount || fallback.groups[index]?.reportCount || 1),
        priorityScore: Number(group.priorityScore || fallback.groups[index]?.priorityScore || 50),
        representativeIssueId: group.representativeIssueId || fallback.groups[index]?.representativeIssueId || "",
        recommendedAction: group.recommendedAction || fallback.groups[index]?.recommendedAction || "Review this group and assign it to the responsible department."
      })) : fallback.groups
    };
  } catch (error) {
    console.warn("Could not parse Gemini group JSON:", error.message);
    return fallback;
  }
}

function fallbackAwarenessMessage(report) {
  const supports = Number(report.supportCount || 0);
  const thoughts = Array.isArray(report.thoughts) ? report.thoughts.length : 0;
  return {
    awarenessMessage: `Community attention needed: ${report.title} at ${report.locationName}. This issue has ${supports} support(s) and ${thoughts} citizen thought(s). Nearby residents should verify only if they have personally seen the issue and should avoid creating duplicate reports.`,
    callToAction: report.status === "Resolved" ? "Share feedback if the resolution helped." : "Support, verify, or add a clear thought to help officials understand the public impact."
  };
}

async function generateAwarenessMessage(report, language = "English") {
  const fallback = fallbackAwarenessMessage(report);
  if (!GEMINI_API_KEY) return fallback;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `You are an awareness message writer for Community Hero.
Create a short, responsible public awareness message for citizens about a local civic issue.
Do not create panic. Do not invent facts. Encourage support, verification, safety, and avoiding duplicate reports.
Return ONLY valid JSON. No markdown.
${userFacingLanguageInstruction(language, false)}

Report:
${JSON.stringify(compactReport(report), null, 2)}
Citizen thoughts:
${JSON.stringify((report.thoughts || []).slice(-5), null, 2)}

Use this JSON schema exactly:
{
  "awarenessMessage": "2 to 3 sentence citizen awareness message",
  "callToAction": "one short action citizens can take"
}`
        }]
      }],
      generationConfig: { temperature: 0.35, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    console.warn("Gemini awareness message failed:", response.status, (await response.text()).slice(0, 300));
    return fallback;
  }

  try {
    const data = await response.json();
    const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return {
      awarenessMessage: parsed.awarenessMessage || fallback.awarenessMessage,
      callToAction: parsed.callToAction || fallback.callToAction
    };
  } catch (error) {
    console.warn("Could not parse Gemini awareness JSON:", error.message);
    return fallback;
  }
}

function fallbackVerificationSummary(report) {
  const thoughtsCount = Array.isArray(report.thoughts) ? report.thoughts.length : 0;
  const support = Number(report.supportCount || 0);
  const verified = Number(report.verifiedCount || 0);
  const score = Math.min(100, (verified * 18) + (support * 10) + (thoughtsCount * 8) + (report.imageData ? 12 : 0));
  return {
    validationStatus: score >= 65 ? "Likely valid" : score >= 35 ? "Needs more proof" : "Low evidence",
    confidenceScore: score,
    evidenceSummary: `${verified} verifications, ${support} supports, and ${thoughtsCount} citizen thoughts are available for this issue.`,
    riskNote: report.severity === "Critical" || report.severity === "High" ? "High severity issue; officials should review quickly." : "Moderate risk based on current data.",
    recommendedNextStep: score >= 65 ? "Move to Assigned or In Progress after official review." : "Ask nearby citizens to verify and add clearer thoughts or evidence."
  };
}

async function generateVerificationSummary(report, language = "English") {
  const fallback = fallbackVerificationSummary(report);
  if (!GEMINI_API_KEY) return fallback;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        role: "user",
        parts: [{
          text: `You are an AI community verification assistant.
Use the report details, verification count, citizen support count, and citizen thoughts to summarize whether the issue appears genuine.
Do not claim the issue is definitely true; use cautious language.
Return ONLY valid JSON. No markdown.
${userFacingLanguageInstruction(language)}

Report:
${JSON.stringify(compactReport(report), null, 2)}
Full citizen thoughts:
${JSON.stringify((report.thoughts || []).slice(-8), null, 2)}

Use this JSON schema exactly:
{
  "validationStatus": "Likely valid | Needs more proof | Low evidence",
  "confidenceScore": number from 0 to 100,
  "evidenceSummary": "short evidence summary",
  "riskNote": "short risk note",
  "recommendedNextStep": "next step for officials or citizens"
}`
        }]
      }],
      generationConfig: { temperature: 0.2, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    console.warn("Gemini verification summary failed:", response.status, (await response.text()).slice(0, 300));
    return fallback;
  }

  try {
    const data = await response.json();
    const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    return {
      validationStatus: parsed.validationStatus || fallback.validationStatus,
      confidenceScore: Number(parsed.confidenceScore || fallback.confidenceScore),
      evidenceSummary: parsed.evidenceSummary || fallback.evidenceSummary,
      riskNote: parsed.riskNote || fallback.riskNote,
      recommendedNextStep: parsed.recommendedNextStep || fallback.recommendedNextStep
    };
  } catch (error) {
    console.warn("Could not parse Gemini verification JSON:", error.message);
    return fallback;
  }
}

app.post("/api/duplicates/check", async (req, res) => {
  try {
    const existingReports = await listReports();
    const result = await checkDuplicateWithGemini(req.body || {}, existingReports);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insights/dashboard", async (req, res) => {
  try {
    const allReports = await listReports();
    const insights = await generateDashboardInsights(allReports, req.body?.language);
    res.json(insights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/insights/groups", async (req, res) => {
  try {
    const allReports = await listReports();
    const groups = await generateIssueGroups(allReports, req.body?.language);
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reports/:id/awareness", async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    const message = await generateAwarenessMessage(report, req.body?.language);
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reports/:id/verification-summary", async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    const summary = await generateVerificationSummary(report, req.body?.language);
    const updated = await updateReport(req.params.id, { verificationSummary: summary });
    res.json(updated?.verificationSummary || summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reports/:id/support", async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    const thoughtText = String(req.body.thought || "").trim();
    const thought = thoughtText ? {
      id: `TH-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      userName: req.body.userName || "Anonymous Citizen",
      userEmail: req.body.userEmail || "",
      thought: thoughtText.slice(0, 500),
      createdAt: nowIso()
    } : null;

    const updated = await updateReport(req.params.id, {
      supportCount: Number(report.supportCount || 0) + 1,
      thoughts: thought ? [...(report.thoughts || []), thought] : (report.thoughts || [])
    });
    res.status(201).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    if (!req.body.locationName && !(req.body.lat && req.body.lng)) {
      return res.status(400).json({ error: "Location is required. Please add GPS location or type the location name." });
    }

    if (!req.body.locationName && req.body.lat && req.body.lng) {
      req.body.locationName = `GPS: ${req.body.lat}, ${req.body.lng}`;
    }

    const validStatuses = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];
    const report = normalizeReport({
      ...req.body,
      id: safeId(),
      reporterName: req.body.reporterName || "Anonymous Citizen",
      reporterEmail: req.body.reporterEmail || "",
      status: req.body.demoSeed && validStatuses.includes(req.body.status) ? req.body.status : "Reported",
      verifiedCount: req.body.demoSeed ? Number(req.body.verifiedCount || 0) : 0,
      supportCount: req.body.demoSeed ? Number(req.body.supportCount || 0) : 0,
      thoughts: req.body.demoSeed && Array.isArray(req.body.thoughts) ? req.body.thoughts : [],
      verificationSummary: req.body.demoSeed && req.body.verificationSummary ? req.body.verificationSummary : null,
      feedback: req.body.demoSeed && Array.isArray(req.body.feedback) ? req.body.feedback : [],
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
    const saved = await saveReport(report);
    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/reports/:id/verify", async (req, res) => {
  try {
    const all = await listReports();
    const report = all.find((item) => item.id === req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    const updated = await updateReport(req.params.id, {
      verifiedCount: report.verifiedCount + 1,
      status: report.verifiedCount + 1 >= 3 && report.status === "Reported" ? "Verified" : report.status
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/reports/:id/status", async (req, res) => {
  try {
    const valid = ["Reported", "Verified", "Assigned", "In Progress", "Resolved"];
    const status = valid.includes(req.body.status) ? req.body.status : "Reported";
    const updated = await updateReport(req.params.id, { status });
    if (!updated) return res.status(404).json({ error: "Report not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reports/:id/feedback", async (req, res) => {
  try {
    const report = await getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    if (report.status !== "Resolved") {
      return res.status(400).json({ error: "Feedback is allowed only after the issue is resolved." });
    }

    const rating = Number(req.body.rating || 0);
    const originalText = String(req.body.originalText || "").trim();
    const enhancedText = String(req.body.enhancedText || originalText).trim();
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Please select a rating from 1 to 5." });
    }
    if (!originalText && !enhancedText) {
      return res.status(400).json({ error: "Please type feedback before submitting." });
    }

    const feedback = {
      id: `FB-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      userName: req.body.userName || "Anonymous Citizen",
      userEmail: req.body.userEmail || "",
      rating,
      originalText,
      enhancedText,
      sentiment: req.body.sentiment || "Neutral",
      followUpNeeded: Boolean(req.body.followUpNeeded),
      officialNote: req.body.officialNote || "Review feedback for resolution quality.",
      createdAt: nowIso()
    };

    const updatedFeedback = [...(report.feedback || []), feedback];
    const updated = await updateReport(req.params.id, { feedback: updatedFeedback });
    res.status(201).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Community Hero running on http://localhost:${PORT}`);
});
