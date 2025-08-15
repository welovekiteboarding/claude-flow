// User Interface - Complete interface management for solar system simulation

class UserInterface {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.domElements = {};
        this.settings = {
            timeScale: 1,
            showOrbits: true,
            showLabels: true,
            showMoons: true,
            realisticDistances: false,
            quality: 'medium',
            autoRotate: false
        };
        
        // Performance monitoring
        this.performanceUpdateInterval = 1000; // ms
        this.lastPerformanceUpdate = 0;
        
        // Planet information
        this.selectedPlanet = null;
        this.planetInfo = {};
        
        // User preferences
        this.bookmarkedViews = [];
        this.keyboardShortcuts = {
            'Space': 'togglePlayPause',
            'KeyR': 'resetView',
            'KeyH': 'toggleHelp',
            'KeyF': 'toggleFullscreen',
            'Digit1': () => this.selectPlanet('mercury'),
            'Digit2': () => this.selectPlanet('venus'),
            'Digit3': () => this.selectPlanet('earth'),
            'Digit4': () => this.selectPlanet('mars'),
            'Digit5': () => this.selectPlanet('jupiter'),
            'Digit6': () => this.selectPlanet('saturn'),
            'Digit7': () => this.selectPlanet('uranus'),
            'Digit8': () => this.selectPlanet('neptune'),
            'Digit9': () => this.selectPlanet('sun')
        };
        
        // Touch/mobile support
        this.isMobile = this.detectMobile();
        this.touchStartTime = 0;
        this.doubleTapDelay = 300;
        
        console.log('User Interface initialized');
    }
    
    async initialize() {
        this.setupDOMReferences();
        this.setupEventListeners();
        this.setupTimeControls();
        this.setupPlanetSelection();
        this.setupViewControls();
        this.setupQualityControls();
        this.setupAdvancedPhysicsControls();
        this.setupAtmosphereControls();
        this.setupNASADataControls();
        this.setupPlanetInfo();
        this.setupPerformanceMonitor();
        this.setupHelpPanel();
        this.setupKeyboardShortcuts();
        this.setupMobileControls();
        this.loadUserPreferences();
        
        console.log('User Interface fully initialized');
    }
    
    setupDOMReferences() {
        // Time controls
        this.domElements.playPauseBtn = document.getElementById('play-pause-btn');
        this.domElements.speedSlider = document.getElementById('speed-slider');
        this.domElements.speedValue = document.getElementById('speed-value');
        this.domElements.timeScale = document.getElementById('time-scale');
        this.domElements.resetBtn = document.getElementById('reset-btn');
        
        // Planet selection
        this.domElements.planetButtons = document.querySelectorAll('.planet-btn');
        
        // View controls
        this.domElements.orbitToggle = document.getElementById('show-orbits');
        this.domElements.labelsToggle = document.getElementById('show-labels');
        this.domElements.moonsToggle = document.getElementById('show-moons');
        this.domElements.realisticToggle = document.getElementById('realistic-distances');
        
        // Quality controls
        this.domElements.qualitySelect = document.getElementById('quality-preset');
        this.domElements.orbitSegments = document.getElementById('orbit-segments');
        this.domElements.orbitSegmentsValue = document.getElementById('orbit-segments-value');
        
        // Planet info
        this.domElements.planetInfoPanel = document.getElementById('planet-info');
        this.domElements.planetName = document.getElementById('info-planet-name');
        this.domElements.planetDistance = document.getElementById('info-distance');
        this.domElements.planetDiameter = document.getElementById('info-diameter');
        this.domElements.planetPeriod = document.getElementById('info-period');
        this.domElements.planetTemperature = document.getElementById('info-temperature');
        this.domElements.planetMoons = document.getElementById('info-moons');
        this.domElements.planetDay = document.getElementById('info-day');
        
        // Performance monitor
        this.domElements.fpsValue = document.getElementById('fps-value');
        this.domElements.objectCount = document.getElementById('object-count');
        
        // UI panels
        this.domElements.helpPanel = document.getElementById('help-panel');
        this.domElements.helpBtn = document.getElementById('help-btn');
        this.domElements.screenshotBtn = document.getElementById('screenshot-btn');
        this.domElements.fullscreenBtn = document.getElementById('fullscreen-btn');
        
        console.log('DOM references established');
    }
    
    setupEventListeners() {
        // Time controls
        if (this.domElements.playPauseBtn) {
            this.domElements.playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }
        
        if (this.domElements.speedSlider) {
            this.domElements.speedSlider.addEventListener('input', (e) => {
                this.setTimeScale(parseFloat(e.target.value));
            });
        }
        
        if (this.domElements.timeScale) {
            this.domElements.timeScale.addEventListener('change', (e) => {
                this.setTimeScalePreset(parseFloat(e.target.value));
            });
        }
        
        if (this.domElements.resetBtn) {
            this.domElements.resetBtn.addEventListener('click', () => {
                this.resetSimulation();
            });
        }
        
        // View controls
        if (this.domElements.orbitToggle) {
            this.domElements.orbitToggle.addEventListener('change', (e) => {
                this.toggleOrbits(e.target.checked);
            });
        }
        
        if (this.domElements.labelsToggle) {
            this.domElements.labelsToggle.addEventListener('change', (e) => {
                this.toggleLabels(e.target.checked);
            });
        }
        
        if (this.domElements.moonsToggle) {
            this.domElements.moonsToggle.addEventListener('change', (e) => {
                this.toggleMoons(e.target.checked);
            });
        }
        
        if (this.domElements.realisticToggle) {
            this.domElements.realisticToggle.addEventListener('change', (e) => {
                this.toggleRealisticDistances(e.target.checked);
            });
        }
        
        // Quality controls
        if (this.domElements.qualitySelect) {
            this.domElements.qualitySelect.addEventListener('change', (e) => {
                this.setQuality(e.target.value);
            });
        }
        
        if (this.domElements.orbitSegments) {
            this.domElements.orbitSegments.addEventListener('input', (e) => {
                this.updateOrbitSegments(parseInt(e.target.value));
            });
        }
        
        // Screenshot
        if (this.domElements.screenshotBtn) {
            this.domElements.screenshotBtn.addEventListener('click', () => {
                this.takeScreenshot();
            });
        }
        
        // Help panel
        if (this.domElements.helpBtn) {
            this.domElements.helpBtn.addEventListener('click', () => {
                this.toggleHelpPanel();
            });
        }
        
        // Fullscreen
        if (this.domElements.fullscreenBtn) {
            this.domElements.fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        console.log('Event listeners established');
    }
    
    setupTimeControls() {
        // Initialize speed slider
        if (this.domElements.speedSlider) {
            this.domElements.speedSlider.value = this.settings.timeScale;
        }
        this.updateSpeedDisplay();
        
        // Initialize time scale
        if (this.domElements.timeScale) {
            this.domElements.timeScale.value = '0.1'; // Default fast simulation
        }
    }
    
    setupPlanetSelection() {
        // Setup planet buttons
        this.domElements.planetButtons.forEach(button => {
            const planetName = button.dataset.planet;
            button.addEventListener('click', () => {
                this.selectPlanet(planetName);
            });
        });
    }
    
    setupViewControls() {
        // Initialize toggle states
        if (this.domElements.orbitToggle) {
            this.domElements.orbitToggle.checked = this.settings.showOrbits;
        }
        if (this.domElements.labelsToggle) {
            this.domElements.labelsToggle.checked = this.settings.showLabels;
        }
        if (this.domElements.moonsToggle) {
            this.domElements.moonsToggle.checked = this.settings.showMoons;
        }
        if (this.domElements.realisticToggle) {
            this.domElements.realisticToggle.checked = this.settings.realisticDistances;
        }
    }
    
    setupQualityControls() {
        if (this.domElements.qualitySelect) {
            this.domElements.qualitySelect.value = this.settings.quality;
        }
        
        if (this.domElements.orbitSegments) {
            this.domElements.orbitSegments.value = '128';
            this.updateOrbitSegmentsDisplay();
        }
    }
    
    setupPlanetInfo() {
        // Initialize with Earth info
        this.updatePlanetInfo('earth');
    }
    
    setupPerformanceMonitor() {
        // Will be updated in the update loop
        this.updatePerformanceMonitor();
    }
    
    setupHelpPanel() {
        // Close help panel by clicking outside
        document.addEventListener('click', (e) => {
            const helpPanel = this.domElements.helpPanel;
            const helpBtn = this.domElements.helpBtn;
            
            if (helpPanel && !helpPanel.contains(e.target) && e.target !== helpBtn) {
                helpPanel.classList.add('hidden');
            }
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            const shortcut = this.keyboardShortcuts[e.code];
            if (shortcut) {
                e.preventDefault();
                if (typeof shortcut === 'function') {
                    shortcut();
                } else {
                    this[shortcut]();
                }
            }
        });
    }
    
    setupMobileControls() {
        if (!this.isMobile) return;
        
        // Add mobile-specific UI hints
        const mobileHints = document.createElement('div');
        mobileHints.className = 'mobile-hints';
        mobileHints.innerHTML = `
            <div class="hint">Pinch to zoom</div>
            <div class="hint">Drag to rotate</div>
            <div class="hint">Tap planet to select</div>
        `;
        
        document.body.appendChild(mobileHints);
        
        // Setup touch events for planet selection
        document.addEventListener('touchstart', (e) => {
            this.touchStartTime = Date.now();
        });
        
        document.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - this.touchStartTime;
            if (touchDuration < this.doubleTapDelay) {
                this.handleMobileTap(e);
            }
        });
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad
    }
    
    handleMobileTap(event) {
        // Implement mobile tap-to-select planet functionality
        console.log('Mobile tap detected');
    }
    
    // UI Control Methods
    togglePlayPause() {
        this.solarSystem.togglePlayPause();
        this.updatePlayPauseButton();
    }
    
    updatePlayPauseButton() {
        const button = this.domElements.playPauseBtn;
        if (!button) return;
        
        const isPlaying = this.solarSystem.isPlaying;
        const icon = button.querySelector('.icon');
        const text = button.querySelector('.text');
        
        if (icon) icon.textContent = isPlaying ? '⏸️' : '▶️';
        if (text) text.textContent = isPlaying ? 'Pause' : 'Play';
        button.title = isPlaying ? 'Pause simulation' : 'Play simulation';
    }
    
    setTimeScale(scale) {
        this.settings.timeScale = scale;
        this.solarSystem.setTimeScale(scale);
        this.updateSpeedDisplay();
        this.saveUserPreferences();
    }
    
    setTimeScalePreset(scale) {
        this.setTimeScale(scale);
        if (this.domElements.speedSlider) {
            this.domElements.speedSlider.value = scale;
        }
    }
    
    updateSpeedDisplay() {
        if (this.domElements.speedValue) {
            this.domElements.speedValue.textContent = `${this.settings.timeScale}x`;
        }
    }
    
    resetSimulation() {
        this.solarSystem.setSimulationTime(new Date());
        this.selectPlanet('earth');
        this.showNotification('Simulation reset', 'info');
    }
    
    selectPlanet(planetName) {
        this.selectedPlanet = planetName;
        this.solarSystem.selectPlanet(planetName);
        this.updatePlanetSelection();
        this.updatePlanetInfo(planetName);
    }
    
    updatePlanetSelection() {
        // Update planet button states
        this.domElements.planetButtons.forEach(button => {
            const isSelected = button.dataset.planet === this.selectedPlanet;
            button.classList.toggle('active', isSelected);
        });
    }
    
    updatePlanetInfo(planetName) {
        const planetData = PLANETARY_DATA[planetName];
        if (!planetData) return;
        
        // Update basic info
        if (this.domElements.planetName) {
            this.domElements.planetName.textContent = planetData.name;
        }
        
        if (this.domElements.planetDistance) {
            this.domElements.planetDistance.textContent = 
                planetData.distance ? `${planetData.distance.toLocaleString()} million km` : 'N/A';
        }
        
        if (this.domElements.planetDiameter) {
            this.domElements.planetDiameter.textContent = 
                planetData.radius ? `${(planetData.radius * 2).toLocaleString()} km` : 'N/A';
        }
        
        if (this.domElements.planetPeriod) {
            this.domElements.planetPeriod.textContent = 
                planetData.period ? `${planetData.period.toLocaleString()} days` : 'N/A';
        }
        
        if (this.domElements.planetTemperature) {
            this.domElements.planetTemperature.textContent = planetData.temperature || 'N/A';
        }
        
        if (this.domElements.planetMoons) {
            this.domElements.planetMoons.textContent = planetData.moons || 0;
        }
        
        if (this.domElements.planetDay) {
            this.domElements.planetDay.textContent = planetData.dayLength || 'N/A';
        }
    }
    
    toggleOrbits(show) {
        this.settings.showOrbits = show;
        this.solarSystem.setOrbitVisibility(show);
        this.saveUserPreferences();
    }
    
    toggleLabels(show) {
        this.settings.showLabels = show;
        this.saveUserPreferences();
    }
    
    toggleMoons(show) {
        this.settings.showMoons = show;
        this.solarSystem.setMoonVisibility(show);
        this.saveUserPreferences();
    }
    
    toggleRealisticDistances(use) {
        this.settings.realisticDistances = use;
        this.solarSystem.setRealisticDistances(use);
        this.saveUserPreferences();
    }
    
    setQuality(quality) {
        this.settings.quality = quality;
        this.solarSystem.setQuality(quality);
        this.saveUserPreferences();
    }
    
    updateOrbitSegments(value) {
        this.updateOrbitSegmentsDisplay();
        // Apply to orbit trails if needed
    }
    
    updateOrbitSegmentsDisplay() {
        if (this.domElements.orbitSegmentsValue) {
            this.domElements.orbitSegmentsValue.textContent = this.domElements.orbitSegments.value;
        }
    }
    
    takeScreenshot() {
        this.solarSystem.takeScreenshot();
        this.showNotification('Screenshot saved!', 'success');
    }
    
    toggleHelpPanel() {
        const helpPanel = this.domElements.helpPanel;
        if (helpPanel) {
            helpPanel.classList.toggle('hidden');
        }
    }
    
    resetView() {
        if (this.solarSystem.cameraControls) {
            this.solarSystem.cameraControls.exitFollowMode();
        }
        this.selectedPlanet = null;
        this.updatePlanetSelection();
        this.updatePlanetInfo('earth');
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    // Performance monitoring
    updatePerformanceMonitor() {
        const stats = this.solarSystem.getStats();
        
        if (this.domElements.fpsValue) {
            this.domElements.fpsValue.textContent = stats.fps || 60;
        }
        
        if (this.domElements.objectCount) {
            this.domElements.objectCount.textContent = stats.objectCount || 0;
        }
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // User preferences
    saveUserPreferences() {
        try {
            localStorage.setItem('solarSystemPreferences', JSON.stringify({
                timeScale: this.settings.timeScale,
                showOrbits: this.settings.showOrbits,
                showLabels: this.settings.showLabels,
                showMoons: this.settings.showMoons,
                realisticDistances: this.settings.realisticDistances,
                quality: this.settings.quality,
                bookmarkedViews: this.bookmarkedViews
            }));
        } catch (error) {
            console.warn('Failed to save user preferences:', error);
        }
    }
    
    loadUserPreferences() {
        try {
            const saved = localStorage.getItem('solarSystemPreferences');
            if (saved) {
                const preferences = JSON.parse(saved);
                Object.assign(this.settings, preferences);
                
                // Apply loaded preferences
                this.setTimeScale(this.settings.timeScale);
                this.toggleOrbits(this.settings.showOrbits);
                this.toggleLabels(this.settings.showLabels);
                this.toggleMoons(this.settings.showMoons);
                this.toggleRealisticDistances(this.settings.realisticDistances);
                this.setQuality(this.settings.quality);
                
                if (preferences.bookmarkedViews) {
                    this.bookmarkedViews = preferences.bookmarkedViews;
                }
            }
        } catch (error) {
            console.warn('Failed to load user preferences:', error);
        }
    }
    
    // Main update loop
    update(deltaTime) {
        const now = Date.now();
        
        // Update performance monitor
        if (now - this.lastPerformanceUpdate > this.performanceUpdateInterval) {
            this.updatePerformanceMonitor();
            this.lastPerformanceUpdate = now;
        }
    }
    
    // Advanced Physics Controls Setup
    setupAdvancedPhysicsControls() {
        const enableNBody = document.getElementById('enable-nbody');
        const enableRelativity = document.getElementById('enable-relativity');
        const showLagrange = document.getElementById('show-lagrange');
        const showTidal = document.getElementById('show-tidal');
        const showGravityField = document.getElementById('show-gravity-field');
        
        if (enableNBody) {
            enableNBody.addEventListener('change', (e) => {
                if (this.solarSystem.advancedPhysics) {
                    this.solarSystem.advancedPhysics.enableNBodyDynamics = e.target.checked;
                    console.log(`N-body dynamics ${e.target.checked ? 'enabled' : 'disabled'}`);
                }
            });
        }
        
        if (enableRelativity) {
            enableRelativity.addEventListener('change', (e) => {
                if (this.solarSystem.advancedPhysics) {
                    this.solarSystem.advancedPhysics.enableRelativity = e.target.checked;
                    console.log(`Relativistic effects ${e.target.checked ? 'enabled' : 'disabled'}`);
                }
            });
        }
        
        if (showLagrange) {
            showLagrange.addEventListener('change', (e) => {
                console.log(`Lagrange points ${e.target.checked ? 'shown' : 'hidden'}`);
            });
        }
        
        if (showTidal) {
            showTidal.addEventListener('change', (e) => {
                console.log(`Tidal forces ${e.target.checked ? 'shown' : 'hidden'}`);
            });
        }
        
        if (showGravityField) {
            showGravityField.addEventListener('change', (e) => {
                console.log(`Gravity field ${e.target.checked ? 'shown' : 'hidden'}`);
            });
        }
    }
    
    // Atmosphere Controls Setup
    setupAtmosphereControls() {
        const enableAtmospheres = document.getElementById('enable-atmospheres');
        const enableScattering = document.getElementById('enable-scattering');
        const atmosphereQuality = document.getElementById('atmosphere-quality');
        
        if (enableAtmospheres) {
            enableAtmospheres.addEventListener('change', (e) => {
                if (this.solarSystem.atmosphereShaders) {
                    console.log(`Atmospheres ${e.target.checked ? 'enabled' : 'disabled'}`);
                }
            });
        }
        
        if (enableScattering) {
            enableScattering.addEventListener('change', (e) => {
                console.log(`Rayleigh scattering ${e.target.checked ? 'enabled' : 'disabled'}`);
            });
        }
        
        if (atmosphereQuality) {
            atmosphereQuality.addEventListener('change', (e) => {
                console.log(`Atmosphere quality set to: ${e.target.value}`);
            });
        }
    }
    
    // NASA Data Controls Setup
    setupNASADataControls() {
        const enableLiveData = document.getElementById('enable-live-data');
        const syncNasaData = document.getElementById('sync-nasa-data');
        const nasaDataSource = document.getElementById('nasa-data-source');
        const nasaLastUpdate = document.getElementById('nasa-last-update');
        
        if (enableLiveData) {
            enableLiveData.addEventListener('change', (e) => {
                if (this.solarSystem.nasaHorizonsAPI) {
                    console.log(`NASA live data ${e.target.checked ? 'enabled' : 'disabled'}`);
                }
            });
        }
        
        if (syncNasaData) {
            syncNasaData.addEventListener('click', async () => {
                console.log('Synchronizing with NASA HORIZONS...');
                syncNasaData.disabled = true;
                syncNasaData.textContent = 'Syncing...';
                
                try {
                    if (this.solarSystem.nasaHorizonsAPI) {
                        const snapshot = await this.solarSystem.nasaHorizonsAPI.getSolarSystemSnapshot();
                        console.log('NASA data synchronized:', snapshot);
                        
                        if (nasaLastUpdate) {
                            nasaLastUpdate.textContent = new Date().toLocaleTimeString();
                        }
                    }
                } catch (error) {
                    console.error('Failed to sync NASA data:', error);
                } finally {
                    syncNasaData.disabled = false;
                    syncNasaData.innerHTML = '<span class="icon">🛰️</span><span class="text">Sync with NASA</span>';
                }
            });
        }
        
        if (nasaDataSource) {
            nasaDataSource.addEventListener('change', (e) => {
                console.log(`NASA data source set to: ${e.target.value}`);
            });
        }
    }

    // Cleanup
    dispose() {
        // Save preferences before cleanup
        this.saveUserPreferences();
        
        console.log('User Interface disposed');
    }
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserInterface;
}