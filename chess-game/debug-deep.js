console.log('=== Chess Debug Started ===');

// Test if classes are available
console.log('Chess available:', typeof Chess);
console.log('ChessGame available:', typeof ChessGame);

try {
    if (typeof Chess !== 'undefined') {
        const game = new Chess();
        console.log('Chess game created successfully');
        console.log('Initial turn:', game.turn());
        console.log('Initial board structure:');
        const board = game.board();
        console.log('Board type:', typeof board);
        console.log('Board length:', board.length);
        console.log('First row:', board[0]);
        console.log('Last row:', board[7]);
        
        // Check first piece
        if (board[0] && board[0][0]) {
            console.log('First piece:', board[0][0]);
            console.log('First piece type:', typeof board[0][0]);
            console.log('First piece keys:', Object.keys(board[0][0]));
        }
    }
    
    if (typeof ChessGame !== 'undefined') {
        console.log('=== ChessGame Debug ===');
        const chessGame = new ChessGame();
        console.log('ChessGame created successfully');
        
        console.log('Game mode:', chessGame.gameMode);
        console.log('Current player (method):', chessGame.getCurrentPlayer());
        
        const boardState = chessGame.getBoardState();
        console.log('Board state:', boardState);
        console.log('Current player (boardState):', boardState.currentPlayer);
        
        // Check a specific square
        console.log('=== Square Check ===');
        const testRow = 0, testCol = 0;
        console.log(`Checking square [${testRow}][${testCol}]`);
        const piece = boardState.board[testRow][testCol];
        console.log('Piece at 0,0:', piece);
        
        if (piece) {
            console.log('Piece type:', typeof piece);
            console.log('Piece keys:', Object.keys(piece));
            console.log('Piece color:', piece.color);
            console.log('Piece type:', piece.type);
            
            // Test color conversion
            const pieceColor = piece.color === 'w' ? 'white' : 'black';
            console.log('Converted piece color:', pieceColor);
            console.log('Board state current player:', boardState.currentPlayer);
            console.log('Colors match:', pieceColor === boardState.currentPlayer);
        } else {
            console.log('No piece at 0,0');
        }
        
        // Test isComputerTurn
        console.log('=== Turn Logic ===');
        console.log('isComputerTurn():', chessGame.isComputerTurn());
        console.log('gameMode === computer:', chessGame.gameMode === 'computer');
        console.log('getCurrentPlayer() === black:', chessGame.getCurrentPlayer() === 'black');
    }
    
    console.log('=== Debug Complete ===');
} catch (error) {
    console.error('Debug error:', error);
}