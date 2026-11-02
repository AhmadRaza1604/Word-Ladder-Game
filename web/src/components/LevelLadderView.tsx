import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Lock, Star, Sparkles, Check, Flame, Trophy } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { LEVELS } from '../engine/levels';
import { AppLogo } from './AppLogo';

interface LevelLadderViewProps {
  onBackToHome: () => void;
  onSelectLevel: (levelId: number) => void;
  progress: PlayerProgress;
  isLevelUnlocked: (levelId: number) => boolean;
}

export const LevelLadderView: React.FC<LevelLadderViewProps> = ({
  onBackToHome,
  onSelectLevel,
  progress,
  isLevelUnlocked,
}) => {
  const activeLevelRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active level on mount
  useEffect(() => {
    if (activeLevelRef.current) {
      activeLevelRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Find the current highest playable level
  const highestPlayableId = LEVELS.reduce((acc, lvl) => {
    return isLevelUnlocked(lvl.id) ? Math.max(acc, lvl.id) : acc;
  }, 1);

  const completedCount = Object.keys(progress.completedLevels).length;

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen transition-colors">
      {/* Top Bar (No filter tabs as requested) */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-xs transition-colors">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2">
          <AppLogo size="sm" />
          <div className="text-left">
            <h1 className="text-sm font-extrabold tracking-tight">
              Level Ladder
            </h1>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              {completedCount} Cleared
            </div>
          </div>
        </div>

        {/* Total Stars Pill */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="tabular-nums font-mono">{progress.totalStars}</span>
        </div>
      </header>

      {/* Artistic Stepping-Stone Winding Trail */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 flex flex-col items-center relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-indigo-500/5 dark:bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-3/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-amber-500/5 dark:bg-amber-600/10 blur-3xl pointer-events-none" />

        {/* Central Winding SVG Trail Guide */}
        <div className="w-full flex flex-col items-center gap-1 relative z-10">
          {LEVELS.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id);
            const isHighestPlayable = level.id === highestPlayableId;
            const completion = progress.completedLevels[level.id];
            const stars = completion ? completion.stars : 0;
            const isCompleted = Boolean(completion?.completed);

            // Artistic winding sinusoidal offset (-50px, 0px, +50px, 0px)
            const phase = index % 4;
            const offsetStyle =
              phase === 0
                ? 'translate-x-0'
                : phase === 1
                ? '-translate-x-12 sm:-translate-x-16'
                : phase === 2
                ? 'translate-x-0'
                : 'translate-x-12 sm:translate-x-16';

            // Tier Milestone Banners
            const isTier1Start = index === 0;
            const isTier2Start = level.tier === 2 && LEVELS[index - 1]?.tier === 1;
            const isTier3Start = level.tier === 3 && LEVELS[index - 1]?.tier === 2;

            return (
              <React.Fragment key={level.id}>
                {/* Artistic Tier Milestones */}
                {isTier1Start && (
                  <div className="w-full my-4 flex items-center justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-indigo-300 shadow-sm flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Trailhead • 3-Letter Valley</span>
                    </div>
                  </div>
                )}

                {isTier2Start && (
                  <div className="w-full my-6 flex items-center justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/80 text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Midland Ascent • 4-Letter Classic Ridge</span>
                    </div>
                  </div>
                )}

                {isTier3Start && (
                  <div className="w-full my-6 flex items-center justify-center">
                    <div className="px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/80 text-xs font-bold text-amber-700 dark:text-amber-300 shadow-sm flex items-center gap-2">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>Summit Peak • 5-Letter Mastery</span>
                    </div>
                  </div>
                )}

                {/* Connecting Path Dots */}
                {index > 0 && (
                  <div className={`flex flex-col items-center gap-1.5 my-1 transition-all duration-300 ${offsetStyle}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      unlocked
                        ? 'bg-indigo-400 dark:bg-indigo-500'
                        : 'bg-slate-300 dark:bg-slate-800'
                    }`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      unlocked
                        ? 'bg-indigo-400/80 dark:bg-indigo-500/80'
                        : 'bg-slate-300 dark:bg-slate-800'
                    }`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      unlocked
                        ? 'bg-indigo-400/60 dark:bg-indigo-500/60'
                        : 'bg-slate-300 dark:bg-slate-800'
                    }`} />
                  </div>
                )}

                {/* Artistic Stepping Node (No words displayed as requested) */}
                <div
                  ref={isHighestPlayable ? activeLevelRef : null}
                  className={`flex flex-col items-center transition-all duration-300 transform ${offsetStyle}`}
                >
                  <button
                    onClick={() => onSelectLevel(level.id)}
                    disabled={!unlocked}
                    className={`group relative flex items-center justify-center select-none rounded-full transition-all duration-200 transform active:scale-95 ${
                      isHighestPlayable
                        ? 'w-18 h-18 bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 ring-4 ring-indigo-400/40 dark:ring-indigo-500/50 scale-110 animate-pop'
                        : isCompleted
                        ? 'w-16 h-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-emerald-500 shadow-md hover:scale-105'
                        : unlocked
                        ? 'w-16 h-16 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-2 border-slate-300 dark:border-slate-700 shadow-sm hover:border-indigo-400 hover:scale-105'
                        : 'w-15 h-15 bg-slate-200/80 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    {/* Inner Content */}
                    <div className="flex flex-col items-center justify-center">
                      {unlocked ? (
                        <>
                          <span className={`font-black tracking-tight ${
                            isHighestPlayable ? 'text-lg text-white' : 'text-base font-bold'
                          }`}>
                            {level.id}
                          </span>
                        </>
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                      )}
                    </div>

                    {/* Completion Checkmark badge */}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Active Pulsing Indicator Badge */}
                    {isHighestPlayable && (
                      <div className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider animate-bounce shadow-md">
                        PLAY
                      </div>
                    )}
                  </button>

                  {/* Stars Displayed Tastefully Underneath Node */}
                  {unlocked && (
                    <div className="flex items-center gap-0.5 mt-1.5 px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 text-xs shadow-2xs">
                      {[1, 2, 3].map(s => (
                        <span
                          key={s}
                          className={
                            s <= stars
                              ? 'text-amber-500 drop-shadow-[0_1px_3px_rgba(245,158,11,0.6)]'
                              : 'text-slate-300 dark:text-slate-750'
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </main>
    </div>
  );
};
