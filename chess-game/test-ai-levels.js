// Test script to verify AI difficulty levels
console.log('=== AI DIFFICULTY LEVEL VERIFICATION ===');

// Test each level
const levelNames = {
    1: 'Beginner',
    2: 'Easy', 
    3: 'Medium',
    4: 'Hard',
    5: 'Grandmaster'
};

for (let level = 1; level <= 5; level++) {
    console.log(`\n--- Testing ${levelNames[level]} (Level ${level}) ---`);
    
    try {
        // Create game with specific difficulty
        const game = new ChessGame();
        game.setGameMode('computer');
        game.setComputerLevel(level);
        
        console.log(`Game created with level ${level}`);
        
        // Make a standard opening move
        const humanMoveResult = game.movePiece(6, 4, 4, 4); // e2 to e4
        console.log(`Human move result: ${humanMoveResult}`);
        console.log(`Current player after human move: ${game.getCurrentPlayer()}`);
        console.log(`Is computer turn: ${game.isComputerTurn()}`);
        
        if (game.isComputerTurn()) {
            console.log('Getting computer move...');
            const startTime = performance.now();
            const computerMove = game.getComputerMove();
            const endTime = performance.now();
            
            console.log(`Computer move calculation time: ${Math.round(endTime - startTime)}ms`);
            console.log(`Computer move:`, computerMove);
            
            if (computerMove) {
                console.log(`Computer move SAN: ${computerMove.san || 'N/A'}`);
                console.log(`Computer move piece: ${computerMove.piece}`);
                console.log(`Computer move captures: ${computerMove.captured || 'None'}`);
                console.log(`Computer move flags: ${computerMove.flags || 'None'}`);
            } else {
                console.log('ERROR: Computer failed to generate move');
            }
        } else {
            console.log('ERROR: It is not computer turn');
        }
        
    } catch (error) {
        console.log(`ERROR testing level ${level}:`, error.message);
    }
}

console.log('\n=== VERIFICATION COMPLETE ===');