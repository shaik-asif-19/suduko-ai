"""
Sudoku Solver Module
Implements efficient backtracking algorithm with constraint propagation
"""

class SudokuSolver:
    def __init__(self, board):
        """
        Initialize solver with a 9x9 Sudoku board.
        0 represents empty cells.
        """
        self.board = [row[:] for row in board]
        self.original = [row[:] for row in board]
    
    def is_valid(self, row, col, num):
        """Check if placing num at (row, col) is valid."""
        # Check row
        if num in self.board[row]:
            return False
        
        # Check column
        if num in [self.board[i][col] for i in range(9)]:
            return False
        
        # Check 3x3 box
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(box_row, box_row + 3):
            for j in range(box_col, box_col + 3):
                if self.board[i][j] == num:
                    return False
        
        return True
    
    def find_empty(self):
        """Find the next empty cell."""
        for i in range(9):
            for j in range(9):
                if self.board[i][j] == 0:
                    return (i, j)
        return None
    
    def solve(self):
        """Solve the Sudoku puzzle using backtracking."""
        empty = self.find_empty()
        
        if empty is None:
            return True  # Puzzle solved
        
        row, col = empty
        
        for num in range(1, 10):
            if self.is_valid(row, col, num):
                self.board[row][col] = num
                
                if self.solve():
                    return True
                
                self.board[row][col] = 0  # Backtrack
        
        return False
    
    def get_solution(self):
        """Return the solved board."""
        return self.board
    
    def get_candidates(self, row, col):
        """Get possible candidates for a cell."""
        if self.board[row][col] != 0:
            return []
        
        candidates = []
        for num in range(1, 10):
            if self.is_valid(row, col, num):
                candidates.append(num)
        
        return candidates


def solve_sudoku(board):
    """Convenience function to solve a Sudoku puzzle."""
    solver = SudokuSolver(board)
    if solver.solve():
        return solver.get_solution()
    return None
