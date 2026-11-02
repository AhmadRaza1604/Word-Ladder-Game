import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Play } from 'lucide-react';
import { LevelDefinition } from '../types/game';
import { LEVELS } from '../engine/levels';
import { findShortestPath, verifyLevelSolvability } from '../engine/bfsSolver';
import { isValidWord } from '../engine/dictionary';

interface SolverInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: LevelDefinition;
}

export const SolverInspectorModal: React.FC<SolverInspectorModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(currentLevel.id);
  const [customStart, setCustomStart] = useState<string>('COLD');
  const [customTarget, setCustomTarget] = useState<string>('WARM');
  const [customPath, setCustomPath] = useState<string[] | null>(null);
  const [customSearched, setCustomSearched] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeLevel = LEVELS.find(l => l.id === selectedLevelId) || currentLevel;
  const verification = verifyLevelSolvability(activeLevel);

  const handleCustomSolve = (e: React.FormEvent) => {
    e.preventDefault();
    const start = customStart.toUpperCase().trim();
    const target = customTarget.toUpperCase().trim();
    const path = findShortestPath(start, target);
    setCustomPath(path);
    setCustomSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">BFS Shortest-Path Verifier</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-600 dark:text-slate-300">
          {/* Level Verification Panel */}
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
              Inspect Shipped Level:
            </label>
            <select
              value={selectedLevelId}
              onChange={(e) => setSelectedLevelId(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
            >
              {LEVELS.map(l => (
                <option key={l.id} value={l.id}>
                  Level {l.id}: {l.startWord} → {l.targetWord} ({l.wordLength} letters, Par {l.optimalMoves})
                </option>
              ))}
            </select>
          </div>

          {/* Verification Badge */}
          <div className={`p-4 rounded-xl border ${
            verification.isValid
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
              : 'bg-red-950/30 border-red-800/60 text-red-200'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {verification.isValid ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Algorithmically Verified Optimal Path</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Path Mismatch Error</span>
                </>
              )}
            </div>
            <p className="text-xs opacity-90 mb-3">
              BFS computed shortest distance is exactly <strong>{verification.actualOptimalMoves} moves</strong> (declared par: {activeLevel.optimalMoves}).
            </p>

            {verification.shortestPath && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 opacity-80">
                  Computed Shortest Ladder:
                </div>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-950/80 rounded-lg border border-slate-800">
                  {verification.shortestPath.map((word, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-white">
                        {word}
                      </span>
                      {idx < verification.shortestPath!.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Words Solver Playground */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="font-bold text-sm text-white mb-2">
              Test Any Custom Pair in Dictionary
            </h3>
            <form onSubmit={handleCustomSolve} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Start Word</label>
                  <input
                    type="text"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value.toUpperCase().slice(0, 5))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono uppercase font-bold text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  {!isValidWord(customStart) && customStart && (
                    <span className="text-[10px] text-red-400">Not in dictionary</span>
                  )}
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Target Word</label>
                  <input
                    type="text"
                    value={customTarget}
                    onChange={(e) => setCustomTarget(e.target.value.toUpperCase().slice(0, 5))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono uppercase font-bold text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                  {!isValidWord(customTarget) && customTarget && (
                    <span className="text-[10px] text-red-400">Not in dictionary</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={customStart.length !== customTarget.length || !isValidWord(customStart) || !isValidWord(customTarget)}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Run BFS Graph Solver</span>
              </button>
            </form>

            {customSearched && (
              <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                {customPath ? (
                  <div>
                    <div className="text-xs text-emerald-400 font-bold mb-1">
                      Path Found in {customPath.length - 1} moves:
                    </div>
                    <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
                      {customPath.map((w, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white font-bold">
                            {w}
                          </span>
                          {i < customPath.length - 1 && <span className="text-slate-500">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-red-400">
                    No valid path connects "{customStart}" to "{customTarget}" in this lexicon.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
