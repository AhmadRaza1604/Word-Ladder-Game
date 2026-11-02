import 'package:flutter/material.dart';
import '../data/levels.dart';
import '../data/progress_repository.dart';
import 'game_screen.dart';

class LevelSelectScreen extends StatefulWidget {
  const LevelSelectScreen({super.key});

  @override
  State<LevelSelectScreen> createState() => _LevelSelectScreenState();
}

class _LevelSelectScreenState extends State<LevelSelectScreen> {
  final ProgressRepository _repo = ProgressRepository();
  int _unlockedLevel = 1;
  Map<int, LevelProgress> _completed = {};

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final unlocked = await _repo.getUnlockedLevel();
    final completed = await _repo.getCompletedLevels();
    setState(() {
      _unlockedLevel = unlocked;
      _completed = completed;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        title: const Text('Select Level', style: TextStyle(fontWeight: FontWeight.bold)),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: LevelRepository.levels.length,
        itemBuilder: (context, index) {
          final level = LevelRepository.levels[index];
          final isUnlocked = level.id <= _unlockedLevel;
          final prog = _completed[level.id];
          final stars = prog?.stars ?? 0;

          return Card(
            color: isUnlocked ? const Color(0xFF1E293B) : const Color(0xFF0F172A),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                color: isUnlocked ? const Color(0xFF334155) : const Color(0xFF1E293B),
              ),
            ),
            margin: const EdgeInsets.symmetric(vertical: 6),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: isUnlocked ? const Color(0xFF4F46E5) : const Color(0xFF334155),
                child: isUnlocked
                    ? Text('${level.id}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold))
                    : const Icon(Icons.lock, color: Colors.white38, size: 18),
              ),
              title: Text(
                '${level.startWord}  →  ${level.targetWord}',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: isUnlocked ? Colors.white : Colors.white38,
                  letterSpacing: 1.5,
                ),
              ),
              subtitle: Text(
                'Par: ${level.optimalMoves} moves  •  ${level.wordLength} letters',
                style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
              ),
              trailing: isUnlocked
                  ? Row(
                      mainAxisSize: MainAxisSize.min,
                      children: List.generate(
                        3,
                        (i) => Icon(
                          Icons.star,
                          size: 20,
                          color: i < stars ? const Color(0xFFF59E0B) : const Color(0xFF334155),
                        ),
                      ),
                    )
                  : null,
              onTap: isUnlocked
                  ? () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => GameScreen(level: level)),
                      ).then((_) => _load());
                    }
                  : null,
            ),
          );
        },
      ),
    );
  }
}
