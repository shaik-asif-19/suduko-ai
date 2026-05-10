/**
 * CODEX - Sudoku Game
 * Complete Sudoku game with puzzle generation and solving
 */

class SudokuGame {
    constructor() {
        this.board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.originalBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        this.solvedBoard = Array(9).fill(null).map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.startTime = null;
        this.timerInterval = null;
        this.hintsUsed = 0;
        this.errors = 0;
        
        this.initializeEventListeners();
        this.generatePuzzle();
    }

    initializeEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.generatePuzzle());
        document.getElementById('hint').addEventListener('click', () => this.giveHint());
        document.getElementById('solve').addEventListener('click', () => this.solvePuzzle());
        document.getElementById('clear').addEventListener('click', () => this.clearBoard());
        document.getElementById('difficulty').addEventListener('change', () => this.generatePuzzle());
        
        // Number pad listeners
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const num = e.target.getAttribute('data-num');
                if (num === 'clear') {
                    this.clearSelectedCell();
                } else {
                    this.fillSelectedCell(parseInt(num));
                }
            });
        });
    }

    generatePuzzle() {
        this.hintsUsed = 0;
        this.errors = 0;
        this.updateStats();
        
        // Generate a complete solved board
        this.solvedBoard = this.generateSolvedBoard();
        
        // Create a puzzle by removing numbers based on difficulty
        const difficulty = document.getElementById('difficulty').value;
        const cellsToRemove = {
            'easy': 35,
            'medium': 45,
            'hard': 55,
            'expert': 60
        }[difficulty] || 45;
        
        this.board = this.solvedBoard.map(row => [...row]);
        this.removeCells(cellsToRemove);
        this.originalBoard = this.board.map(row => [...row]);
        
        this.startTime = Date.now();
        this.startTimer();
        this.updateStatus(`New ${difficulty} puzzle generated!`);
        this.renderBoard();
    }

    generateSolvedBoard() {
        const board = Array(9).fill(null).map(() => Array(9).fill(0));
        this.fillBoard(board);
        return board;
    }

    fillBoard(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    
                    for (let num of numbers) {
                        if (this.isValid(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (this.fillBoard(board)) {
                                return true;
                            }
                            
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    isValid(board, row, col, num) {
        // Check row
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num) return false;
        }
        
        // Check column
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (board[i][j] === num) return false;
            }
        }
        
        return true;
    }

    removeCells(count) {
        let removed = 0;
        while (removed < count) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            
            if (this.board[row][col] !== 0) {
                this.board[row][col] = 0;
                removed++;
            }
        }
    }

    renderBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.id = `cell-${i}-${j}`;
                cell.textContent = this.board[i][j] || '';
                
                if (this.originalBoard[i][j] !== 0) {
                    cell.classList.add('given');
                } else {
                    cell.addEventListener('click', () => this.selectCell(i, j));
                }
                
                boardElement.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        if (this.originalBoard[row][col] !== 0) return;
        
        document.querySelectorAll('.cell.selected, .cell.related').forEach(c => {
            c.classList.remove('selected', 'related');
        });
        
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.classList.add('selected');
        this.selectedCell = { row, col };
        
        // Highlight related cells
        this.highlightRelated(row, col);
    }

    highlightRelated(row, col) {
        // Highlight row
        for (let j = 0; j < 9; j++) {
            if (j !== col) {
                document.getElementById(`cell-${row}-${j}`).classList.add('related');
            }
        }
        
        // Highlight column
        for (let i = 0; i < 9; i++) {
            if (i !== row) {
                document.getElementById(`cell-${i}-${col}`).classList.add('related');
            }
        }
        
        // Highlight 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if (i !== row || j !== col) {
                    document.getElementById(`cell-${i}-${j}`).classList.add('related');
                }
            }
        }
    }

    fillSelectedCell(num) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        if (this.originalBoard[row][col] !== 0) return;
        
        this.board[row][col] = num;
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.textContent = num;
        
        // Check if valid
        if (!this.isValidPlacement(row, col, num)) {
            cell.classList.add('invalid');
            this.errors++;
            this.updateStats();
            setTimeout(() => cell.classList.remove('invalid'), 500);
        }
        
        // Check for completion
        if (this.isComplete()) {
            this.updateStatus('🎉 Puzzle Solved!');
            clearInterval(this.timerInterval);
        }
    }

    clearSelectedCell() {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        if (this.originalBoard[row][col] !== 0) return;
        
        this.board[row][col] = 0;
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.textContent = '';
    }

    isValidPlacement(row, col, num) {
        // Temporarily remove the number to check
        this.board[row][col] = 0;
        
        // Check row
        for (let j = 0; j < 9; j++) {
            if (j !== col && this.board[row][j] === num) {
                this.board[row][col] = num;
                return false;
            }
        }
        
        // Check column
        for (let i = 0; i < 9; i++) {
            if (i !== row && this.board[i][col] === num) {
                this.board[row][col] = num;
                return false;
            }
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = boxRow; i < boxRow + 3; i++) {
            for (let j = boxCol; j < boxCol + 3; j++) {
                if ((i !== row || j !== col) && this.board[i][j] === num) {
                    this.board[row][col] = num;
                    return false;
                }
            }
        }
        
        this.board[row][col] = num;
        return true;
    }

    giveHint() {
        if (this.hintsUsed >= 3) {
            this.updateStatus('Maximum hints reached!');
            return;
        }
        
        // Find an empty cell
        const emptyCells = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0 && this.originalBoard[i][j] === 0) {
                    emptyCells.push({ row: i, col: j });
                }
            }
        }
        
        if (emptyCells.length === 0) {
            this.updateStatus('No more empty cells!');
            return;
        }
        
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomCell;
        const correctNum = this.solvedBoard[row][col];
        
        this.board[row][col] = correctNum;
        const cell = document.getElementById(`cell-${row}-${col}`);
        cell.textContent = correctNum;
        cell.classList.add('hint');
        
        this.hintsUsed++;
        this.updateStats();
        this.updateStatus(`Hint given! (${3 - this.hintsUsed} remaining)`);
    }

    solvePuzzle() {
        // Copy solved board to current board
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.board[i][j] = this.solvedBoard[i][j];
            }
        }
        
        this.renderBoard();
        this.updateStatus('Puzzle solved!');
        clearInterval(this.timerInterval);
    }

    clearBoard() {
        // Reset to original puzzle
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.originalBoard[i][j] === 0) {
                    this.board[i][j] = 0;
                }
            }
        }
        
        this.renderBoard();
        this.updateStatus('Board cleared');
    }

    isComplete() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) return false;
                if (this.board[i][j] !== this.solvedBoard[i][j]) return false;
            }
        }
        return true;
    }

    startTimer() {
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    updateStatus(message) {
        document.getElementById('status').textContent = message;
    }

    updateStats() {
        document.getElementById('hintCount').textContent = this.hintsUsed;
        document.getElementById('errorCount').textContent = this.errors;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
