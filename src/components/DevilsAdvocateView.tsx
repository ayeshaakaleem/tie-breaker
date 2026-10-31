import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Lightbulb, HelpCircle, Loader2, Send } from 'lucide-react';
import { AnalysisResult, ChallengeResponse } from '../types';

interface DevilsAdvocateViewProps {
  analysis: AnalysisResult;
  decisionTitle: string;
  context: string;
  options: { name: string }[];
}

export const DevilsAdvocateView: React.FC<DevilsAdvocateViewProps> = ({
  analysis,
  decisionTitle,
  context,
  options,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    analysis.tiebreakerVerdict.recommendedOptionName || options[0]?.name || ''
  );
  const [userQuery, setUserQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [challengeData, setChallengeData] = useState<ChallengeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunChallenge = async (customQuery?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/challenge-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: decisionTitle,
          chosenOption: selectedOption,
          options,
          context,
          userQuestion: customQuery || userQuery || 'What are the biggest blindspots and how do I de-risk this choice?',
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to stress-test choice (${res.status})`);
      }
      const data = await res.json();
      setChallengeData(data);
    } catch (err: any) {
      setError(err.message || 'Error executing devil’s advocate review.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/30 border border-rose-500/30 rounded-2xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Devil's Advocate Stress Test
              <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Pre-Mortem Analysis
              </span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Gary Klein's Nobel-recognized "Pre-Mortem" technique: Imagine you picked this option and 1 year later it failed. Why did it fail, and how do we prevent that today?
            </p>
          </div>
        </div>

        {/* Option Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Option to Stress-Test:
          </span>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => {
                  setSelectedOption(opt.name);
                  setChallengeData(null);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  selectedOption === opt.name
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 shadow-sm'
                    : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom prompt input */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Ask a specific worry (e.g. 'What if the market turns down?' or 'What if I hate the manager?')"
            className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
          />
          <button
            onClick={() => handleRunChallenge()}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Stress Testing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Challenge Choice
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Challenge Results */}
      {challengeData ? (
        <div className="space-y-5 animate-fadeIn">
          {/* Summary Box */}
          <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-lg">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
              The Reality Check
            </span>
            <p className="text-sm sm:text-base font-medium text-slate-200 mt-1 leading-relaxed">
              {challengeData.devilsAdvocateSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Blindspots */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Hidden Blind Spots
                </h4>
              </div>
              <ul className="space-y-2.5">
                {challengeData.blindspots.map((b, i) => (
                  <li key={i} className="text-xs sm:text-sm text-slate-300 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Worst Case */}
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  Realistic Worst-Case Scenario
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {challengeData.worstCaseScenario}
              </p>
            </div>
          </div>

          {/* De-risking Moves */}
          <div className="p-5 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                De-Risking Playbook (3 Concrete Safeguards)
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {challengeData.deriskingMoves.map((m, i) => (
                <div key={i} className="p-3 bg-slate-900/80 border border-emerald-500/20 rounded-xl text-xs text-slate-300">
                  <span className="inline-block w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 mb-2">
                    {i + 1}
                  </span>
                  <p>{m}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Acid Test Question */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" /> The Acid Test Question
            </div>
            <p className="text-sm sm:text-base font-bold text-white italic">
              "{challengeData.acidTestQuestion}"
            </p>
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-10 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-6">
            <p className="text-sm text-slate-400">
              Click <strong className="text-rose-400">"Challenge Choice"</strong> above to stress test <strong className="text-white">{selectedOption}</strong> and reveal blindspots before you commit.
            </p>
          </div>
        )
      )}
    </div>
  );
};
