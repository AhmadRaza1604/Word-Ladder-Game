import 'package:flutter/material.dart';

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
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        width: 56,
        height: 64,
        margin: const EdgeInsets.symmetric(horizontal: 4),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFF4F46E5)
              : (isHighlighted ? const Color(0xFF312E81) : const Color(0xFF1E293B)),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? const Color(0xFF818CF8)
                : (isHighlighted ? const Color(0xFFF59E0B) : const Color(0xFF334155)),
            width: isSelected || isHighlighted ? 2.5 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF4F46E5).withOpacity(0.4),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  )
                ]
              : null,
        ),
        alignment: Alignment.center,
        child: Text(
          letter,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w800,
            color: isSelected ? Colors.white : const Color(0xFFF1F5F9),
            fontFamily: 'monospace',
          ),
        ),
      ),
    );
  }
}
