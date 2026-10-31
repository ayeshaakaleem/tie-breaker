import React, { useState } from 'react';
import { Target, Zap, TrendingUp, AlertTriangle, ShieldX, Plus } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface SwotViewProps {
  optionsAnalysis: OptionAnalysis[];
}

export const SwotView: React.FC<SwotViewProps> = ({ optionsAnalysis }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [userSwotAdditions, setUserSwotAdditions] = useState<
    Record<number, { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }>
  >({});
  const [activeInputQuadrant, setActiveInputQuadrant] = useState<string | null>(null);
  const [newPointText, setNewPointText] = useState('');

  const currentOption = optionsAnalysis[activeTab] || optionsAnalysis[0];

  const handleAddPoint = (quadrant: 'strengths' | 'weaknesses' | 'opportunities' | 'threats') => {
    if (!newPointText.trim()) return;
    setUserSwotAdditions((prev) => {
      const existing = prev[activeTab] || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
      return {
        ...prev,
        [activeTab]: {
          ...existing,
          [quadrant]: [...existing[quadrant], newPointText.trim()],
        },
      };
    });
    setNewPointText('');
    setActiveInputQuadrant(null);
  };

  const additions = userSwotAdditions[activeTab] || { strengths: [], weaknesses: [], opportunities: [], threats: [] };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div className="flex flex-wrap gap-2">
          {optionsAnalysis.map((opt, idx) => (
            <button
              key={opt.optionName}
              onClick={() => {
                setActiveTab(idx);
                setActiveInputQuadrant(null);
              }}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center gap-2 ${
                activeTab === idx
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">
                {idx + 1}
              </span>
              <span className="truncate max-w-[200px]">{opt.optionName}</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Internal (S/W) vs External (O/T) Strategic Framework</span>
        </div>
      </div>

      {currentOption && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              SWOT Matrix: <span className="text-indigo-400">{currentOption.optionName}</span>
            </h3>
            <span className="text-xs text-slate-400 italic">
              {currentOption.tagline}
            </span>
          </div>

          {/* 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-5 bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Strengths</h4>
                      <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">
                        Internal Advantages
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.strengths.map((str, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                  {additions.strengths.map((str, i) => (
                    <li key={`custom-str-${i}`} className="text-xs sm:text-sm text-emerald-200 flex items-start gap-2 bg-emerald-500/10 p-2 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{str} (Your Note)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Point */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                {activeInputQuadrant === 'strengths' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPointText}
                      onChange={(e) => setNewPointText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPoint('strengths')}
                      placeholder="Add strength..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      onClick={() => handleAddPoint('strengths')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveInputQuadrant('strengths');
                      setNewPointText('');
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add custom strength
                  </button>
                )}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="p-5 bg-gradient-to-br from-amber-950/20 to-slate-900 border border-amber-500/30 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Weaknesses</h4>
                      <span className="text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                        Internal Vulnerabilities
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.weaknesses.map((w, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                  {additions.weaknesses.map((w, i) => (
                    <li key={`custom-w-${i}`} className="text-xs sm:text-sm text-amber-200 flex items-start gap-2 bg-amber-500/10 p-2 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{w} (Your Note)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Point */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                {activeInputQuadrant === 'weaknesses' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPointText}
                      onChange={(e) => setNewPointText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPoint('weaknesses')}
                      placeholder="Add weakness..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      onClick={() => handleAddPoint('weaknesses')}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveInputQuadrant('weaknesses');
                      setNewPointText('');
                    }}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add custom weakness
                  </button>
                )}
              </div>
            </div>

            {/* Opportunities */}
            <div className="p-5 bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Opportunities</h4>
                      <span className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
                        External Tailwinds & Upside
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.opportunities.map((opp, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                      <span>{opp}</span>
                    </li>
                  ))}
                  {additions.opportunities.map((opp, i) => (
                    <li key={`custom-opp-${i}`} className="text-xs sm:text-sm text-indigo-200 flex items-start gap-2 bg-indigo-500/10 p-2 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{opp} (Your Note)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Point */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                {activeInputQuadrant === 'opportunities' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPointText}
                      onChange={(e) => setNewPointText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPoint('opportunities')}
                      placeholder="Add opportunity..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      onClick={() => handleAddPoint('opportunities')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveInputQuadrant('opportunities');
                      setNewPointText('');
                    }}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add custom opportunity
                  </button>
                )}
              </div>
            </div>

            {/* Threats */}
            <div className="p-5 bg-gradient-to-br from-rose-950/20 to-slate-900 border border-rose-500/30 rounded-2xl flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <ShieldX className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Threats</h4>
                      <span className="text-[10px] text-rose-400 uppercase tracking-wider font-semibold">
                        External Risks & Competitors
                      </span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {currentOption.swot.threats.map((t, i) => (
                    <li key={i} className="text-xs sm:text-sm text-slate-200 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                  {additions.threats.map((t, i) => (
                    <li key={`custom-t-${i}`} className="text-xs sm:text-sm text-rose-200 flex items-start gap-2 bg-rose-500/10 p-2 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{t} (Your Note)</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Add Point */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                {activeInputQuadrant === 'threats' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPointText}
                      onChange={(e) => setNewPointText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddPoint('threats')}
                      placeholder="Add threat..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                    />
                    <button
                      onClick={() => handleAddPoint('threats')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveInputQuadrant('threats');
                      setNewPointText('');
                    }}
                    className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add custom threat
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
