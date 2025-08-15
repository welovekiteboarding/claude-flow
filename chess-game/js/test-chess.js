/**
 * Test chess.js import
 */

import { Chess } from './chess.js';

console.log('Chess.js imported successfully');

// Test if Chess class works
try {
    const game = new Chess();
    console.log('Chess game created successfully');
    console.log('Initial board:', game.board());
} catch (error) {
    console.error('Error creating chess game:', error);
}

export { Chess };