import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, Scale, Compass, Check, ArrowRight, BookOpen } from 'lucide-react';
import { DecisionInput, OptionInput } from '../types';
import { SAMPLE_DILEMMAS } from '../data/sampleDilemmas';

interface DecisionFormProps {
  onSubmit: (input: Omit<DecisionInput, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
  loadingStage?: string;
}

const CATEGORIES = [
  'Career',
  'Financial',
  'Relocation',
  'Business',
  'Lifestyle',
  'Personal',
  'Education',
];

const COMMON_PRIORITIES = [
  'Work-Life Balance',
  'Financial Upside',
  'Risk Minimization',
  'Career Growth',
  'Freedom & Flexibility',
  'Peace of Mind',
  'Family & Relationships',
  'Speed of Execution',
];

export const DecisionForm: React.FC<DecisionFormProps> = ({
  onSubmit,
  isLoading,
  loadingStage,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career');
  const [context, setContext] = useState('');
  const [options, setOptions] = useState<OptionInput[]>([
    { id: 'opt-1', name: '', notes: '' },
    { id: 'opt-2', name: '', notes: '' },
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([
    'Work-Life Balance',
    'Financial Upside',
  ]);
  const [customPriorityInput, setCustomPriorityInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 5) return;
    setOptions([
      ...options,
      { id: `opt-${Date.now()}`, name: '', notes: '' },
    ]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'name' | 'notes', val: string) => {
    const updated = [...options];
    updated[index] = { ...updated[index], [field]: val };
    setOptions(updated);
  };

  const togglePriority = (p: string) => {
    if (selectedPriorities.includes(p)) {
      setSelectedPriorities(selectedPriorities.filter((item) => item !== p));
    } else {
      setSelectedPriorities([...selectedPriorities, p]);
    }
  };

  const handleAddCustomPriority = () => {
    if (!customPriorityInput.trim()) return;
    if (!selectedPriorities.includes(customPriorityInput.trim())) {
      setSelectedPriorities([...selectedPriorities, customPriorityInput.trim()]);
    }
    setCustomPriorityInput('');
  };

  const loadPreset = (preset: typeof SAMPLE_DILEMMAS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setContext(preset.context);
    setOptions(preset.options);
    setSelectedPriorities(preset.userCriteria);
    setShowPresets(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const validOptions = options.filter((o) => o.name.trim().length > 0);
    if (validOptions.length < 2) return;

    onSubmit({
      title: title.trim(),
      category,
      context: context.trim(),
      options: validOptions,
      userCriteria: selectedPriorities,
    });
  };

  const isValid =
    title.trim().length > 0 &&
    options.filter((o) => o.name.trim().length > 0).length >= 2;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Presets bar */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Need inspiration? Try a realistic high-stakes scenario:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_DILEMMAS.slice(0, 3).map((preset) => (
            <button
              key={preset.sampleTag}
              type="button"
              onClick={() => loadPreset(preset)}
              className="px-3 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              {preset.sampleTag}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="px-2.5 py-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            {showPresets ? 'Close Presets' : 'View All (4)'}
          </button>
        </div>
      </div>

      {/* Preset cards modal/expansion */}
      {showPresets && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-900 border border-indigo-500/30 rounded-2xl animate-fadeIn">
          {SAMPLE_DILEMMAS.map((d) => (
            <div
              key={d.title}
              onClick={() => loadPreset(d)}
              className="p-3.5 bg-slate-800/50 hover:bg-indigo-950/30 border border-slate-700 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold uppercase tracking-wider text-indigo-400">
                  {d.category}
                </span>
                <span className="text-slate-400 group-hover:text-white">Click to Load →</span>
              </div>
              <h4 className="text-sm font-bold text-white group-hover:text-indigo-200">
                {d.title}
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.context}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Form */}
      <form
        onSubmit={handleSubmit}
        className="p-6 sm:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl space-y-7"
      >
        {/* Decision Title & Category */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-400" />
              What Decision Are You Trying to Make?
            </label>
            <span className="text-xs text-slate-500">Be clear and direct</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Accept new job offer at a startup vs stay at current corporate job..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Options Builder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Options to Compare (Minimum 2, Up to 5)
            </label>
            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Another Option
              </button>
            )}
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div
                key={opt.id}
                className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2.5 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Option {idx + 1}
                    </span>
                  </div>
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="text-slate-500 hover:text-rose-400 text-xs p-1 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  required
                  value={opt.name}
                  onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                  placeholder={`e.g. Option ${idx + 1}: ${
                    idx === 0
                      ? 'Take the Startup Offer (AI Team Lead)'
                      : idx === 1
                      ? 'Stay at Big Tech (Senior Engineer)'
                      : 'Freelance / Consult'
                  }`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="text"
                  value={opt.notes || ''}
                  onChange={(e) => handleOptionChange(idx, 'notes', e.target.value)}
                  placeholder="Optional details (e.g. comp, location, risks, commute, gut feeling...)"
                  className="w-full bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-slate-600"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Context & Personal Constraints */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Context, Stakes & Constraints (Optional)</span>
            <span className="text-[11px] text-slate-500 font-normal">
              Help AI calibrate to your reality
            </span>
          </label>
          <textarea
            rows={3}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. I have a 2-year-old child, 6 months of savings, need to decide by Friday, and I feel burned out by corporate politics but nervous about startup instability..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Priorities / Values */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            What Matters Most in this Decision? (Click to select)
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_PRIORITIES.map((priority) => {
              const isSelected = selectedPriorities.includes(priority);
              return (
                <button
                  key={priority}
                  type="button"
                  onClick={() => togglePriority(priority)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {priority}
                </button>
              );
            })}
          </div>

          {/* Add custom priority */}
          <div className="flex gap-2 pt-1 max-w-sm">
            <input
              type="text"
              value={customPriorityInput}
              onChange={(e) => setCustomPriorityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomPriority())}
              placeholder="Add another value or goal..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomPriority}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xl ${
              isValid && !isLoading
                ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 hover:opacity-95 text-white shadow-indigo-500/25 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{loadingStage || 'Synthesizing decision intelligence...'}</span>
              </div>
            ) : (
              <>
                <Scale className="w-5 h-5" />
                <span>Break The Tie with AI</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
