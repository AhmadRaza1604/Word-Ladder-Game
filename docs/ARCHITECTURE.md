# Monorepo Architecture & Git Workflow

## Monorepo Layout

```
Word-Ladder-Game/
├── web/                   # Vite + React 18 + Tailwind CSS v4 interactive preview & player (Port 3000)
├── mobile/                # Flutter (Dart) cross-platform mobile application (Android & iOS)
├── backend/               # Future Phase 3 API services contracts & blueprints
├── docs/                  # Specs, game rules, and project roadmap
├── package.json           # Root workspace configuration
└── README.md              # Project overview and quickstart
```

## Git Branch Management

- **`master` branch**: The stable base branch.
- **`develop` branch**: The active integration branch where all feature commits and phase deliverables are staged and pushed.

### Workflow Commands
```bash
# Checkout the develop branch
git checkout develop

# Commit incremental changes
git commit -m "feat(module): description"

# Push to remote develop
git push origin develop
```

## Running the Web Dev Server (Port 3000)

The dev server serves the responsive game engine on port 3000:
```bash
npm run dev
```

## Running the Flutter Mobile App (`mobile/`)

Prerequisites: Flutter SDK 3.19+ and Dart SDK 3.3+.
```bash
cd mobile

# Get dependencies
flutter pub get

# Run on connected device (physical Android phone or emulator)
flutter run

# Run unit tests
flutter test
```

