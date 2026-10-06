import React, { useState } from 'react';
import { ResumeAnalysis, ImprovedSection } from '../types/resume';
import { Sparkles, Check, X, Edit3, Copy, Download, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { exportImprovedResumePDF, downloadTextFile } from '../utils/pdfExport';

interface ImprovementStudioProps {
  analysis: ResumeAnalysis;
}

export const ImprovementStudio: React.FC<ImprovementStudioProps> = ({ analysis }) => {
  const [sections, setSections] = useState<ImprovedSection[]>(
    analysis.improvedSections || [
      {
        id: 'sec-summary',
        sectionTitle: 'Professional Summary',
        originalContent: analysis.summaryAnalysis?.currentSummary || 'Experienced professional...',
        improvedContent: analysis.summaryAnalysis?.suggestedSummary || 'Executive profile...',
        accepted: true,
      },
    ]
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [activeDraftTab, setActiveDraftTab] = useState<'side-by-side' | 'full-draft'>('side-by-side');

  const handleAccept = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, accepted: true } : s))
    );
  };

  const handleReject = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, accepted: false } : s))
    );
  };

  const startEdit = (s: ImprovedSection) => {
    setEditingId(s.id);
    setEditText(s.improvedContent);
  };

  const saveEdit = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, improvedContent: editText } : s))
    );
    setEditingId(null);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  // Compile full text for export
  const getFullImprovedText = () => {
    let output = `${analysis.candidateName || 'Candidate'}\n`;
    output += `Target Role: ${analysis.targetRole || 'Professional'}\n`;
    output += `========================================\n\n`;

    sections.forEach((sec) => {
      output += `${sec.sectionTitle.toUpperCase()}\n`;
      output += `----------------------------------------\n`;
      output += `${sec.accepted !== false ? sec.improvedContent : sec.originalContent}\n\n`;
    });

    return output;
  };

  return (
    <div className="space-y-8">
      {/* Studio Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recruiter Improvement Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Before & After Rewrite Studio
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect section-by-section improvements. Convert task-lists into quantified impact statements. Accept, reject, or edit changes freely.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button
              onClick={() => exportImprovedResumePDF(analysis, getFullImprovedText())}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF Resume</span>
            </button>
            <button
              onClick={() => downloadTextFile(`${(analysis.candidateName || 'Candidate').replace(/\s+/g, '_')}_Improved_Resume.txt`, getFullImprovedText())}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Export Text/DOCX</span>
            </button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveDraftTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeDraftTab === 'side-by-side'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side Review
          </button>
          <button
            onClick={() => setActiveDraftTab('full-draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeDraftTab === 'full-draft'
                ? 'bg-slate-800 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Full Resume Draft Preview
          </button>
        </div>
      </div>

      {/* Professional Summary Deep Dive Card */}
      {analysis.summaryAnalysis && activeDraftTab === 'side-by-side' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Professional Summary Optimization</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
              Recruiter First Impression
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 block">Original Summary:</span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                "{analysis.summaryAnalysis.currentSummary || 'No summary detected in original resume.'}"
              </p>
              {analysis.summaryAnalysis.problems?.length > 0 && (
                <div className="pt-2 text-[11px] text-slate-400 space-y-1">
                  <span className="font-semibold text-rose-300">Why it gets rejected:</span>
                  {analysis.summaryAnalysis.problems.map((prob, i) => (
                    <div key={i} className="flex items-start space-x-1">
                      <span className="text-rose-400">•</span>
                      <span>{prob}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400">Recruiter-Grounded Rewrite:</span>
                <button
                  type="button"
                  onClick={() => handleCopy('summary', analysis.summaryAnalysis.suggestedSummary)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                >
                  {copiedSectionId === 'summary' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSectionId === 'summary' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-emerald-200 font-mono leading-relaxed font-medium">
                "{analysis.summaryAnalysis.suggestedSummary}"
              </p>
              <p className="text-[10px] text-emerald-400/80 italic pt-1">
                ✓ Grounded purely in factual resume evidence. Zero invented credentials.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Section Cards */}
      {activeDraftTab === 'side-by-side' ? (
        <div className="space-y-6">
          {sections.map((sec) => (
            <div
              key={sec.id}
              className={`bg-slate-900/90 border rounded-2xl p-6 shadow-xl space-y-4 transition-all ${
                sec.accepted === false
                  ? 'border-slate-800 opacity-60'
                  : sec.accepted
                  ? 'border-emerald-500/40'
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm sm:text-base font-bold text-white">{sec.sectionTitle}</h4>
                  {sec.accepted && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Change Accepted</span>
                    </span>
                  )}
                  {sec.accepted === false && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      Rejected (Keeps Original)
                    </span>
                  )}
                </div>

                {/* Section Action Controls */}
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => handleAccept(sec.id)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 font-semibold"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleReject(sec.id)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 text-slate-400 hover:text-white font-medium"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => startEdit(sec)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-medium"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleCopy(sec.id, sec.improvedContent)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white font-medium"
                  >
                    {copiedSectionId === sec.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSectionId === sec.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before: Original */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Original Version:
                  </span>
                  <div className="text-xs text-slate-400 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {sec.originalContent}
                  </div>
                </div>

                {/* After: Recruiter Improved */}
                <div className="p-4 rounded-xl bg-emerald-950/15 border border-emerald-500/30 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                    Recruiter-Optimized Version:
                  </span>

                  {editingId === sec.id ? (
                    <div className="space-y-3">
                      <textarea
                        rows={6}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full bg-slate-900 border border-emerald-500/40 rounded-lg p-2.5 text-xs text-slate-100 font-mono focus:outline-none"
                      />
                      <div className="flex space-x-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded text-xs bg-slate-800 text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(sec.id)}
                          className="px-3 py-1 rounded text-xs bg-emerald-500 text-slate-950 font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-200 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                      {sec.improvedContent}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Full Draft Preview */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Full Recruiter-Optimized Resume Draft</h3>
              <p className="text-xs text-slate-400">Clean, ATS-compliant layout ready to copy or download.</p>
            </div>
            <button
              onClick={() => handleCopy('fulldraft', getFullImprovedText())}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              {copiedSectionId === 'fulldraft' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSectionId === 'fulldraft' ? 'Draft Copied' : 'Copy All Text'}</span>
            </button>
          </div>

          <pre className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
            {getFullImprovedText()}
          </pre>
        </div>
      )}
    </div>
  );
};
