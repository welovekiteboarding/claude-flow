console.log('=== ULTIMATE DEBUG STARTED ===');

// Manual test of core functionality
try {
    console.log('1. Testing Chess class availability...');
    if (typeof Chess === 'undefined') {
        console.error('Chess class not found!');
        throw new Error('Chess class not found');
    }
    console.log('✓ Chess class found');
    
    console.log('2. Testing ChessGame class availability...');
    if (typeof ChessGame === 'undefined') {
        console.error('ChessGame class not found!');
        throw new Error('ChessGame class not found');
    }
    console.log('✓ ChessGame class found');
    
    console.log('3. Creating Chess instance...');
    const testGame = new Chess();
    console.log('✓ Chess instance created');
    console.log('  Initial turn:', testGame.turn());
    
    console.log('4. Creating ChessGame instance...');
    const chessGame = new ChessGame();
    console.log('✓ ChessGame instance created');
    
    console.log('5. Testing game properties...');
    console.log('  Game mode:', chessGame.gameMode);
    console.log('  Current player:', chessGame.getCurrentPlayer());
    console.log('  Is computer turn:', chessGame.isComputerTurn());
    
    console.log('6. Testing board state...');
    const boardState = chessGame.getBoardState();
    console.log('  Board state current player:', boardState.currentPlayer);
    
    console.log('7. Testing specific pieces...');
    const piece = boardState.board[0][0]; // Should be black rook
    console.log('  Piece at 0,0:', piece);
    if (piece) {
        console.log('  Piece color (raw):', piece.color);
        console.log('  Piece type:', piece.type);
        const convertedColor = piece.color === 'w' ? 'white' : 'black';
        console.log('  Converted color:', convertedColor);
        console.log('  Colors match:', convertedColor === boardState.currentPlayer);
    }
    
    console.log('8. Final test - turn logic...');
    console.log('  Game mode check:', chessGame.gameMode === 'computer');
    console.log('  Current player check:', chessGame.getCurrentPlayer() === 'black');
    console.log('  Combined isComputerTurn:', chessGame.isComputerTurn());
    
    console.log('=== ULTIMATE DEBUG COMPLETED SUCCESSFULLY ===');
    
} catch (error) {
    console.error('FATAL ERROR:', error);
    console.error('Stack trace:', error.stack);
}