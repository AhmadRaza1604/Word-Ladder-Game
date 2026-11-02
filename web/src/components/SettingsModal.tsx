import React from 'react';
import { X, Moon, Sun, Volume2, VolumeX, Volume1, Sliders, Check } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onSetTheme: (theme: 'dark' | 'light') => void;
  volume: number; // 0 to 100
  onSetVolume: (volume: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onSetTheme,
  volume,
  onSetVolume,
  soundEnabled,
  onToggleSound,
}) => {
  if (!isOpen) return null;

  const handleVolumeChange = (newVal: number) => {
    onSetVolume(newVal);
    sounds.setVolume(newVal / 100);
  };

  const handleTestSound = () => {
    sounds.playTileTap();
    setTimeout(() => sounds.playValidMove(), 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold tracking-tight">Game Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 1. Day / Night Mode Section */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
              Display Theme
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Night Mode Button (Default) */}
              <button
                onClick={() => onSetTheme('dark')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-950 border-indigo-500 text-indigo-400 ring-2 ring-indigo-500/30 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Night Mode</span>
                {theme === 'dark' && <Check className="w-3.5 h-3.5 ml-auto" />}
              </button>

              {/* Day Mode Button */}
              <button
                onClick={() => onSetTheme('light')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                  theme === 'light'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Day Mode</span>
                {theme === 'light' && <Check className="w-3.5 h-3.5 ml-auto" />}
              </button>
            </div>
          </div>

          {/* 2. Audio & Volume Controls Section */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Sound Effects
                </label>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Tactile taps, chime & fanfares
                </span>
              </div>
              <button
                onClick={onToggleSound}
                className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  soundEnabled
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Muted</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Slider for reducing audio */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Volume1 className="w-3.5 h-3.5 text-slate-400" />
                  Volume Level
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {soundEnabled ? `${volume}%` : '0% (Muted)'}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={soundEnabled ? volume : 0}
                disabled={!soundEnabled}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-40"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>0% (Quiet)</span>
                <button
                  type="button"
                  onClick={handleTestSound}
                  disabled={!soundEnabled}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold underline disabled:opacity-40"
                >
                  Test Audio Chime
                </button>
                <span>100% (Full)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
