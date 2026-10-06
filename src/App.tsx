import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadZone } from './components/UploadZone';
import { ScoreOverview } from './components/ScoreOverview';
import { RecruiterRoastCard } from './components/RecruiterRoastCard';
import { TopProblemsList } from './components/TopProblemsList';
import { BulletAnalyzer } from './components/BulletAnalyzer';
import { JobMatchSection } from './components/JobMatchSection';
import { ATSStructureSection } from './components/ATSStructureSection';
import { ImprovementStudio } from './components/ImprovementStudio';
import { ExportView } from './components/ExportView';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ResumeAnalysis } from './types/resume';
import { analyzeResumeApi, AnalyzeResumeParams } from './services/api';
import { AlertCircle, Flame, Sparkles } from 'lucide-react';

export default function App() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resume_roast_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
  }, []);

  const saveToHistory = (newAnalysis: ResumeAnalysis) => {
    try {
      const updated = [newAnalysis, ...history.filter((h) => h.id !== newAnalysis.id)].slice(0, 15);
      setHistory(updated);
      localStorage.setItem('resume_roast_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to history:', e);
    }
  };

  const deleteFromHistory = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('resume_roast_history', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update history:', e);
    }
  };

  const handleAnalyze = async (payload: AnalyzeResumeParams & { fileSize?: string }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await analyzeResumeApi(payload);
      if (payload.fileSize) {
        result.fileSize = payload.fileSize;
      }
      setAnalysis(result);
      saveToHistory(result);
      setActiveTab('overview');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while analyzing the resume.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewRoast = () => {
    setAnalysis(null);
    setErrorMessage(null);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Sticky Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasAnalysis={Boolean(analysis)}
        onNewRoast={handleNewRoast}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold">Analysis Notice: </span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-400 hover:text-white px-2 py-1 rounded bg-rose-500/20"
            >
              Dismiss
            </button>
          </div>
        )}

        {!analysis ? (
          /* Step 1: Upload / Input Zone */
          <UploadZone onAnalyze={handleAnalyze} isLoading={isLoading} />
        ) : (
          /* Step 2: Recruiter Roast Analysis Dashboard */
          <div>
            {activeTab === 'overview' && (
              <ScoreOverview
                analysis={analysis}
                onGoToImprovement={() => setActiveTab('improve')}
                onGoToTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'roast' && (
              <RecruiterRoastCard
                roast={analysis.recruiterRoast}
                onGoToImprovement={() => setActiveTab('improve')}
                onGoToBullets={() => setActiveTab('bullets')}
              />
            )}

            {activeTab === 'problems' && (
              <TopProblemsList problems={analysis.topProblems || []} />
            )}

            {activeTab === 'bullets' && (
              <BulletAnalyzer
                bulletReviews={analysis.bulletReviews || []}
                targetRole={analysis.targetRole}
              />
            )}

            {activeTab === 'jobmatch' && (
              <JobMatchSection analysis={analysis} />
            )}

            {activeTab === 'ats' && (
              <ATSStructureSection analysis={analysis} />
            )}

            {activeTab === 'improve' && (
              <ImprovementStudio analysis={analysis} />
            )}

            {activeTab === 'export' && (
              <ExportView analysis={analysis} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
            <span className="font-bold text-slate-300">Resume Roast AI</span>
            <span>— 10+ Year Recruiter Screening & ATS Intelligence</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Simulated recruiter evaluations are advisory only and do not guarantee hiring decisions.
          </div>
        </div>
      </footer>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(saved) => {
          setAnalysis(saved);
          setActiveTab('overview');
        }}
        onDelete={deleteFromHistory}
      />
    </div>
  );
}
