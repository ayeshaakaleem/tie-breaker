import React, { useState } from 'react';
import {
  Award,
  BarChart3,
  Scale,
  Target,
  Swords,
  ShieldAlert,
  Bookmark,
  Share2,
  Printer,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AnalysisResult, DecisionInput } from '../types';
import { VerdictView } from './VerdictView';
import { ComparisonMatrixView } from './ComparisonMatrixView';
import { ProsAndConsView } from './ProsAndConsView';
import { SwotView } from './SwotView';
import { TiebreakerDuel } from './TiebreakerDuel';
import { DevilsAdvocateView } from './DevilsAdvocateView';

interface AnalysisContainerProps {
  input: DecisionInput;
  analysis: AnalysisResult;
  onBack: () => void;
  onSave: (customWeights?: Record<string, number>, duelAnswerWins?: number) => void;
  isSaved: boolean;
  onOpenCoinToss: () => void;
  onCommitDecision: (optionIndex: number) => void;
  isDecided?: boolean;
  chosenOptionIndex?: number;
}

type TabType = 'verdict' | 'matrix' | 'proscons' | 'swot' | 'duel' | 'devilsadvocate';

export const AnalysisContainer: React.FC<AnalysisContainerProps> = ({
  input,
  analysis,
  onBack,
  onSave,
  isSaved,
  onOpenCoinToss,
  onCommitDecision,
  isDecided,
  chosenOptionIndex,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('verdict');
  const [copied, setCopied] = useState(false);
  const [userWeights, setUserWeights] = useState<Record<string, number>>({});

  const handleCopySummary = () => {
    const text = `
# The Tiebreaker Decision Analysis
Decision: ${input.title}
Category: ${input.category}

## AI Tiebreaker Verdict
Recommended: ${analysis.tiebreakerVerdict.recommendedOptionName} (${analysis.tiebreakerVerdict.confidenceScore}% confidence)
Headline: "${analysis.tiebreakerVerdict.headline}"
Core Rationale: ${analysis.tiebreakerVerdict.executiveSummary}

The Deciding Question: "${analysis.tiebreakerVerdict.theDecidingQuestion}"
Reversibility: ${analysis.tiebreakerVerdict.reversibilityType} - ${analysis.tiebreakerVerdict.reversibilityExplanation}

## Evaluated Options:
${input.options.map((o, i) => `${i + 1}. ${o.name}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Modify Input</span>
          </button>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              {input.category} Decision
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
              {input.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Gut check coin toss button */}
          <button
            onClick={onOpenCoinToss}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>🪙 Coin Toss</span>
          </button>

          {/* Copy summary */}
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Copy Markdown Summary"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700 hidden sm:flex"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>

          {/* Save Decision */}
          <button
            onClick={() => onSave(userWeights)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
            }`}
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl scrollbar-none">
        <button
          onClick={() => setActiveTab('verdict')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'verdict'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Verdict & Verdict</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'matrix'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Comparison Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('proscons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'proscons'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>Pros & Cons (10/10/10)</span>
        </button>

        <button
          onClick={() => setActiveTab('swot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'swot'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Target className="w-4 h-4 text-purple-400" />
          <span>SWOT Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('duel')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'duel'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span>Tiebreaker Duel</span>
        </button>

        <button
          onClick={() => setActiveTab('devilsadvocate')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
            activeTab === 'devilsadvocate'
              ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Devil's Advocate</span>
        </button>
      </div>

      {/* Tab Content Body */}
      <div className="transition-all duration-200">
        {activeTab === 'verdict' && (
          <VerdictView
            verdict={analysis.tiebreakerVerdict}
            options={input.options}
            onOpenCoinToss={onOpenCoinToss}
            onCommitDecision={onCommitDecision}
            isDecided={isDecided}
            chosenOptionIndex={chosenOptionIndex}
          />
        )}

        {activeTab === 'matrix' && (
          <ComparisonMatrixView
            comparisonMatrix={analysis.comparisonMatrix}
            options={input.options}
            onWeightsChange={(w) => setUserWeights(w)}
            initialWeights={userWeights}
          />
        )}

        {activeTab === 'proscons' && (
          <ProsAndConsView optionsAnalysis={analysis.optionsAnalysis} />
        )}

        {activeTab === 'swot' && (
          <SwotView optionsAnalysis={analysis.optionsAnalysis} />
        )}

        {activeTab === 'duel' && (
          <TiebreakerDuel
            questions={analysis.tiebreakerDuelQuestions}
            options={input.options}
            onFinishDuel={(winnerIdx) => {
              // Can record answer
            }}
          />
        )}

        {activeTab === 'devilsadvocate' && (
          <DevilsAdvocateView
            analysis={analysis}
            decisionTitle={input.title}
            context={input.context}
            options={input.options}
          />
        )}
      </div>
    </div>
  );
};
