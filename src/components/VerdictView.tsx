import React from 'react';
import { Award, Compass, HelpCircle, DoorOpen, CheckCircle, ArrowRight, Sparkles, CheckCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TiebreakerVerdict, OptionInput } from '../types';

interface VerdictViewProps {
  verdict: TiebreakerVerdict;
  options: OptionInput[];
  onOpenCoinToss: () => void;
  onCommitDecision: (chosenOptionIndex: number) => void;
  isDecided?: boolean;
  chosenOptionIndex?: number;
}

export const VerdictView: React.FC<VerdictViewProps> = ({
  verdict,
  options,
  onOpenCoinToss,
  onCommitDecision,
  isDecided,
  chosenOptionIndex,
}) => {
  const isOneWay = verdict.reversibilityType.toLowerCase().includes('one-way');

  const triggerCelebration = (indexToCommit: number) => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'],
    });
    onCommitDecision(indexToCommit);
  };

  const winningOption = options[verdict.recommendedOptionIndex] || {
    name: verdict.recommendedOptionName,
  };

  return (
    <div className="space-y-6">
      {/* Crown Recommendation Hero Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950/40 border border-indigo-500/40 rounded-3xl shadow-2xl">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold tracking-wide uppercase">
              <Award className="w-4 h-4 text-amber-400" />
              The Tiebreaker Recommendation
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">AI Confidence:</span>
              <div className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-white">
                  {verdict.confidenceScore}%
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {verdict.recommendedOptionName}
          </h2>

          <p className="text-sm sm:text-base font-semibold text-amber-300/90 mt-2">
            "{verdict.headline}"
          </p>

          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed max-w-3xl">
            {verdict.executiveSummary}
          </p>

          {/* Quick Commit Action */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Ready to pull the trigger and free your mental bandwidth?</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenCoinToss}
                className="px-4 py-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-colors"
              >
                <span>🪙 Gut-Check Coin Toss</span>
              </button>

              <button
                onClick={() => triggerCelebration(verdict.recommendedOptionIndex)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg ${
                  isDecided
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                }`}
              >
                <CheckCheck className="w-4 h-4" />
                {isDecided
                  ? `Decided: ${options[chosenOptionIndex ?? verdict.recommendedOptionIndex]?.name || 'Option'}`
                  : `Commit to ${verdict.recommendedOptionName}`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Decision Frameworks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* The Deciding Question */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-indigo-400 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                The Deciding Question (The Core Tipping Point)
              </h4>
            </div>
            <p className="text-sm sm:text-base font-bold text-white italic leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              "{verdict.theDecidingQuestion}"
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            If your honest answer to this single prompt is "Yes", your decision is effectively already made.
          </p>
        </div>

        {/* Reversibility: Type 1 vs Type 2 Door */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5 text-emerald-400">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Reversibility Architecture
                </h4>
              </div>

              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${
                  isOneWay
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {verdict.reversibilityType}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {verdict.reversibilityExplanation}
            </p>
          </div>

          <p className="text-[11px] text-slate-500 mt-4">
            Mental model inspired by Jeff Bezos: 70% of decisions are Two-Way Doors—reversible with low exit cost. Avoid agonizing over two-way doors.
          </p>
        </div>
      </div>

      {/* Immediate 3-Step Action Plan */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
          <Compass className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            Next 48 Hours: Execution Roadmap
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {verdict.actionPlan.map((step, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl relative group hover:border-indigo-500/40 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center text-xs font-bold mb-3">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
