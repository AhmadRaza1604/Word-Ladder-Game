# Word Ladder Game — Flutter Mobile App (`mobile/`)

A cross-platform (Android & iOS) Word Ladder puzzle game built with Flutter and Dart for Phase 1 of the Word Ladder project plan.

## Features
- **Offline-First**: Zero backend, accounts, or internet connection required.
- **Curated Levels**: 3, 4, and 5 letter levels with verified shortest paths.
- **Algorithmic Par & Hints**: Deterministic Breadth-First Search (BFS) graph pathfinder.
- **Dual Input Modes**: Tap letter tiles to replace individually, or type candidate words.
- **Local Persistence**: Scores, best moves, and star ratings saved via `shared_preferences`.
- **Accessible UI**: Minimum 48px touch targets, clear letter states, dark/light theme support.

## Getting Started

### Prerequisites
- [Flutter SDK](https://docs.flutter.dev/get-started/install) (3.19 or later)
- Android Studio with Android SDK 34 or Xcode for iOS
- Physical Android phone with USB debugging enabled, or an Android emulator

### Commands
```bash
# 1. Enter the mobile directory
cd mobile

# 2. Install dependencies
flutter pub get

# 3. Run automated tests (verifying BFS solver and move validation)
flutter test

# 4. Run on a connected physical phone or emulator
flutter run

# 5. Build an Android Release APK
flutter build apk --release
```

## How to Test on a Physical Android Phone via USB Debugging
1. On your Android phone, navigate to **Settings > About Phone** and tap **Build Number** 7 times to enable Developer Options.
2. In **Settings > Developer Options**, enable **USB Debugging**.
3. Connect your phone to your computer with a USB cable. Accept the "Allow USB debugging?" prompt on the phone screen.
4. Verify the phone is detected by running:
   ```bash
   flutter devices
   ```
5. Deploy and launch:
   ```bash
   flutter run
   ```
