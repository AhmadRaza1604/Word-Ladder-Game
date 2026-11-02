import React from 'react';
import { Target, Flag, ArrowDown } from 'lucide-react';

interface LadderStackProps {
  startWord: string;
  targetWord: string;
  history: string[];
  optimalMoves: number;
  maxMoves: number;
  currentMoves: number;
}

export const LadderStack: React.FC<LadderStackProps> = ({
  startWord,
  targetWord,
  history,
  optimalMoves,
  maxMoves,
  currentMoves,
}) => {
  return (
    <div className="w-full flex flex-col items-center py-2 px-3">
      {/* Target status / par strip */}
      <div className="w-full max-w-sm flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span>Moves:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
            {currentMoves} / {maxMoves}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Par (Shortest):</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {optimalMoves} steps
          </span>
        </div>
      </div>

      {/* Ladder Container */}
      <div className="w-full max-w-sm bg-slate-100/80 dark:bg-slate-950/60 rounded-2xl p-3 border border-slate-200 dark:border-slate-800/80 shadow-xs relative flex flex-col items-center transition-colors">
        {/* Left and Right Ladder Rails */}
        <div className="absolute left-6 top-4 bottom-4 w-1 bg-slate-300 dark:bg-slate-800 rounded-full" />
        <div className="absolute right-6 top-4 bottom-4 w-1 bg-slate-300 dark:bg-slate-800 rounded-full" />

        <div className="w-full flex flex-col items-center gap-2 relative z-10">
          {/* 1. Start Word */}
          <div className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
              <Flag className="w-3.5 h-3.5" />
              <span>Start</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold tracking-widest text-base sm:text-lg text-slate-900 dark:text-white">
              {startWord.split('').map((char, idx) => (
                <span
                  key={idx}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white shadow-2xs"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* 2. Intermediate Steps in Ladder */}
          {history.length > 1 && (
            <div className="w-full flex flex-col gap-1.5 max-h-40 overflow-y-auto ladder-scroll pr-1">
              {history.slice(1).map((word, stepIdx) => {
                const prevWord = history[stepIdx];
                return (
                  <div
                    key={stepIdx}
                    className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors animate-pop shadow-2xs"
                  >
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono font-semibold tabular-nums w-10">
                      #{stepIdx + 1}
                    </span>
                    <div className="flex items-center gap-1.5 font-mono font-bold tracking-widest text-sm sm:text-base">
                      {word.split('').map((char, idx) => {
                        const isChanged = prevWord && prevWord[idx] !== char;
                        return (
                          <span
                            key={idx}
                            className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-md text-xs sm:text-sm font-bold ${
                              isChanged
                                ? 'bg-indigo-600 text-white shadow-xs border border-indigo-400'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50'
                            }`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ladder connector icon */}
          <div className="text-slate-400 dark:text-slate-600 my-0.5">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          {/* 3. Target Word */}
          <div className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Goal</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono font-bold tracking-widest text-base sm:text-lg text-emerald-800 dark:text-emerald-300">
              {targetWord.split('').map((char, idx) => (
                <span
                  key={idx}
                  className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white dark:bg-emerald-900/50 rounded-lg border border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 shadow-2xs"
                >
                  {char}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
