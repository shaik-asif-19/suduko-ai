# CODEX - Sudoku Puzzle Generator & Solver

A complete Sudoku puzzle generator and solver built with HTML5, CSS3, and JavaScript. Features automatic puzzle generation, real-time validation, hints system, and complete solving capability.

## Features

### Puzzle Generation
- **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert
- **Dynamic Puzzle Creation**: Generates unique puzzles on-the-fly using backtracking algorithm
- **Configurable Difficulty**: Different number of clues for each difficulty level
  - Easy: 54 clues (beginner friendly)
  - Medium: 45 clues (standard difficulty)
  - Hard: 35 clues (challenging)
  - Expert: 30 clues (very difficult)

### Gameplay
- **Interactive Board**: Click cells to select and use the number pad to fill
- **Real-time Validation**: Immediate feedback on invalid placements
- **Hint System**: Up to 3 hints per game (reveals correct numbers)
- **Solve Button**: Auto-solve the entire puzzle
- **Clear Button**: Reset to original puzzle state
- **Timer**: Track elapsed time for each puzzle
- **Statistics**: Monitor hints used and errors made

### User Interface
- **Number Pad**: Quick number entry for easy gameplay
- **Cell Highlighting**: Related cells (row, column, 3x3 box) are highlighted when selected
- **Visual Feedback**: Different colors for given cells, selected cells, hints, and errors
- **Responsive Design**: Works on desktop and tablet devices

## How to Play

1. **Start a Game**: Click "New Game" or select a difficulty and a new puzzle is generated
2. **Select a Cell**: Click any empty cell
3. **Enter a Number**: 
   - Click a number (1-9) on the number pad, OR
   - Use keyboard to type a number
4. **Clear a Cell**: Click the ✕ button on the number pad
5. **Get Help**: Click "Hint" to reveal a random cell (max 3 per game)
6. **Solve**: Click "Solve" to auto-solve the puzzle
7. **Reset**: Click "Clear" to reset to the original puzzle state

## Running the Game

**No installation needed!** Simply open `frontend/index.html` in your web browser and start playing.

## Difficulty Levels

- **Easy**: 54 clues - Great for beginners, quick to solve
- **Medium**: 45 clues - Balanced challenge, typical sudoku difficulty
- **Hard**: 35 clues - Challenging, requires advanced techniques
- **Expert**: 30 clues - Very difficult, for experienced players

## Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Algorithm**: Backtracking algorithm for puzzle generation and validation
- **No Backend Required**: Completely standalone

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Game Rules (Standard Sudoku)

- Fill each row with numbers 1-9 (no repeats)
- Fill each column with numbers 1-9 (no repeats)
- Fill each 3x3 box with numbers 1-9 (no repeats)
