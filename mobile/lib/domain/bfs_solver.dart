import '../data/dictionary.dart';

class BfsSolver {
  /// Counts how many characters differ between two words of equal length.
  static int countDifferences(String a, String b) {
    if (a.length != b.length) return a.length > b.length ? a.length : b.length;
    int diff = 0;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) diff++;
    }
    return diff;
  }

  /// Finds the single differing index between two words differing by exactly 1 character.
  static int findDiffIndex(String a, String b) {
    if (a.length != b.length) return -1;
    int diffIndex = -1;
    int count = 0;
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        count++;
        diffIndex = i;
      }
    }
    return count == 1 ? diffIndex : -1;
  }

  /// Generates all valid 1-letter change neighbors for word in the dictionary.
  static List<String> getNeighbors(String word, Set<String> wordSet) {
    final List<String> neighbors = [];
    final upper = word.toUpperCase();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (int i = 0; i < upper.length; i++) {
      final originalChar = upper[i];
      for (int c = 0; c < 26; c++) {
        final char = chars[c];
        if (char == originalChar) continue;
        final candidate = upper.substring(0, i) + char + upper.substring(i + 1);
        if (wordSet.contains(candidate)) {
          neighbors.add(candidate);
        }
      }
    }
    return neighbors;
  }

  /// Deterministic Breadth-First Search (BFS) returning the shortest sequence
  /// [start, ..., target], or null if unreachable.
  static List<String>? findShortestPath(String startWord, String targetWord) {
    final start = startWord.toUpperCase().trim();
    final target = targetWord.toUpperCase().trim();

    if (start.length != target.length) return null;
    if (start == target) return [start];

    final wordSet = OfflineDictionary.getWordsOfLength(start.length);
    if (!wordSet.contains(start) || !wordSet.contains(target)) {
      return null;
    }

    final queue = <String>[start];
    final visited = <String, String?>{start: null};

    while (queue.isNotEmpty) {
      final current = queue.removeAt(0);

      if (current == target) {
        final path = <String>[];
        String? curr = target;
        while (curr != null) {
          path.add(curr);
          curr = visited[curr];
        }
        return path.reversed.toList();
      }

      for (final neighbor in getNeighbors(current, wordSet)) {
        if (!visited.containsKey(neighbor)) {
          visited[neighbor] = current;
          queue.add(neighbor);
        }
      }
    }

    return null;
  }
}
