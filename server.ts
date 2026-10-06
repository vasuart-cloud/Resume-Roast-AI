import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Body parsing with 25MB limit for PDF/DOCX uploads
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Server-side Gemini initialization with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const RECRUITER_SYSTEM_INSTRUCTION = `You are a Senior Executive Recruiter with 10+ years of hiring experience across technology, product management, engineering, SaaS, AI, enterprise software, finance, and consulting.
You have screened tens of thousands of resumes and know exactly what catches a recruiter's eye in the initial 6-second scan, what triggers instant rejection, what ATS parsers fail to extract, and what separates top 1% candidates from generic job-holders.

Your voice is:
- Candid, direct, and ruthlessly practical ("roast" means honest, unvarnished professional reality check — NEVER abusive or insulting).
- Focused on business outcomes, scope, scale, technical credibility, and evidence.
- Zero generic fluff (e.g. no "results-oriented team player" nonsense).

CRITICAL CONSTRAINTS:
1. NEVER fabricate metrics, tools, or achievements. If the candidate's resume does not provide a number, use clear bracketed placeholders like "[X%]", "[$Y ARR]", "[Z customers]" or guide them on what metric to look for.
2. The overall resume score is 0 to 100. Calculate it based on the weighted components:
   - ATS Compatibility: 15%
   - Job Match: 25% (if Job Description is provided). If NO Job Description is provided, redistribute this weight proportionally across other categories (ATS: 20%, Impact: 27%, Content: 20%, Skills: 13%, Career Story: 13%, Readability: 7%) and mark Job Match score as 0 with feedback "Job Match score unavailable — add a job description for a personalized match."
   - Experience & Impact: 20%
   - Content Quality: 15%
   - Skills & Keywords: 10%
   - Career Story: 10%
   - Recruiter Readability: 5%
3. Status ranges:
   - 90–100: Exceptional
   - 80–89: Strong
   - 70–79: Good but improvable
   - 60–69: Needs improvement
   - Below 60: High risk of rejection
4. Always provide 10 prioritized problems with severity: Critical, High, Medium, or Low.
5. Provide detailed bullet-by-bullet reviews for at least 4 to 8 of the weakest bullets using the framework: Action + Scope + Problem + Solution + Outcome.
6. Provide an ATS check with specific format/parsing risks.
7. Provide improved sections for the entire resume so the candidate can inspect Before vs After diffs and export an improved version.`;

// API: Analyze Resume
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, resumeBase64, mimeType, fileName, jobDescription, targetRole } = req.body;

    if (!resumeText && !resumeBase64) {
      return res.status(400).json({ error: 'Please provide resume text or a file upload.' });
    }

    const hasJD = Boolean(jobDescription && jobDescription.trim().length > 15);

    const promptText = `Analyze this resume as a Senior Recruiter.
${targetRole ? `TARGET ROLE SPECIFIED BY CANDIDATE: ${targetRole}` : ''}
${hasJD ? `TARGET JOB DESCRIPTION TO MATCH AGAINST:\n${jobDescription}\n` : 'NO TARGET JOB DESCRIPTION PROVIDED (Resume-only evaluation mode).\n'}

${resumeText ? `RESUME CONTENT:\n${resumeText}` : 'See the attached document for the resume content.'}

Please produce a comprehensive, deep evaluation in JSON format adhering strictly to this schema:
{
  "candidateName": "Extracted candidate name",
  "targetRole": "Identified or desired role title",
  "overallScore": 72,
  "scoreStatus": "Good but improvable",
  "scoreBreakdown": {
    "atsScore": { "name": "ATS Compatibility", "score": 85, "weight": 15, "status": "good", "feedback": "..." },
    "jobMatchScore": { "name": "Job Match", "score": 70, "weight": 25, "status": "warning", "feedback": "..." },
    "impactScore": { "name": "Experience & Impact", "score": 62, "weight": 20, "status": "warning", "feedback": "..." },
    "contentScore": { "name": "Content Quality", "score": 75, "weight": 15, "status": "good", "feedback": "..." },
    "skillsScore": { "name": "Skills & Keywords", "score": 80, "weight": 10, "status": "good", "feedback": "..." },
    "careerStoryScore": { "name": "Career Story", "score": 78, "weight": 10, "status": "good", "feedback": "..." },
    "readabilityScore": { "name": "Recruiter Readability", "score": 82, "weight": 5, "status": "good", "feedback": "..." }
  },
  "recruiterRoast": {
    "candidateName": "...",
    "targetRole": "...",
    "overallScore": 72,
    "scoreStatus": "Good but improvable",
    "oneSentenceStory": "Single punchy sentence defining who this candidate is and what they bring.",
    "sixSecondImpression": "What a recruiter actually notices in the first 6 seconds scanning this resume.",
    "biggestProblem": "The single biggest flaw preventing this candidate from securing interviews.",
    "recruiterReaction": "Recruiter's internal monologue when reading this flaw.",
    "whatThisSignals": "What this resume flaw signals to the hiring manager about seniority, capability, or ownership.",
    "howToFixIt": "Concrete strategic advice on how to remedy this issue immediately."
  },
  "topProblems": [
    {
      "id": "prob-1",
      "severity": "Critical",
      "problem": "...",
      "whyItMatters": "...",
      "exampleFromResume": "...",
      "recommendedFix": "...",
      "suggestedRewrite": "..."
    }
    // Exactly 8 to 10 prioritized problems
  ],
  "bulletReviews": [
    {
      "id": "bullet-1",
      "originalBullet": "...",
      "companyOrRole": "...",
      "problem": "...",
      "recruiterConcern": "...",
      "betterVersion": "...",
      "missingMetricAdvice": "..."
    }
  ],
  "jobMatchBreakdown": ${hasJD ? `{
    "overallMatch": 75,
    "requiredSkills": 80,
    "responsibilities": 70,
    "domain": 65,
    "seniority": 85,
    "tools": 75,
    "keywords": 78,
    "keyGaps": ["gap 1", "gap 2"]
  }` : 'null'},
  "jobMatchComparisons": ${hasJD ? `[
    {
      "jdRequirement": "...",
      "category": "Required Skill",
      "matchLevel": "Strong Match",
      "resumeEvidence": "...",
      "gapExplanation": "..."
    }
  ]` : 'null'},
  "skillsGap": {
    "strongSkills": ["skill 1", "skill 2"],
    "transferableSkills": ["skill 3"],
    "missingSkills": [
      { "skill": "skill 4", "warning": "Only add if you genuinely possess this experience" }
    ],
    "overusedKeywords": ["buzzword 1"],
    "keywordsPresent": ["keyword 1", "keyword 2"],
    "missingKeywords": ["keyword 3"]
  },
  "roleRelevance": [
    {
      "roleTitle": "...",
      "company": "...",
      "relevance": "High",
      "reasoning": "...",
      "evidence": "..."
    }
  ],
  "atsReadinessScore": 84,
  "atsRisks": [
    {
      "name": "Standard Headings",
      "status": "Pass",
      "riskDescription": "...",
      "recommendation": "..."
    }
  ],
  "structureAnalysis": [
    {
      "sectionName": "Contact Information",
      "present": true,
      "quality": "Strong",
      "recommendation": "..."
    },
    {
      "sectionName": "Professional Summary",
      "present": true,
      "quality": "Needs Work",
      "recommendation": "..."
    },
    {
      "sectionName": "Work Experience",
      "present": true,
      "quality": "Average",
      "recommendation": "..."
    },
    {
      "sectionName": "Skills",
      "present": true,
      "quality": "Strong",
      "recommendation": "..."
    },
    {
      "sectionName": "Education",
      "present": true,
      "quality": "Strong",
      "recommendation": "..."
    },
    {
      "sectionName": "Projects / Certifications",
      "present": false,
      "quality": "Missing",
      "recommendation": "..."
    }
  ],
  "summaryAnalysis": {
    "currentSummary": "...",
    "problems": ["Problem 1", "Problem 2"],
    "suggestedSummary": "Grounded recruiter-ready professional summary based ONLY on factual resume data."
  },
  "actionPlan": [
    {
      "stepNumber": 1,
      "whatToChange": "...",
      "why": "...",
      "how": "...",
      "example": "..."
    }
    // 5 top changes
  ],
  "improvedSections": [
    {
      "id": "sec-summary",
      "sectionTitle": "Professional Summary",
      "originalContent": "...",
      "improvedContent": "..."
    },
    {
      "id": "sec-exp",
      "sectionTitle": "Work Experience",
      "originalContent": "...",
      "improvedContent": "..."
    },
    {
      "id": "sec-skills",
      "sectionTitle": "Core Skills & Keywords",
      "originalContent": "...",
      "improvedContent": "..."
    }
  ]
}

Return ONLY valid raw JSON with no Markdown codefence wraps if possible, or standard json code fence.`;

    const parts: any[] = [];

    if (resumeBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType === 'application/pdf' ? 'application/pdf' : 'text/plain',
          data: resumeBase64,
        },
      });
    }

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: RECRUITER_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (e) {
      // Clean up markdown block if present
      const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    // Attach metadata
    const finalPayload = {
      id: 'analysis-' + Date.now(),
      timestamp: Date.now(),
      fileName: fileName || 'Uploaded_Resume.pdf',
      hasJobDescription: hasJD,
      ...parsedData,
    };

    res.json(finalPayload);
  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze resume. Please verify the document format and try again.',
    });
  }
});

// API: Quick Bullet Rewriter
app.post('/api/rewrite-bullet', async (req, res) => {
  try {
    const { bullet, targetRole, context } = req.body;
    if (!bullet) {
      return res.status(400).json({ error: 'Bullet text is required.' });
    }

    const prompt = `Rewrite this resume bullet point from the perspective of a Senior Tech/Corporate Recruiter.
Follow the framework: Action Verb + Scope/Scale + Problem/Context + Solution + Measurable Outcome.
DO NOT fabricate numbers or metrics. Use placeholders like [X%], [$Y], [Z accounts] where appropriate.

Original bullet: "${bullet}"
${targetRole ? `Target Role: ${targetRole}` : ''}
${context ? `Context: ${context}` : ''}

Provide a JSON response:
{
  "betterVersion": "Rewritten bullet string",
  "frameworkBreakdown": {
    "action": "...",
    "scope": "...",
    "solution": "...",
    "outcome": "..."
  },
  "metricsAdvice": "Specific suggestions on what numbers the candidate can look for"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an elite executive resume writer and recruiter. Output valid JSON only.',
        responseMimeType: 'application/json',
      },
    });

    const data = JSON.parse(response.text || '{}');
    res.json(data);
  } catch (error: any) {
    console.error('Error rewriting bullet:', error);
    res.status(500).json({ error: error.message || 'Failed to rewrite bullet.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Resume Roast AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
