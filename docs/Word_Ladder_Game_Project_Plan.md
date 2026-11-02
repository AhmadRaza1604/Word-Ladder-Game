# WORD LADDER GAME
## Project Plan & Phased Development Roadmap
*Temporary project name • Monorepo • Android-first MVP*

### Purpose
Build the game in small, testable phases. Start with a polished offline Android single-player experience. Add backend services and web administration only after core gameplay is reliable.

---

### 1. Product Vision
Create a fun, approachable, and strategically engaging word-transformation puzzle game. Players move from a starting word to a target word by changing exactly one letter per move. Every submitted word must be valid for the selected level and follow the game rules.

#### Core gameplay example
`CASE → BASE → BAKE → CAKE → TAKE`
*(Illustrative route only. The game calculates the actual shortest path for each level; examples must not be treated as proof of optimality.)*

#### Product principles
- **Easy to understand in seconds**, with room for planning and optimization.
- **Fair rules**: clearly distinguish invalid attempts from valid moves.
- **Reward efficient solutions** while allowing alternative valid routes when level design permits them.
- **Offline-first MVP**: no account, network connection, or backend required to play.
- **Build maintainable code** and keep mobile, web, and backend projects separated by folder.

---

### 2. Repository Structure
Use the repository as a monorepo. Keep each application in its own folder:

| Path | Purpose |
| :--- | :--- |
| `mobile/` | Native Android player app; built first (Phase 1). |
| `web/` | Web player preview & admin dashboard for levels and dictionary; interactive player on port 3000. |
| `backend/` | API, account services, online progression, leaderboards, and multiplayer; later phase. |
| `docs/` | Product decisions, game rules, API contracts, and release notes. |

---

### 3. Phased Roadmap

#### Phase 1 — Offline Mobile MVP (START HERE)
**Goal**: a playable, polished single-player game on mobile (built with Flutter & Dart for cross-platform Android/iOS support) and interactive web preview.
- Flutter mobile app in `mobile/` using Dart with clean architecture.
- Screens: Home, Level Selection, Gameplay, Level Complete, and Help/Settings.
- Predefined, hand-authored levels with start word, target word, allowed move limit, and expected optimal path length.
- Both tapping letter tiles and typing candidate words supported.
- Validation: keep same word length, change exactly one letter, exist in approved dictionary.
- Clearly distinguish invalid input from a valid move. Invalid words must not advance the level or penalize moves.
- Track current word, move count, remaining moves, hints, completion, and star rating.
- Bonus rewards for optimal solutions.
- Bundled offline dictionary.
- Calculated and verified shortest paths for all shipped levels with graph search (BFS).
- Progress saved locally (e.g. SharedPreferences) surviving app restarts.
- High accessibility, touch targets $\ge 44\text{px}$, clear selected-letter states.

#### Phase 2 — Content and Game-Feel Polish
- Curated difficulty progression.
- Animated tile transitions, sound effects / haptics.
- Daily challenges.
- Local statistics: levels completed, optimal solves, streaks.

#### Phase 3 — Backend Foundation
- ASP.NET Core Web API / Node service contracts.
- Server-side score validation.

#### Phase 4 — Web Admin Dashboard
- Content management for levels, words, and shortest-path verification.

#### Phase 5 — Accounts, Leaderboards & Social Competition
- Optional accounts, cloud progress sync, leaderboards.

#### Phase 6 — PvP and World/Theme Progression
- Real-time/turn-based PvP match format.

---

### 4. Definition of Done for Phase 1
- Project opens and builds with documented steps.
- App installs and runs on a physical Android phone.
- A complete level can be played from start to target.
- Move validation and shortest-path facts are covered by automated tests.
- Local progress persists across app restarts.
- No backend or internet connection is required for core gameplay.
- README includes setup, build, test, and device-install instructions.
