import React, { useState, useEffect } from 'react';
import { useGameStore } from './state/useGameStore';
import { HomeScreen } from './components/HomeScreen';
import { LevelLadderView } from './components/LevelLadderView';
import { Header } from './components/Header';
import { LadderStack } from './components/LadderStack';
import { WordTileRow } from './components/WordTileRow';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { LevelCriteriaModal } from './components/LevelCriteriaModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { HelpModal } from './components/HelpModal';
import { SolverInspectorModal } from './components/SolverInspectorModal';
import { SettingsModal } from './components/SettingsModal';
import { LEVELS } from './engine/levels';

export const App: React.FC = () => {
  const {
    progress,
    currentView,
    currentLevel,
    currentWord,
    history,
    selectedIndex,
    setSelectedIndex,
    movesCount,
    remainingMoves,
    timeElapsed,
    gameState,
    feedback,
    isShaking,
    activeHint,
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
    calculateStars,
  } = useGameStore();

  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Highest playable level ID
  const highestPlayableId = LEVELS.reduce((acc, lvl) => {
    return isLevelUnlocked(lvl.id) ? Math.max(acc, lvl.id) : acc;
  }, 1);

  // Global physical keyboard listener when playing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        currentView !== 'playing' ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isHelpOpen ||
        isInspectorOpen ||
        previewLevel !== null ||
        gameState !== 'playing'
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && key.length === 1) {
        e.preventDefault();
        replaceSelectedLetter(key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        undoLastMove();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(currentLevel.wordLength - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentView,
    isHelpOpen,
    isInspectorOpen,
    previewLevel,
    gameState,
    replaceSelectedLetter,
    undoLastMove,
    setSelectedIndex,
    currentLevel.wordLength,
  ]);

  const starsEarned = calculateStars(movesCount, currentLevel.optimalMoves);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-start selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Outer Viewport Container (supports mobile frame simulation or full-width) */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isMobileFrame
            ? 'max-w-[440px] min-h-screen my-0 sm:my-3 sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900/90 overflow-hidden'
            : 'max-w-2xl min-h-screen bg-white/95 dark:bg-slate-900/50 border-x border-slate-200 dark:border-slate-800/80 shadow-2xl'
        }`}
      >
        {/* VIEW 1: Home Page */}
        {currentView === 'home' && (
          <HomeScreen
            onPlay={goToLadder}
            onOpenHelp={() => setIsHelpOpen(true)}
            onOpenInspector={() => setIsInspectorOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            progress={progress}
            highestPlayableId={highestPlayableId}
            soundEnabled={progress.soundEnabled}
            onToggleSound={toggleSound}
            isMobileFrame={isMobileFrame}
            onToggleMobileFrame={() => setIsMobileFrame(prev => !prev)}
          />
        )}

        {/* VIEW 2: Level Ladder (52 levels) */}
        {currentView === 'ladder' && (
          <LevelLadderView
            onBackToHome={goToHome}
            onSelectLevel={openLevelPreview}
            progress={progress}
            isLevelUnlocked={isLevelUnlocked}
          />
        )}

        {/* VIEW 3: Active Gameplay */}
        {currentView === 'playing' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <Header
              levelTitle={currentLevel.title}
              levelNumber={currentLevel.id}
              totalLevels={LEVELS.length}
              totalStars={progress.totalStars}
              timeElapsedSeconds={timeElapsed}
              soundEnabled={progress.soundEnabled}
              onToggleSound={toggleSound}
              onBackToLadder={goToLadder}
              onOpenHelp={() => setIsHelpOpen(true)}
              onOpenInspector={() => setIsInspectorOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              isMobileFrame={isMobileFrame}
              onToggleMobileFrame={() => setIsMobileFrame(prev => !prev)}
            />

            <main className="flex-1 flex flex-col justify-between p-2 sm:p-3 overflow-hidden">
              {/* 1. Ladder Stack */}
              <LadderStack
                startWord={currentLevel.startWord}
                targetWord={currentLevel.targetWord}
                history={history}
                optimalMoves={currentLevel.optimalMoves}
                maxMoves={currentLevel.maxMoves}
                currentMoves={movesCount}
              />

              {/* 2. Active Word Tile Row */}
              <WordTileRow
                currentWord={currentWord}
                selectedIndex={selectedIndex}
                onSelectIndex={setSelectedIndex}
                isShaking={isShaking}
                feedback={feedback}
                activeHint={activeHint}
              />

              {/* 3. Virtual Keyboard & Dual-Input */}
              <VirtualKeyboard
                onLetterPress={replaceSelectedLetter}
                onSubmitWord={submitWord}
                onUndo={undoLastMove}
                onHint={requestHint}
                canUndo={history.length > 1}
                wordLength={currentLevel.wordLength}
              />
            </main>
          </div>
        )}
      </div>

      {/* MODAL 1: Level Criteria Preview Modal (Before Starting Level) */}
      <LevelCriteriaModal
        level={previewLevel}
        onClose={closeLevelPreview}
        onPlay={(levelId) => {
          startLevel(levelId);
        }}
        previousRecord={previewLevel ? progress.completedLevels[previewLevel.id] : undefined}
      />

      {/* MODAL 2: Level Complete Modal */}
      <LevelCompleteModal
        isOpen={gameState === 'won'}
        level={currentLevel}
        moves={movesCount}
        stars={starsEarned}
        timeElapsedSeconds={timeElapsed}
        history={history}
        onNextLevel={() => {
          nextLevel();
        }}
        onGoToLadder={goToLadder}
        onGoToHome={goToHome}
        onReplay={() => startLevel(currentLevel.id)}
        hasNextLevel={currentLevel.id < LEVELS.length}
      />

      {/* MODAL 3: How to Play Rules */}
      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* MODAL 4: Algorithmic Solver Inspector */}
      <SolverInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        currentLevel={currentLevel}
      />

      {/* MODAL 5: Game Settings (Day/Night & Volume) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={progress.theme}
        onSetTheme={setTheme}
        volume={progress.volume}
        onSetVolume={setVolume}
        soundEnabled={progress.soundEnabled}
        onToggleSound={toggleSound}
      />
    </div>
  );
};

export default App;
