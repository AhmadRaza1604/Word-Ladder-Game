import { getWordsOfLength, isValidWord } from './dictionary';
import { HintResponse, LevelDefinition } from '../types/game';

/**
 * Counts the number of character differences between two equal-length words.
 */
export function countDifferentLetters(a: string, b: string): number {
  if (a.length !== b.length) return Math.max(a.length, b.length);
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff++;
    }
  }
  return diff;
}

/**
 * Finds the index of the single differing character between two words differing by exactly 1 character.
 * Returns -1 if words are identical or differ by more than 1 character.
 */
export function findDiffIndex(a: string, b: string): number {
  if (a.length !== b.length) return -1;
  let diffIndex = -1;
  let count = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      count++;
      diffIndex = i;
    }
  }
  return count === 1 ? diffIndex : -1;
}

/**
 * Generates all valid 1-letter change neighbors for a given word using the dictionary set.
 * Time complexity: O(L * 26) = O(26L) lookups in O(1) Set, very fast.
 */
export function getValidNeighbors(word: string, wordSet: Set<string>): string[] {
  const neighbors: string[] = [];
  const upper = word.toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  for (let i = 0; i < upper.length; i++) {
    const originalChar = upper[i];
    for (let c = 0; c < 26; c++) {
      const char = chars[c];
      if (char === originalChar) continue;
      const candidate = upper.slice(0, i) + char + upper.slice(i + 1);
      if (wordSet.has(candidate)) {
        neighbors.push(candidate);
      }
    }
  }
  return neighbors;
}

/**
 * Deterministic Breadth-First Search (BFS) to find the provably shortest ladder
 * from startWord to targetWord.
 * Returns the sequence of words [start, ..., target], or null if no path exists.
 */
export function findShortestPath(
  startWord: string,
  targetWord: string,
  customWordSet?: Set<string>
): string[] | null {
  const start = startWord.toUpperCase().trim();
  const target = targetWord.toUpperCase().trim();

  if (start.length !== target.length) return null;
  if (start === target) return [start];

  const wordSet = customWordSet || getWordsOfLength(start.length);

  // Both words must be valid
  if (!wordSet.has(start) && !isValidWord(start)) return null;
  if (!wordSet.has(target) && !isValidWord(target)) return null;

  // Standard BFS queue
  const queue: string[] = [start];
  const visited = new Map<string, string | null>(); // word -> parentWord
  visited.set(start, null);

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current === target) {
      // Reconstruct path
      const path: string[] = [];
      let curr: string | null = target;
      while (curr !== null) {
        path.push(curr);
        curr = visited.get(curr) || null;
      }
      path.reverse();
      return path;
    }

    const neighbors = getValidNeighbors(current, wordSet);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  return null;
}

/**
 * Calculates optimal next hint from player's current word to target word.
 */
export function getOptimalNextHint(
  currentWord: string,
  targetWord: string
): HintResponse | null {
  const current = currentWord.toUpperCase().trim();
  const target = targetWord.toUpperCase().trim();

  if (current === target) {
    return {
      type: 'word',
      suggestedWord: target,
      explanation: "You have already reached the target word!",
      remainingDistance: 0
    };
  }

  const path = findShortestPath(current, target);
  if (!path || path.length < 2) {
    return null;
  }

  const nextWord = path[1];
  const diffIndex = findDiffIndex(current, nextWord);

  return {
    type: 'index',
    index: diffIndex,
    suggestedWord: nextWord,
    explanation: `Next optimal move: Change letter #${diffIndex + 1} (${current[diffIndex]} → ${nextWord[diffIndex]}) to form "${nextWord}"`,
    remainingDistance: path.length - 1
  };
}

/**
 * Verifies that a level definition has a guaranteed reachable path
 * and matches the declared optimal moves.
 */
export function verifyLevelSolvability(level: LevelDefinition): {
  isValid: boolean;
  actualOptimalMoves: number;
  shortestPath: string[] | null;
  error?: string;
} {
  const path = findShortestPath(level.startWord, level.targetWord);
  if (!path) {
    return {
      isValid: false,
      actualOptimalMoves: -1,
      shortestPath: null,
      error: `Level ${level.id} (${level.startWord} → ${level.targetWord}): No valid path found in dictionary.`
    };
  }

  const actualMoves = path.length - 1;
  const isMatch = actualMoves === level.optimalMoves;

  return {
    isValid: isMatch,
    actualOptimalMoves: actualMoves,
    shortestPath: path,
    error: isMatch
      ? undefined
      : `Level ${level.id} expected ${level.optimalMoves} optimal moves, but BFS calculated ${actualMoves} moves.`
  };
}
