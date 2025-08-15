/**
 * Main script for the chess game
 * Handles UI interactions and game rendering
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Loaded');
    // Use global ChessGame reference instead of ES6 import
    const ChessGame = window.ChessGame;
    const chessGame = new ChessGame();
    const boardElement = document.getElementById('chess-board');
    
    console.log('ChessGame created:', chessGame);
    console.log('Board element:', boardElement);
    
    // UI Elements
    const gameModeSelect = document.getElementById('game-mode');
    const difficultySelect = document.getElementById('difficulty');
    const newGameBtn = document.getElementById('new-game-btn');
    const flipBoardBtn = document.getElementById('flip-board-btn');
    const undoBtn = document.getElementById('undo-btn');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameResult = document.getElementById('game-result');
    const resultMessage = document.getElementById('result-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const whitePlayerStatus = document.querySelector('.white-player .player-status');
    const blackPlayerStatus = document.querySelector('.black-player .player-status');
    const movesList = document.getElementById('moves-list');
    const whiteCapturedContainer = document.querySelector('.white-captured .captured-container');
    const blackCapturedContainer = document.querySelector('.black-captured .captured-container');
    
    // Initialize the game
    renderBoard();
    updateGameStatus();
    updateCapturedPieces();
    
    // Event Listeners
    gameModeSelect.addEventListener('change', () => {
        chessGame.setGameMode(gameModeSelect.value);
    });
    
    difficultySelect.addEventListener('change', () => {
        chessGame.setComputerLevel(parseInt(difficultySelect.value));
    });
    
    newGameBtn.addEventListener('click', () => {
        chessGame.resetGame();
        hideGameOverModal();
        renderBoard();
        updateGameStatus();
        updateCapturedPieces();
        movesList.innerHTML = '';
    });
    
    flipBoardBtn.addEventListener('click', () => {
        chessGame.flipBoard();
        renderBoard();
        updateGameStatus();
    });
    
    undoBtn.addEventListener('click', () => {
        if (chessGame.undoMove()) {
            renderBoard();
            updateGameStatus();
            updateCapturedPieces();
            updateMoveHistory();
        }
    });
    
    playAgainBtn.addEventListener('click', () => {
        chessGame.resetGame();
        hideGameOverModal();
        renderBoard();
        updateGameStatus();
        updateCapturedPieces();
        movesList.innerHTML = '';
    });
    
    function renderBoard() {
        console.log('Rendering board...');
        boardElement.innerHTML = '';
        const boardState = chessGame.getBoardState();
        const board = boardState.board;
        
        console.log('Board state:', boardState);
        
        // Get possible moves if a piece is selected
        let possibleMoves = [];
        if (chessGame.selectedSquare) {
            possibleMoves = chessGame.getPossibleMoves(
                chessGame.selectedSquare.row, 
                chessGame.selectedSquare.col
            );
        }
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                // Adjust coordinates if board is flipped
                const displayRow = boardState.boardFlipped ? 7 - row : row;
                const displayCol = boardState.boardFlipped ? 7 - col : col;
                
                const square = document.createElement('div');
                square.className = `square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = displayRow;
                square.dataset.col = displayCol;
                
                // Highlight selected square
                if (chessGame.selectedSquare && 
                    chessGame.selectedSquare.row === displayRow && 
                    chessGame.selectedSquare.col === displayCol) {
                    square.classList.add('selected');
                }
                
                // Highlight possible moves
                const isPossibleMove = possibleMoves.some(move => 
                    move.row === displayRow && move.col === displayCol);
                if (isPossibleMove) {
                    square.classList.add('possible-move');
                }
                
                const piece = board[displayRow][displayCol];
                console.log(`Square ${row},${col}:`, piece);
                
                if (piece) {
                    const pieceElement = document.createElement('div');
                    pieceElement.className = 'piece';
                    pieceElement.textContent = getPieceSymbol(piece.type, piece.color);
                    pieceElement.dataset.color = piece.color;
                    pieceElement.dataset.type = piece.type;
                    pieceElement.draggable = true;
                    
                    // Add event listeners for piece interaction
                    pieceElement.addEventListener('click', (e) => {
                        e.stopPropagation();
                        handlePieceClick(displayRow, displayCol);
                    });
                    
                    pieceElement.addEventListener('dragstart', (e) => {
                        handleDragStart(e, displayRow, displayCol);
                    });
                    
                    square.appendChild(pieceElement);
                }
                
                // Add event listener for square click
                square.addEventListener('click', () => {
                    handleSquareClick(displayRow, displayCol);
                });
                
                square.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });
                
                square.addEventListener('drop', (e) => {
                    e.preventDefault();
                    handleDrop(e, displayRow, displayCol);
                });
                
                boardElement.appendChild(square);
            }
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
    
    function handlePieceClick(row, col) {
        const boardState = chessGame.getBoardState();
        const piece = boardState.board[row][col];
        
        // Don't allow clicking on opponent's pieces
        // Convert piece color to full name for comparison
        const pieceColor = piece.color === 'w' ? 'white' : 'black';
        if (piece && pieceColor !== boardState.currentPlayer) {
            showTemporaryMessage("That's not your piece!");
            return;
        }
        
        // Don't allow moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        if (piece && piece.color === boardState.currentPlayer) {
            // Select the piece
            chessGame.selectedSquare = { row, col };
        } else if (chessGame.selectedSquare) {
            // Try to move to this square
            handleMove(chessGame.selectedSquare.row, chessGame.selectedSquare.col, row, col);
        }
        
        renderBoard();
    }
    
    function handleSquareClick(row, col) {
        console.log('Square clicked:', row, col);
        const boardState = chessGame.getBoardState();
        const piece = boardState.board[row][col];
        
        // Don't allow moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        if (chessGame.selectedSquare) {
            // Try to move to this square
            handleMove(chessGame.selectedSquare.row, chessGame.selectedSquare.col, row, col);
        } else if (piece && piece.color === boardState.currentPlayer) {
            // Select the piece
            chessGame.selectedSquare = { row, col };
            renderBoard();
        }
    }
    
    function handleMove(fromRow, fromCol, toRow, toCol) {
        console.log('Attempting move:', fromRow, fromCol, 'to', toRow, toCol);
        
        // Prevent moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        if (chessGame.movePiece(fromRow, fromCol, toRow, toCol)) {
            console.log('Move successful');
            chessGame.selectedSquare = null;
            renderBoard();
            updateGameStatus();
            updateCapturedPieces();
            updateMoveHistory();
            
            // Check for computer move
            if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn() && !chessGame.gameOver) {
                // Show thinking message
                showTemporaryMessage("Computer is thinking...", 1000);
                
                setTimeout(() => {
                    if (chessGame.makeComputerMove()) {
                        renderBoard();
                        updateGameStatus();
                        updateCapturedPieces();
                        updateMoveHistory();
                    }
                }, 500);
            }
        } else {
            console.log('Invalid move');
            // If clicking on another piece of the same color, select that piece instead
            const boardState = chessGame.getBoardState();
            const piece = boardState.board[toRow][toCol];
            if (piece && piece.color === boardState.currentPlayer) {
                chessGame.selectedSquare = { row: toRow, col: toCol };
                renderBoard();
            } else {
                chessGame.selectedSquare = null;
                renderBoard();
            }
            showTemporaryMessage("Invalid move!");
        }
    }
    
    function handleDragStart(e, row, col) {
        console.log('Drag start:', row, col);
        
        const boardState = chessGame.getBoardState();
        const piece = boardState.board[row][col];
        
        // Don't allow dragging opponent's pieces
        // Convert piece color to full name for comparison
        const pieceColor = piece.color === 'w' ? 'white' : 'black';
        if (piece && pieceColor !== boardState.currentPlayer) {
            e.preventDefault();
            showTemporaryMessage("That's not your piece!");
            return;
        }
        
        // Don't allow moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            e.preventDefault();
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        e.dataTransfer.setData('text/plain', `${row},${col}`);
        chessGame.selectedSquare = { row, col };
        renderBoard();
    }
    
    function handleDrop(e, row, col) {
        console.log('Drop:', row, col);
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const [fromRow, fromCol] = data.split(',').map(Number);
        
        handleMove(fromRow, fromCol, row, col);
    }
    
    function updateGameStatus() {
        const status = chessGame.getGameStatus();
        console.log('Game status:', status);
        
        // Update player status indicators
        if (chessGame.getCurrentPlayer() === 'white') {
            whitePlayerStatus.textContent = status.message;
            whitePlayerStatus.className = 'player-status';
            blackPlayerStatus.textContent = 'Waiting';
            blackPlayerStatus.className = 'player-status';
        } else {
            blackPlayerStatus.textContent = status.message;
            blackPlayerStatus.className = 'player-status';
            whitePlayerStatus.textContent = 'Waiting';
            whitePlayerStatus.className = 'player-status';
        }
        
        // Highlight current player
        if (!chessGame.gameOver) {
            if (chessGame.getCurrentPlayer() === 'white') {
                document.querySelector('.white-player').classList.add('active');
                document.querySelector('.black-player').classList.remove('active');
            } else {
                document.querySelector('.black-player').classList.add('active');
                document.querySelector('.white-player').classList.remove('active');
            }
        } else {
            document.querySelector('.white-player').classList.remove('active');
            document.querySelector('.black-player').classList.remove('active');
        }
        
        // Show game over modal if game is over
        if (chessGame.gameOver) {
            gameResult.textContent = status.status.charAt(0).toUpperCase() + status.status.slice(1);
            resultMessage.textContent = status.message;
            showGameOverModal();
        }
    }
    
    function updateCapturedPieces() {
        // Clear captured pieces containers
        whiteCapturedContainer.innerHTML = '';
        blackCapturedContainer.innerHTML = '';
        
        // Get captured pieces from move history
        const capturedPieces = [];
        chessGame.moveHistory.forEach(move => {
            if (move.captured) {
                capturedPieces.push({
                    piece: move.captured,
                    color: move.color === 'w' ? 'b' : 'w' // Captured piece color is opposite of mover
                });
            }
        });
        
        // Separate captured pieces by color
        const whiteCaptured = capturedPieces.filter(p => p.color === 'w');
        const blackCaptured = capturedPieces.filter(p => p.color === 'b');
        
        // Display white captured pieces (by black)
        whiteCaptured.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'captured-piece';
            pieceElement.textContent = getPieceSymbol(piece.piece, piece.color);
            whiteCapturedContainer.appendChild(pieceElement);
        });
        
        // Display black captured pieces (by white)
        blackCaptured.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'captured-piece';
            pieceElement.textContent = getPieceSymbol(piece.piece, piece.color);
            blackCapturedContainer.appendChild(pieceElement);
        });
    }
    
    function updateMoveHistory() {
        movesList.innerHTML = '';
        
        // Group moves by turn
        for (let i = 0; i < chessGame.moveHistory.length; i += 2) {
            const moveNumber = Math.floor(i / 2) + 1;
            const whiteMove = chessGame.moveHistory[i];
            const blackMove = chessGame.moveHistory[i + 1];
            
            const moveElement = document.createElement('div');
            moveElement.className = 'move-entry';
            moveElement.innerHTML = `
                <span class="move-number">${moveNumber}.</span>
                <span class="move">${whiteMove.san}</span>
                ${blackMove ? `<span class="move">${blackMove.san}</span>` : ''}
            `;
            movesList.appendChild(moveElement);
        }
        
        // Scroll to bottom
        movesList.scrollTop = movesList.scrollHeight;
    }
    
    function showGameOverModal() {
        gameOverModal.classList.remove('hidden');
    }
    
    function hideGameOverModal() {
        gameOverModal.classList.add('hidden');
    }
});