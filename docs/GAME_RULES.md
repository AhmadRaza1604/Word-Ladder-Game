# Word Ladder Game Rules & Mechanics

## Core Rules

1. **Uniform Word Length**: All words in a ladder must have the exact same length as the start and target words for that level.
2. **One-Letter Transformation**: A valid move consists of replacing exactly one character in the current word with a different letter of the English alphabet.
3. **Approved Dictionary**: The newly formed word must exist in the approved bundled offline dictionary. Proper nouns and abbreviations are excluded.
4. **Move Deduction Discipline**:
   - Only **valid accepted moves** deduct from the remaining move allowance and increment the move counter.
   - **Invalid inputs** (words not in dictionary, duplicate submissions, words changing more than one letter) display immediate explanatory visual/audio feedback and do not penalize the player.
5. **Level Completion**: The level is won when the player submits a valid move that matches the target word.

---

## Scoring & Star Rating System

Shortest paths are computed deterministically using Breadth-First Search (BFS) over the dictionary graph.
- **3 Stars (Optimal Mastery)**: Solved in the exact minimum number of moves ($M = M_{\text{optimal}}$).
- **2 Stars (Skilled Path)**: Solved within 2 moves of optimal ($M \le M_{\text{optimal}} + 2$).
- **1 Star (Completion)**: Solved within the maximum move limit ($M \le M_{\text{max}}$).
- **0 Stars / Game Over**: Remaining moves reach 0 before reaching the target word. Player may restart or undo.

---

## Hint Mechanics

- **Position Hint (Tier 1)**: Illuminates the tile index that differs between the current word and the next step in an optimal BFS trajectory.
- **Word Hint (Tier 2)**: Reveals the full next word along the shortest path.

---

## Offline Dictionary Source & Provenance
The initial MVP uses an offline, public-domain wordlist curated from ENABLE (Enhanced North American Benchmark Lexicon) and SCOWL (Spell Checking Oriented Word Lists), filtered to common 3, 4, and 5-letter English vocabulary to ensure 100% offline gameplay with zero licensing restrictions.
