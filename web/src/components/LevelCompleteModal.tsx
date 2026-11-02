import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw, Home, Sparkles, Clock, ListOrdered } from 'lucide-react';
import { LevelDefinition } from '../types/game';

interface LevelCompleteModalProps {
  isOpen: boolean;
  level: LevelDefinition;
  moves: number;
  stars: number;
  timeElapsedSeconds: number;
  history: string[];
  onNextLevel: () => void;
  onGoToLadder: () => void;
  onGoToHome: () => void;
  onReplay: () => void;
  hasNextLevel: boolean;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  level,
  moves,
  stars,
  timeElapsedSeconds,
  history,
  onNextLevel,
  onGoToLadder,
  onGoToHome,
  onReplay,
  hasNextLevel,
}) => {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: stars === 3 ? 100 : 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#f59e0b', '#10b981', '#38bdf8']
        });
      } catch {
        // Confetti unavailable
      }
    }
  }, [isOpen, stars]);

  if (!isOpen) return null;

  const isOptimal = moves <= level.optimalMoves;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-pop">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 rounded-3xl shadow-2xl p-6 text-center flex flex-col items-center text-slate-900 dark:text-slate-100 transition-colors">
        {/* Victory Trophy Badge */}
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 dark:text-amber-400 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/10">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-0.5">
          Level {level.id} Completed!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-mono">
          {level.startWord} → {level.targetWord}
        </p>

        {/* 3-Star Rating Graphic */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map(s => {
            const earned = s <= stars;
            return (
              <div
                key={s}
                className={`text-4xl transition-all duration-300 transform ${
                  earned
                    ? 'text-amber-400 scale-110 drop-shadow-[0_2px_10px_rgba(245,158,11,0.6)]'
                    : 'text-slate-300 dark:text-slate-750 scale-95'
                }`}
              >
                ★
              </div>
            );
          })}
        </div>

        {/* Optimal Badge / Feedback */}
        {isOptimal ? (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimal Route! 3 Stars!</span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Optimal path is <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{level.optimalMoves} moves</span>. Replay for 3 stars!
          </div>
        )}

        {/* Stats Strip: Moves and Time Elapsed */}
        <div className="w-full grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-4">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Your Moves</div>
            <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">{moves}</div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Time</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(timeElapsedSeconds)}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Par (Shortest)</div>
            <div className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">{level.optimalMoves}</div>
          </div>
        </div>

        {/* Solution Step History */}
        <div className="w-full text-left mb-5">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span>Your Ladder Path ({history.length} words):</span>
          </div>
          <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800/80 max-h-20 overflow-y-auto">
            {history.map((w, i) => (
              <span
                key={i}
                className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-250 dark:border-slate-700 flex items-center gap-1 shadow-xs"
              >
                {w}
                {i < history.length - 1 && <span className="text-slate-400 dark:text-slate-500 font-normal">→</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2">
          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <span>Next Level</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="grid grid-cols-3 gap-2 w-full">
            <button
              onClick={onReplay}
              className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors border border-slate-250 dark:border-slate-700"
              title="Replay"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>

            <button
              onClick={onGoToLadder}
              className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors border border-slate-250 dark:border-slate-700"
              title="Level Ladder"
            >
              <ListOrdered className="w-3.5 h-3.5" />
              <span>Ladder</span>
            </button>

            <button
              onClick={onGoToHome}
              className="py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1 transition-colors border border-slate-250 dark:border-slate-700"
              title="Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
