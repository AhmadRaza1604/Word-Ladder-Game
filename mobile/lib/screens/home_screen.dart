import 'package:flutter/material.dart';
import '../data/levels.dart';
import '../data/progress_repository.dart';
import 'game_screen.dart';
import 'level_select_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ProgressRepository _repo = ProgressRepository();
  int _unlockedLevel = 1;
  int _totalStars = 0;

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    final unlocked = await _repo.getUnlockedLevel();
    final stars = await _repo.getTotalStars();
    setState(() {
      _unlockedLevel = unlocked;
      _totalStars = stars;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Top Stats Strip
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.star, color: Color(0xFFF59E0B), size: 18),
                        const SizedBox(width: 6),
                        Text(
                          '$_totalStars Stars',
                          style: const TextStyle(
                            color: Color(0xFFFBBF24),
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Title and Ladder Graphic
              Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: const Color(0xFF4F46E5),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF4F46E5).withOpacity(0.4),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.stairs,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'WORD LADDER',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 2,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Transform words one letter at a time',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Demo ladder animation pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: const Text(
                      'COLD  →  CORD  →  CARD  →  WARD  →  WARM',
                      style: TextStyle(
                        fontFamily: 'monospace',
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: Color(0xFF818CF8),
                        letterSpacing: 1,
                      ),
                    ),
                  ),
                ],
              ),

              // Action Buttons
              Column(
                children: [
                  SizedBox(
                    width: double.infinity,
                    height: 54,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 4,
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
                      child: Text(
                        'Play Level $_unlockedLevel',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFFCBD5E1),
                        side: const Border.all(color: const Color(0xFF334155)),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => const LevelSelectScreen(),
                          ),
                        ).then((_) => _loadProgress());
                      },
                      child: const Text(
                        'Select Level',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
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
}
