import React from 'react';
import { X, CheckCircle, HelpCircle, Star, Keyboard, Lightbulb } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">How to Play</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300">
          {/* Rule 1: Goal */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
              The Goal
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Transform the <strong>Start Word</strong> into the <strong>Target Word</strong> in as few steps as possible.
            </p>
            <div className="mt-2 p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 font-mono font-bold text-center text-indigo-600 dark:text-indigo-300 text-xs tracking-wider shadow-xs">
              COLD → CORD → CARD → WARD → WARM
            </div>
          </div>

          {/* Rule 2: One-Letter Rule */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
              The One-Letter Rule
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Each move must change <strong>exactly one letter</strong> at a time. The resulting word must be an accepted dictionary word.
            </p>
          </div>

          {/* Rule 3: Input modes */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Two Ways to Input
            </h3>
            <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
              <li><strong>Tile Tapping:</strong> Tap any letter tile to select it, then press a key to replace that letter.</li>
              <li><strong>Full-Word Typing:</strong> Type candidate words into the input bar and press Enter.</li>
            </ul>
          </div>

          {/* Scoring & Stars */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Scoring & Star Ratings
            </h3>
            <div className="space-y-1 text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 dark:text-amber-400 font-bold">★★★</span>
                <span>Solved in the <strong>optimal shortest path</strong>.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 dark:text-amber-400 font-bold">★★☆</span>
                <span>Solved within <strong>2 moves of optimal</strong>.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 dark:text-amber-400 font-bold">★☆☆</span>
                <span>Solved within the <strong>move limit</strong>.</span>
              </div>
            </div>
          </div>

          {/* Hints & Offline notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              Hints & Offline Play
            </h3>
            <p className="leading-relaxed text-slate-600 dark:text-slate-400">
              Tap the bulb icon if you get stuck. The BFS graph engine calculates the provably shortest route from your current word. 100% offline with no ads or network requirements.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
