import React from 'react';
import { HintResponse } from '../types/game';

interface WordTileRowProps {
  currentWord: string;
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  isShaking: boolean;
  feedback: { message: string; isError: boolean } | null;
  activeHint: HintResponse | null;
}

export const WordTileRow: React.FC<WordTileRowProps> = ({
  currentWord,
  selectedIndex,
  onSelectIndex,
  isShaking,
  feedback,
  activeHint,
}) => {
  return (
    <div className="w-full flex flex-col items-center my-3 px-3">
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5 flex items-center gap-1">
        <span>Tap a tile to replace letter:</span>
      </div>

      {/* Interactive Tile Row */}
      <div
        className={`flex items-center gap-2 sm:gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md transition-colors ${
          isShaking ? 'animate-shake border-red-500/80 bg-red-50 dark:bg-red-950/20' : ''
        }`}
      >
        {currentWord.split('').map((char, idx) => {
          const isSelected = selectedIndex === idx;
          const isHintedIndex = activeHint && activeHint.index === idx;

          return (
            <button
              key={idx}
              onClick={() => onSelectIndex(idx)}
              className={`relative flex flex-col items-center justify-center w-12 h-14 sm:w-14 sm:h-16 rounded-xl font-mono text-2xl sm:text-3xl font-extrabold transition-all duration-150 transform active:scale-95 select-none focus:outline-none ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 ring-2 ring-indigo-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-750'
              } ${isHintedIndex ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
            >
              {char}
              {/* Selected indicator triangle/pip */}
              {isSelected && (
                <div className="absolute -bottom-1.5 w-2 h-2 bg-indigo-500 dark:bg-indigo-400 rotate-45 rounded-xs" />
              )}
              {/* Hint badge */}
              {isHintedIndex && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback Message Bar */}
      <div className="min-h-6 mt-2 flex items-center justify-center text-center px-2">
        {feedback ? (
          <div
            className={`text-xs font-semibold px-3 py-1 rounded-full transition-all ${
              feedback.isError
                ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/60 animate-shake'
                : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/50 animate-pop'
            }`}
          >
            {feedback.message}
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            Type a letter on keyboard or press full candidate word
          </div>
        )}
      </div>
    </div>
  );
};
