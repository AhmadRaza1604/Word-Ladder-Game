import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels.dart';
import '../theme/app_theme.dart';

class VictoryDialog extends StatelessWidget {
  final Level level;
  final int stars;
  final int moves;
  final Duration elapsedTime;
  final VoidCallback onNextLevel;
  final VoidCallback onGoHome;
  final VoidCallback onReplay;

  const VictoryDialog({
    super.key,
    required this.level,
    required this.stars,
    required this.moves,
    required this.elapsedTime,
    required this.onNextLevel,
    required this.onGoHome,
    required this.onReplay,
  });

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes;
    final seconds = d.inSeconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppThemeNotifier>();
    final hasNext = level.id < LevelRepository.levels.length;

    return Dialog(
      backgroundColor: theme.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: theme.borderColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Celebratory Top Icon
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.accentGold.withOpacity(0.15),
                shape: BoxShape.circle,
                border: Border.all(color: AppColors.accentGold.withOpacity(0.4)),
              ),
              child: const Icon(
                Icons.emoji_events_rounded,
                color: AppColors.accentGold,
                size: 32,
              ),
            ),
            const SizedBox(height: 12),

            Text(
              'Level ${level.id} Cleared!',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: theme.textColor,
              ),
            ),
            const SizedBox(height: 12),

            // 3 Big Glowing Stars
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                3,
                (i) => Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4.0),
                  child: Icon(
                    Icons.star_rounded,
                    size: 40,
                    color: i < stars ? AppColors.accentGold : theme.borderColor,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Stats Card: Time & Moves
            Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: theme.backgroundColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: theme.borderColor),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    children: [
                      Text(
                        'TIME',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                          color: theme.textMutedColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _formatDuration(elapsedTime),
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: theme.textColor,
                        ),
                      ),
                    ],
                  ),
                  Container(
                    width: 1,
                    height: 28,
                    color: theme.borderColor,
                  ),
                  Column(
                    children: [
                      Text(
                        'MOVES',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 1,
                          color: theme.textMutedColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '$moves / Par ${level.optimalMoves}',
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: theme.textColor,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Action Buttons: Next Level / Go Home / Replay
            if (hasNext)
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                    elevation: 2,
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    onNextLevel();
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Next Level',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward_rounded, size: 20),
                    ],
                  ),
                ),
              ),

            const SizedBox(height: 8),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: theme.textColor,
                      side: BorderSide(color: theme.borderColor),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      onReplay();
                    },
                    child: const Text('Replay'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: theme.textColor,
                      side: BorderSide(color: theme.borderColor),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () {
                      Navigator.pop(context);
                      onGoHome();
                    },
                    child: const Text('Home'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
