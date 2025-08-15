// Add comprehensive debugging to identify any remaining issues
console.log('=== Enhanced Debug Started ===');

// Check if all required libraries are loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Check chess.js
    if (typeof Chess !== 'undefined') {
        console.log('✓ Chess library loaded');
        try {
            const testGame = new Chess();
            console.log('✓ Chess instance created successfully');
            console.log('Initial turn:', testGame.turn());
        } catch (e) {
            console.error('✗ Failed to create Chess instance:', e);
        }
    } else {
        console.error('✗ Chess library NOT loaded');
    }
    
    // Check ChessGame.js
    if (typeof ChessGame !== 'undefined') {
        console.log('✓ ChessGame class loaded');
        try {
            const chessGame = new ChessGame();
            console.log('✓ ChessGame instance created successfully');
            console.log('Game mode:', chessGame.gameMode);
            console.log('Current player:', chessGame.getCurrentPlayer());
        } catch (e) {
            console.error('✗ Failed to create ChessGame instance:', e);
        }
    } else {
        console.error('✗ ChessGame class NOT loaded');
    }
    
    console.log('=== Enhanced Debug Completed ===');
});