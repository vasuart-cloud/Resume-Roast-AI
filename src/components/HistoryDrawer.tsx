import React from 'react';
import { ResumeAnalysis } from '../types/resume';
import { X, Trash2, ArrowRight, Clock, Award, FileText } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ResumeAnalysis[];
  onSelect: (analysis: ResumeAnalysis) => void;
  onDelete: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-950 border-l border-slate-800 h-full flex flex-col p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Saved Resume Roasts ({history.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs">
              No saved resumes yet. Upload or try a sample resume to get your first roast!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white line-clamp-1">
                    {item.candidateName || 'Candidate Profile'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.overallScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : item.overallScore >= 70
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {item.overallScore}/100
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Delete from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-1">
                  Target: {item.targetRole || 'Not specified'}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                  <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      onSelect(item);
                      onClose();
                    }}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                  >
                    <span>Load Roast</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
