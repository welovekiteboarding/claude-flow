/**
 * Main script for the chess game - FINAL FIXED VERSION 2
 * Handles UI interactions and game rendering
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== CHESS GAME FINAL VERSION 2 LOADED ===');
    
    // Check if required classes are available
    if (typeof Chess === 'undefined') {
        console.error('Chess library not loaded');
        showErrorMessage('Chess library failed to load. Please check your internet connection and refresh the page.');
        return;
    }
    
    if (typeof ChessGame === 'undefined') {
        console.error('ChessGame class not loaded');
        showErrorMessage('Chess game failed to load. Please check your internet connection and refresh the page.');
        return;
    }
    
    // Initialize the game
    let chessGame;
    try {
        chessGame = new ChessGame();
        console.log('ChessGame created:', chessGame);
    } catch (error) {
        console.error('Failed to initialize ChessGame:', error);
        showErrorMessage('Failed to start chess game: ' + error.message);
        return;
    }
    
    const boardElement = document.getElementById('chess-board');
    
    if (!boardElement) {
        console.error('Board element not found');
        showErrorMessage('Game board not found. Please refresh the page.');
        return;
    }
    
    console.log('DOM elements found successfully');
    
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
    
    // New UI elements for advanced features
    const gameStatsDiv = document.createElement('div');
    gameStatsDiv.id = 'game-stats';
    gameStatsDiv.className = 'game-stats';
    document.querySelector('.game-info').appendChild(gameStatsDiv);
    
    const moveSuggestionsDiv = document.createElement('div');
    moveSuggestionsDiv.id = 'move-suggestions';
    moveSuggestionsDiv.className = 'move-suggestions';
    document.querySelector('.game-area').appendChild(moveSuggestionsDiv);
    
    // Initialize the game with correct settings
    try {
        // Set initial game mode and difficulty from UI controls
        chessGame.setGameMode(gameModeSelect.value);
        chessGame.setComputerLevel(parseInt(difficultySelect.value));
        console.log('Initial game mode set to:', gameModeSelect.value);
        console.log('Initial difficulty set to:', difficultySelect.value);
        
        renderBoard();
        updateGameStatus();
        updateCapturedPieces();
        updateGameStats();
    } catch (error) {
        console.error('Failed to initialize game board:', error);
        showErrorMessage('Failed to initialize game board: ' + error.message);
        return;
    }
    
    // Event Listeners
    gameModeSelect.addEventListener('change', () => {
        console.log('Game mode changed to:', gameModeSelect.value);
        chessGame.setGameMode(gameModeSelect.value);
        updateGameStatus();
    });
    
    difficultySelect.addEventListener('change', () => {
        console.log('Difficulty changed to:', difficultySelect.value);
        chessGame.setComputerLevel(parseInt(difficultySelect.value));
        updateGameStatus();
    });
    
    newGameBtn.addEventListener('click', () => {
        console.log('New game started');
        chessGame.resetGame();
        // Reset game mode and difficulty
        chessGame.setGameMode(gameModeSelect.value);
        chessGame.setComputerLevel(parseInt(difficultySelect.value));
        hideGameOverModal();
        renderBoard();
        updateGameStatus();
        updateCapturedPieces();
        updateMoveHistory();
        updateGameStats();
        clearMoveSuggestions();
    });
    
    flipBoardBtn.addEventListener('click', () => {
        console.log('Board flipped');
        chessGame.flipBoard();
        renderBoard();
        updateGameStatus();
    });
    
    undoBtn.addEventListener('click', () => {
        console.log('Move undone');
        if (chessGame.undoMove()) {
            renderBoard();
            updateGameStatus();
            updateCapturedPieces();
            updateMoveHistory();
            updateGameStats();
            clearMoveSuggestions();
        }
    });
    
    playAgainBtn.addEventListener('click', () => {
        console.log('Play again clicked');
        chessGame.resetGame();
        // Reset game mode and difficulty
        chessGame.setGameMode(gameModeSelect.value);
        chessGame.setComputerLevel(parseInt(difficultySelect.value));
        hideGameOverModal();
        renderBoard();
        updateGameStatus();
        updateCapturedPieces();
        updateMoveHistory();
        updateGameStats();
        clearMoveSuggestions();
    });
    
    // Add hint button for move suggestions
    const hintBtn = document.createElement('button');
    hintBtn.id = 'hint-btn';
    hintBtn.className = 'btn';
    hintBtn.textContent = 'Get Hint';
    hintBtn.addEventListener('click', () => {
        showMoveSuggestions();
    });
    
    // Add hint button to game controls
    document.querySelector('.game-controls').appendChild(hintBtn);
    
    function renderBoard() {
        if (!boardElement) return;
        
        try {
            boardElement.innerHTML = '';
            const boardState = chessGame.getBoardState();
            const board = boardState.board;
            
            console.log('Rendering board - Current player:', boardState.currentPlayer, 'Game mode:', chessGame.gameMode, 'Computer turn:', chessGame.isComputerTurn());
            
            // Get possible moves if a piece is selected
            let possibleMoves = [];
            if (chessGame.selectedSquare) {
                possibleMoves = chessGame.getPossibleMoves(
                    chessGame.selectedSquare.row, 
                    chessGame.selectedSquare.col
                );
                console.log('Possible moves for selected piece:', possibleMoves);
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
        } catch (error) {
            console.error('Error rendering board:', error);
            showErrorMessage('Error rendering board: ' + error.message);
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
        console.log('=== PIECE CLICK ===', row, col);
        const boardState = chessGame.getBoardState();
        const piece = boardState.board[row][col];
        
        console.log('Piece:', piece);
        console.log('Current player:', boardState.currentPlayer);
        console.log('Game mode:', chessGame.gameMode);
        console.log('Is computer turn:', chessGame.isComputerTurn());
        
        // Don't allow moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            console.log('COMPUTER TURN - blocking human move');
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        // For player vs computer mode, only allow selecting player's pieces
        if (piece) {
            const pieceColor = piece.color === 'w' ? 'white' : 'black';
            console.log('Piece color:', pieceColor);
            
            // In computer mode, only allow human player to select their own pieces
            if (chessGame.gameMode === 'computer' && pieceColor !== boardState.currentPlayer) {
                // BUT if a piece is already selected, this might be a capture attempt
                if (chessGame.selectedSquare) {
                    console.log('CAPTURE ATTEMPT - moving selected piece to opponent piece location');
                    handleMove(chessGame.selectedSquare.row, chessGame.selectedSquare.col, row, col);
                    return;
                } else {
                    console.log('OPPONENT PIECE - blocking selection in computer mode');
                    showTemporaryMessage("That's not your piece!");
                    return;
                }
            }
            
            // Select the piece
            chessGame.selectedSquare = { row, col };
            console.log('Selected piece at:', row, col);
        } else if (chessGame.selectedSquare) {
            console.log('Moving to empty square');
            // Try to move to this square
            handleMove(chessGame.selectedSquare.row, chessGame.selectedSquare.col, row, col);
        }
        
        renderBoard();
    }
    
    function handleSquareClick(row, col) {
        console.log('=== SQUARE CLICK ===', row, col);
        const boardState = chessGame.getBoardState();
        const piece = boardState.board[row][col];
        
        console.log('Square piece:', piece);
        console.log('Current player:', boardState.currentPlayer);
        console.log('Game mode:', chessGame.gameMode);
        console.log('Is computer turn:', chessGame.isComputerTurn());
        console.log('Selected square:', chessGame.selectedSquare);
        
        // Don't allow moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            console.log('COMPUTER TURN - blocking human move on square click');
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        if (chessGame.selectedSquare) {
            console.log('Attempting move with selected piece');
            // Try to move to this square (this handles captures too)
            handleMove(chessGame.selectedSquare.row, chessGame.selectedSquare.col, row, col);
        } else if (piece) {
            console.log('Selecting piece on square click');
            // For player vs computer mode, only allow selecting player's pieces
            const pieceColor = piece.color === 'w' ? 'white' : 'black';
            console.log('Square piece color:', pieceColor);
            
            // In computer mode, only allow human player to select their own pieces
            if (chessGame.gameMode === 'computer' && pieceColor !== boardState.currentPlayer) {
                console.log('OPPONENT PIECE ON SQUARE - blocking selection in computer mode');
                showTemporaryMessage("That's not your piece!");
                return;
            }
            
            // Select the piece
            chessGame.selectedSquare = { row, col };
            console.log('Selected piece at:', row, col);
            renderBoard();
        } else {
            console.log('Clicked empty square with no selection');
        }
    }
    
    function handleMove(fromRow, fromCol, toRow, toCol) {
        console.log('=== ATTEMPTING MOVE ===', fromRow, fromCol, '->', toRow, toCol);
        
        // Prevent moves when it's computer's turn in player vs computer mode
        if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn()) {
            console.log('COMPUTER TURN - blocking move attempt');
            showTemporaryMessage("It's the computer's turn!");
            return;
        }
        
        console.log('Calling chessGame.movePiece');
        if (chessGame.movePiece(fromRow, fromCol, toRow, toCol)) {
            console.log('MOVE SUCCESSFUL');
            chessGame.selectedSquare = null;
            renderBoard();
            updateGameStatus();
            updateCapturedPieces();
            updateMoveHistory();
            updateGameStats();
            clearMoveSuggestions();
            
            // Check for computer move
            console.log('Checking for computer move - Game mode:', chessGame.gameMode, 'Is computer turn:', chessGame.isComputerTurn(), 'Game over:', chessGame.gameOver);
            if (chessGame.gameMode === 'computer' && chessGame.isComputerTurn() && !chessGame.gameOver) {
                console.log('TRIGGERING COMPUTER MOVE');
                // Show thinking message
                showTemporaryMessage("Computer is thinking...", 1000);
                
                // Add slight delay for better UX
                setTimeout(() => {
                    console.log('EXECUTING COMPUTER MOVE');
                    if (chessGame.makeComputerMove()) {
                        console.log('COMPUTER MOVE SUCCESSFUL');
                        renderBoard();
                        updateGameStatus();
                        updateCapturedPieces();
                        updateMoveHistory();
                        updateGameStats();
                    } else {
                        console.log('COMPUTER MOVE FAILED');
                        // Force a render in case something went wrong
                        renderBoard();
                        updateGameStatus();
                    }
                }, 500);
            } else {
                console.log('NO COMPUTER MOVE TRIGGERED');
                console.log('Game mode:', chessGame.gameMode);
                console.log('Is computer turn:', chessGame.isComputerTurn());
                console.log('Game over:', chessGame.gameOver);
            }
        } else {
            console.log('MOVE FAILED - Invalid move');
            // If clicking on another piece of the same color, select that piece instead
            const boardState = chessGame.getBoardState();
            const piece = boardState.board[toRow][toCol];
            if (piece) {
                const pieceColor = piece.color === 'w' ? 'white' : 'black';
                // For player vs computer mode, only allow selecting player's pieces
                if (chessGame.gameMode === 'computer' && pieceColor !== boardState.currentPlayer) {
                    // BUT if a piece is already selected, this might be a capture attempt
                    if (chessGame.selectedSquare) {
                        console.log('OPPONENT PIECE DURING MOVE - but this is a capture attempt');
                        // Let the chess engine handle this as an invalid move if it's truly invalid
                    } else {
                        console.log('OPPONENT PIECE DURING MOVE - blocking selection');
                        showTemporaryMessage("That's not your piece!");
                        chessGame.selectedSquare = null;
                        renderBoard();
                        return;
                    }
                } else {
                    chessGame.selectedSquare = { row: toRow, col: toCol };
                    renderBoard();
                }
            } else {
                chessGame.selectedSquare = null;
                renderBoard();
            }
            showTemporaryMessage("Invalid move!");
        }
    }
    
    function handleDragStart(e, row, col) {
        console.log('DRAG START:', row, col);
        const boardState = chessGame.getBoardState();
        const piece = boardState.board[row][col];
        
        // Don't allow dragging opponent's pieces in player vs computer mode
        if (piece && chessGame.gameMode === 'computer') {
            const pieceColor = piece.color === 'w' ? 'white' : 'black';
            if (pieceColor !== boardState.currentPlayer) {
                e.preventDefault();
                showTemporaryMessage("That's not your piece!");
                return;
            }
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
        console.log('DROP:', row, col);
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const [fromRow, fromCol] = data.split(',').map(Number);
        
        handleMove(fromRow, fromCol, row, col);
    }
    
    function updateGameStatus() {
        try {
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
            if (chessGame.gameOver || status.status === 'checkmate' || status.status === 'draw' || status.status === 'stalemate') {
                gameResult.textContent = status.status.charAt(0).toUpperCase() + status.status.slice(1);
                resultMessage.textContent = status.message;
                showGameOverModal();
            }
        } catch (error) {
            console.error('Error updating game status:', error);
            showErrorMessage('Error updating game status: ' + error.message);
        }
    }
    
    function updateCapturedPieces() {
        try {
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
        } catch (error) {
            console.error('Error updating captured pieces:', error);
        }
    }
    
    function updateMoveHistory() {
        try {
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
        } catch (error) {
            console.error('Error updating move history:', error);
        }
    }
    
    function updateGameStats() {
        try {
            const stats = chessGame.getGameStats();
            gameStatsDiv.innerHTML = `
                <div class="stats-item">
                    <span class="stats-label">Moves:</span>
                    <span class="stats-value">${stats.movesPlayed}</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">Captures:</span>
                    <span class="stats-value">${stats.captures}</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">Checks:</span>
                    <span class="stats-value">${stats.checks}</span>
                </div>
                <div class="stats-item">
                    <span class="stats-label">Avg Time:</span>
                    <span class="stats-value">${stats.avgMoveTime}ms</span>
                </div>
            `;
        } catch (error) {
            console.error('Error updating game stats:', error);
        }
    }
    
    function showMoveSuggestions() {
        try {
            const suggestions = chessGame.getMoveSuggestions();
            if (suggestions.length === 0) {
                showTemporaryMessage("No suggestions available.");
                return;
            }
            
            moveSuggestionsDiv.innerHTML = '<h3>Move Suggestions</h3>';
            const suggestionsList = document.createElement('ul');
            
            suggestions.forEach(suggestion => {
                const li = document.createElement('li');
                li.className = 'suggestion-item';
                li.innerHTML = `
                    <span class="suggestion-move">${suggestion.san}</span>
                    <span class="suggestion-score">(Score: ${suggestion.score})</span>
                `;
                suggestionsList.appendChild(li);
            });
            
            moveSuggestionsDiv.appendChild(suggestionsList);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                moveSuggestionsDiv.innerHTML = '';
            }, 5000);
        } catch (error) {
            console.error('Error showing move suggestions:', error);
            showTemporaryMessage("Error getting suggestions: " + error.message);
        }
    }
    
    function clearMoveSuggestions() {
        moveSuggestionsDiv.innerHTML = '';
    }
    
    function showGameOverModal() {
        if (gameOverModal) {
            gameOverModal.classList.remove('hidden');
        }
    }
    
    function hideGameOverModal() {
        if (gameOverModal) {
            gameOverModal.classList.add('hidden');
        }
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #e74c3c;
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    function showTemporaryMessage(message, duration = 2000) {
        console.log('Temporary message:', message);
        const messageDiv = document.createElement('div');
        messageDiv.className = 'temporary-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(52, 152, 219, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-weight: bold;
        `;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, duration);
    }
});