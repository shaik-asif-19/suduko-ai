"""
Sudoku Puzzle Generator
Generates random valid Sudoku puzzles with varying difficulty levels
"""

import random
from solver import SudokuSolver


class PuzzleGenerator:
    def __init__(self):
        self.board = [[0] * 9 for _ in range(9)]
    
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
    
    def fill_board(self):
        """Fill the board with a valid complete solution."""
        for i in range(9):
            for j in range(9):
                if self.board[i][j] == 0:
                    nums = list(range(1, 10))
                    random.shuffle(nums)
                    
                    for num in nums:
                        if self.is_valid(i, j, num):
                            self.board[i][j] = num
                            
                            if self.fill_board():
                                return True
                            
                            self.board[i][j] = 0
                    
                    return False
        
        return True
    
    def remove_numbers(self, difficulty='medium'):
        """Remove numbers to create a puzzle."""
        cells_to_remove = {
            'easy': 30,
            'medium': 40,
            'hard': 50,
            'expert': 60
        }
        
        count = cells_to_remove.get(difficulty, 40)
        removed = 0
        
        while removed < count:
            row = random.randint(0, 8)
            col = random.randint(0, 8)
            
            if self.board[row][col] != 0:
                self.board[row][col] = 0
                removed += 1
    
    def generate(self, difficulty='medium'):
        """Generate a new puzzle."""
        self.board = [[0] * 9 for _ in range(9)]
        self.fill_board()
        self.remove_numbers(difficulty)
        return self.board


def generate_puzzle(difficulty='medium'):
    """Convenience function to generate a puzzle."""
    generator = PuzzleGenerator()
    return generator.generate(difficulty)
