import React, { useState } from 'react';
import { BulletReview } from '../types/resume';
import { Check, Copy, Sparkles, AlertCircle, ArrowRight, RefreshCw, HelpCircle, Layers } from 'lucide-react';
import { rewriteBulletApi } from '../services/api';

interface BulletAnalyzerProps {
  bulletReviews: BulletReview[];
  targetRole?: string;
}

export const BulletAnalyzer: React.FC<BulletAnalyzerProps> = ({ bulletReviews, targetRole }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeReviews, setActiveReviews] = useState<BulletReview[]>(bulletReviews);
  const [customBullet, setCustomBullet] = useState<string>('');
  const [isRewritingCustom, setIsRewritingCustom] = useState<boolean>(false);
  const [customRewriteResult, setCustomRewriteResult] = useState<any | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCustomRewrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBullet.trim()) return;

    setIsRewritingCustom(true);
    try {
      const res = await rewriteBulletApi({
        bullet: customBullet,
        targetRole,
      });
      setCustomRewriteResult(res);
    } catch (err) {
      console.error('Failed to rewrite bullet:', err);
    } finally {
      setIsRewritingCustom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>The Recruiter Impact Formula</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-extrabold text-white mb-2">
          Bullet-by-Bullet Impact Audit
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed mb-6">
          Weak bullets describe daily duties. Elite bullets describe measurable business value using the recruiter framework:{' '}
          <span className="text-amber-400 font-semibold">Action Verb + Scope + Problem + Solution + Outcome</span>.
          We never fabricate metrics — where numbers are missing, clear bracketed placeholders like{' '}
          <span className="text-amber-300 font-mono">[X%]</span> guide you on what data to look up.
        </p>

        {/* Framework Explanation Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-amber-300">
            1. Strong Action
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-blue-300">
            2. Scope / Scale
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-purple-300">
            3. Business Context
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300">
            4. Solution
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 col-span-2 sm:col-span-1">
            5. Quantified Outcome
          </div>
        </div>
      </div>

      {/* Bullet Cards */}
      <div className="space-y-6">
        {activeReviews.map((rev, idx) => (
          <div
            key={rev.id || idx}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400">
                Bullet #{idx + 1} {rev.companyOrRole ? `• ${rev.companyOrRole}` : ''}
              </span>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Needs Business Outcome
              </span>
            </div>

            {/* Original Weak Bullet */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Original Bullet (Responsibility-Focused):
              </span>
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-200 font-mono text-xs sm:text-sm">
                "{rev.originalBullet}"
              </div>
            </div>

            {/* Recruiter Concern */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-400 block mb-1">Why It Falls Flat:</span>
                {rev.problem}
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                <span className="font-bold text-amber-400 block mb-1">Recruiter Concern:</span>
                {rev.recruiterConcern}
              </div>
            </div>

            {/* Recruiter Better Version */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Recruiter-Optimized Outcome Version:</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(rev.id, rev.betterVersion)}
                  className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded transition-colors"
                >
                  {copiedId === rev.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bullet</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-emerald-200 font-mono leading-relaxed font-medium">
                {rev.betterVersion}
              </p>

              {/* Metric Advice */}
              {rev.missingMetricAdvice && (
                <div className="pt-2 text-[11px] text-emerald-400/80 flex items-start space-x-1.5">
                  <HelpCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>Metric Tip: {rev.missingMetricAdvice}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Bullet Studio Sandbox */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-xl mt-8">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>On-Demand Bullet Rewriter Sandbox</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Have another bullet point you'd like roasted and rewritten according to the Action-Outcome formula? Paste it below:
        </p>

        <form onSubmit={handleCustomRewrite} className="space-y-4">
          <textarea
            rows={3}
            value={customBullet}
            onChange={(e) => setCustomBullet(e.target.value)}
            placeholder="e.g. Worked with design and engineering to build new features on the mobile app."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-200 font-mono focus:outline-none focus:border-amber-500"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isRewritingCustom || !customBullet.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRewritingCustom ? 'animate-spin' : ''}`} />
              <span>{isRewritingCustom ? 'Transforming...' : 'Rewrite with Recruiter Formula'}</span>
            </button>
          </div>
        </form>

        {customRewriteResult && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Recruiter Result:
              </span>
              <button
                type="button"
                onClick={() => handleCopy('custom', customRewriteResult.betterVersion)}
                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
              >
                {copiedId === 'custom' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'custom' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200 font-mono leading-relaxed">
              {customRewriteResult.betterVersion}
            </p>
            {customRewriteResult.metricsAdvice && (
              <p className="text-[11px] text-emerald-400/80">
                💡 Tip: {customRewriteResult.metricsAdvice}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
