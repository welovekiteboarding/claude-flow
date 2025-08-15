/**
 * Main script for the chess game
 * Handles UI interactions and game rendering
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded - DEBUG VERSION');
    
    // Check if required classes are available
    if (typeof Chess === 'undefined') {
        console.error('Chess library not loaded');
        return;
    }
    
    if (typeof ChessGame === 'undefined') {
        console.error('ChessGame class not loaded');
        return;
    }
    
    // Initialize the game
    let chessGame;
    try {
        chessGame = new ChessGame();
        console.log('ChessGame initialized successfully');
    } catch (error) {
        console.error('Failed to initialize ChessGame:', error);
        return;
    }
    
    const boardElement = document.getElementById('chess-board');
    if (!boardElement) {
        console.error('Board element not found');
        return;
    }
    
    console.log('Game initialized, starting render...');
    
    // Render initial board for debugging
    function renderBoard() {
        if (!boardElement) return;
        
        try {
            boardElement.innerHTML = '';
            const boardState = chessGame.getBoardState();
            const board = boardState.board;
            
            console.log('Rendering board - Current player:', boardState.currentPlayer);
            
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 8; col++) {
                    const displayRow = boardState.boardFlipped ? 7 - row : row;
                    const displayCol = boardState.boardFlipped ? 7 - col : col;
                    
                    const square = document.createElement('div');
                    square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                    square.dataset.row = displayRow;
                    square.dataset.col = displayCol;
                    
                    const piece = board[displayRow][displayCol];
                    if (piece) {
                        const pieceElement = document.createElement('div');
                        pieceElement.className = 'piece';
                        pieceElement.textContent = getPieceSymbol(piece.type, piece.color);
                        pieceElement.dataset.color = piece.color;
                        pieceElement.dataset.type = piece.type;
                        pieceElement.draggable = true;
                        
                        // Add click handler with debug info
                        pieceElement.addEventListener('click', (e) => {
                            e.stopPropagation();
                            console.log('=== PIECE CLICK DEBUG ===');
                            console.log('Clicked piece:', piece);
                            console.log('Piece color (raw):', piece.color);
                            console.log('Row:', displayRow, 'Col:', displayCol);
                            
                            const boardStateDebug = chessGame.getBoardState();
                            console.log('Current player:', boardStateDebug.currentPlayer);
                            
                            const pieceColorConverted = piece.color === 'w' ? 'white' : 'black';
                            console.log('Converted piece color:', pieceColorConverted);
                            console.log('Colors match:', pieceColorConverted === boardStateDebug.currentPlayer);
                            
                            if (pieceColorConverted !== boardStateDebug.currentPlayer) {
                                console.log('PREVENTING MOVE - Not your piece');
                                alert(`That's not your piece! You are ${boardStateDebug.currentPlayer}, this piece is ${pieceColorConverted}`);
                                return;
                            }
                            
                            console.log('Allowing piece selection');
                            chessGame.selectedSquare = { row: displayRow, col: displayCol };
                            renderBoard();
                        });
                        
                        square.appendChild(pieceElement);
                    }
                    
                    // Add square click handler
                    square.addEventListener('click', () => {
                        console.log('Square clicked:', displayRow, displayCol);
                        // Handle square click logic here if needed
                    });
                    
                    boardElement.appendChild(square);
                }
            }
        } catch (error) {
            console.error('Error rendering board:', error);
        }
    }
    
    function getPieceSymbol(type, color) {
        const symbols = {
            'p': color === 'w' ? '♙' : '♟',
            'r': color === 'w' ? '♖' : '♜',
            'n': color === 'w' ? '♘' : '♞',
            'b': color === 'w' ? '♗' : '♝',
            'q': color === 'w' ? '♕' : '♛',
            'k': color === 'w' ? '♔' : '♚'
        };
        return symbols[type] || '';
    }
    
    // Initial render
    renderBoard();
});