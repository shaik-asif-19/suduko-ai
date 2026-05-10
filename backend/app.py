"""
Codex Sudoku API Server
Flask server providing Sudoku solving and game functionality
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from solver import SudokuSolver, solve_sudoku
from generator import generate_puzzle

app = Flask(__name__)
CORS(app)


@app.route('/api/solve', methods=['POST'])
def solve():
    """Solve a Sudoku puzzle."""
    try:
        data = request.json
        board = data.get('board')
        
        if not board or len(board) != 9:
            return jsonify({'error': 'Invalid board format'}), 400
        
        solution = solve_sudoku(board)
        
        if solution:
            return jsonify({'solution': solution, 'success': True})
        else:
            return jsonify({'error': 'No solution found', 'success': False}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/generate', methods=['GET'])
def generate():
    """Generate a new puzzle."""
    try:
        difficulty = request.args.get('difficulty', 'medium')
        puzzle = generate_puzzle(difficulty)
        
        return jsonify({'puzzle': puzzle, 'difficulty': difficulty})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/validate', methods=['POST'])
def validate():
    """Validate a board."""
    try:
        data = request.json
        board = data.get('board')
        row = data.get('row')
        col = data.get('col')
        num = data.get('num')
        
        solver = SudokuSolver(board)
        is_valid = solver.is_valid(row, col, num)
        
        return jsonify({'valid': is_valid})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/candidates', methods=['POST'])
def candidates():
    """Get possible candidates for a cell."""
    try:
        data = request.json
        board = data.get('board')
        row = data.get('row')
        col = data.get('col')
        
        solver = SudokuSolver(board)
        cands = solver.get_candidates(row, col)
        
        return jsonify({'candidates': cands})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)
