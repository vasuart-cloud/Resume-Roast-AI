import React from 'react';
import { Flame, Sparkles, FileText, History, RotateCcw, Download } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasAnalysis: boolean;
  onNewRoast: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  hasAnalysis,
  onNewRoast,
  onOpenHistory,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewRoast}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500/30 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                  Resume Roast AI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  10+ Yr Recruiter
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Roasted by a recruiter. Fixed by AI.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {hasAnalysis && (
              <button
                onClick={onNewRoast}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
                title="Start a new roast"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">New Resume</span>
              </button>
            )}

            <button
              onClick={onOpenHistory}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors relative"
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Saved ({historyCount})</span>
            </button>
          </div>
        </div>

        {/* Sub-nav tabs when analysis is loaded */}
        {hasAnalysis && (
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
            {[
              { id: 'overview', label: '📊 Overview & Scores' },
              { id: 'roast', label: '🔥 Recruiter Roast' },
              { id: 'problems', label: '⚠️ Top 10 Problems' },
              { id: 'bullets', label: '📝 Bullet Breakdown' },
              { id: 'jobmatch', label: '🎯 Job Match & Gaps' },
              { id: 'ats', label: '🛡️ ATS & Structure' },
              { id: 'improve', label: '✨ Improvement Studio' },
              { id: 'export', label: '📄 Export & Share' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
