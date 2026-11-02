import 'package:flutter/material.dart';
import '../data/levels.dart';
import '../data/progress_repository.dart';
import '../domain/word_validator.dart';
import '../domain/bfs_solver.dart';
import '../widgets/word_tile.dart';
import '../widgets/virtual_keyboard.dart';

class GameScreen extends StatefulWidget {
  final Level level;

  const GameScreen({super.key, required this.level});

  @override
  State<GameScreen> createState() => _GameScreenState();
}

class _GameScreenState extends State<GameScreen> {
  final ProgressRepository _repo = ProgressRepository();
  late List<String> _history;
  late String _currentWord;
  int _selectedIndex = 0;
  int _movesCount = 0;
  String? _feedbackMessage;
  bool _isError = false;
  int? _hintIndex;
  bool _isComplete = false;

  @override
  void initState() {
    super.initState();
    _startLevel();
  }

  void _startLevel() {
    setState(() {
      _history = [widget.level.startWord];
      _currentWord = widget.level.startWord;
      _selectedIndex = 0;
      _movesCount = 0;
      _feedbackMessage = null;
      _isError = false;
      _hintIndex = null;
      _isComplete = false;
    });
  }

  void _onLetterTap(String letter) {
    if (_isComplete) return;

    final chars = _currentWord.split('');
    chars[_selectedIndex] = letter;
    final candidate = chars.join('');

    _submitMove(candidate);
  }

  void _submitMove(String candidate) {
    final validation = WordValidator.validateMove(
      currentWord: _currentWord,
      candidateWord: candidate,
    );

    if (!validation.isValid) {
      setState(() {
        _feedbackMessage = validation.errorMessage;
        _isError = true;
      });
      return;
    }

    final newMoves = _movesCount + 1;
    final newHistory = List<String>.from(_history)..add(candidate);

    setState(() {
      _currentWord = candidate;
      _history = newHistory;
      _movesCount = newMoves;
      _feedbackMessage = 'Valid move: $candidate';
      _isError = false;
      _hintIndex = null;
    });

    if (candidate == widget.level.targetWord) {
      _handleWin(newMoves);
    } else if (newMoves >= widget.level.maxMoves) {
      setState(() {
        _feedbackMessage = 'Move limit reached! Tap undo or restart.';
        _isError = true;
      });
    }
  }

  void _handleWin(int totalMoves) async {
    setState(() {
      _isComplete = true;
    });

    int stars = 1;
    if (totalMoves <= widget.level.optimalMoves) {
      stars = 3;
    } else if (totalMoves <= widget.level.optimalMoves + 2) {
      stars = 2;
    }

    await _repo.saveLevelComplete(
      levelId: widget.level.id,
      moves: totalMoves,
      stars: stars,
      totalLevels: LevelRepository.levels.length,
    );

    if (!mounted) return;
    _showVictoryDialog(stars, totalMoves);
  }

  void _showVictoryDialog(int stars, int totalMoves) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1E293B),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Center(
          child: Text(
            'Level Solved!',
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          ),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                3,
                (i) => Icon(
                  Icons.star,
                  size: 36,
                  color: i < stars ? const Color(0xFFF59E0B) : const Color(0xFF475569),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Moves: $totalMoves  •  Par: ${widget.level.optimalMoves}',
              style: const TextStyle(color: Color(0xFF94A3B8)),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              _startLevel();
            },
            child: const Text('Replay', style: TextStyle(color: Color(0xFF818CF8))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF4F46E5),
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.pop(ctx);
              final next = LevelRepository.getById(widget.level.id + 1);
              if (next != null) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (_) => GameScreen(level: next)),
                );
              } else {
                Navigator.pop(context);
              }
            },
            child: const Text('Next Level'),
          ),
        ],
      ),
    );
  }

  void _onUndo() {
    if (_history.length <= 1) return;
    setState(() {
      _history.removeLast();
      _currentWord = _history.last;
      _movesCount = _movesCount > 0 ? _movesCount - 1 : 0;
      _feedbackMessage = 'Undid last step.';
      _isError = false;
      _hintIndex = null;
    });
  }

  void _onHint() {
    final path = BfsSolver.findShortestPath(_currentWord, widget.level.targetWord);
    if (path != null && path.length > 1) {
      final nextWord = path[1];
      final diff = BfsSolver.findDiffIndex(_currentWord, nextWord);
      setState(() {
        _hintIndex = diff;
        _selectedIndex = diff >= 0 ? diff : 0;
        _feedbackMessage = 'Hint: Change letter #${diff + 1} to "${nextWord[diff]}"';
        _isError = false;
      });
    } else {
      setState(() {
        _feedbackMessage = 'No route from here. Try undoing a step.';
        _isError = true;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1E293B),
        elevation: 0,
        title: Text(
          'Level ${widget.level.id}: ${widget.level.title}',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
              child: Text(
                'Moves: $_movesCount / ${widget.level.maxMoves}',
                style: const TextStyle(color: Color(0xFF94A3B8), fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Ladder Stack
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                itemCount: _history.length + 1,
                itemBuilder: (context, index) {
                  if (index == _history.length) {
                    // Target goal
                    return Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF064E3B).withOpacity(0.4),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFF059669)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('GOAL', style: TextStyle(color: Color(0xFF34D399), fontWeight: FontWeight.bold)),
                          Text(
                            widget.level.targetWord,
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                              color: Color(0xFF6EE7B7),
                              letterSpacing: 4,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  final word = _history[index];
                  final isStart = index == 0;
                  return Container(
                    margin: const EdgeInsets.symmetric(vertical: 3),
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: isStart ? const Color(0xFF1E293B) : const Color(0xFF1E293B).withOpacity(0.7),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFF334155)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          isStart ? 'START' : '#$index',
                          style: TextStyle(
                            color: isStart ? const Color(0xFFFBBF24) : const Color(0xFF64748B),
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          word,
                          style: const TextStyle(
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: Colors.white,
                            letterSpacing: 4,
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

            // Active Word Tiles
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _currentWord.length,
                  (idx) => WordTile(
                    letter: _currentWord[idx],
                    isSelected: _selectedIndex == idx,
                    isHighlighted: _hintIndex == idx,
                    onTap: () => setState(() => _selectedIndex = idx),
                  ),
                ),
              ),
            ),

            // Feedback Message
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Text(
                _feedbackMessage ?? 'Tap a tile to change that letter',
                style: TextStyle(
                  color: _isError ? const Color(0xFFF87171) : const Color(0xFF818CF8),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),

            // Keyboard
            VirtualKeyboard(
              onLetterTap: _onLetterTap,
              onUndo: _onUndo,
              onHint: _onHint,
              canUndo: _history.length > 1,
            ),
          ],
        ),
      ),
    );
  }
}
