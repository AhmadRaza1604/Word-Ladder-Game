import React from 'react';
import { Volume2, VolumeX, HelpCircle, Sparkles, Smartphone, Monitor, ArrowLeft, Clock, Settings } from 'lucide-react';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  levelTitle: string;
  levelNumber: number;
  totalLevels: number;
  totalStars: number;
  timeElapsedSeconds: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBackToLadder: () => void;
  onOpenHelp: () => void;
  onOpenInspector: () => void;
  onOpenSettings: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  levelTitle,
  levelNumber,
  totalLevels,
  totalStars,
  timeElapsedSeconds,
  soundEnabled,
  onToggleSound,
  onBackToLadder,
  onOpenHelp,
  onOpenInspector,
  onOpenSettings,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2.5 bg-white/90 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 sticky top-0 z-20 transition-colors">
      {/* Back to Level Ladder button & Level Info */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBackToLadder}
          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 transition-colors"
          title="Back to Level Ladder"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <AppLogo size="sm" />

        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            Level {levelNumber} of {totalLevels}
          </div>
          <div className="text-xs sm:text-sm font-extrabold tracking-tight">
            {levelTitle}
          </div>
        </div>
      </div>

      {/* Timer & Star Count & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Stopwatch Timer */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{formatTime(timeElapsedSeconds)}</span>
        </div>

        {/* Star Counter */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-amber-600 dark:text-amber-300">
          <span className="text-sm">★</span>
          <span className="tabular-nums font-mono">{totalStars}</span>
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Settings (Day/Night & Volume)"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Algorithmic Solver Inspector */}
        <button
          onClick={onOpenInspector}
          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-slate-800/80 hover:bg-indigo-100 dark:hover:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900/40 transition-colors"
          title="Verify BFS Shortest Path"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title={soundEnabled ? 'Mute Audio' : 'Enable Audio'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Mobile Viewport Toggle */}
        <button
          onClick={onToggleMobileFrame}
          className="hidden sm:flex p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title={isMobileFrame ? 'Expand to Desktop' : 'Preview Phone Frame'}
        >
          {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        </button>

        {/* Rules Help */}
        <button
          onClick={onOpenHelp}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          title="Game Rules"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
