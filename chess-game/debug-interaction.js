// Debug script to understand piece selection and move issues
console.log('=== Chess Game Debug Script ===');

// Add debugging to the existing functions
document.addEventListener('DOMContentLoaded', () => {
    // Store original functions
    const originalHandlePieceClick = window.handlePieceClick;
    const originalHandleSquareClick = window.handleSquareClick;
    const originalHandleMove = window.handleMove;
    
    console.log('Debug script loaded');
});