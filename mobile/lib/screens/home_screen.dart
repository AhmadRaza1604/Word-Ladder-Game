import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels.dart';
import '../data/progress_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/app_logo.dart';
import '../widgets/settings_dialog.dart';
import 'ladder_screen.dart';
import 'game_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  final ProgressRepository _repo = ProgressRepository();
  int _unlockedLevel = 1;
  int _totalStars = 0;
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    );
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0, 0.08), end: Offset.zero).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic),
    );

    _animController.forward();
    _loadProgress();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _loadProgress() async {
    final unlocked = await _repo.getUnlockedLevel();
    final stars = await _repo.getTotalStars();
    if (!mounted) return;
    setState(() {
      _unlockedLevel = unlocked;
      _totalStars = stars;
    });
  }

  void _openSettings() {
    showDialog(
      context: context,
      builder: (_) => const SettingsDialog(),
    );
  }

  void _openLadder() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const LadderScreen()),
    ).then((_) => _loadProgress());
  }

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppThemeNotifier>();

    return Scaffold(
      backgroundColor: theme.backgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top Bar: Ahmad's first name on top corner + Settings & Stars
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Ahmad's name on top corner ONLY
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.accentGold,
                              shape: BoxShape.circle,
                            ],
                          ),
                          const SizedBox(width: 6),
                          Text(
                            "Ahmad's",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              letterSpacing: 0.5,
                              color: theme.textColor,
                            ),
                          ),
                        ],
                      ),
                      Text(
                        'Word Ladder',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: theme.textMutedColor,
                        ),
                      ),
                    ],
                  ),

                  // Actions: Stars Badge & Settings Button
                  Row(
                    children: [
                      // Total Stars
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
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
                      const SizedBox(width: 8),

                      // Settings Button
                      IconButton(
                        style: IconButton.styleFrom(
                          backgroundColor: theme.cardColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: BorderSide(color: theme.borderColor),
                          ),
                        ),
                        icon: Icon(Icons.settings_outlined, color: theme.textColor, size: 20),
                        onPressed: _openSettings,
                      ),
                    ],
                  ),
                ],
              ),

              // Hero Center: Animated Logo & Title
              FadeTransition(
                opacity: _fadeAnim,
                child: SlideTransition(
                  position: _slideAnim,
                  child: Column(
                    children: [
                      const AppLogo(size: 80),
                      const SizedBox(height: 20),
                      Text(
                        'WORD LADDER',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 3,
                          color: theme.textColor,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Transform words one step at a time',
                        style: TextStyle(
                          fontSize: 13,
                          color: theme.textMutedColor,
                        ),
                      ),
                      const SizedBox(height: 24),

                      // Demo Transformation Pill
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        decoration: BoxDecoration(
                          color: theme.cardColor,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: theme.borderColor),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            _buildStepBadge('COLD', theme),
                            _buildArrow(),
                            _buildStepBadge('CORD', theme),
                            _buildArrow(),
                            _buildStepBadge('CARD', theme),
                            _buildArrow(),
                            _buildStepBadge('WARM', theme, isTarget: true),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Bottom Actions: Play Level / Open Ladder
              Column(
                children: [
                  // Play Level Button
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 4,
                        shadowColor: AppColors.primary.withOpacity(0.4),
                      ),
                      onPressed: () {
                        final current = LevelRepository.getById(_unlockedLevel) ??
                            LevelRepository.levels.first;
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => GameScreen(level: current),
                          ),
                        ).then((_) => _loadProgress());
                      },
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.play_arrow_rounded, size: 24),
                          const SizedBox(width: 8),
                          Text(
                            'Play Level $_unlockedLevel',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 12),

                  // Open Ladder Button
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: theme.textColor,
                        side: BorderSide(color: theme.borderColor),
                        backgroundColor: theme.cardColor,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: _openLadder,
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.stairs_rounded, size: 20, color: AppColors.primaryLight),
                          SizedBox(width: 8),
                          Text(
                            'Level Ladder',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStepBadge(String word, AppThemeNotifier theme, {bool isTarget = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isTarget
            ? AppColors.accentGold.withOpacity(0.15)
            : AppColors.primary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        word,
        style: TextStyle(
          fontFamily: 'monospace',
          fontWeight: FontWeight.w900,
          fontSize: 11,
          letterSpacing: 1,
          color: isTarget ? AppColors.accentGold : AppColors.primaryLight,
        ),
      ),
    );
  }

  Widget _buildArrow() {
    return const Padding(
      padding: EdgeInsets.symmetric(horizontal: 4.0),
      child: Icon(Icons.chevron_right_rounded, size: 14, color: AppColors.primaryLight),
    );
  }
}
