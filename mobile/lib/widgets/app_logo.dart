import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class AppLogo extends StatelessWidget {
  final double size;

  const AppLogo({super.key, this.size = 64});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.15),
        borderRadius: BorderRadius.circular(size * 0.28),
        border: Border.all(
          color: AppColors.primary.withOpacity(0.4),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: size * 0.3,
            offset: Offset(0, size * 0.1),
          ),
        ],
      ),
      child: CustomPaint(
        painter: _LogoPainter(),
      ),
    );
  }
}

class _LogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // Left & Right Rails
    final railPaint = Paint()
      ..color = AppColors.primaryLight
      ..strokeWidth = w * 0.07
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final leftX = w * 0.30;
    final rightX = w * 0.70;
    final topY = h * 0.22;
    final bottomY = h * 0.82;

    canvas.drawLine(Offset(leftX, topY), Offset(leftX, bottomY), railPaint);
    canvas.drawLine(Offset(rightX, topY), Offset(rightX, bottomY), railPaint);

    // 3 Ascending Creative Rungs
    final rungWidth = w * 0.44;
    final rungHeight = h * 0.08;
    final rungRadius = Radius.circular(rungHeight / 2);

    // Bottom Rung: Indigo
    final rung1Paint = Paint()..color = AppColors.primaryLight;
    final rung1Rect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.68), width: rungWidth, height: rungHeight),
      rungRadius,
    );
    canvas.drawRRect(rung1Rect, rung1Paint);

    // Middle Rung: Cyan
    final rung2Paint = Paint()..color = AppColors.accentCyan;
    final rung2Rect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.48), width: rungWidth, height: rungHeight),
      rungRadius,
    );
    canvas.drawRRect(rung2Rect, rung2Paint);

    // Top Rung: Gold
    final rung3Paint = Paint()..color = AppColors.accentGold;
    final rung3Rect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.28), width: rungWidth, height: rungHeight),
      rungRadius,
    );
    canvas.drawRRect(rung3Rect, rung3Paint);

    // Summit Sparkle Star Accent
    final starPaint = Paint()..color = AppColors.accentGoldLight;
    final starPath = Path();
    final sx = w * 0.5;
    final sy = h * 0.14;
    final r = w * 0.09;

    starPath.moveTo(sx, sy - r);
    starPath.lineTo(sx + r * 0.35, sy - r * 0.35);
    starPath.lineTo(sx + r, sy);
    starPath.lineTo(sx + r * 0.35, sy + r * 0.35);
    starPath.lineTo(sx, sy + r);
    starPath.lineTo(sx - r * 0.35, sy + r * 0.35);
    starPath.lineTo(sx - r, sy);
    starPath.lineTo(sx - r * 0.35, sy - r * 0.35);
    starPath.close();

    canvas.drawPath(starPath, starPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
