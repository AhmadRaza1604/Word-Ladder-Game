import 'package:flutter/material.dart';
import 'screens/home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const WordLadderApp());
}

class WordLadderApp extends StatelessWidget {
  const WordLadderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Word Ladder Game',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF4F46E5),
          secondary: Color(0xFFF59E0B),
          surface: Color(0xFF1E293B),
        ),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
