import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';

interface CoinFlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: { name: string }[];
  onRecordGutImpression?: (optionName: string, reaction: 'relieved' | 'disappointed') => void;
}

export const CoinFlipModal: React.FC<CoinFlipModalProps> = ({
  isOpen,
  onClose,
  options,
  onRecordGutImpression,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipsCount, setFlipsCount] = useState(0);
  const [selectedReaction, setSelectedReaction] = useState<'relieved' | 'disappointed' | null>(null);

  if (!isOpen) return null;

  const optionA = options[0]?.name || 'Option A';
  const optionB = options[1]?.name || 'Option B';

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setResult(null);
    setSelectedReaction(null);

    // Randomize result after 1.8 seconds of exciting animation
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setResult(outcome);
      setIsFlipping(false);
      setFlipsCount((c) => c + 1);
    }, 1800);
  };

  const winningOption = result === 'heads' ? optionA : result === 'tails' ? optionB : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow behind modal */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              🪙
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">The Gut-Check Coin Toss</h3>
              <p className="text-xs text-slate-400">Discover what your subconscious already chose</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option Mapping */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className={`p-3 rounded-xl border text-center transition-all ${
            result === 'heads'
              ? 'bg-amber-500/15 border-amber-500/50 shadow-lg shadow-amber-500/10 scale-102'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Heads</span>
            <p className="text-sm font-bold text-slate-100 mt-0.5 line-clamp-2">{optionA}</p>
          </div>
          <div className={`p-3 rounded-xl border text-center transition-all ${
            result === 'tails'
              ? 'bg-indigo-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/10 scale-102'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">Tails</span>
            <p className="text-sm font-bold text-slate-100 mt-0.5 line-clamp-2">{optionB}</p>
          </div>
        </div>

        {/* Psychological Insight Banner */}
        <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-white">Freud & Kahneman Principle:</span> When the coin is in mid-air, notice which outcome your heart silently hopes will land. That instant reflex is your true intuition.
          </p>
        </div>

        {/* Coin Display Area */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Spinning Coin */}
            <div
              className={`w-32 h-32 rounded-full border-4 border-amber-400/90 bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-xl shadow-amber-500/20 transition-all duration-300 ${
                isFlipping ? 'animate-bounce [transform:rotateY(1080deg)] transition-transform duration-1000' : ''
              }`}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-800/40 flex flex-col items-center justify-center text-center p-2 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 font-black">
                {isFlipping ? (
                  <span className="text-2xl animate-spin">⚖️</span>
                ) : result === 'heads' ? (
                  <>
                    <span className="text-2xl">👑</span>
                    <span className="text-xs uppercase tracking-widest font-extrabold mt-1">HEADS</span>
                  </>
                ) : result === 'tails' ? (
                  <>
                    <span className="text-2xl">⚡</span>
                    <span className="text-xs uppercase tracking-widest font-extrabold mt-1">TAILS</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🪙</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider mt-1">Ready</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Result announcement */}
          {result && (
            <div className="mt-5 text-center animate-fadeIn">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                The Coin Chose
              </span>
              <h4 className="text-xl font-bold text-white mt-0.5 text-amber-300">
                {winningOption}
              </h4>
            </div>
          )}
        </div>

        {/* Gut Check Question if result is present */}
        {result && (
          <div className="mb-5 p-4 bg-slate-800/80 border border-slate-700 rounded-xl animate-fadeIn">
            <p className="text-sm font-medium text-slate-200 text-center mb-3">
              How did you feel the instant you saw this result?
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedReaction('relieved');
                  if (onRecordGutImpression && winningOption) {
                    onRecordGutImpression(winningOption, 'relieved');
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  selectedReaction === 'relieved'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                Relieved (I wanted this!)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedReaction('disappointed');
                  if (onRecordGutImpression && winningOption) {
                    onRecordGutImpression(winningOption, 'disappointed');
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  selectedReaction === 'disappointed'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                Disappointed (I wanted the other!)
              </button>
            </div>
            {selectedReaction === 'disappointed' && (
              <p className="text-xs text-rose-300 text-center mt-2 font-medium">
                💡 Key revelation: Because you felt disappointed, your subconscious is actually pulling you toward the other option!
              </p>
            )}
            {selectedReaction === 'relieved' && (
              <p className="text-xs text-emerald-300 text-center mt-2 font-medium">
                💡 Key revelation: Your relief validates that this option resonates with your inner priorities.
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleFlip}
            disabled={isFlipping}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
            {isFlipping ? 'Flipping...' : flipsCount === 0 ? 'Flip Coin' : 'Flip Again'}
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
