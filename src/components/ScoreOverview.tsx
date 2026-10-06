import React from 'react';
import { ResumeAnalysis } from '../types/resume';
import { Sparkles, ArrowRight, ShieldCheck, Target, TrendingUp, BookOpen, Cpu, Award, Eye, AlertTriangle } from 'lucide-react';

interface ScoreOverviewProps {
  analysis: ResumeAnalysis;
  onGoToImprovement: () => void;
  onGoToTab: (tab: string) => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  analysis,
  onGoToImprovement,
  onGoToTab,
}) => {
  const getStatusColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: '#10b981' };
    if (score >= 80) return { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', ring: '#3b82f6' };
    if (score >= 70) return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: '#f59e0b' };
    if (score >= 60) return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', ring: '#f97316' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', ring: '#f43f5e' };
  };

  const overallColor = getStatusColor(analysis.overallScore);
  const categories = analysis.scoreBreakdown;

  const scoreItems = [
    {
      key: 'ats',
      data: categories.atsScore,
      icon: ShieldCheck,
      tab: 'ats',
      desc: 'Formatting, parsability, columns & standard section tags.',
    },
    {
      key: 'jobMatch',
      data: categories.jobMatchScore,
      icon: Target,
      tab: 'jobmatch',
      desc: analysis.hasJobDescription
        ? 'Direct alignment with target JD required skills & scope.'
        : 'Job Match score redistributed — add a JD for personalized match.',
    },
    {
      key: 'impact',
      data: categories.impactScore,
      icon: TrendingUp,
      tab: 'bullets',
      desc: 'Business outcomes, quantifiable metrics & leadership scope.',
    },
    {
      key: 'content',
      data: categories.contentScore,
      icon: BookOpen,
      tab: 'bullets',
      desc: 'Clarity, strong action verbs, specificity & zero fluff.',
    },
    {
      key: 'skills',
      data: categories.skillsScore,
      icon: Cpu,
      tab: 'jobmatch',
      desc: 'Technical credibility, modern tools & role keywords.',
    },
    {
      key: 'careerStory',
      data: categories.careerStoryScore,
      icon: Award,
      tab: 'roast',
      desc: 'Seniority progression, logical transitions & coherence.',
    },
    {
      key: 'readability',
      data: categories.readabilityScore,
      icon: Eye,
      tab: 'ats',
      desc: '6-second scanability, visual hierarchy & length.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Profile Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Evaluated Candidate
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">
              File: <span className="text-slate-300 font-mono">{analysis.fileName}</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {analysis.candidateName || 'Candidate Profile'}
          </h2>
          <p className="text-sm font-medium text-amber-400 flex items-center space-x-1.5">
            <span>Target Role:</span>
            <span className="text-white font-semibold">{analysis.targetRole || 'Not specified'}</span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={onGoToImprovement}
            className="w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 group transition-all"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Improve My Resume</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recruiter Screening Score
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${overallColor.bg} ${overallColor.text} ${overallColor.border}`}>
                {analysis.scoreStatus}
              </span>
            </div>

            {/* Score Display */}
            <div className="flex items-baseline space-x-3 my-4">
              <span className={`text-6xl sm:text-7xl font-black tracking-tight ${overallColor.text}`}>
                {analysis.overallScore}
              </span>
              <span className="text-2xl font-bold text-slate-500">/ 100</span>
            </div>

            {/* Scale Gauge */}
            <div className="space-y-1.5 my-4">
              <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${analysis.overallScore}%`,
                    backgroundColor: overallColor.ring,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 High Risk</span>
                <span>60 Needs Work</span>
                <span>80 Strong</span>
                <span>100 Top 1%</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Based on candidate evidence, quantified impact, ATS readability, and competitive recruiter screening behavior.
            </p>
          </div>

          {/* Assessment Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500/80 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-tight">
              <span className="font-semibold text-slate-300">Recruiter Assessment:</span> This score represents an AI-assisted evaluation model simulating senior recruiter scrutiny. It is not an official hiring decision or guarantee.
            </p>
          </div>
        </div>

        {/* Career Story in One Sentence & 6-Second Impression */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Award className="w-4 h-4" />
              <span>Your Career Story in One Sentence</span>
            </div>
            <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              "{analysis.recruiterRoast?.oneSentenceStory || 'Enterprise professional with demonstrated industry expertise.'}"
            </p>
          </div>

          <div className="bg-gradient-to-r from-rose-950/20 via-slate-900 to-amber-950/20 border border-amber-500/20 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
              <Eye className="w-4 h-4" />
              <span>The Recruiter's 6-Second First Scan</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{analysis.recruiterRoast?.sixSecondImpression || 'The first scan looks at title progression, company credibility, and whether bullet points contain measurable business impact.'}"
            </p>
            <div className="mt-3">
              <button
                onClick={() => onGoToTab('roast')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
              >
                <span>Read Full Recruiter Roast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Score Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Weighted Score Breakdown
          </h3>
          <span className="text-xs text-slate-500">Click any card to inspect details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scoreItems.map((item) => {
            const Icon = item.icon;
            const categoryData = item.data;
            if (!categoryData) return null;
            const itemColor = getStatusColor(categoryData.score);

            return (
              <div
                key={item.key}
                onClick={() => onGoToTab(item.tab)}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 cursor-pointer transition-all hover:bg-slate-900 shadow-md group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:text-amber-400 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                      {categoryData.weight}% Weight
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-200 mb-1">{categoryData.name}</h4>
                  <div className="flex items-baseline space-x-2 my-1">
                    <span className={`text-2xl font-black ${itemColor.text}`}>
                      {categoryData.score}
                    </span>
                    <span className="text-xs font-medium text-slate-500">/ 100</span>
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden my-2">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${categoryData.score}%`,
                        backgroundColor: itemColor.ring,
                      }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {categoryData.feedback || item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-amber-400">
                  <span>View analysis</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
