import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels.dart';
import '../data/progress_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/level_criteria_modal.dart';
import 'game_screen.dart';

class LadderScreen extends StatefulWidget {
  const LadderScreen({super.key});

  @override
  State<LadderScreen> createState() => _LadderScreenState();
}

class _LadderScreenState extends State<LadderScreen> {
  final ProgressRepository _repo = ProgressRepository();
  int _unlockedLevel = 1;
  int _totalStars = 0;
  Map<int, LevelProgress> _completed = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final unlocked = await _repo.getUnlockedLevel();
    final stars = await _repo.getTotalStars();
    final completed = await _repo.getCompletedLevels();
    if (!mounted) return;
    setState(() {
      _unlockedLevel = unlocked;
      _totalStars = stars;
      _completed = completed;
      _isLoading = false;
    });
  }

  void _onLevelClicked(Level level) {
    final isUnlocked = level.id <= _unlockedLevel;
    if (!isUnlocked) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Level ${level.id} is locked! Complete previous level with at least 1 star.'),
          backgroundColor: AppColors.cardColorForTheme(context),
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }

    final prog = _completed[level.id];
    final earnedStars = prog?.stars ?? 0;

    showDialog(
      context: context,
      builder: (_) => LevelCriteriaModal(
        level: level,
        earnedStars: earnedStars,
        onPlay: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => GameScreen(level: level)),
          ).then((_) => _loadData());
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppThemeNotifier>();

    return Scaffold(
      backgroundColor: theme.backgroundColor,
      appBar: AppBar(
        backgroundColor: theme.surfaceColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: theme.textColor),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Ascent Ladder',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: theme.textColor,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.accentGold.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.accentGold.withOpacity(0.3)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.star_rounded, color: AppColors.accentGold, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '$_totalStars',
                      style: const TextStyle(
                        color: AppColors.accentGold,
                        fontWeight: FontWeight.bold,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: AppColors.primary))
          : CustomScrollView(
              slivers: [
                // Top Altitude Banner
                SliverToBoxAdapter(
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
                    color: theme.surfaceColor.withOpacity(0.5),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '52 LEVELS TO THE SUMMIT',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                            color: theme.textMutedColor,
                          ),
                        ),
                        Text(
                          'UNLOCKED: $_unlockedLevel',
                          style: const TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.2,
                            color: AppColors.primaryLight,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Winding Ladder List
                SliverPadding(
                  padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) {
                        final level = LevelRepository.levels[index];
                        final isUnlocked = level.id <= _unlockedLevel;
                        final isCurrent = level.id == _unlockedLevel;
                        final prog = _completed[level.id];
                        final stars = prog?.stars ?? 0;

                        // Calculate winding horizontal alignment (-1 left, 0 center, 1 right)
                        // A smooth sine wave curve
                        final alignmentFactor = (index % 4 == 0)
                            ? 0.0
                            : (index % 4 == 1)
                                ? 0.65
                                : (index % 4 == 2)
                                    ? 0.0
                                    : -0.65;

                        // Section divider headers at tier thresholds
                        Widget? tierHeader;
                        if (index == 0) {
                          tierHeader = _buildTierHeader('VALLEY ASCENT', 'Levels 1–15 • 3-Letter Words', theme);
                        } else if (index == 15) {
                          tierHeader = _buildTierHeader('HIGHLAND RIDGE', 'Levels 16–40 • 4-Letter Words', theme);
                        } else if (index == 40) {
                          tierHeader = _buildTierHeader('SUMMIT PEAKS', 'Levels 41–52 • 5-Letter Mastery', theme);
                        }

                        return Column(
                          children: [
                            if (tierHeader != null) tierHeader,

                            // Connecting trail indicator
                            if (index > 0)
                              SizedBox(
                                height: 28,
                                child: Center(
                                  child: Container(
                                    width: 2,
                                    height: 28,
                                    decoration: BoxDecoration(
                                      color: isUnlocked
                                          ? AppColors.primaryLight.withOpacity(0.4)
                                          : theme.borderColor.withOpacity(0.5),
                                    ),
                                  ),
                                ),
                              ),

                            // Artistic Ladder Node
                            Align(
                              alignment: Alignment(alignmentFactor, 0.0),
                              child: GestureDetector(
                                onTap: () => _onLevelClicked(level),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  width: isCurrent ? 84 : 76,
                                  height: isCurrent ? 84 : 76,
                                  decoration: BoxDecoration(
                                    color: isUnlocked
                                        ? (isCurrent ? AppColors.primary : theme.cardColor)
                                        : theme.backgroundColor,
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: isCurrent
                                          ? AppColors.accentGold
                                          : (isUnlocked
                                              ? (stars > 0 ? AppColors.primaryLight : theme.borderColor)
                                              : theme.borderColor),
                                      width: isCurrent ? 3 : 2,
                                    ),
                                    boxShadow: isCurrent
                                        ? [
                                            BoxShadow(
                                              color: AppColors.primary.withOpacity(0.5),
                                              blurRadius: 16,
                                              spreadRadius: 2,
                                            ),
                                          ]
                                        : (isUnlocked
                                            ? [
                                                BoxShadow(
                                                  color: Colors.black.withOpacity(0.08),
                                                  blurRadius: 8,
                                                  offset: const Offset(0, 4),
                                                ),
                                              ]
                                            : null),
                                  ),
                                  child: Stack(
                                    alignment: Alignment.center,
                                    children: [
                                      if (!isUnlocked)
                                        Icon(Icons.lock_rounded, color: theme.textMutedColor.withOpacity(0.6), size: 24)
                                      else
                                        Column(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              '${level.id}',
                                              style: TextStyle(
                                                fontFamily: 'monospace',
                                                fontSize: isCurrent ? 22 : 19,
                                                fontWeight: FontWeight.w900,
                                                color: isCurrent ? Colors.white : theme.textColor,
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            // 3 Stars indicator below number
                                            Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: List.generate(
                                                3,
                                                (i) => Icon(
                                                  Icons.star_rounded,
                                                  size: 11,
                                                  color: i < stars
                                                      ? AppColors.accentGold
                                                      : (isCurrent
                                                          ? Colors.white.withOpacity(0.35)
                                                          : theme.borderColor),
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        );
                      },
                      childCount: LevelRepository.levels.length,
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildTierHeader(String title, String subtitle, AppThemeNotifier theme) {
    return Container(
      margin: const EdgeInsets.only(top: 24, bottom: 12),
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primary.withOpacity(0.2)),
      ),
      child: Column(
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w900,
              letterSpacing: 1.5,
              color: AppColors.primaryLight,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 10,
              color: theme.textMutedColor,
            ),
          ),
        ],
      ),
    );
  }
}

extension ThemeHelpers on AppColors {
  static Color cardColorForTheme(BuildContext context) {
    return Provider.of<AppThemeNotifier>(context, listen: false).cardColor;
  }
}
