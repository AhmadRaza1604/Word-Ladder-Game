# Word Ladder Backend Services (`backend/`)

Foundation and architectural contracts for Phase 3 & 5 (online progression, server-side score validation, daily challenges, and leaderboards).

## Architectural Strategy (Phase 3 Roadmap)
- **Framework**: ASP.NET Core Web API / Minimal APIs (.NET 8+).
- **Core Principle**: Zero-trust client score validation. Clients never report their star rating or optimality; instead, clients submit their array of move steps (`["COLD", "CORD", "CARD", "WARD", "WARM"]`). The server executes the BFS shortest-path graph validator against the authoritative server dictionary and calculates the verified star rating and leaderboard score.
- **Offline Preservation**: The mobile and web clients remain 100% playable offline. When online, pending completions are synchronized with the backend.

## Endpoint Specifications

### 1. Levels & Content Delivery
- `GET /api/v1/levels` — Fetches current published levels and par values.
- `GET /api/v1/levels/daily` — Returns the rotating daily challenge seed.

### 2. Move & Score Validation
- `POST /api/v1/scores/submit`
  - Request: `ScoreSubmissionDto` (levelId, ladderSteps, durationSeconds, clientTimestamp)
  - Response: `ScoreVerificationResultDto` (isVerified, starsAwarded, serverCalculatedPar, rank)

### 3. Leaderboards
- `GET /api/v1/leaderboards/global` — Top verified solvers sorted by total stars, fewest moves, and streaks.
- `GET /api/v1/leaderboards/level/{id}` — Level-specific speed and optimality rankings.
