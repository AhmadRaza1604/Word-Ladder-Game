import 'package:flutter/material.dart';

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
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          _buildRow(_rows[0]),
          const SizedBox(height: 6),
          _buildRow(_rows[1]),
          const SizedBox(height: 6),
          _buildBottomRow(),
        ],
      ),
    );
  }

  Widget _buildRow(List<String> keys) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: keys.map((key) => _buildKey(key)).toList(),
    );
  }

  Widget _buildKey(String letter) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2.5),
        child: InkWell(
          onTap: () => onLetterTap(letter),
          borderRadius: BorderRadius.circular(8),
          child: Container(
            height: 46,
            decoration: BoxDecoration(
              color: const Color(0xFF1E293B),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: const Color(0xFF334155)),
            ),
            alignment: Alignment.center,
            child: Text(
              letter,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFFF1F5F9),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildBottomRow() {
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
                  color: canUndo ? const Color(0xFF334155) : const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(8),
                ),
                alignment: Alignment.center,
                child: Icon(
                  Icons.undo,
                  color: canUndo ? Colors.white : Colors.white30,
                  size: 20,
                ),
              ),
            ),
          ),
        ),
        ..._rows[2].map((key) => _buildKey(key)),
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
                  color: const Color(0xFF78350F).withOpacity(0.5),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: const Color(0xFFF59E0B).withOpacity(0.4)),
                ),
                alignment: Alignment.center,
                child: const Icon(
                  Icons.lightbulb_outline,
                  color: Color(0xFFFBBF24),
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
