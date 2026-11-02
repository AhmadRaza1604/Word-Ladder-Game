import { isValidWord } from './dictionary';
import { countDifferentLetters, findDiffIndex } from './bfsSolver';

export interface ValidationResult {
  isValid: boolean;
  errorCode?: 'LENGTH_MISMATCH' | 'NOT_IN_DICTIONARY' | 'SAME_WORD' | 'MULTIPLE_CHANGES';
  message: string;
  changedIndex?: number;
}

/**
 * Validates whether candidateWord is a legal move from currentWord according to Word Ladder rules:
 * 1. Must have the exact same length
 * 2. Must not be identical to currentWord
 * 3. Must differ by EXACTLY 1 letter
 * 4. Must exist in the approved dictionary
 */
export function validateMove(
  currentWord: string,
  candidateWord: string
): ValidationResult {
  const current = currentWord.toUpperCase().trim();
  const candidate = candidateWord.toUpperCase().trim();

  if (candidate.length !== current.length) {
    return {
      isValid: false,
      errorCode: 'LENGTH_MISMATCH',
      message: `Word must be exactly ${current.length} letters long.`
    };
  }

  if (candidate === current) {
    return {
      isValid: false,
      errorCode: 'SAME_WORD',
      message: 'Word is identical to the current step.'
    };
  }

  const diffCount = countDifferentLetters(current, candidate);
  if (diffCount !== 1) {
    return {
      isValid: false,
      errorCode: 'MULTIPLE_CHANGES',
      message: diffCount === 0
        ? 'No change detected.'
        : `Must change exactly 1 letter (changed ${diffCount} letters).`
    };
  }

  if (!isValidWord(candidate)) {
    return {
      isValid: false,
      errorCode: 'NOT_IN_DICTIONARY',
      message: `"${candidate}" is not in the approved dictionary.`
    };
  }

  const changedIndex = findDiffIndex(current, candidate);

  return {
    isValid: true,
    message: `Valid move: formed "${candidate}"`,
    changedIndex
  };
}
