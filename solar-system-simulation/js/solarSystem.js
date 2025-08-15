// Solar System Simulation - Main 3D Graphics Engine
// Orchestrates the complete solar system with NASA orbital mechanics

class SolarSystem {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        
        // Specialized modules
        this.planetFactory = null;
        this.orbitTrails = null;
        this.cameraControls = null;
        this.userInterface = null;
        
        // State-of-the-art enhancements
        this.advancedPhysics = null;
        this.atmosphereShaders = null;
        this.nasaHorizonsAPI = null;
        
        // NASA orbital mechanics - will be set during initialization
        this.nasaOrbitalMechanics = null;
        
        // Advanced physics integration
        this.physicsIntegration = null;
        this.advancedPhysicsUI = null;
        this.advancedPhysicsEnabled = false;
        
        // Simulation state
        this.isPlaying = true;
        this.timeScale = 1;
        this.simulationTime = new Date();
        this.useRealisticDistances = false;
        this.showOrbits = true;
        this.showLabels = true;
        this.showMoons = true;
        
        // Performance monitoring
        this.stats = {
            fps: 0,
            frameCount: 0,
            lastTime: 0,
            objectCount: 0
        };
        
        // Quality settings
        this.qualityLevel = 'medium';
        this.shadowQuality = 'medium';
        
        // Loading state
        this.loadingSteps = [
            'Initializing 3D engine',
            'Loading NASA orbital data',
            'Creating planetary textures',
            'Building solar system',
            'Generating orbit trails',
            'Setting up camera controls',
            'Initializing user interface',
            'Setting up advanced physics',
            'Starting simulation'
        ];
        this.currentLoadingStep = 0;
        
        // Planets and celestial bodies
        this.planets = new Map();
        this.selectedPlanet = null;
        
        console.log('Solar System simulation initialized');
    }
    
    async initialize() {
        try {
            this.updateLoadingProgress(0, 'Initializing 3D engine');
            await this.initializeThreeJS();
            
            this.updateLoadingProgress(1, 'Loading NASA orbital data');
            await this.validateNASAData();
            
            this.updateLoadingProgress(2, 'Creating planetary textures');
            await this.initializeTextures();
            
            this.updateLoadingProgress(3, 'Building solar system');
            await this.createSolarSystem();
            
            this.updateLoadingProgress(4, 'Generating orbit trails');
            await this.initializeOrbitTrails();
            
            this.updateLoadingProgress(5, 'Setting up camera controls');
            await this.initializeCameraControls();
            
            this.updateLoadingProgress(6, 'Initializing user interface');
            await this.initializeUserInterface();
            
            this.updateLoadingProgress(7, 'Setting up advanced physics');
            await this.initializeAdvancedPhysics();
            
            this.updateLoadingProgress(8, 'Starting simulation');
            await this.startSimulation();
            
            this.hideLoadingScreen();
            
            console.log('Solar System simulation fully loaded');
            return true;
            
        } catch (error) {
            console.error('Failed to initialize solar system:', error);
            this.showError('Failed to load solar system simulation: ' + error.message);
            return false;
        }
    }
    
    updateLoadingProgress(step, message) {
        this.currentLoadingStep = step;
        const progress = ((step + 1) / this.loadingSteps.length) * 100;
        
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.querySelector('.loading-text');
        
        if (progressBar) progressBar.style.width = `${progress}%`;
        if (loadingText) loadingText.textContent = message;
        
        console.log(`Loading: ${progress.toFixed(0)}% - ${message}`);
    }
    
    async initializeThreeJS() {
        // Get canvas element
        this.canvas = document.getElementById('solar-system-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = this.createCosmicBackground();
        
        // Create camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            SIMULATION_CONSTANTS.CAMERA_FOV,
            aspect,
            SIMULATION_CONSTANTS.CAMERA_NEAR,
            SIMULATION_CONSTANTS.CAMERA_FAR
        );
        this.camera.position.set(0, 10, SIMULATION_CONSTANTS.CAMERA_INITIAL_DISTANCE);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            logarithmicDepthBuffer: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Setup lighting
        this.setupLighting();
        
        // Add starfield
        this.addStarfield();
        
        // Handle window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        console.log('Three.js initialized successfully');
    }
    
    createCosmicBackground() {
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        
        // Create cosmic gradient
        const gradient = context.createLinearGradient(0, 0, 0, 1024);
        gradient.addColorStop(0, '#0a0a2e');
        gradient.addColorStop(0.3, '#16213e');
        gradient.addColorStop(0.7, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1e');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 2048, 1024);
        
        // Add cosmic noise
        const imageData = context.getImageData(0, 0, 2048, 1024);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 0.1;
            data[i] += noise * 255;     // R
            data[i + 1] += noise * 255; // G
            data[i + 2] += noise * 255; // B
        }
        
        context.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    setupLighting() {
        // Ambient light for basic visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        this.scene.add(ambientLight);
        
        // Sun light (will be positioned at sun's location)
        this.sunLight = new THREE.PointLight(0xffffff, 2, 0);
        this.sunLight.position.set(0, 0, 0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = 200;
        this.scene.add(this.sunLight);
        
        console.log('Lighting setup complete');
    }
    
    addStarfield() {
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            // Random position on sphere
            const radius = 500;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Random star color (white to blue-white)
            const brightness = 0.5 + Math.random() * 0.5;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = brightness * (0.8 + Math.random() * 0.4);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
        
        console.log(`Added ${starCount} stars to the scene`);
    }
    
    async validateNASAData() {
        console.log('Starting NASA data validation...');
        
        // Check if NASA orbital mechanics is available globally
        console.log('NASA orbital mechanics available:', typeof nasaOrbitalMechanics);
        if (typeof nasaOrbitalMechanics === 'undefined') {
            throw new Error('NASA orbital mechanics not available');
        }
        
        // Set the instance reference
        this.nasaOrbitalMechanics = nasaOrbitalMechanics;
        console.log('NASA orbital mechanics instance set');
        
        // Check if NASA orbital elements are available
        console.log('NASA orbital elements available:', typeof NASA_ORBITAL_ELEMENTS);
        if (typeof NASA_ORBITAL_ELEMENTS === 'undefined') {
            throw new Error('NASA orbital elements not available');
        }
        
        // Check planet count first
        const planetCount = Object.keys(NASA_ORBITAL_ELEMENTS).length;
        console.log(`Planet count: ${planetCount}, planets:`, Object.keys(NASA_ORBITAL_ELEMENTS));
        if (planetCount !== 8) {
            console.warn(`Planet count: found ${planetCount}, expected 8`);
            throw new Error(`Expected 8 planets, found ${planetCount}`);
        }
        
        // Test basic functionality
        console.log('Testing Julian day calculation...');
        const testDate = new Date('2000-01-01T12:00:00Z');
        console.log('Test date:', testDate.toISOString());
        
        try {
            const julianDay = this.nasaOrbitalMechanics.getJulianDay(testDate);
            const expectedJD = 2451545.0;
            console.log(`Julian day calculation: got ${julianDay}, expected ${expectedJD}`);
            
            if (Math.abs(julianDay - expectedJD) > 0.1) {
                console.error(`Julian day validation failed: difference = ${Math.abs(julianDay - expectedJD)}`);
                throw new Error('NASA orbital mechanics validation failed');
            }
        } catch (error) {
            console.error('Error during Julian day calculation:', error);
            throw error;
        }
        
        console.log('NASA orbital data validation successful');
    }
    
    async initializeTextures() {
        // Initialize texture loader if not already done
        if (typeof textureLoader === 'undefined') {
            throw new Error('Texture loader not available');
        }
        
        console.log('Using standard texture loading system with Solar System Scope URLs');
        
        // Load textures with progress tracking
        textureLoader.onProgress((type, progress, url) => {
            if (type === 'progress') {
                this.updateLoadingProgress(2, `Loading textures: ${progress.toFixed(0)}%`);
            }
        });
        
        console.log('Texture loading complete - Solar System Scope textures active');
    }
    
    async createSolarSystem() {
        // Initialize planet factory
        this.planetFactory = new PlanetFactory(this.scene, textureLoader, this.nasaOrbitalMechanics);
        this.planetFactory.setQuality(this.qualityLevel);
        
        // Create all planets
        const planetNames = Object.keys(PLANETARY_DATA);
        for (const planetName of planetNames) {
            const planetData = PLANETARY_DATA[planetName];
            try {
                const planet = await this.planetFactory.createPlanet(
                    planetName, 
                    planetData, 
                    this.useRealisticDistances
                );
                
                if (planet) {
                    this.planets.set(planetName, planet);
                    console.log(`Created ${planetName}`);
                }
            } catch (error) {
                console.warn(`Failed to create ${planetName}:`, error);
            }
        }
        
        // Update object count
        this.stats.objectCount = this.planetFactory.getObjectCount();
        
        console.log(`Solar system created with ${this.planets.size} planets`);
    }
    
    async initializeOrbitTrails() {
        this.orbitTrails = new OrbitTrails(this.scene, this.nasaOrbitalMechanics);
        
        if (this.showOrbits) {
            // Create trails for all planets
            for (const [planetName, planetData] of Object.entries(PLANETARY_DATA)) {
                if (planetName !== 'sun') {
                    this.orbitTrails.createPlanetTrail(planetName, planetData);
                }
            }
            
            // Create moon trail for Earth's moon
            this.orbitTrails.createMoonTrail('Moon', 'earth', this.simulationTime);
        }
        
        console.log('Orbit trails initialized');
    }
    
    async initializeCameraControls() {
        this.cameraControls = new CameraControls(this.camera, this.canvas, this.scene);
        
        // Set initial camera position and target
        this.cameraControls.setTarget(new THREE.Vector3(0, 0, 0));
        this.cameraControls.setDistance(SIMULATION_CONSTANTS.CAMERA_INITIAL_DISTANCE);
        
        // CRITICAL FIX: Initialize spherical coordinates manually (working solution)
        console.log('🚀 APPLYING WORKING ZOOM FIX: Manually initializing spherical coordinates');
        const offset = new THREE.Vector3();
        offset.copy(this.camera.position).sub(this.cameraControls.target);
        this.cameraControls.spherical.setFromVector3(offset);
        this.cameraControls.sphericalDelta.set(0, 0, 0);
        this.cameraControls.panOffset.set(0, 0, 0);
        console.log('🚀 ZOOM FIX: Spherical radius set to:', this.cameraControls.spherical.radius);
        console.log('🚀 ZOOM FIX: Camera position:', this.camera.position.x, this.camera.position.y, this.camera.position.z);
        
        console.log('🚀 MAIN SIM: Camera controls initialized with distance:', SIMULATION_CONSTANTS.CAMERA_INITIAL_DISTANCE);
        console.log('🚀 MAIN SIM: Spherical radius should now be:', this.cameraControls.spherical.radius);
    }
    
    async initializeUserInterface() {
        this.userInterface = new UserInterface(this);
        await this.userInterface.initialize();
        
        console.log('User interface initialized');
    }
    
    async initializeAdvancedPhysics() {
        // Initialize advanced physics engine
        this.advancedPhysics = new AdvancedPhysics();
        await this.advancedPhysics.initializeBodies(PLANETARY_DATA);
        
        // Initialize atmosphere shaders
        this.atmosphereShaders = new AtmosphereShaders();
        
        // Initialize NASA HORIZONS API
        this.nasaHorizonsAPI = new NASAHorizonsAPI();
        
        console.log('Advanced physics and rendering systems initialized');
    }
    
    async startSimulation() {
        // Initialize simulation time
        this.simulationTime = new Date();
        
        // Set initial planet positions
        this.updatePlanetPositions();
        
        // Start render loop
        this.animate();
        
        console.log('Simulation started');
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
    
    showError(message) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = 'Error: ' + message;
            loadingText.style.color = '#ff4444';
        }
        console.error('Solar System Error:', message);
    }
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.stats.lastTime) / 1000;
        this.stats.lastTime = currentTime;
        
        // Update FPS
        this.stats.frameCount++;
        if (this.stats.frameCount % 60 === 0) {
            this.stats.fps = Math.round(1 / deltaTime);
        }
        
        // Update simulation
        this.update(deltaTime);
        
        // Render
        this.render();
    }
    
    update(deltaTime) {
        // Update simulation time
        if (this.isPlaying) {
            const timeIncrement = deltaTime * this.timeScale * 24 * 60 * 60 * 1000; // Scale to days
            this.simulationTime = new Date(this.simulationTime.getTime() + timeIncrement);
            // Debug: Show time update
            if (this.stats.frameCount % 120 === 0) { // Every 2 seconds at 60fps
                console.log(`Simulation time: ${this.simulationTime.toISOString()}, Scale: ${this.timeScale}x`);
            }
        }
        
        // Update camera controls
        if (this.cameraControls) {
            this.cameraControls.update();
        }
        
        // Update planet animations
        if (this.planetFactory) {
            this.planetFactory.animatePlanets(deltaTime, this.timeScale);
        }
        
        // Update planet positions smoothly every frame
        this.updatePlanetPositions();
        
        // Update orbit trails
        if (this.orbitTrails && this.showOrbits) {
            this.orbitTrails.updateTrails(this.simulationTime);
        }
        
        // Update user interface
        if (this.userInterface) {
            this.userInterface.update(deltaTime);
        }
    }
    
    updatePlanetPositions() {
        if (!this.planetFactory) return;
        
        try {
            // Always update positions for smooth movement
            this.planetFactory.updatePositions(this.simulationTime);
            
            // Also update orbit trails periodically for performance
            if (this.orbitTrails && this.stats.frameCount % 60 === 0) {
                this.orbitTrails.updateTrails(this.simulationTime);
            }
        } catch (error) {
            console.warn('Error updating planet positions:', error);
        }
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    // Simulation controls
    play() {
        this.isPlaying = true;
        console.log('Simulation playing');
    }
    
    pause() {
        this.isPlaying = false;
        console.log('Simulation paused');
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        console.log(`Simulation ${this.isPlaying ? 'playing' : 'paused'}`);
    }
    
    setTimeScale(scale) {
        this.timeScale = Math.max(0.1, Math.min(100, scale));
        console.log(`Time scale set to ${this.timeScale}x, Playing: ${this.isPlaying}`);
        // Ensure user interface is updated
        if (this.userInterface) {
            this.userInterface.updateSpeedDisplay();
        }
    }
    
    setSimulationTime(date) {
        this.simulationTime = new Date(date);
        this.updatePlanetPositions();
        console.log(`Simulation time set to ${this.simulationTime.toISOString()}`);
    }
    
    // View controls
    setRealisticDistances(enabled) {
        this.useRealisticDistances = enabled;
        this.updatePlanetPositions();
        console.log(`Realistic distances ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    setOrbitVisibility(visible) {
        this.showOrbits = visible;
        if (this.orbitTrails) {
            this.orbitTrails.setVisibility(visible);
        }
        console.log(`Orbit trails ${visible ? 'shown' : 'hidden'}`);
    }
    
    setMoonVisibility(visible) {
        this.showMoons = visible;
        // Implementation for showing/hiding moons
        console.log(`Moons ${visible ? 'shown' : 'hidden'}`);
    }
    
    // Planet selection
    selectPlanet(planetName) {
        const planet = this.planets.get(planetName);
        if (planet && this.cameraControls) {
            this.selectedPlanet = planetName;
            this.cameraControls.focusOnPlanet(planetName);
            console.log(`Selected planet: ${planetName}`);
        }
    }
    
    // Quality controls
    setQuality(quality) {
        this.qualityLevel = quality;
        if (this.planetFactory) {
            this.planetFactory.setQuality(quality);
        }
        if (this.orbitTrails) {
            this.orbitTrails.setLOD(quality);
        }
        console.log(`Quality set to ${quality}`);
    }
    
    // Screenshot
    takeScreenshot() {
        this.renderer.render(this.scene, this.camera);
        const dataURL = this.renderer.domElement.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = `solar-system-${Date.now()}.png`;
        link.href = dataURL;
        link.click();
        
        console.log('Screenshot saved');
    }
    
    // Getters
    getStats() {
        return {
            ...this.stats,
            objectCount: this.planetFactory ? this.planetFactory.getObjectCount() : 0,
            trailCount: this.orbitTrails ? this.orbitTrails.getTrailCount() : 0
        };
    }
    
    getSimulationTime() {
        return this.simulationTime;
    }
    
    getSelectedPlanet() {
        return this.selectedPlanet;
    }
    
    getPlanetPosition(planetName) {
        const planet = this.planets.get(planetName);
        return planet ? planet.position : null;
    }
    
    // Cleanup
    dispose() {
        // Stop animation
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Dispose modules
        if (this.planetFactory) this.planetFactory.dispose();
        if (this.orbitTrails) this.orbitTrails.dispose();
        if (this.cameraControls) this.cameraControls.dispose();
        if (this.userInterface) this.userInterface.dispose();
        
        // Dispose Three.js objects
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        
        console.log('Solar System simulation disposed');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SolarSystem;
}