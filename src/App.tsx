import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DecisionForm } from './components/DecisionForm';
import { AnalysisContainer } from './components/AnalysisContainer';
import { CoinFlipModal } from './components/CoinFlipModal';
import { SavedDecisionsDrawer } from './components/SavedDecisionsDrawer';
import { DecisionInput, AnalysisResult, SavedDecisionRecord } from './types';
import { AlertCircle, Sparkles, Scale } from 'lucide-react';

const STORAGE_KEY = 'the_tiebreaker_saved_decisions_v1';

export default function App() {
  const [currentInput, setCurrentInput] = useState<DecisionInput | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<SavedDecisionRecord[]>([]);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Evaluating options...');
  const [error, setError] = useState<string | null>(null);

  const [isCoinTossOpen, setIsCoinTossOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isDecided, setIsDecided] = useState(false);
  const [chosenOptionIndex, setChosenOptionIndex] = useState<number | undefined>(undefined);

  // Load saved decisions from localStorage
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setSavedDecisions(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved decisions from localStorage', e);
    }
  }, []);

  // Save changes to localStorage
  const persistSavedDecisions = (updatedList: SavedDecisionRecord[]) => {
    setSavedDecisions(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  // Analyze Decision via API
  const handleAnalyze = async (formInput: Omit<DecisionInput, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);

    const stages = [
      'Deconstructing dilemma & constraints...',
      'Mapping pros, cons & mitigating risks...',
      'Synthesizing 2x2 SWOT strategic matrices...',
      'Calibrating multi-attribute criteria scores...',
      'Computing the definitive tiebreaker verdict...',
    ];

    let stageIdx = 0;
    setLoadingStage(stages[0]);
    const interval = setInterval(() => {
      stageIdx = (stageIdx + 1) % stages.length;
      setLoadingStage(stages[stageIdx]);
    }, 1800);

    const decisionId = `dec-${Date.now()}`;
    const fullInput: DecisionInput = {
      ...formInput,
      id: decisionId,
      createdAt: new Date().toISOString(),
      status: 'deciding',
    };

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: fullInput.title,
          category: fullInput.category,
          context: fullInput.context,
          options: fullInput.options,
          userCriteria: fullInput.userCriteria,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setCurrentInput(fullInput);
      setCurrentAnalysis(result);
      setActiveDecisionId(decisionId);
      setIsDecided(false);
      setChosenOptionIndex(undefined);

      // Auto-save initial record
      const newRecord: SavedDecisionRecord = {
        id: decisionId,
        input: fullInput,
        analysis: result,
        updatedAt: new Date().toISOString(),
      };
      persistSavedDecisions([newRecord, ...savedDecisions]);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'Something went wrong while analyzing your decision. Please try again.');
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  // Save or update decision
  const handleSaveDecision = (customWeights?: Record<string, number>) => {
    if (!currentInput || !currentAnalysis) return;

    const id = activeDecisionId || currentInput.id;
    const existingIdx = savedDecisions.findIndex((d) => d.id === id);

    const record: SavedDecisionRecord = {
      id,
      input: {
        ...currentInput,
        status: isDecided ? 'decided' : 'deciding',
        chosenOptionIndex,
      },
      analysis: currentAnalysis,
      updatedAt: new Date().toISOString(),
      userWeights: customWeights,
    };

    if (existingIdx >= 0) {
      const updated = [...savedDecisions];
      updated[existingIdx] = record;
      persistSavedDecisions(updated);
    } else {
      persistSavedDecisions([record, ...savedDecisions]);
    }
  };

  // Delete decision
  const handleDeleteDecision = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = savedDecisions.filter((d) => d.id !== id);
    persistSavedDecisions(filtered);
    if (activeDecisionId === id) {
      setActiveDecisionId(null);
    }
  };

  // Select decision from saved drawer
  const handleSelectDecision = (record: SavedDecisionRecord) => {
    setCurrentInput(record.input);
    setCurrentAnalysis(record.analysis);
    setActiveDecisionId(record.id);
    setIsDecided(record.input.status === 'decided');
    setChosenOptionIndex(record.input.chosenOptionIndex);
    setError(null);
  };

  // Commit to a decision
  const handleCommitDecision = (optionIndex: number) => {
    setIsDecided(true);
    setChosenOptionIndex(optionIndex);
    if (currentInput) {
      const updatedInput = {
        ...currentInput,
        status: 'decided' as const,
        chosenOptionIndex: optionIndex,
      };
      setCurrentInput(updatedInput);
      handleSaveDecision();
    }
  };

  // Start fresh decision
  const handleNewDecision = () => {
    setCurrentInput(null);
    setCurrentAnalysis(null);
    setActiveDecisionId(null);
    setIsDecided(false);
    setChosenOptionIndex(undefined);
    setError(null);
  };

  const isCurrentSaved = Boolean(
    activeDecisionId && savedDecisions.some((d) => d.id === activeDecisionId)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      {/* Ambient background gradients */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Navigation */}
      <Navbar
        onNewDecision={handleNewDecision}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        savedCount={savedDecisions.length}
        onOpenCoinToss={() => setIsCoinTossOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto w-full relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-rose-950/60 border border-rose-500/50 rounded-2xl flex items-center justify-between gap-3 text-rose-200 text-xs sm:text-sm shadow-lg animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs uppercase font-bold text-rose-300 hover:text-white underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* View Mode: Form vs Analysis */}
        {currentAnalysis && currentInput ? (
          <AnalysisContainer
            input={currentInput}
            analysis={currentAnalysis}
            onBack={() => {
              setCurrentAnalysis(null);
            }}
            onSave={handleSaveDecision}
            isSaved={isCurrentSaved}
            onOpenCoinToss={() => setIsCoinTossOpen(true)}
            onCommitDecision={handleCommitDecision}
            isDecided={isDecided}
            chosenOptionIndex={chosenOptionIndex}
          />
        ) : (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Weighted Pros & Cons • Comparison Tables • SWOT • Tiebreaker Verdicts</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Make Hard Decisions <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-amber-300 bg-clip-text text-transparent">
                  With Absolute Conviction.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Stuck between two good options or dreading a high-stakes fork in the road?
                Feed your dilemma into <strong>The Tiebreaker</strong> to analyze trade-offs, stress-test blindspots, and discover the deciding factor.
              </p>
            </div>

            {/* Input Form */}
            <DecisionForm
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              loadingStage={loadingStage}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">The Tiebreaker</span>
            <span>• Rational Decision Engine</span>
          </div>
          <p>
            Designed for high-stakes career, relocation, financial, and life dilemmas.
          </p>
        </div>
      </footer>

      {/* Coin Flip Modal */}
      <CoinFlipModal
        isOpen={isCoinTossOpen}
        onClose={() => setIsCoinTossOpen(false)}
        options={
          currentInput?.options || [
            { name: 'Option A (First Path)' },
            { name: 'Option B (Second Path)' },
          ]
        }
      />

      {/* Saved Decisions Drawer */}
      <SavedDecisionsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectDecision}
        onDeleteDecision={handleDeleteDecision}
        activeDecisionId={activeDecisionId || undefined}
      />
    </div>
  );
}
