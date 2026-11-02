import React, { useState } from 'react';
import { X, Lock, CheckCircle2 } from 'lucide-react';
import { LevelDefinition, PlayerProgress } from '../types/game';
import { LEVELS } from '../engine/levels';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (levelId: number) => void;
  currentLevelId: number;
  progress: PlayerProgress;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
  currentLevelId,
  progress,
}) => {
  const [activeTier, setActiveTier] = useState<number>(2); // Default to Tier 2 (4-letter)

  if (!isOpen) return null;

  const tiers = [
    { tier: 1, label: '3 Letters', description: 'Quick Warmups' },
    { tier: 2, label: '4 Letters', description: 'Classic Ladders' },
    { tier: 3, label: '5 Letters', description: 'Mastery Challenge' },
  ];

  const filteredLevels = LEVELS.filter(l => l.tier === activeTier);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Select Level</h2>
            <p className="text-xs text-slate-400">
              Total Stars: <span className="text-amber-400 font-bold">★ {progress.totalStars}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tier Segmented Tabs */}
        <div className="flex items-center gap-1 p-2 mx-6 mt-3 bg-slate-950 rounded-xl border border-slate-800">
          {tiers.map(t => (
            <button
              key={t.tier}
              onClick={() => setActiveTier(t.tier)}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all text-center ${
                activeTier === t.tier
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div>{t.label}</div>
              <div className="text-[10px] opacity-75 font-normal">{t.description}</div>
            </button>
          ))}
        </div>

        {/* Level Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredLevels.map(level => {
            const isUnlocked = level.id <= progress.unlockedLevelId;
            const isCurrent = level.id === currentLevelId;
            const completion = progress.completedLevels[level.id];
            const stars = completion ? completion.stars : 0;

            return (
              <button
                key={level.id}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(level.id);
                    onClose();
                  }
                }}
                disabled={!isUnlocked}
                className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between select-none ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500 shadow-md'
                    : isUnlocked
                    ? 'border-slate-800 bg-slate-850 hover:border-slate-700 hover:bg-slate-800'
                    : 'border-slate-850 bg-slate-950/50 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-semibold text-slate-400">
                    Level {level.id}
                  </div>
                  {isUnlocked ? (
                    <div className="flex items-center gap-0.5 text-xs text-amber-400">
                      {[1, 2, 3].map(starNum => (
                        <span
                          key={starNum}
                          className={starNum <= stars ? 'text-amber-400' : 'text-slate-700'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                </div>

                <div className="font-bold text-white text-sm mb-1 tracking-wide">
                  {level.startWord} <span className="text-indigo-400 font-normal">→</span> {level.targetWord}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Par: {level.optimalMoves} moves</span>
                  {completion?.completed && (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{completion.bestMoves} moves</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
