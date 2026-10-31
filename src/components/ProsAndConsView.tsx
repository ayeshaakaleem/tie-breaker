import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, Plus, ShieldCheck, HelpCircle } from 'lucide-react';
import { OptionAnalysis } from '../types';

interface ProsAndConsViewProps {
  optionsAnalysis: OptionAnalysis[];
}

export const ProsAndConsView: React.FC<ProsAndConsViewProps> = ({ optionsAnalysis }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [customPros, setCustomPros] = useState<Record<number, string[]>>({});
  const [customCons, setCustomCons] = useState<Record<number, string[]>>({});
  const [newProInput, setNewProInput] = useState('');
  const [newConInput, setNewConInput] = useState('');

  const currentOption = optionsAnalysis[activeTab] || optionsAnalysis[0];

  const handleAddPro = () => {
    if (!newProInput.trim()) return;
    setCustomPros((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newProInput.trim()],
    }));
    setNewProInput('');
  };

  const handleAddCon = () => {
    if (!newConInput.trim()) return;
    setCustomCons((prev) => ({
      ...prev,
      [activeTab]: [...(prev[activeTab] || []), newConInput.trim()],
    }));
    setNewConInput('');
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-slate-800">
        {optionsAnalysis.map((opt, idx) => (
          <button
            key={opt.optionName}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center gap-2 ${
              activeTab === idx
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs">
              {idx + 1}
            </span>
            <span className="truncate max-w-[200px]">{opt.optionName}</span>
          </button>
        ))}
      </div>

      {currentOption && (
        <div className="space-y-6">
          {/* Tagline Header */}
          <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Option Profile
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {currentOption.optionName}
              </h3>
            </div>
            <span className="text-xs sm:text-sm text-slate-300 italic px-3 py-1 bg-slate-800/80 rounded-lg border border-slate-700/60 max-w-sm text-right">
              "{currentOption.tagline}"
            </span>
          </div>

          {/* Pros & Cons Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pros Column */}
            <div className="p-5 bg-gradient-to-b from-emerald-950/20 to-slate-900 border border-emerald-500/30 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                    Pros & Advantages
                  </h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {currentOption.pros.length + (customPros[activeTab]?.length || 0)} Factors
                </span>
              </div>

              <div className="space-y-3">
                {currentOption.pros.map((pro, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 rounded-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{pro.point}</p>
                      <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {pro.impact} Impact (+{pro.score})
                      </span>
                    </div>
                    {pro.reasoning && (
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                        {pro.reasoning}
                      </p>
                    )}
                  </div>
                ))}

                {/* Custom user pros */}
                {customPros[activeTab]?.map((item, idx) => (
                  <div
                    key={`custom-pro-${idx}`}
                    className="p-3.5 bg-slate-900/80 border border-emerald-500/40 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{item}</p>
                      <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        Your Note
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add Custom Pro */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={newProInput}
                    onChange={(e) => setNewProInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddPro()}
                    placeholder="Add your own pro factor..."
                    className="flex-1 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={handleAddPro}
                    className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Cons Column */}
            <div className="p-5 bg-gradient-to-b from-rose-950/20 to-slate-900 border border-rose-500/30 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">
                    Cons & Trade-Offs
                  </h4>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300">
                  {currentOption.cons.length + (customCons[activeTab]?.length || 0)} Risks
                </span>
              </div>

              <div className="space-y-3">
                {currentOption.cons.map((con, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 rounded-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{con.point}</p>
                      <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
                        {con.severity} Risk (-{con.score})
                      </span>
                    </div>
                    {con.mitigation && (
                      <div className="mt-2 p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 flex items-start gap-1.5 text-xs text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>
                          <strong className="text-slate-300">Mitigation:</strong> {con.mitigation}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Custom user cons */}
                {customCons[activeTab]?.map((item, idx) => (
                  <div
                    key={`custom-con-${idx}`}
                    className="p-3.5 bg-slate-900/80 border border-rose-500/40 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-100">{item}</p>
                      <span className="shrink-0 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                        Your Note
                      </span>
                    </div>
                  </div>
                ))}

                {/* Add Custom Con */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    value={newConInput}
                    onChange={(e) => setNewConInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCon()}
                    placeholder="Add your own con or risk..."
                    className="flex-1 bg-slate-950/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={handleAddCon}
                    className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 10/10/10 Rule Perspective */}
          {currentOption.timeHorizon10x && (
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <Clock className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  The Suzy Welch 10/10/10 Rule
                </h4>
                <span className="text-xs text-slate-400">
                  (How will you feel about choosing {currentOption.optionName} across time?)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    ⏱️ In 10 Minutes
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {currentOption.timeHorizon10x.tenMinutes}
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    📅 In 10 Months
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {currentOption.timeHorizon10x.tenMonths}
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    🚀 In 10 Years
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                    {currentOption.timeHorizon10x.tenYears}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
