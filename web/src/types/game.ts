export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type AppView = 'home' | 'ladder' | 'playing';

export interface LevelDefinition {
  id: number;
  title: string;
  wordLength: number;
  startWord: string;
  targetWord: string;
  optimalMoves: number;       // Shortest path edge count verified by BFS
  maxMoves: number;           // Move limit
  difficulty: Difficulty;
  tier: number;               // 1: 3-letter, 2: 4-letter, 3: 5-letter
  hintClue?: string;
  verifiedPath?: string[];
}

export interface MoveRecord {
  word: string;
  changedIndex: number;
  timestamp: number;
}

export interface CompletedLevelData {
  completed: boolean;
  stars: number;
  bestMoves: number;
  shortestPathMoves: number;
  history: string[];
  timeElapsedSeconds?: number;
  completedAt: string;
}

export interface PlayerProgress {
  unlockedLevelId: number;
  completedLevels: Record<number, CompletedLevelData>;
  totalStars: number;
  streak: number;
  lastPlayedDate: string;
  soundEnabled: boolean;
  volume: number; // 0 to 100
  theme: 'dark' | 'light';
}

export interface HintResponse {
  type: 'index' | 'word';
  index?: number;
  suggestedWord?: string;
  explanation: string;
  remainingDistance: number;
}
