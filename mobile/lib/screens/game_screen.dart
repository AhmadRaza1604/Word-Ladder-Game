import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/levels.dart';
import '../data/progress_repository.dart';
import '../domain/word_validator.dart';
import '../domain/bfs_solver.dart';
import '../theme/app_theme.dart';
import '../widgets/word_tile.dart';
import '../widgets/virtual_keyboard.dart';
import '../widgets/victory_dialog.dart';

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
  final Stopwatch _stopwatch = Stopwatch();

  @override
  void initState() {
    super.initState();
    _startLevel();
  }

  @override
  void dispose() {
    _stopwatch.stop();
    super.dispose();
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
    _stopwatch.reset();
    _stopwatch.start();
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
    _stopwatch.stop();
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

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => VictoryDialog(
        level: widget.level,
        stars: stars,
        moves: totalMoves,
        elapsedTime: _stopwatch.elapsed,
        onNextLevel: () {
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
        onGoHome: () {
          Navigator.pop(context); // Back to previous (Ladder or Home)
        },
        onReplay: () {
          _startLevel();
        },
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
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Level ${widget.level.id}: ${widget.level.title}',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: theme.textColor,
              ),
            ),
            Text(
              'Par ${widget.level.optimalMoves} moves',
              style: TextStyle(
                fontSize: 11,
                color: theme.textMutedColor,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                ),
                child: Text(
                  'Moves: $_movesCount',
                  style: const TextStyle(
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: AppColors.primaryLight,
                  ),
                ),
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
                      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                      decoration: BoxDecoration(
                        color: AppColors.accentGold.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.accentGold.withOpacity(0.4)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: const [
                              Icon(Icons.flag_rounded, color: AppColors.accentGold, size: 16),
                              SizedBox(width: 6),
                              Text(
                                'GOAL',
                                style: TextStyle(
                                  color: AppColors.accentGold,
                                  fontWeight: FontWeight.bold,
                                  letterSpacing: 1,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            widget.level.targetWord,
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontWeight: FontWeight.w900,
                              fontSize: 18,
                              color: AppColors.accentGold,
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
                    padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
                    decoration: BoxDecoration(
                      color: isStart ? theme.cardColor : theme.cardColor.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                        color: isStart ? AppColors.primary.withOpacity(0.4) : theme.borderColor,
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          isStart ? 'START' : '#$index',
                          style: TextStyle(
                            color: isStart ? AppColors.accentGold : theme.textMutedColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          word,
                          style: TextStyle(
                            fontFamily: 'monospace',
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: theme.textColor,
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
                _feedbackMessage ?? 'Tap any tile to change letter',
                style: TextStyle(
                  color: _isError ? AppColors.error : AppColors.primaryLight,
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
