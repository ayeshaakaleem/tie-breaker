import React from 'react';
import { X, Calendar, CheckCircle2, Clock, Trash2, ArrowRight, BookmarkCheck } from 'lucide-react';
import { SavedDecisionRecord } from '../types';

interface SavedDecisionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: SavedDecisionRecord[];
  onSelectDecision: (record: SavedDecisionRecord) => void;
  onDeleteDecision: (id: string, e: React.MouseEvent) => void;
  activeDecisionId?: string;
}

export const SavedDecisionsDrawer: React.FC<SavedDecisionsDrawerProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
  activeDecisionId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Decision History</h3>
              <p className="text-xs text-slate-400">
                {savedDecisions.length} {savedDecisions.length === 1 ? 'dilemma' : 'dilemmas'} saved locally
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                ⚖️
              </div>
              <p className="text-sm font-medium text-slate-300">No decisions saved yet</p>
              <p className="text-xs text-slate-500 mt-1">
                When you analyze a dilemma, click "Save Decision" to keep track of your choices.
              </p>
            </div>
          ) : (
            savedDecisions.map((record) => {
              const isSelected = activeDecisionId === record.id;
              const dateStr = new Date(record.updatedAt || record.input.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const isDecided = record.input.status === 'decided';

              return (
                <div
                  key={record.id}
                  onClick={() => {
                    onSelectDecision(record);
                    onClose();
                  }}
                  className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/50 ring-1 ring-indigo-500/30'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-300">
                      {record.input.category || 'General'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isDecided ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Decided
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          <Clock className="w-3 h-3" /> In Progress
                        </span>
                      )}
                      <button
                        onClick={(e) => onDeleteDecision(record.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete decision"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {record.input.title}
                  </h4>

                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                    <span>•</span>
                    <span>{record.input.options.length} options</span>
                  </div>

                  {record.analysis?.tiebreakerVerdict && (
                    <div className="mt-2.5 pt-2.5 border-t border-slate-700/50 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Top pick:{' '}
                        <strong className="text-slate-200">
                          {record.analysis.tiebreakerVerdict.recommendedOptionName}
                        </strong>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
