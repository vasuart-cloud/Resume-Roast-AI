import React from 'react';
import { ResumeAnalysis } from '../types/resume';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Layout, FileCode, Check } from 'lucide-react';

interface ATSStructureSectionProps {
  analysis: ResumeAnalysis;
}

export const ATSStructureSection: React.FC<ATSStructureSectionProps> = ({ analysis }) => {
  const atsScore = analysis.atsReadinessScore || analysis.scoreBreakdown.atsScore.score || 80;
  const risks = analysis.atsRisks || [];
  const structure = analysis.structureAnalysis || [];

  return (
    <div className="space-y-8">
      {/* ATS Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS Parser Simulation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              ATS Readiness & Parsing Integrity
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Applicant Tracking Systems (Workday, Greenhouse, Lever, Taleo) strip complex formatting, two-column grids, and graphics into raw plain text.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-6 py-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              ATS Parse Score
            </span>
            <span className="text-4xl sm:text-5xl font-black text-emerald-400">
              {atsScore}
            </span>
            <span className="text-xs text-slate-500 block mt-1">/ 100</span>
          </div>
        </div>
      </div>

      {/* Common ATS Formatting Pitfalls Check */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <span>Format & Layout Risk Audit</span>
          </h3>
          <p className="text-xs text-slate-400">
            Automated checks for layout traps that scramble candidate parsing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {risks.map((risk, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2 ${
                risk.status === 'Pass'
                  ? 'bg-slate-950/50 border-slate-800'
                  : risk.status === 'Warning'
                  ? 'bg-amber-950/10 border-amber-500/30'
                  : 'bg-rose-950/10 border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">{risk.name}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    risk.status === 'Pass'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : risk.status === 'Warning'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {risk.status}
                </span>
              </div>
              <p className="text-xs text-slate-400">{risk.riskDescription}</p>
              {risk.recommendation && (
                <p className="text-[11px] text-amber-300/90 pt-1">
                  Fix: {risk.recommendation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section Structure Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Layout className="w-5 h-5 text-amber-400" />
            <span>Standard Resume Section Completeness</span>
          </h3>
          <p className="text-xs text-slate-400">
            Recruiters expect predictable standard section headings so they can locate key qualifications in seconds.
          </p>
        </div>

        <div className="space-y-3">
          {structure.map((sec, idx) => (
            <div
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">{sec.sectionName}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sec.present
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {sec.present ? 'Present' : 'Missing'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Quality: {sec.quality}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{sec.recommendation}</p>
              </div>

              <div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    sec.quality === 'Strong'
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : sec.quality === 'Average'
                      ? 'bg-amber-500/10 text-amber-300'
                      : 'bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {sec.quality}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
