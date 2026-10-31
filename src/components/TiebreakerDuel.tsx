import React, { useState } from 'react';
import { Swords, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { DuelQuestion } from '../types';

interface TiebreakerDuelProps {
  questions: DuelQuestion[];
  options: { name: string }[];
  onFinishDuel?: (winnerOptionIndex: number) => void;
}

export const TiebreakerDuel: React.FC<TiebreakerDuelProps> = ({
  questions,
  options,
  onFinishDuel,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
        No duel questions generated for this decision.
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  const handleSelect = (favorsOptionIndex: number) => {
    const updated = { ...answers, [currentQ.id]: favorsOptionIndex };
    setAnswers(updated);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      // calculate winner
      const tally: Record<number, number> = {};
      Object.values(updated).forEach((idx) => {
        tally[idx] = (tally[idx] || 0) + 1;
      });
      let topIdx = 0;
      let topScore = -1;
      Object.entries(tally).forEach(([idxStr, score]) => {
        const idx = Number(idxStr);
        if (score > topScore) {
          topScore = score;
          topIdx = idx;
        }
      });
      if (onFinishDuel) {
        onFinishDuel(topIdx);
      }
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    setIsCompleted(false);
  };

  // Score breakdown
  const optionScores: Record<number, number> = {};
  options.forEach((_, i) => {
    optionScores[i] = 0;
  });
  Object.values(answers).forEach((favorsIdx) => {
    optionScores[favorsIdx] = (optionScores[favorsIdx] || 0) + 1;
  });

  const totalAnswered = Object.keys(answers).length;

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-5 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 rounded-2xl flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
          <Swords className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            The Tiebreaker Rapid Duel
            <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Micro-Tradeoff Test
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            When logic is deadlocked, micro-scenarios expose what you truly value. Answer spontaneously without overanalyzing.
          </p>
        </div>
      </div>

      {/* Progress & Live Scores */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>
            Question {Math.min(currentIdx + 1, questions.length)} of {questions.length}
          </span>
          <span>{Math.round((totalAnswered / questions.length) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex gap-1">
          {options.map((opt, i) => {
            const count = optionScores[i] || 0;
            const pct = totalAnswered > 0 ? (count / totalAnswered) * 100 : 0;
            const colors = [
              'bg-indigo-500',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-rose-500',
            ];
            return (
              <div
                key={opt.name}
                className={`h-full transition-all duration-500 ${colors[i % colors.length]}`}
                style={{ width: `${pct}%` }}
                title={`${opt.name}: ${count} votes`}
              />
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
          {options.map((opt, i) => {
            const dots = [
              'bg-indigo-400',
              'bg-emerald-400',
              'bg-amber-400',
              'bg-rose-400',
            ];
            return (
              <div key={opt.name} className="flex items-center gap-1.5 text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${dots[i % dots.length]}`} />
                <span>
                  {opt.name}: <strong className="text-white">{optionScores[i] || 0} pts</strong>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Question or Completion Screen */}
      {!isCompleted ? (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-6 animate-fadeIn">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Scenario #{currentIdx + 1}
            </span>
            <h4 className="text-base sm:text-lg font-semibold text-white mt-1 leading-snug">
              {currentQ.scenario}
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Choice A */}
            <button
              onClick={() => handleSelect(currentQ.choiceA.favorsOptionIndex)}
              className="p-5 bg-slate-800/60 hover:bg-indigo-950/40 border border-slate-700 hover:border-indigo-500 rounded-xl text-left transition-all group flex flex-col justify-between min-h-[120px]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-700 group-hover:bg-indigo-600 text-slate-200 group-hover:text-white transition-colors">
                  Choice A
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-indigo-300">
                  Leans toward Option {currentQ.choiceA.favorsOptionIndex + 1}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-100 group-hover:text-white mt-3">
                {currentQ.choiceA.text}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Select this trade-off</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Choice B */}
            <button
              onClick={() => handleSelect(currentQ.choiceB.favorsOptionIndex)}
              className="p-5 bg-slate-800/60 hover:bg-emerald-950/40 border border-slate-700 hover:border-emerald-500 rounded-xl text-left transition-all group flex flex-col justify-between min-h-[120px]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-700 group-hover:bg-emerald-600 text-slate-200 group-hover:text-white transition-colors">
                  Choice B
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-emerald-300">
                  Leans toward Option {currentQ.choiceB.favorsOptionIndex + 1}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-100 group-hover:text-white mt-3">
                {currentQ.choiceB.text}
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Select this trade-off</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Completed Duel Summary */
        <div className="p-6 bg-gradient-to-b from-slate-900 to-indigo-950/40 border border-indigo-500/40 rounded-2xl text-center space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto text-2xl">
            🏆
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Duel Complete • Gut Verdict
            </span>
            <h4 className="text-2xl font-black text-white mt-1">
              Your Subconscious Favors:
            </h4>
            <p className="text-xl font-bold text-amber-300 mt-1">
              {(() => {
                let maxIdx = 0;
                let maxPts = -1;
                Object.entries(optionScores).forEach(([idx, pts]) => {
                  if (pts > maxPts) {
                    maxPts = pts;
                    maxIdx = Number(idx);
                  }
                });
                return options[maxIdx]?.name || `Option ${maxIdx + 1}`;
              })()}
            </p>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2">
              Across {questions.length} situational trade-offs, you consistently favored outcomes aligned with this path. When forced to choose in small dilemmas, this is where your priorities lie.
            </p>
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retake Duel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
