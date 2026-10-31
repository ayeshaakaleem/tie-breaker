import React, { useState, useMemo } from 'react';
import { Sliders, Trophy, Plus, Trash2, Info, BarChart3 } from 'lucide-react';
import { ComparisonMatrix, OptionInput } from '../types';
import { ScoreVisualizationChart } from './ScoreVisualizationChart';

interface ComparisonMatrixViewProps {
  comparisonMatrix: ComparisonMatrix;
  options: OptionInput[];
  onWeightsChange?: (weights: Record<string, number>) => void;
  initialWeights?: Record<string, number>;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  comparisonMatrix,
  options,
  onWeightsChange,
  initialWeights,
}) => {
  // Criteria weights: default each criterion to 3 (out of 5)
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    if (initialWeights && Object.keys(initialWeights).length > 0) {
      return initialWeights;
    }
    const defaultWeights: Record<string, number> = {};
    comparisonMatrix.criteria.forEach((c) => {
      defaultWeights[c.name] = 3;
    });
    return defaultWeights;
  });

  const [activeComment, setActiveComment] = useState<{
    criterion: string;
    optionName: string;
    comment: string;
  } | null>(null);

  const handleWeightChange = (criterionName: string, newWeight: number) => {
    const updated = { ...weights, [criterionName]: newWeight };
    setWeights(updated);
    if (onWeightsChange) {
      onWeightsChange(updated);
    }
  };

  // Compute weighted totals
  const optionTotals = useMemo(() => {
    const totals: Record<number, { rawTotal: number; weightedTotal: number; maxPossible: number }> = {};
    options.forEach((_, idx) => {
      totals[idx] = { rawTotal: 0, weightedTotal: 0, maxPossible: 0 };
    });

    comparisonMatrix.criteria.forEach((crit) => {
      const weight = weights[crit.name] ?? 3;
      crit.scores.forEach((sc) => {
        const idx = sc.optionIndex;
        if (totals[idx]) {
          totals[idx].rawTotal += sc.score;
          totals[idx].weightedTotal += sc.score * weight;
          totals[idx].maxPossible += 10 * weight;
        }
      });
    });

    return totals;
  }, [comparisonMatrix, options, weights]);

  // Identify highest scoring option
  const winnerIndex = useMemo(() => {
    let bestIdx = 0;
    let maxWeighted = -1;
    Object.entries(optionTotals).forEach(([idxStr, data]) => {
      const idx = Number(idxStr);
      if (data.weightedTotal > maxWeighted) {
        maxWeighted = data.weightedTotal;
        bestIdx = idx;
      }
    });
    return bestIdx;
  }, [optionTotals]);

  return (
    <div className="space-y-6">
      {/* Dynamic Winner Banner */}
      <div className="p-5 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Weighted Decision Matrix Leader
            </span>
            <h3 className="text-lg font-bold text-white">
              {options[winnerIndex]?.name || `Option ${winnerIndex + 1}`}
            </h3>
            <p className="text-xs text-slate-300">
              Weighted Score: {optionTotals[winnerIndex]?.weightedTotal} pts (
              {Math.round(
                (optionTotals[winnerIndex]?.weightedTotal /
                  (optionTotals[winnerIndex]?.maxPossible || 1)) *
                  100
              )}
              % efficiency based on your custom criteria weights)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs text-slate-400 flex items-center gap-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Adjust weight sliders below to calibrate
          </span>
        </div>
      </div>

      {/* Visual Recharts Radar/Bar Chart Section */}
      <ScoreVisualizationChart
        comparisonMatrix={comparisonMatrix}
        options={options}
        weights={weights}
      />

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/60">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-1/3">
                Criterion & Importance Weight
              </th>
              {options.map((opt, idx) => (
                <th key={opt.id} className="p-4 text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    {idx === winnerIndex && (
                      <span className="text-amber-400" title="Weighted Winner">
                        👑
                      </span>
                    )}
                    <span className="line-clamp-1">{opt.name}</span>
                  </div>
                  <span className="text-[11px] font-normal text-slate-400 block mt-0.5">
                    Score: {optionTotals[idx]?.weightedTotal} pts
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {comparisonMatrix.criteria.map((criterion) => {
              const weight = weights[criterion.name] ?? 3;
              return (
                <tr key={criterion.name} className="hover:bg-slate-800/30 transition-colors">
                  {/* Criterion + Slider */}
                  <td className="p-4 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          {criterion.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {criterion.description}
                        </span>
                      </div>
                    </div>

                    {/* Weight slider */}
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-[10px] font-semibold uppercase text-slate-400">
                        Weight:
                      </span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={weight}
                        onChange={(e) =>
                          handleWeightChange(criterion.name, Number(e.target.value))
                        }
                        className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <span className="text-xs font-bold text-indigo-400 w-4">
                        {weight}x
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {weight === 5
                          ? '(Critical)'
                          : weight === 4
                          ? '(High)'
                          : weight === 3
                          ? '(Moderate)'
                          : weight === 2
                          ? '(Low)'
                          : '(Minor)'}
                      </span>
                    </div>
                  </td>

                  {/* Option scores */}
                  {options.map((_, optIdx) => {
                    const scoreObj = criterion.scores.find(
                      (s) => s.optionIndex === optIdx
                    );
                    const rawScore = scoreObj?.score || 0;
                    const weightedScore = rawScore * weight;

                    return (
                      <td key={optIdx} className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border ${
                              rawScore >= 8
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                : rawScore >= 5
                                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                                : 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                            }`}
                          >
                            {rawScore}
                            <span className="text-[10px] text-slate-400 font-normal">/10</span>
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold text-slate-300 block">
                              +{weightedScore} pts
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              ({rawScore} × {weight}w)
                            </span>
                          </div>
                        </div>

                        {/* Rationale tooltip button */}
                        {scoreObj?.comment && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveComment({
                                criterion: criterion.name,
                                optionName: options[optIdx]?.name || `Option ${optIdx + 1}`,
                                comment: scoreObj.comment,
                              })
                            }
                            className="mt-2 inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <Info className="w-3 h-3" />
                            <span>Why {rawScore}/10?</span>
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-slate-950/80 font-bold border-t-2 border-slate-700">
              <td className="p-4 text-xs font-bold uppercase tracking-wider text-slate-300">
                Final Weighted Total
              </td>
              {options.map((_, idx) => (
                <td key={idx} className="p-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-extrabold ${
                        idx === winnerIndex ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      {optionTotals[idx]?.weightedTotal} pts
                    </span>
                    {idx === winnerIndex && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Top Choice
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block font-normal">
                    Raw avg: {(optionTotals[idx]?.rawTotal / (comparisonMatrix.criteria.length || 1)).toFixed(1)}/10
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Rationale Modal if opened */}
      {activeComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <span className="text-[11px] font-bold uppercase text-indigo-400">
              {activeComment.criterion} • {activeComment.optionName}
            </span>
            <h4 className="text-base font-bold text-white mt-1 mb-3">AI Evaluation Rationale</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
              {activeComment.comment}
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setActiveComment(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
