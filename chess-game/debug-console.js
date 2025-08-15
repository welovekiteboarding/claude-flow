console.log('Debug script loaded');

// Test if classes are available
console.log('Chess available:', typeof Chess);
console.log('ChessGame available:', typeof ChessGame);

if (typeof Chess !== 'undefined') {
    const game = new Chess();
    console.log('Chess game created');
    console.log('Initial turn:', game.turn());
    console.log('Board:', game.board());
}

if (typeof ChessGame !== 'undefined') {
    const chessGame = new ChessGame();
    console.log('ChessGame created');
    console.log('Game mode:', chessGame.gameMode);
    console.log('Current player:', chessGame.getCurrentPlayer());
    console.log('Is computer turn:', chessGame.isComputerTurn());
    console.log('Board state:', chessGame.getBoardState());
}