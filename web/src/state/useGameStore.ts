import { useState, useEffect, useCallback, useRef } from 'react';
import { LevelDefinition, PlayerProgress, HintResponse, AppView } from '../types/game';
import { LEVELS, getLevelById } from '../engine/levels';
import { validateMove } from '../engine/validator';
import { getOptimalNextHint } from '../engine/bfsSolver';
import { sounds } from '../audio/soundEffects';

const STORAGE_KEY = 'word_ladder_progress_v4';

const DEFAULT_PROGRESS: PlayerProgress = {
  unlockedLevelId: 1,
  completedLevels: {},
  totalStars: 0,
  streak: 0,
  lastPlayedDate: '',
  soundEnabled: true,
  volume: 50,
  theme: 'dark', // Night mode is default
};

function loadStoredProgress(): PlayerProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    const completedLevels = parsed.completedLevels || {};
    const hasCompletedAny = Object.keys(completedLevels).length > 0;

    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      volume: typeof parsed.volume === 'number' ? parsed.volume : 50,
      streak: hasCompletedAny ? (parsed.streak || 1) : 0,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgressToStorage(progress: PlayerProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // LocalStorage write failed
  }
}

export function useGameStore() {
  const [progress, setProgress] = useState<PlayerProgress>(loadStoredProgress);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [previewLevel, setPreviewLevel] = useState<LevelDefinition | null>(null);

  // Gameplay state
  const [history, setHistory] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [movesCount, setMovesCount] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [activeHint, setActiveHint] = useState<HintResponse | null>(null);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentLevel: LevelDefinition = getLevelById(currentLevelId) || LEVELS[0];

  // Helper: check if a level is unlocked
  // "each level unlock once previous is done with atlease 1 star"
  const isLevelUnlocked = useCallback((levelId: number): boolean => {
    if (levelId === 1) return true;
    const previousLevelProgress = progress.completedLevels[levelId - 1];
    return Boolean(previousLevelProgress && previousLevelProgress.stars >= 1);
  }, [progress.completedLevels]);

  // Sync document theme with progress.theme (Day vs Night mode)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (progress.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [progress.theme]);

  // Sync sound manager with progress
  useEffect(() => {
    sounds.setEnabled(progress.soundEnabled);
    sounds.setVolume(progress.volume / 100);
  }, [progress.soundEnabled, progress.volume]);

  // Stopwatch timer for active gameplay
  useEffect(() => {
    if (currentView === 'playing' && gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentView, gameState]);

  // Start a specific level directly
  const startLevel = useCallback((levelId: number) => {
    const level = getLevelById(levelId) || LEVELS[0];
    setCurrentLevelId(level.id);
    setCurrentWord(level.startWord);
    setHistory([level.startWord]);
    setSelectedIndex(0);
    setMovesCount(0);
    setTimeElapsed(0);
    setGameState('playing');
    setFeedback(null);
    setIsShaking(false);
    setActiveHint(null);
    setHintsUsedCount(0);
    setPreviewLevel(null);
    setCurrentView('playing');
  }, []);

  // Open criteria preview modal for a level
  const openLevelPreview = useCallback((levelId: number) => {
    const level = getLevelById(levelId);
    if (level && isLevelUnlocked(level.id)) {
      setPreviewLevel(level);
    }
  }, [isLevelUnlocked]);

  const closeLevelPreview = useCallback(() => {
    setPreviewLevel(null);
  }, []);

  // Trigger feedback with auto-clear
  const showFeedback = useCallback((message: string, isError: boolean = false) => {
    setFeedback({ message, isError });
    if (isError) {
      setIsShaking(true);
      sounds.playInvalid();
      setTimeout(() => setIsShaking(false), 450);
    }
    const timer = setTimeout(() => {
      setFeedback(prev => (prev?.message === message ? null : prev));
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  // Star calculation
  const calculateStars = useCallback((moves: number, optimal: number): number => {
    if (moves <= optimal) return 3;
    if (moves <= optimal + 2) return 2;
    return 1;
  }, []);

  // Submit candidate word move
  const submitWord = useCallback((candidate: string) => {
    if (gameState !== 'playing') return;

    const trimmed = candidate.toUpperCase().trim();
    const validation = validateMove(currentWord, trimmed);

    if (!validation.isValid) {
      showFeedback(validation.message, true);
      return;
    }

    // Valid move accepted!
    const newMovesCount = movesCount + 1;
    const newHistory = [...history, trimmed];
    setHistory(newHistory);
    setCurrentWord(trimmed);
    setMovesCount(newMovesCount);
    setActiveHint(null);

    // Check if won
    if (trimmed === currentLevel.targetWord) {
      const starsEarned = calculateStars(newMovesCount, currentLevel.optimalMoves);
      setGameState('won');
      sounds.playVictory();

      // Update progress
      setProgress(prev => {
        const existingLevelData = prev.completedLevels[currentLevel.id];
        const previousStars = existingLevelData ? existingLevelData.stars : 0;
        const starDiff = Math.max(0, starsEarned - previousStars);

        const nextUnlocked = Math.max(
          prev.unlockedLevelId,
          Math.min(currentLevel.id + 1, LEVELS.length)
        );

        // Streak calculation
        const todayStr = new Date().toISOString().split('T')[0];
        let newStreak = prev.streak || 0;

        if (newStreak === 0) {
          newStreak = 1;
        } else if (prev.lastPlayedDate) {
          const lastDateStr = prev.lastPlayedDate.split('T')[0];
          if (lastDateStr !== todayStr) {
            const diffTime = Math.abs(new Date(todayStr).getTime() - new Date(lastDateStr).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            newStreak = diffDays === 1 ? newStreak + 1 : 1;
          }
        } else {
          newStreak = 1;
        }

        const updatedProgress: PlayerProgress = {
          ...prev,
          unlockedLevelId: nextUnlocked,
          totalStars: prev.totalStars + starDiff,
          streak: newStreak,
          lastPlayedDate: new Date().toISOString(),
          completedLevels: {
            ...prev.completedLevels,
            [currentLevel.id]: {
              completed: true,
              stars: Math.max(previousStars, starsEarned),
              bestMoves: existingLevelData ? Math.min(existingLevelData.bestMoves, newMovesCount) : newMovesCount,
              shortestPathMoves: currentLevel.optimalMoves,
              history: newHistory,
              timeElapsedSeconds: timeElapsed,
              completedAt: new Date().toISOString(),
            }
          }
        };

        saveProgressToStorage(updatedProgress);
        return updatedProgress;
      });

      showFeedback(
        starsEarned === 3
          ? `Perfect! Optimal solution in ${newMovesCount} moves! (+3 Stars)`
          : `Target reached in ${newMovesCount} moves!`,
        false
      );
      return;
    }

    // Check if move limit exceeded
    if (newMovesCount >= currentLevel.maxMoves) {
      setGameState('lost');
      sounds.playInvalid();
      showFeedback(`Move limit (${currentLevel.maxMoves}) reached. Try again!`, true);
      return;
    }

    // Normal valid intermediate step
    sounds.playValidMove();
    showFeedback(`Step accepted: ${trimmed}`, false);
  }, [currentWord, gameState, history, movesCount, currentLevel, calculateStars, showFeedback, timeElapsed]);

  // Change single letter at currently selected index
  const replaceSelectedLetter = useCallback((char: string) => {
    if (gameState !== 'playing' || !currentWord) return;
    sounds.playTileTap();

    const upperChar = char.toUpperCase().slice(0, 1);
    if (!/^[A-Z]$/.test(upperChar)) return;

    const chars = currentWord.split('');
    chars[selectedIndex] = upperChar;
    const candidate = chars.join('');

    submitWord(candidate);
  }, [currentWord, gameState, selectedIndex, submitWord]);

  // Request optimal hint
  const requestHint = useCallback(() => {
    if (gameState !== 'playing') return;
    const hint = getOptimalNextHint(currentWord, currentLevel.targetWord);
    if (hint) {
      sounds.playHint();
      setActiveHint(hint);
      setHintsUsedCount(c => c + 1);
      if (hint.index !== undefined && hint.index >= 0) {
        setSelectedIndex(hint.index);
      }
      showFeedback(hint.explanation, false);
    } else {
      showFeedback("No reachable path from current word. Try undoing a step!", true);
    }
  }, [currentWord, currentLevel.targetWord, gameState, showFeedback]);

  // Undo last step
  const undoLastMove = useCallback(() => {
    if (gameState !== 'playing' || history.length <= 1) return;
    const newHistory = history.slice(0, history.length - 1);
    const prevWord = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setCurrentWord(prevWord);
    setMovesCount(m => Math.max(0, m - 1));
    setActiveHint(null);
    sounds.playTileTap();
    showFeedback(`Undid step to ${prevWord}`, false);
  }, [gameState, history, showFeedback]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setProgress(prev => {
      const updated = { ...prev, soundEnabled: !prev.soundEnabled };
      saveProgressToStorage(updated);
      return updated;
    });
  }, []);

  // Set theme (day or night)
  const setTheme = useCallback((theme: 'dark' | 'light') => {
    setProgress(prev => {
      const updated = { ...prev, theme };
      saveProgressToStorage(updated);
      return updated;
    });
  }, []);

  // Set volume (0 to 100)
  const setVolume = useCallback((volume: number) => {
    setProgress(prev => {
      const updated = { ...prev, volume };
      saveProgressToStorage(updated);
      return updated;
    });
  }, []);

  // Navigation handlers
  const goToHome = useCallback(() => {
    setCurrentView('home');
    setPreviewLevel(null);
  }, []);

  const goToLadder = useCallback(() => {
    setCurrentView('ladder');
    setPreviewLevel(null);
  }, []);

  const nextLevel = useCallback(() => {
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      startLevel(nextId);
    } else {
      goToLadder();
    }
  }, [currentLevelId, startLevel, goToLadder]);

  return {
    progress,
    currentView,
    setCurrentView,
    currentLevel,
    currentWord,
    history,
    selectedIndex,
    setSelectedIndex,
    movesCount,
    remainingMoves: Math.max(0, currentLevel.maxMoves - movesCount),
    timeElapsed,
    gameState,
    feedback,
    isShaking,
    activeHint,
    hintsUsedCount,
    previewLevel,
    isLevelUnlocked,
    openLevelPreview,
    closeLevelPreview,
    submitWord,
    replaceSelectedLetter,
    requestHint,
    undoLastMove,
    startLevel,
    nextLevel,
    goToHome,
    goToLadder,
    toggleSound,
    setTheme,
    setVolume,
    calculateStars
  };
}
