import React, { useState } from 'react';
import { Scale, Bookmark, PlusCircle, HelpCircle, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNewDecision: () => void;
  onOpenSaved: () => void;
  savedCount: number;
  onOpenCoinToss: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewDecision,
  onOpenSaved,
  savedCount,
  onOpenCoinToss,
}) => {
  const [showFrameworks, setShowFrameworks] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div
            onClick={onNewDecision}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400 group-hover:text-indigo-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                  The Tiebreaker
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Turn analysis paralysis into clear, confident conviction
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Frameworks Guide Button */}
            <button
              onClick={() => setShowFrameworks(true)}
              className="p-2 sm:px-3 sm:py-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Decision Frameworks Guide"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Frameworks</span>
            </button>

            {/* Quick Coin Toss */}
            <button
              onClick={onOpenCoinToss}
              className="px-2.5 sm:px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-amber-300 border border-slate-800 hover:border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>🪙</span>
              <span className="hidden sm:inline">Coin Toss</span>
            </button>

            {/* Saved Decisions */}
            <button
              onClick={onOpenSaved}
              className="relative px-2.5 sm:px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Bookmark className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="ml-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            {/* New Decision Button */}
            <button
              onClick={onNewDecision}
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Dilemma</span>
            </button>
          </div>
        </div>
      </header>

      {/* Decision Frameworks Modal */}
      {showFrameworks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">The Tiebreaker Frameworks</h3>
                  <p className="text-xs text-slate-400">
                    Scientific mental models embedded in your analysis
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFrameworks(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  1. Bezos Reversibility (Type 1 vs 2)
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Type 1 decisions are one-way doors (almost irreversible, high stakes). Type 2 decisions are two-way doors (easily walked back). Most dilemmas feel like Type 1, but are actually Type 2.
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  2. The 10/10/10 Rule
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Formulated by Suzy Welch. Evaluates how you will perceive the outcome in 10 minutes (emotional gut), 10 months (routine reality), and 10 years (regret or legacy).
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  3. Gary Klein's Pre-Mortem
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Assuming your chosen option failed 1 year in the future, what caused it? Used by our Devil's Advocate tab to proactively generate de-risking actions today.
                </p>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  4. Weighted Decision Matrix (Pugh Matrix)
                </span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Multi-attribute utility analysis. Removes emotional bias by multiplying raw performance scores by your customized priority weights.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowFrameworks(false)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
