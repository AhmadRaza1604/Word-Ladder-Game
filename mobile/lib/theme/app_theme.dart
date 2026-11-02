import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum AppThemeMode { night, day }

class AppColors {
  // Centralized Color Palette - change colors here in one single place
  // Night Theme (Default)
  static const Color nightBackground = Color(0xFF090D16);
  static const Color nightSurface = Color(0xFF111827);
  static const Color nightCard = Color(0xFF1E293B);
  static const Color nightBorder = Color(0xFF334155);
  static const Color nightText = Color(0xFFF8FAFC);
  static const Color nightTextMuted = Color(0xFF94A3B8);

  // Day Theme
  static const Color dayBackground = Color(0xFFF1F5F9);
  static const Color daySurface = Color(0xFFFFFFFF);
  static const Color dayCard = Color(0xFFFFFFFF);
  static const Color dayBorder = Color(0xFFE2E8F0);
  static const Color dayText = Color(0xFF0F172A);
  static const Color dayTextMuted = Color(0xFF64748B);

  // Common Accents
  static const Color primary = Color(0xFF4F46E5);
  static const Color primaryLight = Color(0xFF6366F1);
  static const Color accentCyan = Color(0xFF06B6D4);
  static const Color accentGold = Color(0xFFF59E0B);
  static const Color accentGoldLight = Color(0xFFFBBF24);
  static const Color success = Color(0xFF10B981);
  static const Color error = Color(0xFFEF4444);
}

class AppThemeNotifier extends ChangeNotifier {
  static const String _keyThemeMode = 'app_theme_mode';
  static const String _keyVolume = 'app_audio_volume';

  AppThemeMode _mode = AppThemeMode.night;
  double _volume = 0.8; // 80% default volume

  AppThemeMode get mode => _mode;
  bool get isNight => _mode == AppThemeMode.night;
  double get volume => _volume;

  Color get backgroundColor => isNight ? AppColors.nightBackground : AppColors.dayBackground;
  Color get surfaceColor => isNight ? AppColors.nightSurface : AppColors.daySurface;
  Color get cardColor => isNight ? AppColors.nightCard : AppColors.dayCard;
  Color get borderColor => isNight ? AppColors.nightBorder : AppColors.dayBorder;
  Color get textColor => isNight ? AppColors.nightText : AppColors.dayText;
  Color get textMutedColor => isNight ? AppColors.nightTextMuted : AppColors.dayTextMuted;

  AppThemeNotifier() {
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    final savedMode = prefs.getString(_keyThemeMode);
    if (savedMode == 'day') {
      _mode = AppThemeMode.day;
    } else {
      _mode = AppThemeMode.night;
    }

    final savedVol = prefs.getDouble(_keyVolume);
    if (savedVol != null) {
      _volume = savedVol.clamp(0.0, 1.0);
    }
    notifyListeners();
  }

  Future<void> setThemeMode(AppThemeMode newMode) async {
    _mode = newMode;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyThemeMode, newMode == AppThemeMode.day ? 'day' : 'night');
  }

  Future<void> toggleTheme() async {
    await setThemeMode(isNight ? AppThemeMode.day : AppThemeMode.night);
  }

  Future<void> setVolume(double newVolume) async {
    _volume = newVolume.clamp(0.0, 1.0);
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble(_keyVolume, _volume);
  }
}
