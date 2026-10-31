import React, { useState, useMemo } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, BarChart2, Layers, Sparkles } from 'lucide-react';
import { ComparisonMatrix, OptionInput } from '../types';

interface ScoreVisualizationChartProps {
  comparisonMatrix: ComparisonMatrix;
  options: OptionInput[];
  weights: Record<string, number>;
}

// Color palettes for distinct options
const OPTION_COLORS = [
  { stroke: '#818cf8', fill: '#6366f1', name: 'Indigo' },
  { stroke: '#34d399', fill: '#10b981', name: 'Emerald' },
  { stroke: '#fbbf24', fill: '#f59e0b', name: 'Amber' },
  { stroke: '#f472b6', fill: '#ec4899', name: 'Pink' },
  { stroke: '#38bdf8', fill: '#0ea5e9', name: 'Sky' },
];

export const ScoreVisualizationChart: React.FC<ScoreVisualizationChartProps> = ({
  comparisonMatrix,
  options,
  weights,
}) => {
  const [chartType, setChartType] = useState<'radar' | 'bar'>('radar');
  const [scoreMode, setScoreMode] = useState<'weighted' | 'raw'>('weighted');

  // Format dataset for Recharts
  const chartData = useMemo(() => {
    return comparisonMatrix.criteria.map((crit) => {
      const weight = weights[crit.name] ?? 3;
      const row: Record<string, any> = {
        criterion: crit.name,
        fullCriterion: crit.name,
        weight,
      };

      crit.scores.forEach((s) => {
        const optionKey = `opt_${s.optionIndex}`;
        const rawScore = s.score;
        const weightedScore = rawScore * weight;
        row[optionKey] = scoreMode === 'weighted' ? weightedScore : rawScore;
        row[`${optionKey}_raw`] = rawScore;
        row[`${optionKey}_weighted`] = weightedScore;
      });

      return row;
    });
  }, [comparisonMatrix, weights, scoreMode]);

  // Find max score for axis limits
  const maxAxisValue = useMemo(() => {
    if (scoreMode === 'raw') return 10;
    // max possible weighted score is 10 * 5 = 50
    return 50;
  }, [scoreMode]);

  // Custom Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs">
          <p className="font-bold text-white text-sm mb-1.5">{label}</p>
          <div className="space-y-1.5">
            {payload.map((entry: any, index: number) => {
              const optIndex = Number(entry.dataKey.replace('opt_', ''));
              const optName = options[optIndex]?.name || `Option ${optIndex + 1}`;
              const weight = entry.payload.weight;
              const raw = entry.payload[`opt_${optIndex}_raw`];
              const weighted = entry.payload[`opt_${optIndex}_weighted`];

              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: entry.stroke || entry.fill }}
                    />
                    <span className="text-slate-300 font-medium">{optName}:</span>
                  </div>
                  <span className="font-bold text-white">
                    {scoreMode === 'weighted' ? (
                      <>
                        {weighted} pts <span className="text-slate-500 font-normal">({raw} × {weight}w)</span>
                      </>
                    ) : (
                      <>{raw}/10</>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-5">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Activity className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">
              Criteria Score Visualization
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              Recharts Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare shape and trade-offs across all dimensions
          </p>
        </div>

        {/* Controls: Chart Type & Score Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Score mode: Weighted vs Raw */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setScoreMode('weighted')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                scoreMode === 'weighted'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weighted
            </button>
            <button
              type="button"
              onClick={() => setScoreMode('raw')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                scoreMode === 'raw'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw (1-10)
            </button>
          </div>

          {/* Chart Type: Radar vs Bar */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setChartType('radar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                chartType === 'radar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Radar</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                chartType === 'bar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Bar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-80 sm:h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'radar' ? (
            <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="criterion"
                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, maxAxisValue]}
                tick={{ fill: '#64748b', fontSize: 10 }}
                stroke="#334155"
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value: string) => {
                  const optIdx = Number(value.replace('opt_', ''));
                  return (
                    <span className="text-xs text-slate-300 font-medium">
                      {options[optIdx]?.name || `Option ${optIdx + 1}`}
                    </span>
                  );
                }}
              />
              {options.map((_, idx) => {
                const colors = OPTION_COLORS[idx % OPTION_COLORS.length];
                return (
                  <Radar
                    key={`opt_${idx}`}
                    name={`opt_${idx}`}
                    dataKey={`opt_${idx}`}
                    stroke={colors.stroke}
                    fill={colors.fill}
                    fillOpacity={0.3}
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: colors.stroke, strokeWidth: 1 }}
                  />
                );
              })}
            </RadarChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 40, left: 0 }}
            >
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="criterion"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 11 }}
                interval={0}
                angle={-18}
                textAnchor="end"
                height={50}
              />
              <YAxis
                domain={[0, maxAxisValue]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value: string) => {
                  const optIdx = Number(value.replace('opt_', ''));
                  return (
                    <span className="text-xs text-slate-300 font-medium">
                      {options[optIdx]?.name || `Option ${optIdx + 1}`}
                    </span>
                  );
                }}
              />
              {options.map((_, idx) => {
                const colors = OPTION_COLORS[idx % OPTION_COLORS.length];
                return (
                  <Bar
                    key={`opt_${idx}`}
                    name={`opt_${idx}`}
                    dataKey={`opt_${idx}`}
                    fill={colors.fill}
                    radius={[5, 5, 0, 0]}
                    maxBarSize={36}
                  />
                );
              })}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Dynamic Visual Reading Insight */}
      <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">Visual takeaway:</span> The larger the surface area enclosed by an option's polygon on the radar, the more balanced and dominant its overall performance is across your prioritized criteria.
        </div>
      </div>
    </div>
  );
};
