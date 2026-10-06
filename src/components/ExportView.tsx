import React, { useState } from 'react';
import { ResumeAnalysis } from '../types/resume';
import { Download, FileText, Check, Copy, ListOrdered, Share2, Sparkles, ShieldCheck } from 'lucide-react';
import { exportAnalysisPDF, exportImprovedResumePDF, downloadTextFile } from '../utils/pdfExport';

interface ExportViewProps {
  analysis: ResumeAnalysis;
}

export const ExportView: React.FC<ExportViewProps> = ({ analysis }) => {
  const [copiedAction, setCopiedAction] = useState<boolean>(false);

  const handleCopyActionPlan = () => {
    let text = `TOP ACTION PLAN FOR ${analysis.candidateName || 'CANDIDATE'}\n\n`;
    analysis.actionPlan?.forEach((item) => {
      text += `${item.stepNumber}. ${item.whatToChange}\n`;
      text += `Why: ${item.why}\n`;
      text += `How: ${item.how}\n`;
      text += `Example: ${item.example}\n\n`;
    });
    navigator.clipboard.writeText(text);
    setCopiedAction(true);
    setTimeout(() => setCopiedAction(false), 2000);
  };

  const getAnalysisMarkdown = () => {
    let md = `# RESUME ROAST AI — EXECUTIVE AUDIT REPORT\n`;
    md += `**Candidate:** ${analysis.candidateName} | **Target Role:** ${analysis.targetRole || 'Not specified'}\n`;
    md += `**Overall Score:** ${analysis.overallScore}/100 (${analysis.scoreStatus})\n\n`;

    md += `## 🔥 THE RECRUITER ROAST\n`;
    md += `**Biggest Problem:** ${analysis.recruiterRoast.biggestProblem}\n`;
    md += `**Recruiter Reaction:** "${analysis.recruiterRoast.recruiterReaction}"\n`;
    md += `**What This Signals:** ${analysis.recruiterRoast.whatThisSignals}\n`;
    md += `**How to Fix It:** ${analysis.recruiterRoast.howToFixIt}\n\n`;

    md += `## TOP 10 PRIORITIZED PROBLEMS\n`;
    analysis.topProblems?.forEach((prob, i) => {
      md += `### ${i + 1}. [${prob.severity}] ${prob.problem}\n`;
      md += `- **Why It Matters:** ${prob.whyItMatters}\n`;
      if (prob.exampleFromResume) md += `- **Example:** "${prob.exampleFromResume}"\n`;
      md += `- **Recommended Fix:** ${prob.recommendedFix}\n`;
      if (prob.suggestedRewrite) md += `- **Suggested Rewrite:** ${prob.suggestedRewrite}\n\n`;
    });

    md += `## TOP 5 ACTION PLAN\n`;
    analysis.actionPlan?.forEach((a) => {
      md += `${a.stepNumber}. **${a.whatToChange}**\n- Why: ${a.why}\n- How: ${a.how}\n- Example: ${a.example}\n\n`;
    });

    return md;
  };

  return (
    <div className="space-y-8">
      {/* Export Options Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-2">
          Export Reports & Formatted Resumes
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mb-6">
          Download recruiter-grade PDF summaries, plain-text ATS compliant formats, or full analysis dossiers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Full Audit PDF */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Full Recruiter Roast PDF</h3>
              <p className="text-xs text-slate-400 mt-1">
                Executive PDF report featuring overall scores, category breakdowns, roast commentary, and prioritized action plan.
              </p>
            </div>
            <button
              onClick={() => exportAnalysisPDF(analysis)}
              className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Audit PDF</span>
            </button>
          </div>

          {/* Card 2: Optimized Resume PDF */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Improved Resume (PDF)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Formatted, ATS-clean single/two-page resume document incorporating all recruiter-approved improvements.
              </p>
            </div>
            <button
              onClick={() => exportImprovedResumePDF(analysis)}
              className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Resume PDF</span>
            </button>
          </div>

          {/* Card 3: Markdown / DOCX Text */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Analysis Report (Markdown/Text)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Complete structured plain-text report for importing into Google Docs, Word, or Notion.
              </p>
            </div>
            <button
              onClick={() =>
                downloadTextFile(
                  `Resume_Roast_${(analysis.candidateName || 'Candidate').replace(/\s+/g, '_')}_Report.md`,
                  getAnalysisMarkdown()
                )
              }
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Markdown</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 5 Action Plan */}
      {analysis.actionPlan && analysis.actionPlan.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Impact Priority</span>
              </div>
              <h3 className="text-xl font-bold text-white">Top 5 Changes To Make Right Now</h3>
              <p className="text-xs text-slate-400">
                Strategic sequence prioritized by recruiter conversion lift.
              </p>
            </div>

            <button
              onClick={handleCopyActionPlan}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
            >
              {copiedAction ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAction ? 'Copied Action Plan' : 'Copy Action Plan'}</span>
            </button>
          </div>

          <div className="space-y-4">
            {analysis.actionPlan.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold font-mono flex-shrink-0">
                    {item.stepNumber || idx + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{item.whatToChange}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-amber-400">Why:</span> {item.why}
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-300">How:</span> {item.how}
                    </p>
                    {item.example && (
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-300 mt-2">
                        Example: {item.example}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
