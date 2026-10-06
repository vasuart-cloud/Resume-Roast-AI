import React, { useState } from 'react';
import { ProblemItem, SeverityLevel } from '../types/resume';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface TopProblemsListProps {
  problems: ProblemItem[];
  onApplyRewrite?: (rewrite: string) => void;
}

export const TopProblemsList: React.FC<TopProblemsListProps> = ({ problems }) => {
  const [filter, setFilter] = useState<'All' | SeverityLevel>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return {
          icon: AlertCircle,
          label: '🔴 Critical',
          style: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
      case 'High':
        return {
          icon: AlertTriangle,
          label: '🟠 High Impact',
          style: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        };
      case 'Medium':
        return {
          icon: Info,
          label: '🟡 Medium',
          style: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'Low':
        return {
          icon: CheckCircle,
          label: '🟢 Low Polish',
          style: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
    }
  };

  const filteredProblems = problems.filter((p) => {
    if (filter === 'All') return true;
    return p.severity === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center space-x-2">
            <span>Prioritized Resume Problems</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {problems.length} Found
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ranked by likelihood of triggering an automated ATS drop or a recruiter rejection.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filter === lvl
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Cards List */}
      <div className="space-y-4">
        {filteredProblems.map((prob, idx) => {
          const badge = getSeverityBadge(prob.severity);
          const isExpanded = expandedIds[prob.id] ?? true;

          return (
            <div
              key={prob.id || idx}
              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-700"
            >
              {/* Problem Title Bar */}
              <div
                onClick={() => toggleExpand(prob.id)}
                className="p-4 sm:p-5 flex items-start justify-between cursor-pointer select-none gap-4"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {prob.problem}
                    </h3>
                  </div>
                </div>

                <div className="text-slate-400 hover:text-white p-1">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-4 text-xs sm:text-sm">
                  {/* Why it matters */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Why It Matters to Recruiters:
                    </span>
                    <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/60">
                      {prob.whyItMatters}
                    </p>
                  </div>

                  {/* Example from resume */}
                  {prob.exampleFromResume && (
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                        Found in Resume:
                      </span>
                      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-200 font-mono text-xs">
                        "{prob.exampleFromResume}"
                      </div>
                    </div>
                  )}

                  {/* Recommended Fix */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                      Recommended Fix:
                    </span>
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {prob.recommendedFix}
                    </p>
                  </div>

                  {/* Suggested Rewrite with Copy Button */}
                  {prob.suggestedRewrite && (
                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          Recruiter-Optimized Rewrite:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(prob.id, prob.suggestedRewrite)}
                          className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded transition-colors"
                        >
                          {copiedId === prob.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Rewrite</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-200 font-mono leading-relaxed">
                        {prob.suggestedRewrite}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
