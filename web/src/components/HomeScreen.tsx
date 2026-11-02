import React, { useState, useEffect } from 'react';
import { Play, Sparkles, HelpCircle, Flame, Volume2, VolumeX, Smartphone, Monitor, ChevronRight, Settings } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { AppLogo } from './AppLogo';

interface HomeScreenProps {
  onPlay: () => void;
  onOpenHelp: () => void;
  onOpenInspector: () => void;
  onOpenSettings: () => void;
  progress: PlayerProgress;
  highestPlayableId: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

const DEMO_LADDER_STEPS = [
  ['C', 'A', 'S', 'E'],
  ['B', 'A', 'S', 'E'],
  ['B', 'A', 'K', 'E'],
  ['C', 'A', 'K', 'E'],
  ['T', 'A', 'K', 'E'],
];

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onOpenHelp,
  onOpenInspector,
  onOpenSettings,
  progress,
  highestPlayableId,
  soundEnabled,
  onToggleSound,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const [demoStep, setDemoStep] = useState<number>(0);
  const [hasMounted, setHasMounted] = useState<boolean>(false);

  // App intro animation trigger on mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Cycle demo ladder steps smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep(prev => (prev + 1) % DEMO_LADDER_STEPS.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const completedCount = Object.keys(progress.completedLevels).length;
  const optimalSolvesCount = Object.values(progress.completedLevels).filter(l => l.stars === 3).length;

  return (
    <div className={`w-full flex-1 flex flex-col justify-between p-4 sm:p-6 text-slate-900 dark:text-slate-100 transition-all duration-700 ${
      hasMounted ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Top Bar: Ahmad's name on top corner ONLY as requested */}
      <header className="w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <AppLogo size="sm" />
          <div>
            <div className="text-[10px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
              Ahmad's
            </div>
            <div className="text-sm font-extrabold tracking-tight">
              Word Ladder
            </div>
          </div>
        </div>

        {/* Quick controls with Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs transition-colors"
            title="Settings (Day/Night & Volume)"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs transition-colors"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={onToggleMobileFrame}
            className="hidden sm:flex p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs transition-colors"
            title={isMobileFrame ? 'Expand Screen' : 'Mobile Frame'}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-xs transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section with animated demo word transformation */}
      <div className="flex flex-col items-center text-center my-auto py-6">
        {/* Animated App Badge with glow & simplified creative AppLogo */}
        <div className="relative mb-5 group cursor-pointer" onClick={onPlay}>
          <div className="absolute -inset-2 rounded-3xl bg-indigo-500/20 dark:bg-indigo-500/30 blur-xl group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className="relative transform group-hover:scale-105 transition-transform duration-300">
            <AppLogo size="xl" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          WORD LADDER
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xs mb-6">
          Transform words one letter at a time to reach the goal in this classic puzzle game.
        </p>

        {/* Live Animated Word Ladder Demo */}
        <div className="w-full max-w-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm mb-6 transition-colors">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-2.5 px-1">
            <span className="text-amber-500 dark:text-amber-400">Step {demoStep + 1} of 5</span>
            <span className="font-mono text-indigo-600 dark:text-indigo-400">CASE → TAKE</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            {DEMO_LADDER_STEPS[demoStep].map((char, idx) => {
              const prevStep = DEMO_LADDER_STEPS[(demoStep - 1 + DEMO_LADDER_STEPS.length) % DEMO_LADDER_STEPS.length];
              const isChanged = prevStep && prevStep[idx] !== char;

              return (
                <div
                  key={idx}
                  className={`w-12 h-14 rounded-xl flex items-center justify-center font-mono text-2xl font-black transition-all duration-300 transform ${
                    isChanged
                      ? 'bg-indigo-600 text-white scale-105 shadow-md shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Play Button (Opens Level Ladder) */}
        <div className="w-full max-w-xs flex flex-col gap-2.5">
          <button
            onClick={onPlay}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transform active:scale-98 transition-all"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>PLAY GAME</span>
            <ChevronRight className="w-5 h-5 ml-auto" />
          </button>

          {highestPlayableId > 1 && (
            <button
              onClick={onPlay}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Continue Level {highestPlayableId}</span>
            </button>
          )}
        </div>
      </div>

      {/* Player Stats Strip (No total levels shown as requested) */}
      <div className="w-full max-w-sm mx-auto grid grid-cols-4 gap-2 mb-4">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Stars</div>
          <div className="text-sm font-bold text-amber-500 dark:text-amber-400 font-mono flex items-center justify-center gap-0.5">
            <span>★</span>
            <span className="tabular-nums">{progress.totalStars}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Cleared</div>
          <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
            {completedCount}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Optimal</div>
          <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
            {optimalSolvesCount}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xs">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-0.5">Streak</div>
          <div className="text-sm font-bold text-orange-500 font-mono flex items-center justify-center gap-0.5">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span className="tabular-nums">{progress.streak}d</span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-2">
        <button
          onClick={onOpenInspector}
          className="p-3 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-left transition-colors flex items-center gap-2.5 shadow-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">BFS Inspector</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Test word paths</div>
          </div>
        </button>

        <button
          onClick={onOpenHelp}
          className="p-3 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-left transition-colors flex items-center gap-2.5 shadow-xs"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold">How to Play</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Rules & scoring</div>
          </div>
        </button>
      </div>
    </div>
  );
};
