import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppThemeNotifier(),
      child: const WordLadderApp(),
    ),
  );
}

class WordLadderApp extends StatelessWidget {
  const WordLadderApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeNotifier = context.watch<AppThemeNotifier>();

    return MaterialApp(
      title: "Ahmad's Word Ladder",
      debugShowCheckedModeBanner: false,
      themeMode: themeNotifier.isNight ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: AppColors.dayBackground,
        colorScheme: const ColorScheme.light(
          primary: AppColors.primary,
          secondary: AppColors.accentGold,
          surface: AppColors.daySurface,
        ),
        useMaterial3: true,
      ),
      darkTheme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.nightBackground,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.accentGold,
          surface: AppColors.nightSurface,
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
