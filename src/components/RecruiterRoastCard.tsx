import React from 'react';
import { RecruiterRoast } from '../types/resume';
import { Flame, MessageSquare, AlertOctagon, Lightbulb, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

interface RecruiterRoastCardProps {
  roast: RecruiterRoast;
  onGoToImprovement: () => void;
  onGoToBullets: () => void;
}

export const RecruiterRoastCard: React.FC<RecruiterRoastCardProps> = ({
  roast,
  onGoToImprovement,
  onGoToBullets,
}) => {
  return (
    <div className="space-y-6">
      {/* Roast Header Banner */}
      <div className="bg-gradient-to-r from-orange-950/40 via-rose-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Flame className="w-48 h-48 text-amber-500" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            <span>Unfiltered 10-Year Recruiter Reality Check</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            The Senior Recruiter Roast
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Recruiters review hundreds of profiles every single week. When they look at your resume, they aren't reading line-by-line — they are looking for reasons to qualify you in or disqualify you out. Here is the unvarnished truth about how your resume lands.
          </p>
        </div>
      </div>

      {/* The 4 Core Roast Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. The Biggest Problem */}
        <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-3">
            <AlertOctagon className="w-4 h-4" />
            <span>The #1 Dealbreaker</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
            {roast.biggestProblem}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            This is the primary hesitation holding hiring managers back from scheduling a screening call with you.
          </p>
        </div>

        {/* 2. Recruiter's Internal Monologue */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-4 h-4" />
            <span>Recruiter's Honest Reaction</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 font-serif italic text-base leading-relaxed">
            "{roast.recruiterReaction}"
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            What the recruiter thinks to themselves before dragging your profile into the 'Reject' or 'Maybe' pile.
          </p>
        </div>

        {/* 3. What This Signals */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-4 h-4" />
            <span>What This Signals to Leadership</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed mb-3">
            {roast.whatThisSignals}
          </p>
          <p className="text-xs text-slate-400">
            Resumes don't just communicate tasks; they signal ownership level, executive presence, and business maturity.
          </p>
        </div>

        {/* 4. How to Fix It */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Lightbulb className="w-4 h-4" />
              <span>How to Fix It Right Now</span>
            </div>
            <p className="text-sm font-medium text-slate-200 leading-relaxed mb-4">
              {roast.howToFixIt}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={onGoToBullets}
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1.5"
            >
              <span>See Bullet Rewrites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToImprovement}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              Open Studio
            </button>
          </div>
        </div>
      </div>

      {/* Recruiter 6-Second Screen Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
          <span>The Recruiter's 6-Second Scan Anatomy</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          According to eye-tracking research, recruiters spend an average of 6 to 7.4 seconds scanning an incoming resume. Here is how your resume survived that test:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">1</span>
              <span>Top Third & Role Match</span>
            </div>
            <p className="text-xs text-slate-300">
              The eye lands on candidate title and current company first. Your target title should appear within the first 2 inches.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">2</span>
              <span>Numbers & Bold Metrics</span>
            </div>
            <p className="text-xs text-slate-300">
              Digits ($, %, numbers) act as visual magnets. Paragraphs of unbroken prose cause recruiters to lose interest immediately.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 mb-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">3</span>
              <span>Company & Seniority Scope</span>
            </div>
            <p className="text-xs text-slate-300">
              Recruiters check company tier, tenure duration, and whether promotions or increased scope are clearly signaled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
