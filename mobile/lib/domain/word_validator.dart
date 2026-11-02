import 'bfs_solver.dart';
import '../data/dictionary.dart';

class ValidationResult {
  final bool isValid;
  final String? errorMessage;
  final int? changedIndex;

  const ValidationResult({
    required this.isValid,
    this.errorMessage,
    this.changedIndex,
  });

  factory ValidationResult.valid(int changedIndex) =>
      ValidationResult(isValid: true, changedIndex: changedIndex);

  factory ValidationResult.invalid(String message) =>
      ValidationResult(isValid: false, errorMessage: message);
}

class WordValidator {
  static ValidationResult validateMove({
    required String currentWord,
    required String candidateWord,
  }) {
    final current = currentWord.toUpperCase().trim();
    final candidate = candidateWord.toUpperCase().trim();

    if (candidate.length != current.length) {
      return ValidationResult.invalid('Word must be ${current.length} letters long.');
    }

    if (candidate == current) {
      return ValidationResult.invalid('Word is identical to the current step.');
    }

    final diff = BfsSolver.countDifferences(current, candidate);
    if (diff != 1) {
      return ValidationResult.invalid(
        diff == 0 ? 'No change made.' : 'Must change exactly 1 letter (changed $diff).',
      );
    }

    if (!OfflineDictionary.isValidWord(candidate)) {
      return ValidationResult.invalid('"$candidate" is not in the approved dictionary.');
    }

    final changedIndex = BfsSolver.findDiffIndex(current, candidate);
    return ValidationResult.valid(changedIndex);
  }
}
