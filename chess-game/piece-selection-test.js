// Test to verify the piece selection fix
console.log('=== Piece Selection Fix Test ===');

// Test the color conversion logic
function testColorConversion() {
    console.log('Testing color conversion logic...');
    
    // Test cases
    const testCases = [
        { piece: { color: 'w' }, expected: 'white', description: 'White piece conversion' },
        { piece: { color: 'b' }, expected: 'black', description: 'Black piece conversion' }
    ];
    
    testCases.forEach((testCase, index) => {
        const pieceColor = testCase.piece.color === 'w' ? 'white' : 'black';
        const passed = pieceColor === testCase.expected;
        console.log(`${index + 1}. ${testCase.description}: ${passed ? 'PASS' : 'FAIL'} (${testCase.piece.color} -> ${pieceColor})`);
    });
}

// Test player comparison logic
function testPlayerComparison() {
    console.log('Testing player comparison logic...');
    
    // Simulate board state
    const boardStates = [
        { currentPlayer: 'white', description: 'White player turn' },
        { currentPlayer: 'black', description: 'Black player turn' }
    ];
    
    const pieces = [
        { color: 'w', type: 'p', description: 'White pawn' },
        { color: 'b', type: 'p', description: 'Black pawn' }
    ];
    
    boardStates.forEach(boardState => {
        console.log(`\n${boardState.description}:`);
        pieces.forEach(piece => {
            const pieceColor = piece.color === 'w' ? 'white' : 'black';
            const canSelect = pieceColor === boardState.currentPlayer;
            console.log(`  ${piece.description} -> ${canSelect ? 'CAN SELECT' : 'CANNOT SELECT'}`);
        });
    });
}

// Run tests
testColorConversion();
testPlayerComparison();

console.log('=== Piece Selection Fix Test Completed ===');