// Pumpy Surfer Game Logic
class PumpySurferGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startButton = document.getElementById('start-button');
        this.restartButton = document.getElementById('restart-button');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('high-score');
        this.finalScoreElement = document.getElementById('final-score');
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.highScore = localStorage.getItem('pumpySurferHighScore') || 0;
        this.highScoreElement.textContent = 'High Score: ' + this.highScore;
        
        // Game objects
        this.wave = new Wave(0, 550);
        this.surfer = new Surfer(100, this.wave.baseY - 30 - 10); // Start on bottom wave
        this.obstacles = [];
        this.particles = [];
        
        // Game settings
        this.gravity = 0.25; // Gravity for downward movement
        this.lift = -10; // Negative lift force for pumping upward
        this.gameSpeed = 3;
        this.frameCount = 0;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.draw();
    }
    
    setupEventListeners() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
        
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                if (this.gameRunning) {
                    this.surfer.pump(this.lift);
                    this.createPumpParticles();
                }
                e.preventDefault();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.gameRunning) {
                this.surfer.pump(this.lift);
                this.createPumpParticles();
            }
        });
    }
    
    createPumpParticles() {
        // Create particles when surfer pumps
        for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle(
                this.surfer.x + this.surfer.width,
                this.surfer.y + this.surfer.height / 2
            ));
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.frameCount = 0;
        this.surfer.reset(this.wave.baseY - this.surfer.height - 10); // Start on bottom wave
        this.obstacles = [];
        this.particles = [];
        this.scoreElement.textContent = 'Score: 0';
        this.startScreen.style.display = 'none';
        this.gameOverScreen.style.display = 'none';
        this.gameLoop();
    }
    
    update() {
        if (!this.gameRunning) return;
        
        this.frameCount++;
        
        // Update wave
        this.wave.update(this.frameCount);
        
        // Apply wave current that pulls surfer down over time
        this.surfer.velocity += 0.2; // Downward force to simulate wave current
        
        // Update surfer
        this.surfer.update(this.gravity);
        
                
        // Update obstacles
        this.obstacles.forEach(obstacle => obstacle.update(this.gameSpeed));
        
        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.offScreen);
        
        // Generate new obstacles
        if (this.frameCount % 80 === 0) { // More frequent obstacle generation
            // Randomly select obstacle type
            const obstacleTypes = ['surfer', 'boat', 'jetski', 'whale', 'dolphin'];
            const obstacleType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            
            // Position obstacle based on type (above the wave)
            let obstacle;
            const minY = 50;
            const maxY = 400; // Keep obstacles above the wave
            const yPos = minY + Math.random() * (maxY - minY);
            
            switch (obstacleType) {
                case 'surfer':
                    obstacle = new OtherSurfer(this.canvas.width, yPos);
                    break;
                case 'boat':
                    obstacle = new Boat(this.canvas.width, yPos);
                    break;
                case 'jetski':
                    obstacle = new Jetski(this.canvas.width, yPos);
                    break;
                case 'whale':
                    obstacle = new Whale(this.canvas.width, yPos);
                    break;
                case 'dolphin':
                    obstacle = new Dolphin(this.canvas.width, yPos);
                    break;
                default:
                    // Fallback to a simple obstacle
                    obstacle = new OtherSurfer(this.canvas.width, yPos);
            }
            
            this.obstacles.push(obstacle);
        }
        
        // Update particles
        this.particles.forEach(particle => particle.update());
        this.particles = this.particles.filter(particle => particle.alpha > 0);
        
        // Check collisions
        this.checkCollisions();
        
        // Update score
        if (this.frameCount % 10 === 0) {
            this.score++;
            this.scoreElement.textContent = 'Score: ' + this.score;
        }
    }
    
    checkCollisions() {
        // Check if surfer is below the wave (game over)
        // Use dynamic wave height at surfer's position
        const waveHeightAtSurfer = this.wave.getWaveHeightAt(this.surfer.x);
        if (this.surfer.y + this.surfer.height > waveHeightAtSurfer) {
            this.endGame('You fell off the wave!');
            return;
        }
        
        // Check if surfer is above the top of the canvas (game over)
        if (this.surfer.y < -100) { // Game over when surfer goes too high
            this.endGame('You went too high!');
            return;
        }
        
        // Check obstacle collisions
        for (let obstacle of this.obstacles) {
            if (this.surfer.collidesWith(obstacle)) {
                let reason = 'You hit an obstacle!';
                switch (obstacle.type) {
                    case 'surfer':
                        reason = 'You crashed into another surfer!';
                        break;
                    case 'boat':
                        reason = 'You crashed into a boat!';
                        break;
                    case 'jetski':
                        reason = 'You crashed into a jetski!';
                        break;
                    case 'whale':
                        reason = 'You crashed into a whale!';
                        break;
                    case 'dolphin':
                        reason = 'You crashed into a dolphin!';
                        break;
                }
                this.endGame(reason);
                return;
            }
        }
    }
    
    endGame(reason = 'You fell off the wave!') {
        this.gameRunning = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pumpySurferHighScore', this.highScore);
            this.highScoreElement.textContent = 'High Score: ' + this.highScore;
        }
        
        this.finalScoreElement.textContent = this.score;
        document.getElementById('game-over-reason').textContent = reason;
        this.gameOverScreen.style.display = 'flex';
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw wave
        this.wave.draw(this.ctx);
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        
        // Draw particles
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        // Draw surfer
        this.surfer.draw(this.ctx);
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#1E90FF');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sun
        this.ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(700, 80, 50, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Clouds
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(100, 100, 30, 0, Math.PI * 2);
        this.ctx.arc(130, 90, 40, 0, Math.PI * 2);
        this.ctx.arc(160, 100, 30, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(500, 150, 25, 0, Math.PI * 2);
        this.ctx.arc(525, 140, 35, 0, Math.PI * 2);
        this.ctx.arc(550, 150, 25, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    gameLoop() {
        if (this.gameRunning) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

class Surfer {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 35; // Slightly taller to accommodate new design
        this.velocity = 0;
        this.pumping = false; // Track when surfer is pumping
        this.pumpTimer = 0; // Timer for pump animation
    }
    
    reset(y) {
        this.y = y;
        this.velocity = 0;
        this.pumping = false;
        this.pumpTimer = 0;
    }
    
    update(gravity) {
        this.velocity += gravity;
        this.y += this.velocity;
        
        // Update pump animation timer
        if (this.pumping) {
            this.pumpTimer--;
            if (this.pumpTimer <= 0) {
                this.pumping = false;
            }
        }
    }
    
    pump(lift) {
        this.velocity += lift;
        this.pumping = true;
        this.pumpTimer = 10; // Show pump effect for 10 frames
    }
    
    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Draw surfboard with realistic shape and 3D effect
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + 27);
        ctx.lineTo(this.x + 4, this.y + 24);
        ctx.bezierCurveTo(this.x + 7, this.y + 22, this.x + 12, this.y + 20, this.x + 17, this.y + 20);
        ctx.lineTo(this.x + 27, this.y + 20);
        ctx.bezierCurveTo(this.x + 32, this.y + 20, this.x + 37, this.y + 22, this.x + 40, this.y + 24);
        ctx.lineTo(this.x + 40, this.y + 27);
        ctx.bezierCurveTo(this.x + 37, this.y + 26, this.x + 32, this.y + 25, this.x + 27, this.y + 25);
        ctx.lineTo(this.x + 17, this.y + 25);
        ctx.bezierCurveTo(this.x + 12, this.y + 25, this.x + 7, this.y + 26, this.x + 4, this.y + 27);
        ctx.closePath();
        ctx.fill();
        
        // Main board shape with curved nose and tail
        const boardGradient = ctx.createLinearGradient(this.x, this.y + 20, this.x, this.y + 25);
        boardGradient.addColorStop(0, '#DEB887');
        boardGradient.addColorStop(1, '#D2B48C');
        ctx.fillStyle = boardGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y + 25); // Tail
        ctx.lineTo(this.x + 2, this.y + 22);
        ctx.bezierCurveTo(this.x + 5, this.y + 20, this.x + 10, this.y + 18, this.x + 15, this.y + 18);
        ctx.lineTo(this.x + 25, this.y + 18);
        ctx.bezierCurveTo(this.x + 30, this.y + 18, this.x + 35, this.y + 20, this.x + 38, this.y + 22);
        ctx.lineTo(this.x + 38, this.y + 25); // Nose
        ctx.bezierCurveTo(this.x + 35, this.y + 24, this.x + 30, this.y + 23, this.x + 25, this.y + 23);
        ctx.lineTo(this.x + 15, this.y + 23);
        ctx.bezierCurveTo(this.x + 10, this.y + 23, this.x + 5, this.y + 24, this.x + 2, this.y + 25);
        ctx.closePath();
        ctx.fill();
        
        // Board details and graphics
        ctx.fillStyle = '#8B4513'; // Darker brown for board details
        // Fins
        ctx.fillRect(this.x + 18, this.y + 23, 4, 2); // Center fin
        ctx.fillRect(this.x + 8, this.y + 24, 2, 1); // Front fin
        ctx.fillRect(this.x + 30, this.y + 24, 2, 1); // Back fin
        
        // Board graphic (simple stripe)
        ctx.fillStyle = '#654321';
        ctx.fillRect(this.x + 10, this.y + 20, 20, 1);
        
        // Draw surfer body in surfing stance with more realistic proportions
        // Torso (wetsuit)
        const wetsuitGradient = ctx.createLinearGradient(this.x + 15, this.y + 3, this.x + 15, this.y + 15);
        wetsuitGradient.addColorStop(0, '#6495ED');
        wetsuitGradient.addColorStop(1, '#4169E1');
        ctx.fillStyle = wetsuitGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 5); // Shoulders
        ctx.lineTo(this.x + 15, this.y + 3); // Neck
        ctx.lineTo(this.x + 20, this.y + 3); // Neck
        ctx.lineTo(this.x + 23, this.y + 5); // Shoulders
        ctx.lineTo(this.x + 21, this.y + 15); // Waist
        ctx.lineTo(this.x + 14, this.y + 15); // Waist
        ctx.closePath();
        ctx.fill();
        
        // Head with more detail
        // Head shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y - 1, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Main head
        ctx.fillStyle = '#FFD700'; // Skin tone
        ctx.beginPath();
        ctx.arc(this.x + 17.5, this.y - 2, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair (surf style - windblown)
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.moveTo(this.x + 13, this.y - 6);
        ctx.lineTo(this.x + 15, this.y - 8);
        ctx.lineTo(this.x + 18, this.y - 9);
        ctx.lineTo(this.x + 20, this.y - 8);
        ctx.lineTo(this.x + 22, this.y - 6);
        ctx.lineTo(this.x + 21, this.y - 4);
        ctx.lineTo(this.x + 19, this.y - 5);
        ctx.lineTo(this.x + 16, this.y - 5);
        ctx.closePath();
        ctx.fill();
        
        // Facial features
        // Eyes with highlights
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y - 3, 1, 0, Math.PI * 2);
        ctx.arc(this.x + 19, this.y - 3, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + 16.3, this.y - 3.3, 0.3, 0, Math.PI * 2);
        ctx.arc(this.x + 19.3, this.y - 3.3, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (determined expression)
        ctx.strokeStyle = '#AA6600';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.x + 17.5, this.y + 1, 1.5, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        
        // Arms in proper surfing position
        // Arm shading
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(this.x + 23, this.y + 6);
        ctx.lineTo(this.x + 27, this.y + 3);
        ctx.lineTo(this.x + 28, this.y + 5);
        ctx.lineTo(this.x + 24, this.y + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 8);
        ctx.lineTo(this.x + 8, this.y + 6);
        ctx.lineTo(this.x + 9, this.y + 9);
        ctx.lineTo(this.x + 13, this.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Main arms (skin tone)
        ctx.fillStyle = '#FFD700';
        // Front arm (paddling/reaching arm)
        ctx.beginPath();
        ctx.moveTo(this.x + 23, this.y + 5);
        ctx.lineTo(this.x + 27, this.y + 2);
        ctx.lineTo(this.x + 28, this.y + 4);
        ctx.lineTo(this.x + 24, this.y + 7);
        ctx.closePath();
        ctx.fill();
        
        // Back arm (balance arm)
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 7);
        ctx.lineTo(this.x + 8, this.y + 5);
        ctx.lineTo(this.x + 9, this.y + 8);
        ctx.lineTo(this.x + 13, this.y + 9);
        ctx.closePath();
        ctx.fill();
        
        // Hands with detail
        ctx.fillStyle = '#FFD700';
        // Front hand
        ctx.beginPath();
        ctx.arc(this.x + 28, this.y + 3, 2, 0, Math.PI * 2);
        ctx.fill();
        // Palm lines
        ctx.strokeStyle = '#AA6600';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x + 27, this.y + 2.5);
        ctx.lineTo(this.x + 29, this.y + 2.5);
        ctx.moveTo(this.x + 27, this.y + 3.5);
        ctx.lineTo(this.x + 29, this.y + 3.5);
        ctx.stroke();
        
        // Back hand
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs positioned in surfing stance with wetsuit
        const legGradient = ctx.createLinearGradient(this.x + 15, this.y + 15, this.x + 15, this.y + 23);
        legGradient.addColorStop(0, '#6495ED');
        legGradient.addColorStop(1, '#4169E1');
        ctx.fillStyle = legGradient;
        
        // Front leg (bent for balance)
        ctx.beginPath();
        ctx.moveTo(this.x + 19, this.y + 15);
        ctx.lineTo(this.x + 21, this.y + 20);
        ctx.lineTo(this.x + 20, this.y + 24);
        ctx.lineTo(this.x + 18, this.y + 22);
        ctx.closePath();
        ctx.fill();
        
        // Back leg (extended for balance)
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 15);
        ctx.lineTo(this.x + 13, this.y + 19);
        ctx.lineTo(this.x + 12, this.y + 23);
        ctx.lineTo(this.x + 14, this.y + 21);
        ctx.closePath();
        ctx.fill();
        
        // Feet with detail
        ctx.fillStyle = '#FFD700';
        // Front foot
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 24, 2, 0, Math.PI * 2);
        ctx.fill();
        // Toes
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y + 24.5, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 20, this.y + 25, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 21, this.y + 24.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Back foot
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 23, 2, 0, Math.PI * 2);
        ctx.fill();
        // Toes
        ctx.beginPath();
        ctx.arc(this.x + 11, this.y + 23.5, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 12, this.y + 24, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 13, this.y + 23.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Restore context
        ctx.restore();
        
        // Draw pump effect with realistic water splashes
        if (this.pumping) {
            // Water splash effects in circular pattern
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45) * Math.PI / 180;
                const distance = 12 + Math.random() * 8;
                const splashX = this.x + 20 + Math.cos(angle) * distance;
                const splashY = this.y + 25 + Math.sin(angle) * distance;
                const size = Math.random() * 2 + 1;
                
                // Random splash colors for realism
                const splashColors = ['rgba(135, 206, 235, 0.8)', 'rgba(173, 216, 230, 0.7)', 'rgba(255, 255, 255, 0.6)'];
                ctx.fillStyle = splashColors[Math.floor(Math.random() * splashColors.length)];
                
                ctx.beginPath();
                ctx.arc(splashX, splashY, size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Main splash at board tail with foam effect
            const foamGradient = ctx.createRadialGradient(this.x + 5, this.y + 27, 0, this.x + 5, this.y + 27, 8);
            foamGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            foamGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = foamGradient;
            ctx.beginPath();
            ctx.arc(this.x + 5, this.y + 27, 8, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    collidesWith(obstacle) {
        return (
            this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.y + this.height > obstacle.y
        );
    }
}

class Wave {
    constructor(x, y) {
        this.x = x;
        this.baseY = 550; // Position at bottom of 600px canvas
        this.y = 550;
        this.width = 800; // canvas width
        this.height = 40;
        this.amplitude = 20; // Wave amplitude
        this.frequency = 0.025; // Wave frequency
        this.currentOffset = 0; // For horizontal wave movement
    }
    
    update(frameCount) {
        // Animate wave
        this.y = this.baseY + Math.sin(frameCount * this.frequency) * this.amplitude;
        this.currentOffset = frameCount * 0.8; // Horizontal movement
    }
    
    getWaveHeightAt(x) {
        // Calculate wave height at a specific x position with multiple wave components
        const relativeX1 = (x + this.currentOffset) * 0.03;
        const relativeX2 = (x + this.currentOffset) * 0.07;
        const baseWave = Math.sin(relativeX1) * 12;
        const detailWave = Math.sin(relativeX2) * 6;
        return this.y + baseWave + detailWave;
    }
    
    draw(ctx) {
        // Draw wave with multiple layers
        ctx.fillStyle = '#1ABC9C';
        ctx.beginPath();
        ctx.moveTo(0, 600); // Start at bottom of canvas
        
        // Draw wavy line with horizontal movement (wave surface)
        for (let i = 0; i <= this.width; i += 4) {
            const waveHeight = this.getWaveHeightAt(i);
            ctx.lineTo(i, waveHeight);
        }
        
        // Close the wave shape to bottom of canvas
        ctx.lineTo(this.width, 600);
        ctx.closePath();
        ctx.fill();
        
        // Draw wave foam
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(0, 600);
        for (let i = 0; i <= this.width; i += 6) {
            const waveHeight = this.getWaveHeightAt(i) - 5;
            ctx.lineTo(i, waveHeight);
        }
        ctx.lineTo(this.width, 600);
        ctx.closePath();
        ctx.fill();
        
        // Draw wave crest details
        ctx.fillStyle = '#87CEEB';
        for (let i = 0; i < this.width; i += 40) {
            const waveHeight = this.getWaveHeightAt(i + 15);
            ctx.beginPath();
            ctx.arc(i + 15, waveHeight - 4, 6, 0, Math.PI);
            ctx.fill();
        }
    }
}

// Base obstacle class
class Obstacle {
    constructor(x, y, width, height, type) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.offScreen = false;
    }
    
    update(speed) {
        this.x -= speed;
        if (this.x + this.width < 0) {
            this.offScreen = true;
        }
    }
    
    draw(ctx) {
        // Base draw method - will be overridden by specific obstacle types
        ctx.fillStyle = '#CCCCCC';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Other Surfer obstacle
class OtherSurfer extends Obstacle {
    constructor(x, y) {
        super(x, y, 40, 35, 'surfer');
    }
    
    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Draw surfboard with realistic shape and 3D effect
        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.moveTo(this.x + 4, this.y + 27);
        ctx.lineTo(this.x + 4, this.y + 24);
        ctx.bezierCurveTo(this.x + 7, this.y + 22, this.x + 12, this.y + 20, this.x + 17, this.y + 20);
        ctx.lineTo(this.x + 27, this.y + 20);
        ctx.bezierCurveTo(this.x + 32, this.y + 20, this.x + 37, this.y + 22, this.x + 40, this.y + 24);
        ctx.lineTo(this.x + 40, this.y + 27);
        ctx.bezierCurveTo(this.x + 37, this.y + 26, this.x + 32, this.y + 25, this.x + 27, this.y + 25);
        ctx.lineTo(this.x + 17, this.y + 25);
        ctx.bezierCurveTo(this.x + 12, this.y + 25, this.x + 7, this.y + 26, this.x + 4, this.y + 27);
        ctx.closePath();
        ctx.fill();
        
        // Main board shape with curved nose and tail
        const boardGradient = ctx.createLinearGradient(this.x, this.y + 20, this.x, this.y + 25);
        boardGradient.addColorStop(0, '#8B4513');
        boardGradient.addColorStop(1, '#A0522D');
        ctx.fillStyle = boardGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y + 25); // Tail
        ctx.lineTo(this.x + 2, this.y + 22);
        ctx.bezierCurveTo(this.x + 5, this.y + 20, this.x + 10, this.y + 18, this.x + 15, this.y + 18);
        ctx.lineTo(this.x + 25, this.y + 18);
        ctx.bezierCurveTo(this.x + 30, this.y + 18, this.x + 35, this.y + 20, this.x + 38, this.y + 22);
        ctx.lineTo(this.x + 38, this.y + 25); // Nose
        ctx.bezierCurveTo(this.x + 35, this.y + 24, this.x + 30, this.y + 23, this.x + 25, this.y + 23);
        ctx.lineTo(this.x + 15, this.y + 23);
        ctx.bezierCurveTo(this.x + 10, this.y + 23, this.x + 5, this.y + 24, this.x + 2, this.y + 25);
        ctx.closePath();
        ctx.fill();
        
        // Board details and graphics
        ctx.fillStyle = '#654321'; // Darker brown for board details
        // Fins
        ctx.fillRect(this.x + 18, this.y + 23, 4, 2); // Center fin
        ctx.fillRect(this.x + 8, this.y + 24, 2, 1); // Front fin
        ctx.fillRect(this.x + 30, this.y + 24, 2, 1); // Back fin
        
        // Board graphic (simple stripe)
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(this.x + 10, this.y + 20, 20, 1);
        
        // Draw surfer body in surfing stance with more realistic proportions
        // Torso (wetsuit)
        const wetsuitGradient = ctx.createLinearGradient(this.x + 15, this.y + 3, this.x + 15, this.y + 15);
        wetsuitGradient.addColorStop(0, '#20B2AA');
        wetsuitGradient.addColorStop(1, '#008B8B');
        ctx.fillStyle = wetsuitGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 5); // Shoulders
        ctx.lineTo(this.x + 15, this.y + 3); // Neck
        ctx.lineTo(this.x + 20, this.y + 3); // Neck
        ctx.lineTo(this.x + 23, this.y + 5); // Shoulders
        ctx.lineTo(this.x + 21, this.y + 15); // Waist
        ctx.lineTo(this.x + 14, this.y + 15); // Waist
        ctx.closePath();
        ctx.fill();
        
        // Head with more detail
        // Head shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(this.x + 18, this.y - 1, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Main head
        ctx.fillStyle = '#F5DEB3'; // Skin tone
        ctx.beginPath();
        ctx.arc(this.x + 17.5, this.y - 2, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair (surf style - windblown)
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(this.x + 13, this.y - 6);
        ctx.lineTo(this.x + 15, this.y - 8);
        ctx.lineTo(this.x + 18, this.y - 9);
        ctx.lineTo(this.x + 20, this.y - 8);
        ctx.lineTo(this.x + 22, this.y - 6);
        ctx.lineTo(this.x + 21, this.y - 4);
        ctx.lineTo(this.x + 19, this.y - 5);
        ctx.lineTo(this.x + 16, this.y - 5);
        ctx.closePath();
        ctx.fill();
        
        // Facial features
        // Eyes with highlights
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 16, this.y - 3, 1, 0, Math.PI * 2);
        ctx.arc(this.x + 19, this.y - 3, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlights
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + 16.3, this.y - 3.3, 0.3, 0, Math.PI * 2);
        ctx.arc(this.x + 19.3, this.y - 3.3, 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (determined expression)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(this.x + 17.5, this.y + 1, 1.5, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
        
        // Arms in proper surfing position
        // Arm shading
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.moveTo(this.x + 23, this.y + 6);
        ctx.lineTo(this.x + 27, this.y + 3);
        ctx.lineTo(this.x + 28, this.y + 5);
        ctx.lineTo(this.x + 24, this.y + 8);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 8);
        ctx.lineTo(this.x + 8, this.y + 6);
        ctx.lineTo(this.x + 9, this.y + 9);
        ctx.lineTo(this.x + 13, this.y + 10);
        ctx.closePath();
        ctx.fill();
        
        // Main arms (skin tone)
        ctx.fillStyle = '#F5DEB3';
        // Front arm (paddling/reaching arm)
        ctx.beginPath();
        ctx.moveTo(this.x + 23, this.y + 5);
        ctx.lineTo(this.x + 27, this.y + 2);
        ctx.lineTo(this.x + 28, this.y + 4);
        ctx.lineTo(this.x + 24, this.y + 7);
        ctx.closePath();
        ctx.fill();
        
        // Back arm (balance arm)
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 7);
        ctx.lineTo(this.x + 8, this.y + 5);
        ctx.lineTo(this.x + 9, this.y + 8);
        ctx.lineTo(this.x + 13, this.y + 9);
        ctx.closePath();
        ctx.fill();
        
        // Hands with detail
        ctx.fillStyle = '#F5DEB3';
        // Front hand
        ctx.beginPath();
        ctx.arc(this.x + 28, this.y + 3, 2, 0, Math.PI * 2);
        ctx.fill();
        // Palm lines
        ctx.strokeStyle = '#D2B48C';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x + 27, this.y + 2.5);
        ctx.lineTo(this.x + 29, this.y + 2.5);
        ctx.moveTo(this.x + 27, this.y + 3.5);
        ctx.lineTo(this.x + 29, this.y + 3.5);
        ctx.stroke();
        
        // Back hand
        ctx.beginPath();
        ctx.arc(this.x + 8, this.y + 6, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs positioned in surfing stance with wetsuit
        const legGradient = ctx.createLinearGradient(this.x + 15, this.y + 15, this.x + 15, this.y + 23);
        legGradient.addColorStop(0, '#20B2AA');
        legGradient.addColorStop(1, '#008B8B');
        ctx.fillStyle = legGradient;
        
        // Front leg (bent for balance)
        ctx.beginPath();
        ctx.moveTo(this.x + 19, this.y + 15);
        ctx.lineTo(this.x + 21, this.y + 20);
        ctx.lineTo(this.x + 20, this.y + 24);
        ctx.lineTo(this.x + 18, this.y + 22);
        ctx.closePath();
        ctx.fill();
        
        // Back leg (extended for balance)
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 15);
        ctx.lineTo(this.x + 13, this.y + 19);
        ctx.lineTo(this.x + 12, this.y + 23);
        ctx.lineTo(this.x + 14, this.y + 21);
        ctx.closePath();
        ctx.fill();
        
        // Feet with detail
        ctx.fillStyle = '#F5DEB3';
        // Front foot
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 24, 2, 0, Math.PI * 2);
        ctx.fill();
        // Toes
        ctx.beginPath();
        ctx.arc(this.x + 19, this.y + 24.5, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 20, this.y + 25, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 21, this.y + 24.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Back foot
        ctx.beginPath();
        ctx.arc(this.x + 12, this.y + 23, 2, 0, Math.PI * 2);
        ctx.fill();
        // Toes
        ctx.beginPath();
        ctx.arc(this.x + 11, this.y + 23.5, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 12, this.y + 24, 0.5, 0, Math.PI * 2);
        ctx.arc(this.x + 13, this.y + 23.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Restore context
        ctx.restore();
    }
}

// Boat obstacle
class Boat extends Obstacle {
    constructor(x, y) {
        super(x, y, 80, 40, 'boat');
    }
    
    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Draw boat hull with realistic shape
        const hullGradient = ctx.createLinearGradient(this.x, this.y + 25, this.x, this.y + 40);
        hullGradient.addColorStop(0, '#8B4513');
        hullGradient.addColorStop(1, '#A0522D');
        ctx.fillStyle = hullGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 35); // Stern
        ctx.lineTo(this.x + 5, this.y + 30);
        ctx.bezierCurveTo(this.x + 15, this.y + 25, this.x + 30, this.y + 20, this.x + 40, this.y + 20);
        ctx.lineTo(this.x + 60, this.y + 20);
        ctx.bezierCurveTo(this.x + 70, this.y + 20, this.x + 75, this.y + 25, this.x + 75, this.y + 30);
        ctx.lineTo(this.x + 75, this.y + 35); // Bow
        ctx.bezierCurveTo(this.x + 70, this.x + 32, this.x + 65, this.y + 30, this.x + 60, this.y + 30);
        ctx.lineTo(this.x + 20, this.y + 30);
        ctx.bezierCurveTo(this.x + 15, this.y + 30, this.x + 10, this.y + 32, this.x + 5, this.y + 35);
        ctx.closePath();
        ctx.fill();
        
        // Boat deck details
        ctx.fillStyle = '#D2691E';
        ctx.fillRect(this.x + 15, this.y + 25, 50, 3);
        
        // Draw boat mast with more realistic details
        const mastGradient = ctx.createLinearGradient(this.x + 38, this.y, this.x + 42, this.y + 30);
        mastGradient.addColorStop(0, '#654321');
        mastGradient.addColorStop(1, '#8B4513');
        ctx.fillStyle = mastGradient;
        ctx.fillRect(this.x + 38, this.y + 5, 4, 25);
        
        // Mast base
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(this.x + 35, this.y + 25, 10, 5);
        
        // Draw sail with better shape and shading
        const sailGradient = ctx.createLinearGradient(this.x + 45, this.y + 10, this.x + 65, this.y + 20);
        sailGradient.addColorStop(0, '#FFFFFF');
        sailGradient.addColorStop(1, '#F0F0F0');
        ctx.fillStyle = sailGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 42, this.y + 10); // Mast attachment point
        ctx.lineTo(this.x + 70, this.y + 15); // Sail tip
        ctx.lineTo(this.x + 65, this.y + 25); // Bottom of sail
        ctx.lineTo(this.x + 42, this.y + 20); // Mast attachment point
        ctx.closePath();
        ctx.fill();
        
        // Sail details
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 50, this.y + 12);
        ctx.lineTo(this.x + 55, this.y + 22);
        ctx.moveTo(this.x + 58, this.y + 13);
        ctx.lineTo(this.x + 63, this.y + 23);
        ctx.stroke();
        
        // Boat flag
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(this.x + 42, this.y + 8);
        ctx.lineTo(this.x + 50, this.y + 6);
        ctx.lineTo(this.x + 42, this.y + 4);
        ctx.closePath();
        ctx.fill();
        
        // Restore context
        ctx.restore();
    }
}

// Jetski obstacle
class Jetski extends Obstacle {
    constructor(x, y) {
        super(x, y, 50, 25, 'jetski');
    }
    
    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Draw jetski body with realistic shape and details
        const bodyGradient = ctx.createLinearGradient(this.x, this.y + 5, this.x, this.y + 25);
        bodyGradient.addColorStop(0, '#FF4500');
        bodyGradient.addColorStop(1, '#FF0000');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 2, this.y + 20); // Stern
        ctx.lineTo(this.x + 2, this.y + 15);
        ctx.bezierCurveTo(this.x + 5, this.y + 10, this.x + 15, this.y + 5, this.x + 25, this.y + 5);
        ctx.lineTo(this.x + 40, this.y + 5);
        ctx.bezierCurveTo(this.x + 45, this.y + 5, this.x + 48, this.y + 8, this.x + 48, this.y + 12);
        ctx.lineTo(this.x + 48, this.y + 18);
        ctx.bezierCurveTo(this.x + 45, this.y + 20, this.x + 40, this.y + 20, this.x + 35, this.y + 20);
        ctx.lineTo(this.x + 15, this.y + 20);
        ctx.bezierCurveTo(this.x + 10, this.y + 20, this.x + 5, this.y + 22, this.x + 2, this.y + 20);
        ctx.closePath();
        ctx.fill();
        
        // Jetski deck
        ctx.fillStyle = '#FF6347';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 10);
        ctx.lineTo(this.x + 35, this.y + 10);
        ctx.lineTo(this.x + 38, this.y + 15);
        ctx.lineTo(this.x + 8, this.y + 15);
        ctx.closePath();
        ctx.fill();
        
        // Rider seat
        ctx.fillStyle = '#8B0000';
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 12);
        ctx.lineTo(this.x + 30, this.y + 12);
        ctx.lineTo(this.x + 32, this.y + 18);
        ctx.lineTo(this.x + 13, this.y + 18);
        ctx.closePath();
        ctx.fill();
        
        // Jetski details
        // Headlight
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(this.x + 47, this.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Exhaust
        ctx.fillStyle = '#2F4F4F';
        ctx.fillRect(this.x + 3, this.y + 18, 8, 2);
        
        // Handlebars
        ctx.strokeStyle = '#C0C0C0';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x + 20, this.y + 10);
        ctx.lineTo(this.x + 20, this.y + 8);
        ctx.moveTo(this.x + 20, this.y + 8);
        ctx.lineTo(this.x + 25, this.y + 8);
        ctx.lineTo(this.x + 25, this.y + 10);
        ctx.stroke();
        
        // Water spray
        ctx.fillStyle = 'rgba(173, 216, 230, 0.7)';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + 22);
        ctx.lineTo(this.x - 5, this.y + 18);
        ctx.lineTo(this.x - 3, this.y + 24);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.x - 2, this.y + 25);
        ctx.lineTo(this.x - 8, this.y + 20);
        ctx.lineTo(this.x - 6, this.y + 27);
        ctx.closePath();
        ctx.fill();
        
        // Restore context
        ctx.restore();
    }
}

// Whale obstacle
class Whale extends Obstacle {
    constructor(x, y) {
        super(x, y, 100, 60, 'whale');
    }
    
    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Draw whale body with realistic shape
        const bodyGradient = ctx.createLinearGradient(this.x + 30, this.y + 10, this.x + 30, this.y + 50);
        bodyGradient.addColorStop(0, '#2F4F4F');
        bodyGradient.addColorStop(1, '#556B2F');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        // Whale body - main section
        ctx.moveTo(this.x + 10, this.y + 30);
        ctx.bezierCurveTo(this.x + 20, this.y + 15, this.x + 40, this.y + 10, this.x + 60, this.y + 15);
        ctx.bezierCurveTo(this.x + 80, this.y + 20, this.x + 90, this.y + 30, this.x + 85, this.y + 40);
        ctx.bezierCurveTo(this.x + 80, this.y + 50, this.x + 60, this.y + 55, this.x + 40, this.y + 50);
        ctx.bezierCurveTo(this.x + 20, this.y + 45, this.x + 5, this.y + 40, this.x + 10, this.y + 30);
        ctx.closePath();
        ctx.fill();
        
        // Whale head
        const headGradient = ctx.createLinearGradient(this.x + 70, this.y + 15, this.x + 70, this.y + 45);
        headGradient.addColorStop(0, '#556B2F');
        headGradient.addColorStop(1, '#6B8E23');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.moveTo(this.x + 60, this.y + 20);
        ctx.bezierCurveTo(this.x + 70, this.y + 15, this.x + 85, this.y + 18, this.x + 90, this.y + 25);
        ctx.bezierCurveTo(this.x + 95, this.y + 32, this.x + 90, this.y + 40, this.x + 80, this.y + 42);
        ctx.bezierCurveTo(this.x + 75, this.y + 40, this.x + 65, this.y + 35, this.x + 60, this.y + 30);
        ctx.closePath();
        ctx.fill();
        
        // Whale eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 85, this.y + 28, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + 86, this.y + 27, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Whale mouth
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x + 75, this.y + 35);
        ctx.lineTo(this.x + 85, this.y + 38);
        ctx.stroke();
        
        // Whale fin
        ctx.fillStyle = '#6B8E23';
        ctx.beginPath();
        ctx.moveTo(this.x + 30, this.y + 25);
        ctx.lineTo(this.x + 15, this.y + 10);
        ctx.lineTo(this.x + 20, this.y + 25);
        ctx.lineTo(this.x + 25, this.y + 30);
        ctx.closePath();
        ctx.fill();
        
        // Whale tail - left
        ctx.fillStyle = '#6B8E23';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 30);
        ctx.lineTo(this.x - 15, this.y + 20);
        ctx.lineTo(this.x - 10, this.y + 30);
        ctx.lineTo(this.x - 5, this.y + 35);
        ctx.closePath();
        ctx.fill();
        
        // Whale tail - right
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 30);
        ctx.lineTo(this.x - 15, this.y + 40);
        ctx.lineTo(this.x - 10, this.y + 30);
        ctx.lineTo(this.x - 5, this.y + 25);
        ctx.closePath();
        ctx.fill();
        
        // Water splash effect around whale
        ctx.fillStyle = 'rgba(173, 216, 230, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 10, 8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 50, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y + 30, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Restore context
        ctx.restore();
    }
}

// Dolphin obstacle
class Dolphin extends Obstacle {
    constructor(x, y) {
        super(x, y, 60, 30, 'dolphin');
    }
    
    draw(ctx) {
        // Save context for transformations
        ctx.save();
        
        // Draw dolphin body with realistic shape
        const bodyGradient = ctx.createLinearGradient(this.x + 20, this.y + 5, this.x + 20, this.y + 25);
        bodyGradient.addColorStop(0, '#1E90FF');
        bodyGradient.addColorStop(1, '#0000FF');
        ctx.fillStyle = bodyGradient;
        ctx.beginPath();
        // Dolphin body - main section
        ctx.moveTo(this.x + 5, this.y + 15);
        ctx.bezierCurveTo(this.x + 15, this.y + 8, this.x + 25, this.y + 5, this.x + 35, this.y + 8);
        ctx.bezierCurveTo(this.x + 45, this.y + 12, this.x + 50, this.y + 15, this.x + 45, this.y + 20);
        ctx.bezierCurveTo(this.x + 40, this.y + 25, this.x + 30, this.y + 25, this.x + 20, this.y + 22);
        ctx.bezierCurveTo(this.x + 10, this.y + 20, this.x + 5, this.y + 18, this.x + 5, this.y + 15);
        ctx.closePath();
        ctx.fill();
        
        // Dolphin beak
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.moveTo(this.x + 45, this.y + 15);
        ctx.lineTo(this.x + 55, this.y + 12);
        ctx.lineTo(this.x + 55, this.y + 18);
        ctx.closePath();
        ctx.fill();
        
        // Dolphin eye
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x + 40, this.y + 12, 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(this.x + 40.5, this.y + 11.5, 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Dolphin dorsal fin
        ctx.fillStyle = '#4682B4';
        ctx.beginPath();
        ctx.moveTo(this.x + 25, this.y + 8);
        ctx.lineTo(this.x + 20, this.y + 2);
        ctx.lineTo(this.x + 30, this.y + 8);
        ctx.closePath();
        ctx.fill();
        
        // Dolphin pectoral fin
        ctx.fillStyle = '#4682B4';
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 18);
        ctx.lineTo(this.x + 8, this.y + 22);
        ctx.lineTo(this.x + 18, this.y + 20);
        ctx.closePath();
        ctx.fill();
        
        // Dolphin tail - top
        ctx.fillStyle = '#4682B4';
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 15);
        ctx.lineTo(this.x - 8, this.y + 8);
        ctx.lineTo(this.x - 5, this.y + 15);
        ctx.closePath();
        ctx.fill();
        
        // Dolphin tail - bottom
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 15);
        ctx.lineTo(this.x - 8, this.y + 22);
        ctx.lineTo(this.x - 5, this.y + 15);
        ctx.closePath();
        ctx.fill();
        
        // Water splash effect around dolphin
        ctx.fillStyle = 'rgba(173, 216, 230, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x + 10, this.y + 5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y + 25, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Restore context
        ctx.restore();
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 6 - 3;
        this.speedY = Math.random() * 6 - 3;
        this.color = `rgba(173, 216, 230, ${Math.random() * 0.5 + 0.5})`;
        this.alpha = 1;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new PumpySurferGame();
    window.pumpySurferGame = game; // Make it globally accessible for debugging
});