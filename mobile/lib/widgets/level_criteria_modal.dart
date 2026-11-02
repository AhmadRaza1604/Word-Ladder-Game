import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels.dart';
import '../theme/app_theme.dart';

class LevelCriteriaModal extends StatelessWidget {
  final Level level;
  final int earnedStars;
  final VoidCallback onPlay;

  const LevelCriteriaModal({
    super.key,
    required this.level,
    required this.earnedStars,
    required this.onPlay,
  });

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppThemeNotifier>();

    return Dialog(
      backgroundColor: theme.cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: theme.borderColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(22.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Header: Level # and Close button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        'LEVEL ${level.id}',
                        style: const TextStyle(
                          color: AppColors.primaryLight,
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                          letterSpacing: 1,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    // Current Stars
                    Row(
                      children: List.generate(
                        3,
                        (i) => Icon(
                          Icons.star,
                          size: 16,
                          color: i < earnedStars
                              ? AppColors.accentGold
                              : theme.borderColor,
                        ),
                      ),
                    ),
                  ],
                ),
                IconButton(
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  icon: Icon(Icons.close, color: theme.textMutedColor, size: 20),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),

            const SizedBox(height: 12),

            // Target Transformation Badge
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: theme.backgroundColor,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: theme.borderColor),
              ),
              child: Column(
                children: [
                  Text(
                    'TRANSFORM CHALLENGE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                      color: theme.textMutedColor,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        level.startWord,
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: theme.textColor,
                          letterSpacing: 3,
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 10),
                        child: Icon(Icons.arrow_forward_rounded, color: AppColors.primaryLight, size: 18),
                      ),
                      Text(
                        level.targetWord,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: AppColors.accentGold,
                          letterSpacing: 3,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Par moves: ${level.optimalMoves}  •  Word length: ${level.wordLength}',
                    style: TextStyle(
                      fontSize: 12,
                      color: theme.textMutedColor,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Criteria for each star
            Text(
              'STAR CRITERIA',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                letterSpacing: 1,
                color: theme.textMutedColor,
              ),
            ),
            const SizedBox(height: 8),

            // 3 Stars Criteria
            _buildCriteriaRow(
              starsCount: 3,
              label: 'Par Mastery',
              detail: 'Solve in ≤ ${level.optimalMoves} moves',
              theme: theme,
              isAchieved: earnedStars >= 3,
            ),
            const SizedBox(height: 6),

            // 2 Stars Criteria
            _buildCriteriaRow(
              starsCount: 2,
              label: 'Great Effort',
              detail: 'Solve in ≤ ${level.optimalMoves + 2} moves',
              theme: theme,
              isAchieved: earnedStars >= 2,
            ),
            const SizedBox(height: 6),

            // 1 Star Criteria
            _buildCriteriaRow(
              starsCount: 1,
              label: 'Clear Level',
              detail: 'Complete within ${level.maxMoves} moves',
              theme: theme,
              isAchieved: earnedStars >= 1,
            ),

            const SizedBox(height: 20),

            // Play Level Button
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
                  onPlay();
                },
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.play_arrow_rounded, size: 22),
                    SizedBox(width: 6),
                    Text(
                      'Play Level',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCriteriaRow({
    required int starsCount,
    required String label,
    required String detail,
    required AppThemeNotifier theme,
    required bool isAchieved,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isAchieved ? AppColors.accentGold.withOpacity(0.08) : theme.backgroundColor,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: isAchieved ? AppColors.accentGold.withOpacity(0.3) : theme.borderColor,
        ),
      ),
      child: Row(
        children: [
          Row(
            children: List.generate(
              3,
              (i) => Icon(
                Icons.star,
                size: 14,
                color: i < starsCount ? AppColors.accentGold : theme.borderColor,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: isAchieved ? AppColors.accentGold : theme.textColor,
                  ),
                ),
                Text(
                  detail,
                  style: TextStyle(
                    fontSize: 11,
                    color: theme.textMutedColor,
                  ),
                ),
              ],
            ),
          ),
          if (isAchieved)
            const Icon(Icons.check_circle_rounded, color: AppColors.accentGold, size: 16),
        ],
      ),
    );
  }
}
