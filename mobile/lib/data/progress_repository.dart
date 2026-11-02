import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class LevelProgress {
  final bool completed;
  final int stars;
  final int bestMoves;

  LevelProgress({
    required this.completed,
    required this.stars,
    required this.bestMoves,
  });

  Map<String, dynamic> toJson() => {
    'completed': completed,
    'stars': stars,
    'bestMoves': bestMoves,
  };

  factory LevelProgress.fromJson(Map<String, dynamic> json) => LevelProgress(
    completed: json['completed'] as bool? ?? false,
    stars: json['stars'] as int? ?? 0,
    bestMoves: json['bestMoves'] as int? ?? 0,
  );
}

class ProgressRepository {
  static const String _keyUnlocked = 'unlocked_level';
  static const String _keyStars = 'total_stars';
  static const String _keyCompletedLevels = 'completed_levels_map';

  Future<int> getUnlockedLevel() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyUnlocked) ?? 1;
  }

  Future<int> getTotalStars() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(_keyStars) ?? 0;
  }

  Future<Map<int, LevelProgress>> getCompletedLevels() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_keyCompletedLevels);
    if (raw == null) return {};

    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      return decoded.map((key, value) =>
          MapEntry(int.parse(key), LevelProgress.fromJson(value as Map<String, dynamic>)));
    } catch (_) {
      return {};
    }
  }

  Future<void> saveLevelComplete({
    required int levelId,
    required int moves,
    required int stars,
    required int totalLevels,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final existingLevels = await getCompletedLevels();

    final prevProgress = existingLevels[levelId];
    final prevStars = prevProgress?.stars ?? 0;
    final starDelta = stars > prevStars ? stars - prevStars : 0;

    existingLevels[levelId] = LevelProgress(
      completed: true,
      stars: stars > prevStars ? stars : prevStars,
      bestMoves: prevProgress != null && prevProgress.bestMoves < moves
          ? prevProgress.bestMoves
          : moves,
    );

    final encoded = jsonEncode(
      existingLevels.map((key, value) => MapEntry(key.toString(), value.toJson())),
    );

    await prefs.setString(_keyCompletedLevels, encoded);

    final currentTotalStars = await getTotalStars();
    await prefs.setInt(_keyStars, currentTotalStars + starDelta);

    final currentUnlocked = await getUnlockedLevel();
    if (levelId >= currentUnlocked && levelId < totalLevels) {
      await prefs.setInt(_keyUnlocked, levelId + 1);
    }
  }
}
