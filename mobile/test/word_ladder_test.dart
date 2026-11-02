import 'package:flutter_test/flutter_test.dart';
import '../lib/domain/bfs_solver.dart';
import '../lib/domain/word_validator.dart';
import '../lib/data/levels.dart';
import '../lib/data/dictionary.dart';

void main() {
  group('WordValidator Tests', () {
    test('Valid 1-letter move in dictionary succeeds', () {
      final result = WordValidator.validateMove(
        currentWord: 'COLD',
        candidateWord: 'CORD',
      );
      expect(result.isValid, isTrue);
      expect(result.changedIndex, equals(2));
    });

    test('Identical word is rejected', () {
      final result = WordValidator.validateMove(
        currentWord: 'COLD',
        candidateWord: 'COLD',
      );
      expect(result.isValid, isFalse);
    });

    test('Two letter change is rejected', () {
      final result = WordValidator.validateMove(
        currentWord: 'COLD',
        candidateWord: 'CARD',
      );
      expect(result.isValid, isFalse);
    });

    test('Non-dictionary word is rejected', () {
      final result = WordValidator.validateMove(
        currentWord: 'COLD',
        candidateWord: 'CZZD',
      );
      expect(result.isValid, isFalse);
    });
  });

  group('BfsSolver Tests', () {
    test('Finds verified shortest path for CAT -> DOG in 3 moves', () {
      final path = BfsSolver.findShortestPath('CAT', 'DOG');
      expect(path, isNotNull);
      expect(path!.length - 1, equals(3));
      expect(path.first, equals('CAT'));
      expect(path.last, equals('DOG'));
    });

    test('Finds verified shortest path for COLD -> WARM in 4 moves', () {
      final path = BfsSolver.findShortestPath('COLD', 'WARM');
      expect(path, isNotNull);
      expect(path!.length - 1, equals(4));
    });

    test('All shipped levels are solvable and match optimal moves', () {
      for (final level in LevelRepository.levels) {
        final path = BfsSolver.findShortestPath(level.startWord, level.targetWord);
        expect(
          path,
          isNotNull,
          reason: 'Level ${level.id} (${level.startWord} -> ${level.targetWord}) must have a valid path',
        );
        expect(
          path!.length - 1,
          equals(level.optimalMoves),
          reason: 'Level ${level.id} shortest path must match optimalMoves',
        );
      }
    });
  });
}
