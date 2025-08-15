/**
 * Professional Chess Game using chess.js library
 * Handles all chess rules, validation, and state management
 */

// Import the Chess class
var Chess = window.Chess;

// Fallback if Chess is not available
if (!Chess) {
    console.error("Chess library not loaded. Please check script loading order.");
}

class ChessGame {
    constructor() {
        // Initialize the chess game
        if (!Chess) {
            throw new Error("Chess library not available. Make sure chess.js is loaded before ChessGame.js");
        }
        
        try {
            this.game = new Chess();
        } catch (error) {
            console.error("Failed to initialize Chess game:", error);
            throw new Error("Failed to initialize chess engine");
        }
        
        this.selectedPiece = null;
        this.selectedSquare = null;
        this.possibleMoves = [];
        this.moveHistory = [];
        this.gameOver = false;
        this.boardFlipped = false;
        this.gameMode = 'human'; // 'human' or 'computer'
        this.computerLevel = 1; // 1-5 (easy to grandmaster)
        this.gameStats = {
            movesPlayed: 0,
            captures: 0,
            checks: 0,
            totalTime: 0
        };
        
        console.log('ChessGame initialized successfully');
    }

    // Get piece at position
    getPiece(row, col) {
        const board = this.game.board();
        if (row >= 0 && row < 8 && col >= 0 && col < 8) {
            return board[row][col];
        }
        return null;
    }

    // Make a move
    movePiece(fromRow, fromCol, toRow, toCol) {
        if (this.gameOver) return false;
        
        // Convert row/col to chess notation
        const from = this.positionToSquare(fromRow, fromCol);
        const to = this.positionToSquare(toRow, toCol);
        
        try {
            // Make the move using chess.js
            const move = this.game.move({
                from: from,
                to: to,
                promotion: 'q' // Always promote to queen for simplicity
            });
            
            if (move) {
                // Add to move history
                this.moveHistory.push(move);
                
                // Check for game over
                this.checkGameOver();
                
                return true;
            }
        } catch (e) {
            // Invalid move
            console.log('Invalid move:', e);
        }
        
        return false;
    }

    // Convert row/col to chess square notation (e.g., 'a1', 'h8')
    positionToSquare(row, col) {
        const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
        return files[col] + ranks[row];
    }

    // Convert chess square notation to row/col
    squareToPosition(square) {
        const files = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 };
        const ranks = { '8': 0, '7': 1, '6': 2, '5': 3, '4': 4, '3': 5, '2': 6, '1': 7 };
        return { row: ranks[square[1]], col: files[square[0]] };
    }

    // Get possible moves for a piece
    getPossibleMoves(row, col) {
        const square = this.positionToSquare(row, col);
        const moves = this.game.moves({ square: square, verbose: true });
        
        return moves.map(move => {
            const pos = this.squareToPosition(move.to);
            return pos;
        });
    }

    // Check if game is over
    checkGameOver() {
        if (this.game.game_over()) {
            this.gameOver = true;
        }
    }

    // Get current player
    getCurrentPlayer() {
        return this.game.turn() === 'w' ? 'white' : 'black';
    }

    // Reset game
    resetGame() {
        this.game.reset();
        this.selectedPiece = null;
        this.selectedSquare = null;
        this.possibleMoves = [];
        this.moveHistory = [];
        this.gameOver = false;
    }

    // Undo last move
    undoMove() {
        if (this.moveHistory.length > 0) {
            const move = this.game.undo();
            if (move) {
                this.moveHistory.pop();
                this.gameOver = false;
                return true;
            }
        }
        return false;
    }

    // Flip board
    flipBoard() {
        this.boardFlipped = !this.boardFlipped;
        return this.boardFlipped;
    }

    // Set game mode
    setGameMode(mode) {
        this.gameMode = mode;
    }

    // Set computer level
    setComputerLevel(level) {
        this.computerLevel = level;
    }

    // Check if it's computer's turn
    isComputerTurn() {
        return this.gameMode === 'computer' && this.getCurrentPlayer() === 'black';
    }

    // Get computer move
    getComputerMove() {
        // Check if game is initialized
        if (!this.game) {
            console.error("Chess game not initialized");
            return null;
        }
        
        const moves = this.game.moves({ verbose: true });
        
        if (moves.length === 0) return null;
        
        // Advanced AI with 5 difficulty levels
        switch (this.computerLevel) {
            case 1: // Beginner - mostly random with basic piece safety
                return this.getBeginnerMove(moves);
                
            case 2: // Easy - prioritize captures and basic development
                return this.getEasyMove(moves);
                
            case 3: // Medium - balanced play with position evaluation
                return this.getMediumMove(moves);
                
            case 4: // Hard - strategic play with multi-move lookahead
                return this.getHardMove(moves);
                
            case 5: // Grandmaster - advanced evaluation with deep search
                return this.getGrandmasterMove(moves);
                
            default:
                return this.getEasyMove(moves);
        }
    }
    
    // Beginner AI - mostly random moves with basic safety
    getBeginnerMove(moves) {
        // 70% random, 30% basic capture moves
        if (Math.random() < 0.7) {
            return moves[Math.floor(Math.random() * moves.length)];
        }
        
        // Look for simple captures
        const captures = moves.filter(move => move.captured);
        if (captures.length > 0) {
            // Prefer capturing lower value pieces with higher value pieces
            const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
            captures.sort((a, b) => {
                const valueA = pieceValues[a.captured] || 0;
                const valueB = pieceValues[b.captured] || 0;
                return valueA - valueB; // Prefer capturing lower value pieces
            });
            return captures[0];
        }
        
        // Fallback to random
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    // Easy AI - prioritize captures and basic development
    getEasyMove(moves) {
        // Look for captures first
        const captures = moves.filter(move => move.captured);
        if (captures.length > 0) {
            // Prioritize capturing higher value pieces
            const pieceValues = { 'p': 1, 'n': 3, 'b': 3, 'r': 5, 'q': 9, 'k': 0 };
            captures.sort((a, b) => {
                const valueA = pieceValues[a.captured] || 0;
                const valueB = pieceValues[b.captured] || 0;
                return valueB - valueA; // Higher value captures first
            });
            return captures[0];
        }
        
        // Develop minor pieces
        const developmentMoves = moves.filter(move => {
            return move.piece === 'n' || move.piece === 'b';
        });
        
        if (developmentMoves.length > 0) {
            return developmentMoves[Math.floor(Math.random() * developmentMoves.length)];
        }
        
        // Castle if possible
        const castleMoves = moves.filter(move => move.flags.includes('k') || move.flags.includes('q'));
        if (castleMoves.length > 0) {
            return castleMoves[Math.floor(Math.random() * castleMoves.length)];
        }
        
        // Otherwise random move
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    // Medium AI - balanced play with position evaluation
    getMediumMove(moves) {
        // Evaluate each move
        const evaluatedMoves = moves.map(move => {
            return {
                move: move,
                score: this.evaluateMove(move)
            };
        });
        
        // Sort by score (highest first)
        evaluatedMoves.sort((a, b) => b.score - a.score);
        
        // Add some randomness (top 3 moves)
        const topMoves = evaluatedMoves.slice(0, Math.min(3, evaluatedMoves.length));
        return topMoves[Math.floor(Math.random() * topMoves.length)].move;
    }
    
    // Hard AI - strategic play with multi-move lookahead
    getHardMove(moves) {
        // Simple minimax with depth 3
        const bestMove = this.minimax(3, -Infinity, Infinity, true);
        return bestMove.move || moves[Math.floor(Math.random() * moves.length)];
    }
    
    // Grandmaster AI - advanced evaluation with deeper search
    getGrandmasterMove(moves) {
        // Minimax with depth 4 and better evaluation
        const bestMove = this.minimax(4, -Infinity, Infinity, true);
        return bestMove.move || moves[Math.floor(Math.random() * moves.length)];
    }
    
    // Simple move evaluation
    evaluateMove(move) {
        let score = 0;
        
        // Material gain
        if (move.captured) {
            const pieceValues = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900 };
            score += pieceValues[move.captured] || 0;
        }
        
        // Positional bonuses
        const centerSquares = ['d4', 'd5', 'e4', 'e5'];
        if (centerSquares.includes(move.to)) {
            score += 2;
        }
        
        // Development bonus for minor pieces
        if (move.piece === 'n' || move.piece === 'b') {
            score += 3;
        }
        
        // Pawn advancement
        if (move.piece === 'p') {
            const rank = move.to[1];
            if (move.color === 'w' && rank >= '4') score += 1;
            if (move.color === 'b' && rank <= '5') score += 1;
        }
        
        return score;
    }
    
    // Simple minimax implementation
    minimax(depth, alpha, beta, maximizingPlayer) {
        if (depth === 0 || this.game.game_over()) {
            return { score: this.evaluatePosition() };
        }
        
        const moves = this.game.moves({ verbose: true });
        if (moves.length === 0) {
            return { score: this.evaluatePosition() };
        }
        
        let bestMove = null;
        
        if (maximizingPlayer) {
            let maxEval = -Infinity;
            for (const move of moves) {
                this.game.move(move);
                const evaluation = this.minimax(depth - 1, alpha, beta, false);
                this.game.undo();
                
                if (evaluation.score > maxEval) {
                    maxEval = evaluation.score;
                    bestMove = move;
                }
                
                alpha = Math.max(alpha, evaluation.score);
                if (beta <= alpha) {
                    break;
                }
            }
            return { score: maxEval, move: bestMove };
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                this.game.move(move);
                const evaluation = this.minimax(depth - 1, alpha, beta, true);
                this.game.undo();
                
                if (evaluation.score < minEval) {
                    minEval = evaluation.score;
                    bestMove = move;
                }
                
                beta = Math.min(beta, evaluation.score);
                if (beta <= alpha) {
                    break;
                }
            }
            return { score: minEval, move: bestMove };
        }
    }
    
    // Position evaluation
    evaluatePosition() {
        if (this.game.in_checkmate()) {
            return this.game.turn() === 'w' ? -1000 : 1000;
        }
        
        if (this.game.in_draw()) {
            return 0;
        }
        
        const board = this.game.board();
        let score = 0;
        const pieceValues = { 'p': 10, 'n': 30, 'b': 30, 'r': 50, 'q': 90, 'k': 900 };
        
        // Material count
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece) {
                    const value = pieceValues[piece.type] || 0;
                    score += piece.color === 'w' ? value : -value;
                }
            }
        }
        
        return score;
    }
    
    // Get game statistics
    getGameStats() {
        return {
            ...this.gameStats,
            avgMoveTime: this.gameStats.movesPlayed > 0 ? 
                (this.gameStats.totalTime / this.gameStats.movesPlayed).toFixed(2) : 0
        };
    }
    
    // Get move suggestions for player
    getMoveSuggestions() {
        const moves = this.game.moves({ verbose: true });
        if (moves.length === 0) return [];
        
        // Evaluate all moves
        const evaluatedMoves = moves.map(move => {
            return {
                move: move,
                score: this.evaluateMove(move)
            };
        });
        
        // Sort by score and return top 3
        evaluatedMoves.sort((a, b) => b.score - a.score);
        return evaluatedMoves.slice(0, 3).map(item => ({
            from: item.move.from,
            to: item.move.to,
            san: item.move.san,
            score: item.score
        }));
    }

    // Make computer move
    makeComputerMove() {
        if (!this.isComputerTurn() || this.gameOver) return false;
        
        const startTime = performance.now();
        const move = this.getComputerMove();
        const endTime = performance.now();
        
        if (!move) return false;
        
        try {
            const result = this.game.move(move);
            if (result) {
                this.moveHistory.push(result);
                this.gameStats.movesPlayed++;
                if (result.captured) {
                    this.gameStats.captures++;
                }
                this.gameStats.totalTime += (endTime - startTime);
                this.checkGameOver();
                return true;
            }
        } catch (e) {
            console.error('Computer move error:', e);
        }
        
        return false;
    }

    // Get board state for rendering
    getBoardState() {
        return {
            board: this.game.board(),
            currentPlayer: this.getCurrentPlayer(),
            gameOver: this.gameOver,
            check: this.game.in_check(),
            boardFlipped: this.boardFlipped
        };
    }

    // Get game status for UI
    getGameStatus() {
        if (!this.game) {
            return { status: 'error', message: 'Game not initialized' };
        }
        
        try {
            if (this.game.in_checkmate()) {
                const winner = this.getCurrentPlayer() === 'white' ? 'Black' : 'White';
                return { status: 'checkmate', message: `Checkmate! ${winner} wins!` };
            }
            
            if (this.game.in_draw()) {
                return { status: 'draw', message: 'Draw!' };
            }
            
            if (this.game.in_stalemate()) {
                return { status: 'stalemate', message: 'Stalemate!' };
            }
            
            if (this.game.in_check()) {
                this.gameStats.checks++;
                return { status: 'check', message: `${this.getCurrentPlayer() === 'white' ? 'White' : 'Black'} is in check!` };
            }
            
            if (this.gameOver) {
                const winner = this.getCurrentPlayer() === 'white' ? 'Black' : 'White';
                return { status: 'gameOver', message: `${winner} wins!` };
            }
            
            return { status: 'playing', message: `${this.getCurrentPlayer() === 'white' ? 'White' : 'Black'}'s turn` };
        } catch (error) {
            console.error("Error getting game status:", error);
            return { status: 'error', message: 'Error: Unable to determine game status' };
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChessGame;
} else {
    window.ChessGame = ChessGame;
}