import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';

class WordTile extends StatelessWidget {
  final String letter;
  final bool isSelected;
  final bool isHighlighted;
  final VoidCallback onTap;

  const WordTile({
    super.key,
    required this.letter,
    required this.isSelected,
    this.isHighlighted = false,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final theme = context.watch<AppThemeNotifier>();

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        width: 56,
        height: 64,
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary
              : (isHighlighted
                  ? AppColors.accentGold.withOpacity(0.2)
                  : theme.cardColor),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected
                ? AppColors.primaryLight
                : (isHighlighted
                    ? AppColors.accentGold
                    : theme.borderColor),
            width: isSelected || isHighlighted ? 2.5 : 1.5,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.4),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ]
              : [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  )
                ],
        ),
        alignment: Alignment.center,
        child: Text(
          letter,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : theme.textColor,
            fontFamily: 'monospace',
          ),
        ),
      ),
    );
  }
}
