import React from 'react';
import { X, Play, Target, Flag, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { LevelDefinition, CompletedLevelData } from '../types/game';

interface LevelCriteriaModalProps {
  level: LevelDefinition | null;
  onClose: () => void;
  onPlay: (levelId: number) => void;
  previousRecord?: CompletedLevelData;
}

export const LevelCriteriaModal: React.FC<LevelCriteriaModalProps> = ({
  level,
  onClose,
  onPlay,
  previousRecord,
}) => {
  if (!level) return null;

  const optimalMoves = level.optimalMoves;
  const twoStarMoves = level.optimalMoves + 2;
  const maxMoves = level.maxMoves;

  const formatTime = (seconds?: number) => {
    if (seconds === undefined) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-pop">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/50 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">
              Level {level.id} • Tier {level.tier} ({level.wordLength} Letters)
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {level.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Start and Target Word Display */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Flag className="w-3 h-3" />
                Start
              </span>
              <span className="font-mono text-lg font-black text-slate-900 dark:text-white tracking-widest px-2.5 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
                {level.startWord}
              </span>
            </div>

            <div className="flex flex-col items-center px-2 text-slate-400 dark:text-slate-600">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {level.optimalMoves} steps
              </span>
              <span className="text-sm">→</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Target
              </span>
              <span className="font-mono text-lg font-black text-emerald-700 dark:text-emerald-300 tracking-widest px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
                {level.targetWord}
              </span>
            </div>
          </div>

          {/* Star Criteria Breakdown */}
          <div>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span>Star Earning Criteria:</span>
            </div>

            <div className="space-y-2">
              {/* 3 Stars */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-300 dark:border-amber-500/30">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 dark:text-amber-400 text-sm font-black">★★★</span>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">Optimal Path</span>
                </div>
                <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-300">
                  ≤ {optimalMoves} moves
                </span>
              </div>

              {/* 2 Stars */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500/80 dark:text-amber-400/80 text-sm font-black">★★☆</span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Skilled Solve</span>
                </div>
                <span className="text-xs font-semibold font-mono text-slate-500 dark:text-slate-400">
                  ≤ {twoStarMoves} moves
                </span>
              </div>

              {/* 1 Star */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500/60 dark:text-amber-400/60 text-sm font-black">★☆☆</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Level Cleared</span>
                </div>
                <span className="text-xs font-semibold font-mono text-slate-500 dark:text-slate-500">
                  ≤ {maxMoves} moves
                </span>
              </div>
            </div>
          </div>

          {/* Previous Best Record if completed */}
          {previousRecord?.completed && (
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Best Record:</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                <span className="text-amber-500 dark:text-amber-400 font-bold">
                  {'★'.repeat(previousRecord.stars)}
                </span>
                <span className="font-mono">{previousRecord.bestMoves} moves</span>
                {previousRecord.timeElapsedSeconds !== undefined && (
                  <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatTime(previousRecord.timeElapsedSeconds)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Button: Play to start! */}
          <button
            onClick={() => onPlay(level.id)}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play Level {level.id}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
