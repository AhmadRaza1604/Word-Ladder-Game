import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';

class VirtualKeyboard extends StatelessWidget {
  final ValueChanged<String> onLetterTap;
  final VoidCallback onUndo;
  final VoidCallback onHint;
  final bool canUndo;

  const VirtualKeyboard({
    super.key,
    required this.onLetterTap,
    required this.onUndo,
    required this.onHint,
    required this.canUndo,
  });

  static const List<List<String>> _rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ];

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppThemeNotifier>();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildRow(_rows[0], theme),
          const SizedBox(height: 6),
          _buildRow(_rows[1], theme),
          const SizedBox(height: 6),
          _buildBottomRow(theme),
        ],
      ),
    );
  }

  Widget _buildRow(List<String> keys, AppThemeNotifier theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: keys.map((key) => _buildKey(key, theme)).toList(),
    );
  }

  Widget _buildKey(String letter, AppThemeNotifier theme) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2.5),
        child: InkWell(
          onTap: () => onLetterTap(letter),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            height: 46,
            decoration: BoxDecoration(
              color: theme.cardColor,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: theme.borderColor),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 2,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            alignment: Alignment.center,
            child: Text(
              letter,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: theme.textColor,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomRow(AppThemeNotifier theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Undo button
        Expanded(
          flex: 2,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2.5),
            child: InkWell(
              onTap: canUndo ? onUndo : null,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                height: 46,
                decoration: BoxDecoration(
                  color: canUndo
                      ? (theme.isNight ? const Color(0xFF334155) : const Color(0xFFE2E8F0))
                      : theme.backgroundColor,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: theme.borderColor),
                ),
                alignment: Alignment.center,
                child: Icon(
                  Icons.undo_rounded,
                  color: canUndo ? theme.textColor : theme.textMutedColor.withOpacity(0.4),
                  size: 20,
                ),
              ),
            ),
          ),
        ),
        ..._rows[2].map((key) => _buildKey(key, theme)),
        // Hint button
        Expanded(
          flex: 2,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2.5),
            child: InkWell(
              onTap: onHint,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                height: 46,
                decoration: BoxDecoration(
                  color: AppColors.accentGold.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.accentGold.withOpacity(0.4)),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.lightbulb_outline_rounded,
                  color: AppColors.accentGold,
                  size: 20,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
