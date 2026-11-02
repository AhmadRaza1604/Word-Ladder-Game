import React, { useState } from 'react';
import { RotateCcw, Lightbulb, CornerDownLeft, Undo2 } from 'lucide-react';

interface VirtualKeyboardProps {
  onLetterPress: (letter: string) => void;
  onSubmitWord: (candidate: string) => void;
  onUndo: () => void;
  onHint: () => void;
  canUndo: boolean;
  wordLength: number;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onLetterPress,
  onSubmitWord,
  onUndo,
  onHint,
  canUndo,
  wordLength,
}) => {
  const [typedInput, setTypedInput] = useState<string>('');

  const handleFullWordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    onSubmitWord(typedInput.trim());
    setTypedInput('');
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-1.5 px-2 pb-3 select-none">
      {/* Full Word Quick Typing Bar (Fulfills dual-input requirement) */}
      <form
        onSubmit={handleFullWordSubmit}
        className="w-full flex items-center gap-2 px-1 mb-1"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value.toUpperCase().slice(0, wordLength))}
            placeholder={`Type ${wordLength}-letter word & press Enter...`}
            maxLength={wordLength}
            className="w-full bg-white dark:bg-slate-950/80 border border-slate-250 dark:border-slate-800 rounded-lg px-3 py-2 text-sm font-mono tracking-widest uppercase text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs"
          />
        </div>
        <button
          type="submit"
          disabled={typedInput.length !== wordLength}
          className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-xs"
        >
          <span>Submit</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Row 1 */}
      <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-center">
        {ROWS[0].map(key => (
          <button
            key={key}
            onClick={() => onLetterPress(key)}
            className="flex-1 max-w-10 h-11 sm:h-12 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-indigo-600 active:text-white text-slate-800 dark:text-slate-100 font-bold rounded-lg text-sm sm:text-base border border-slate-200 dark:border-slate-700/60 shadow-xs active:scale-95 transition-all flex items-center justify-center"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-center px-2">
        {ROWS[1].map(key => (
          <button
            key={key}
            onClick={() => onLetterPress(key)}
            className="flex-1 max-w-10 h-11 sm:h-12 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-indigo-600 active:text-white text-slate-800 dark:text-slate-100 font-bold rounded-lg text-sm sm:text-base border border-slate-200 dark:border-slate-700/60 shadow-xs active:scale-95 transition-all flex items-center justify-center"
          >
            {key}
          </button>
        ))}
      </div>

      {/* Row 3 (with Undo & Hint utility buttons) */}
      <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-center">
        {/* Undo Step button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo last step"
          className="flex-1.5 max-w-14 h-11 sm:h-12 bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-750 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs border border-slate-250 dark:border-slate-700/60 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {ROWS[2].map(key => (
          <button
            key={key}
            onClick={() => onLetterPress(key)}
            className="flex-1 max-w-10 h-11 sm:h-12 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-indigo-600 active:text-white text-slate-800 dark:text-slate-100 font-bold rounded-lg text-sm sm:text-base border border-slate-200 dark:border-slate-700/60 shadow-xs active:scale-95 transition-all flex items-center justify-center"
          >
            {key}
          </button>
        ))}

        {/* Optimal Hint Button */}
        <button
          onClick={onHint}
          title="Get optimal path hint"
          className="flex-1.5 max-w-14 h-11 sm:h-12 bg-amber-500/15 dark:bg-amber-500/10 hover:bg-amber-500/25 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold rounded-lg text-xs border border-amber-500/30 shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1"
        >
          <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-300" />
        </button>
      </div>
    </div>
  );
};
