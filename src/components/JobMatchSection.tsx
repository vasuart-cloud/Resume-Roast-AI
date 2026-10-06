import React, { useState } from 'react';
import { ResumeAnalysis, MatchLevel } from '../types/resume';
import { Target, CheckCircle2, AlertCircle, XCircle, ShieldAlert, Cpu, Sparkles, Briefcase, Filter } from 'lucide-react';

interface JobMatchSectionProps {
  analysis: ResumeAnalysis;
}

export const JobMatchSection: React.FC<JobMatchSectionProps> = ({ analysis }) => {
  const [filterMatch, setFilterMatch] = useState<'All' | MatchLevel>('All');

  if (!analysis.hasJobDescription || !analysis.jobMatchBreakdown) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center shadow-xl space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-amber-400 mx-auto flex items-center justify-center">
          <Target className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Job Description Match Unavailable
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          You analyzed this resume in <span className="text-slate-300 font-semibold">Resume-Only mode</span>. To see a detailed side-by-side JD comparison, skills gap analysis, keyword audit, and role relevance rating, add a target job description in the upload screen.
        </p>
      </div>
    );
  }

  const breakdown = analysis.jobMatchBreakdown;
  const comparisons = analysis.jobMatchComparisons || [];
  const skillsGap = analysis.skillsGap;
  const roleRelevance = analysis.roleRelevance || [];

  const getMatchIndicator = (level: MatchLevel) => {
    switch (level) {
      case 'Strong Match':
        return {
          icon: CheckCircle2,
          label: '🟢 Strong Match',
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'Partial Match':
        return {
          icon: AlertCircle,
          label: '🟡 Partial Match',
          style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'Missing':
        return {
          icon: XCircle,
          label: '🔴 Missing',
          style: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
    }
  };

  const filteredComparisons = comparisons.filter((c) => {
    if (filterMatch === 'All') return true;
    return c.matchLevel === filterMatch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Match Score Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Target className="w-3.5 h-3.5" />
              <span>Target Role Fit Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Target Job Description Match
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Screened against qualifications, domain requirements, tool stack, and scope.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-6 py-4 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Overall JD Alignment
            </span>
            <span className="text-4xl sm:text-5xl font-black text-indigo-400">
              {breakdown.overallMatch}%
            </span>
            <span className="text-xs text-slate-500 block mt-1">Weighted Compatibility</span>
          </div>
        </div>

        {/* Category Percentages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          {[
            { label: 'Required Skills', val: breakdown.requiredSkills },
            { label: 'Responsibilities', val: breakdown.responsibilities },
            { label: 'Domain Scope', val: breakdown.domain },
            { label: 'Seniority Level', val: breakdown.seniority },
            { label: 'Tools & Stack', val: breakdown.tools },
            { label: 'Keyword Density', val: breakdown.keywords },
          ].map((cat, i) => (
            <div key={i} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">{cat.label}</span>
              <span className="text-xl font-bold text-white">{cat.val}%</span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-indigo-400 h-full rounded-full"
                  style={{ width: `${cat.val}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 mt-4 italic">
          Disclaimer: Match score evaluates semantic overlap and recruiter criteria. A high score does not guarantee interview shortlisting.
        </p>
      </div>

      {/* Skills Gap Analysis (Strong, Transferable, Missing) */}
      {skillsGap && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-amber-400" />
              <span>Skills Gap & Keyword Intelligence</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Classified into confirmed strengths, transferable capabilities, and missing JD requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Strong Skills */}
            <div className="p-4 rounded-xl bg-emerald-950/10 border border-emerald-500/20 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strong Confirmed Skills ({skillsGap.strongSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsGap.strongSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Transferable Skills */}
            <div className="p-4 rounded-xl bg-amber-950/10 border border-amber-500/20 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Transferable Skills ({skillsGap.transferableSkills?.length || 0})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsGap.transferableSkills?.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills with Warning */}
            <div className="p-4 rounded-xl bg-rose-950/10 border border-rose-500/20 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                <XCircle className="w-4 h-4" />
                <span>Missing JD Requirements ({skillsGap.missingSkills?.length || 0})</span>
              </div>
              <div className="space-y-2">
                {skillsGap.missingSkills?.map((item, i) => (
                  <div key={i} className="p-2 rounded bg-slate-950/60 border border-rose-500/20">
                    <span className="text-xs font-bold text-rose-300 block">{item.skill}</span>
                    <span className="text-[10px] text-slate-400 italic">
                      ⚠️ {item.warning || 'Only add this skill if you genuinely possess this experience.'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords Present vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                High-Value Keywords Detected in Resume:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillsGap.keywordsPresent?.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-200">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                Missing JD Terminology to Incorporate Where Truthful:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillsGap.missingKeywords?.map((kw, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side JD vs Resume Comparisons */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">Side-by-Side Qualification Mapping</h3>
            <p className="text-xs text-slate-400">Directly maps JD qualifications against evidence detected in your resume.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5">
            {(['All', 'Strong Match', 'Partial Match', 'Missing'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setFilterMatch(m)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  filterMatch === m
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Cards */}
        <div className="space-y-4">
          {filteredComparisons.map((comp, idx) => {
            const badge = getMatchIndicator(comp.matchLevel);

            return (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-start"
              >
                {/* Left Column: Job Description Requirement */}
                <div className="md:col-span-5 space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {comp.category}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                    {comp.jdRequirement}
                  </h4>
                </div>

                {/* Center Badge */}
                <div className="md:col-span-2 flex items-center md:justify-center">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${badge.style}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Right Column: Resume Evidence & Gap Analysis */}
                <div className="md:col-span-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Resume Evidence Found:
                  </span>
                  <p className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                    {comp.resumeEvidence || 'No direct evidence found in uploaded resume.'}
                  </p>
                  {comp.gapExplanation && (
                    <p className="text-[11px] text-amber-400/90 leading-tight">
                      Recruiter note: {comp.gapExplanation}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience Relevance Section */}
      {roleRelevance.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <span>Role-by-Role Relevance to Target Job</span>
          </h3>
          <p className="text-xs text-slate-400">
            How a recruiter evaluates the relevance and weight of each previous position.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {roleRelevance.map((role, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{role.roleTitle}</h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      role.relevance === 'High'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : role.relevance === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {role.relevance} Relevance
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{role.company}</p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{role.reasoning}</p>
                {role.evidence && (
                  <p className="text-[11px] text-slate-500 italic">Evidence: {role.evidence}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
