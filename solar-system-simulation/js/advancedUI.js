// Advanced Physics UI Controller
// Enhanced user interface for advanced physics features

/**
 * Advanced Physics UI Manager
 * Manages UI controls for advanced physics features
 */
class AdvancedPhysicsUI {
    constructor(solarSystem, physicsIntegration) {
        this.solarSystem = solarSystem;
        this.physicsIntegration = physicsIntegration;
        
        // UI Elements
        this.uiElements = new Map();
        this.isInitialized = false;
        
        // UI State
        this.uiState = {
            physicsMode: 'kepler',
            showAdvancedControls: false,
            performanceMode: 'standard'
        };
        
        // Feature panels
        this.featurePanels = {
            physics: null,
            visualization: null,
            performance: null,
            export: null
        };
        
        console.log('Advanced Physics UI Manager initialized');
    }
    
    /**
     * Initialize advanced physics UI
     */
    async initialize() {
        try {
            this.createAdvancedControlPanels();
            this.setupEventListeners();
            this.updateUIState();
            
            this.isInitialized = true;
            console.log('Advanced Physics UI initialized successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize Advanced Physics UI:', error);
            return false;
        }
    }
    
    /**
     * Create advanced control panels
     */
    createAdvancedControlPanels() {
        const uiContainer = document.getElementById('ui-container');
        if (!uiContainer) {
            console.error('UI container not found');
            return;
        }
        
        // Create advanced physics panel
        this.createPhysicsControlPanel(uiContainer);
        
        // Create visualization features panel
        this.createVisualizationPanel(uiContainer);
        
        // Create performance monitoring panel
        this.createPerformancePanel(uiContainer);
        
        // Create data export panel
        this.createExportPanel(uiContainer);
        
        // Create physics toggle button
        this.createPhysicsToggleButton();
        
        console.log('Advanced control panels created');
    }
    
    /**
     * Create physics control panel
     */
    createPhysicsControlPanel(container) {
        const panel = document.createElement('div');
        panel.className = 'control-panel advanced-physics-panel';
        panel.id = 'advanced-physics-controls';
        panel.style.display = 'none'; // Initially hidden
        
        panel.innerHTML = `
            <h3>🔬 Advanced Physics</h3>
            
            <div class="control-group">
                <label for="physics-mode">Physics Mode:</label>
                <select id="physics-mode">
                    <option value="kepler">Kepler Orbits (Fast)</option>
                    <option value="nbody">N-Body Dynamics (Accurate)</option>
                </select>
            </div>
            
            <div class="physics-features">
                <h4>Physics Features</h4>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="enable-nbody" checked>
                        <span>N-Body Gravitational Forces</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="enable-relativistic" checked>
                        <span>Relativistic Effects</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="enable-tidal" checked>
                        <span>Tidal Forces</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="enable-perturbations" checked>
                        <span>J2 Perturbations</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="enable-gpu-acceleration">
                        <span>GPU Acceleration</span>
                    </label>
                </div>
            </div>
            
            <div class="control-group">
                <label for="physics-timestep">Time Step (seconds):</label>
                <input type="range" id="physics-timestep" min="60" max="3600" step="60" value="3600">
                <span id="timestep-value">3600</span>
            </div>
            
            <div class="control-group">
                <label for="integration-method">Integration Method:</label>
                <select id="integration-method">
                    <option value="verlet" selected>Verlet (Stable)</option>
                    <option value="rk4">Runge-Kutta 4 (Precise)</option>
                    <option value="leapfrog">Leapfrog (Fast)</option>
                </select>
            </div>
            
            <div class="control-group">
                <button id="reset-physics" class="btn btn-secondary">
                    <span class="icon">⚡</span>
                    <span class="text">Reset Physics</span>
                </button>
            </div>
        `;
        
        container.appendChild(panel);
        this.featurePanels.physics = panel;
        
        // Store element references
        this.uiElements.set('physicsMode', document.getElementById('physics-mode'));
        this.uiElements.set('enableNBody', document.getElementById('enable-nbody'));
        this.uiElements.set('enableRelativistic', document.getElementById('enable-relativistic'));
        this.uiElements.set('enableTidal', document.getElementById('enable-tidal'));
        this.uiElements.set('enablePerturbations', document.getElementById('enable-perturbations'));
        this.uiElements.set('enableGPU', document.getElementById('enable-gpu-acceleration'));
        this.uiElements.set('physicsTimestep', document.getElementById('physics-timestep'));
        this.uiElements.set('timestepValue', document.getElementById('timestep-value'));
        this.uiElements.set('integrationMethod', document.getElementById('integration-method'));
        this.uiElements.set('resetPhysics', document.getElementById('reset-physics'));
    }
    
    /**
     * Create visualization features panel
     */
    createVisualizationPanel(container) {
        const panel = document.createElement('div');
        panel.className = 'control-panel visualization-panel';
        panel.id = 'visualization-features';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <h3>👁️ Advanced Visualization</h3>
            
            <div class="visualization-features">
                <h4>Special Features</h4>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="show-lagrange-points">
                        <span>Lagrange Points</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="show-gravity-field">
                        <span>Gravitational Field Lines</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="show-tidal-field">
                        <span>Tidal Force Field</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="show-precession" checked>
                        <span>Precession Effects</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="show-trajectories" checked>
                        <span>Long-term Trajectories</span>
                    </label>
                </div>
            </div>
            
            <div class="control-group">
                <label for="trajectory-length">Trajectory Length:</label>
                <input type="range" id="trajectory-length" min="100" max="5000" step="100" value="1000">
                <span id="trajectory-length-value">1000</span>
            </div>
            
            <div class="control-group">
                <label for="field-density">Field Visualization Density:</label>
                <input type="range" id="field-density" min="10" max="100" step="10" value="50">
                <span id="field-density-value">50</span>
            </div>
            
            <div class="lagrange-systems">
                <h4>Lagrange Point Systems</h4>
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="lagrange-sun-earth" checked>
                        <span>Sun-Earth System</span>
                    </label>
                </div>
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="lagrange-earth-moon" checked>
                        <span>Earth-Moon System</span>
                    </label>
                </div>
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="lagrange-sun-jupiter">
                        <span>Sun-Jupiter System</span>
                    </label>
                </div>
            </div>
        `;
        
        container.appendChild(panel);
        this.featurePanels.visualization = panel;
        
        // Store element references
        this.uiElements.set('showLagrangePoints', document.getElementById('show-lagrange-points'));
        this.uiElements.set('showGravityField', document.getElementById('show-gravity-field'));
        this.uiElements.set('showTidalField', document.getElementById('show-tidal-field'));
        this.uiElements.set('showPrecession', document.getElementById('show-precession'));
        this.uiElements.set('showTrajectories', document.getElementById('show-trajectories'));
        this.uiElements.set('trajectoryLength', document.getElementById('trajectory-length'));
        this.uiElements.set('trajectoryLengthValue', document.getElementById('trajectory-length-value'));
        this.uiElements.set('fieldDensity', document.getElementById('field-density'));
        this.uiElements.set('fieldDensityValue', document.getElementById('field-density-value'));
    }
    
    /**
     * Create performance monitoring panel
     */
    createPerformancePanel(container) {
        const panel = document.createElement('div');
        panel.className = 'control-panel performance-panel';
        panel.id = 'performance-monitoring';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <h3>📊 Performance Monitor</h3>
            
            <div class="performance-stats">
                <div class="stat-row">
                    <span class="stat-label">Physics FPS:</span>
                    <span class="stat-value" id="physics-fps">60</span>
                </div>
                
                <div class="stat-row">
                    <span class="stat-label">Calculations/sec:</span>
                    <span class="stat-value" id="calculations-per-sec">0</span>
                </div>
                
                <div class="stat-row">
                    <span class="stat-label">Body Interactions:</span>
                    <span class="stat-value" id="body-interactions">0</span>
                </div>
                
                <div class="stat-row">
                    <span class="stat-label">GPU Acceleration:</span>
                    <span class="stat-value" id="gpu-status">Disabled</span>
                </div>
                
                <div class="stat-row">
                    <span class="stat-label">Memory Usage:</span>
                    <span class="stat-value" id="memory-usage">0 MB</span>
                </div>
                
                <div class="stat-row">
                    <span class="stat-label">Update Time:</span>
                    <span class="stat-value" id="update-time">0 ms</span>
                </div>
            </div>
            
            <div class="control-group">
                <label for="performance-mode">Performance Mode:</label>
                <select id="performance-mode">
                    <option value="quality">Quality (Slow)</option>
                    <option value="standard" selected>Standard</option>
                    <option value="performance">Performance (Fast)</option>
                    <option value="turbo">Turbo (Fastest)</option>
                </select>
            </div>
            
            <div class="control-group">
                <label for="update-frequency">Update Frequency (Hz):</label>
                <input type="range" id="update-frequency" min="10" max="120" step="10" value="60">
                <span id="frequency-value">60</span>
            </div>
            
            <div class="control-group">
                <button id="benchmark-physics" class="btn btn-secondary">
                    <span class="icon">⏱️</span>
                    <span class="text">Run Benchmark</span>
                </button>
            </div>
        `;
        
        container.appendChild(panel);
        this.featurePanels.performance = panel;
        
        // Store element references
        this.uiElements.set('physicsFps', document.getElementById('physics-fps'));
        this.uiElements.set('calculationsPerSec', document.getElementById('calculations-per-sec'));
        this.uiElements.set('bodyInteractions', document.getElementById('body-interactions'));
        this.uiElements.set('gpuStatus', document.getElementById('gpu-status'));
        this.uiElements.set('memoryUsage', document.getElementById('memory-usage'));
        this.uiElements.set('updateTime', document.getElementById('update-time'));
        this.uiElements.set('performanceMode', document.getElementById('performance-mode'));
        this.uiElements.set('updateFrequency', document.getElementById('update-frequency'));
        this.uiElements.set('frequencyValue', document.getElementById('frequency-value'));
        this.uiElements.set('benchmarkPhysics', document.getElementById('benchmark-physics'));
    }
    
    /**
     * Create data export panel
     */
    createExportPanel(container) {
        const panel = document.createElement('div');
        panel.className = 'control-panel export-panel';
        panel.id = 'data-export';
        panel.style.display = 'none';
        
        panel.innerHTML = `
            <h3>💾 Data Export</h3>
            
            <div class="export-options">
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="export-positions" checked>
                        <span>Body Positions</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="export-velocities" checked>
                        <span>Body Velocities</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="export-forces">
                        <span>Gravitational Forces</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="export-lagrange">
                        <span>Lagrange Points</span>
                    </label>
                </div>
                
                <div class="control-group">
                    <label>
                        <input type="checkbox" id="export-performance">
                        <span>Performance Data</span>
                    </label>
                </div>
            </div>
            
            <div class="control-group">
                <label for="export-format">Export Format:</label>
                <select id="export-format">
                    <option value="json" selected>JSON</option>
                    <option value="csv">CSV</option>
                    <option value="xml">XML</option>
                </select>
            </div>
            
            <div class="control-group">
                <label for="export-interval">Export Interval (seconds):</label>
                <input type="range" id="export-interval" min="60" max="86400" step="60" value="3600">
                <span id="export-interval-value">3600</span>
            </div>
            
            <div class="export-buttons">
                <button id="export-snapshot" class="btn btn-primary">
                    <span class="icon">📸</span>
                    <span class="text">Export Snapshot</span>
                </button>
                
                <button id="start-recording" class="btn btn-secondary">
                    <span class="icon">🔴</span>
                    <span class="text">Start Recording</span>
                </button>
                
                <button id="stop-recording" class="btn btn-secondary" disabled>
                    <span class="icon">⏹️</span>
                    <span class="text">Stop Recording</span>
                </button>
            </div>
        `;
        
        container.appendChild(panel);
        this.featurePanels.export = panel;
        
        // Store element references
        this.uiElements.set('exportPositions', document.getElementById('export-positions'));
        this.uiElements.set('exportVelocities', document.getElementById('export-velocities'));
        this.uiElements.set('exportForces', document.getElementById('export-forces'));
        this.uiElements.set('exportLagrange', document.getElementById('export-lagrange'));
        this.uiElements.set('exportPerformance', document.getElementById('export-performance'));
        this.uiElements.set('exportFormat', document.getElementById('export-format'));
        this.uiElements.set('exportInterval', document.getElementById('export-interval'));
        this.uiElements.set('exportIntervalValue', document.getElementById('export-interval-value'));
        this.uiElements.set('exportSnapshot', document.getElementById('export-snapshot'));
        this.uiElements.set('startRecording', document.getElementById('start-recording'));
        this.uiElements.set('stopRecording', document.getElementById('stop-recording'));
    }
    
    /**
     * Create physics toggle button
     */
    createPhysicsToggleButton() {
        const toggleButtons = document.getElementById('toggle-buttons');
        if (!toggleButtons) return;
        
        const toggleButton = document.createElement('button');
        toggleButton.id = 'advanced-physics-toggle';
        toggleButton.className = 'toggle-btn';
        toggleButton.title = 'Toggle Advanced Physics';
        toggleButton.innerHTML = '<span>🔬</span>';
        
        toggleButtons.appendChild(toggleButton);
        this.uiElements.set('physicsToggle', toggleButton);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Physics mode change
        const physicsModeSelect = this.uiElements.get('physicsMode');
        if (physicsModeSelect) {
            physicsModeSelect.addEventListener('change', (e) => {
                this.handlePhysicsModeChange(e.target.value);
            });
        }
        
        // Physics features toggles
        const physicsFeatures = ['enableNBody', 'enableRelativistic', 'enableTidal', 'enablePerturbations', 'enableGPU'];
        physicsFeatures.forEach(feature => {
            const element = this.uiElements.get(feature);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.handlePhysicsFeatureToggle(feature, e.target.checked);
                });
            }
        });
        
        // Visualization features toggles
        const visualizationFeatures = ['showLagrangePoints', 'showGravityField', 'showTidalField', 'showPrecession', 'showTrajectories'];
        visualizationFeatures.forEach(feature => {
            const element = this.uiElements.get(feature);
            if (element) {
                element.addEventListener('change', (e) => {
                    this.handleVisualizationFeatureToggle(feature, e.target.checked);
                });
            }
        });
        
        // Sliders
        this.setupSliderListeners();
        
        // Buttons
        this.setupButtonListeners();
        
        // Physics toggle button
        const physicsToggle = this.uiElements.get('physicsToggle');
        if (physicsToggle) {
            physicsToggle.addEventListener('click', () => {
                this.toggleAdvancedPhysicsUI();
            });
        }
        
        console.log('Event listeners setup complete');
    }
    
    /**
     * Setup slider event listeners
     */
    setupSliderListeners() {
        // Physics timestep
        const timestepSlider = this.uiElements.get('physicsTimestep');
        const timestepValue = this.uiElements.get('timestepValue');
        if (timestepSlider && timestepValue) {
            timestepSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                timestepValue.textContent = value;
                this.handleTimestepChange(value);
            });
        }
        
        // Trajectory length
        const trajectorySlider = this.uiElements.get('trajectoryLength');
        const trajectoryValue = this.uiElements.get('trajectoryLengthValue');
        if (trajectorySlider && trajectoryValue) {
            trajectorySlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                trajectoryValue.textContent = value;
                this.handleTrajectoryLengthChange(value);
            });
        }
        
        // Update frequency
        const frequencySlider = this.uiElements.get('updateFrequency');
        const frequencyValue = this.uiElements.get('frequencyValue');
        if (frequencySlider && frequencyValue) {
            frequencySlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                frequencyValue.textContent = value;
                this.handleUpdateFrequencyChange(value);
            });
        }
        
        // Export interval
        const exportSlider = this.uiElements.get('exportInterval');
        const exportValue = this.uiElements.get('exportIntervalValue');
        if (exportSlider && exportValue) {
            exportSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                exportValue.textContent = value;
            });
        }
    }
    
    /**
     * Setup button event listeners
     */
    setupButtonListeners() {
        // Reset physics
        const resetButton = this.uiElements.get('resetPhysics');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.handleResetPhysics();
            });
        }
        
        // Benchmark
        const benchmarkButton = this.uiElements.get('benchmarkPhysics');
        if (benchmarkButton) {
            benchmarkButton.addEventListener('click', () => {
                this.runPhysicsBenchmark();
            });
        }
        
        // Export snapshot
        const exportButton = this.uiElements.get('exportSnapshot');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportDataSnapshot();
            });
        }
        
        // Recording controls
        const startRecordingButton = this.uiElements.get('startRecording');
        const stopRecordingButton = this.uiElements.get('stopRecording');
        
        if (startRecordingButton) {
            startRecordingButton.addEventListener('click', () => {
                this.startDataRecording();
            });
        }
        
        if (stopRecordingButton) {
            stopRecordingButton.addEventListener('click', () => {
                this.stopDataRecording();
            });
        }
    }
    
    /**
     * Handle physics mode change
     */
    handlePhysicsModeChange(mode) {
        this.uiState.physicsMode = mode;
        
        if (this.physicsIntegration) {
            this.physicsIntegration.setSimulationMode(mode);
        }
        
        // Update UI based on mode
        this.updatePhysicsFeatureVisibility(mode);
        
        console.log(`Physics mode changed to: ${mode}`);
    }
    
    /**
     * Handle physics feature toggle
     */
    handlePhysicsFeatureToggle(feature, enabled) {
        if (!this.physicsIntegration || !this.physicsIntegration.physicsEngine) return;
        
        const options = {};
        
        switch (feature) {
            case 'enableNBody':
                options.nBodyGravity = enabled;
                break;
            case 'enableRelativistic':
                options.relativisticEffects = enabled;
                break;
            case 'enableTidal':
                options.tidalForces = enabled;
                break;
            case 'enablePerturbations':
                options.perturbations = enabled;
                break;
        }
        
        this.physicsIntegration.physicsEngine.setPhysicsOptions(options);
        console.log(`Physics feature ${feature} ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Handle visualization feature toggle
     */
    handleVisualizationFeatureToggle(feature, enabled) {
        if (!this.physicsIntegration) return;
        
        const featureMap = {
            'showLagrangePoints': 'lagrangePoints',
            'showGravityField': 'gravitationalField',
            'showTidalField': 'tidalField',
            'showPrecession': 'relativisticEffects',
            'showTrajectories': 'orbitTrajectories'
        };
        
        const physicsFeature = featureMap[feature];
        if (physicsFeature) {
            this.physicsIntegration.setVisualizationFeature(physicsFeature, enabled);
        }
        
        console.log(`Visualization feature ${feature} ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Handle timestep change
     */
    handleTimestepChange(timestep) {
        if (this.physicsIntegration && this.physicsIntegration.physicsEngine) {
            this.physicsIntegration.physicsEngine.timestep = timestep;
        }
    }
    
    /**
     * Handle trajectory length change
     */
    handleTrajectoryLengthChange(length) {
        // Update trajectory system if available
        if (this.solarSystem.orbitTrails) {
            this.solarSystem.orbitTrails.setTrailLength(length);
        }
    }
    
    /**
     * Handle update frequency change
     */
    handleUpdateFrequencyChange(frequency) {
        if (this.physicsIntegration) {
            this.physicsIntegration.physicsUpdateFrequency = frequency;
        }
    }
    
    /**
     * Handle reset physics
     */
    handleResetPhysics() {
        if (this.physicsIntegration) {
            this.physicsIntegration.initializeAdvancedPhysics();
        }
        console.log('Physics system reset');
    }
    
    /**
     * Run physics benchmark
     */
    async runPhysicsBenchmark() {
        const button = this.uiElements.get('benchmarkPhysics');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<span class="icon">⏱️</span><span class="text">Running...</span>';
        }
        
        // Run benchmark for 5 seconds
        const startTime = performance.now();
        const duration = 5000; // 5 seconds
        let iterations = 0;
        
        while (performance.now() - startTime < duration) {
            if (this.physicsIntegration && this.physicsIntegration.physicsEngine) {
                this.physicsIntegration.physicsEngine.calculateNBodyForces();
                iterations++;
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        
        const endTime = performance.now();
        const actualDuration = endTime - startTime;
        const iterationsPerSecond = (iterations / actualDuration) * 1000;
        
        console.log(`Benchmark complete: ${iterationsPerSecond.toFixed(2)} iterations/second`);
        
        if (button) {
            button.disabled = false;
            button.innerHTML = '<span class="icon">⏱️</span><span class="text">Run Benchmark</span>';
        }
        
        // Show benchmark results
        alert(`Benchmark Results:\n${iterationsPerSecond.toFixed(2)} physics calculations per second`);
    }
    
    /**
     * Export data snapshot
     */
    exportDataSnapshot() {
        if (!this.physicsIntegration) return;
        
        const data = this.physicsIntegration.exportSimulationData();
        if (!data) return;
        
        const format = this.uiElements.get('exportFormat')?.value || 'json';
        const filename = `solar-system-snapshot-${Date.now()}.${format}`;
        
        let content;
        let mimeType;
        
        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                mimeType = 'application/json';
                break;
            case 'csv':
                content = this.convertToCSV(data);
                mimeType = 'text/csv';
                break;
            case 'xml':
                content = this.convertToXML(data);
                mimeType = 'application/xml';
                break;
            default:
                content = JSON.stringify(data, null, 2);
                mimeType = 'application/json';
        }
        
        this.downloadFile(content, filename, mimeType);
        console.log(`Data snapshot exported as ${filename}`);
    }
    
    /**
     * Start data recording
     */
    startDataRecording() {
        // Implementation for continuous data recording
        console.log('Data recording started');
        
        const startButton = this.uiElements.get('startRecording');
        const stopButton = this.uiElements.get('stopRecording');
        
        if (startButton) startButton.disabled = true;
        if (stopButton) stopButton.disabled = false;
    }
    
    /**
     * Stop data recording
     */
    stopDataRecording() {
        // Implementation for stopping data recording
        console.log('Data recording stopped');
        
        const startButton = this.uiElements.get('startRecording');
        const stopButton = this.uiElements.get('stopRecording');
        
        if (startButton) startButton.disabled = false;
        if (stopButton) stopButton.disabled = true;
    }
    
    /**
     * Toggle advanced physics UI visibility
     */
    toggleAdvancedPhysicsUI() {
        this.uiState.showAdvancedControls = !this.uiState.showAdvancedControls;
        
        Object.values(this.featurePanels).forEach(panel => {
            if (panel) {
                panel.style.display = this.uiState.showAdvancedControls ? 'block' : 'none';
            }
        });
        
        console.log(`Advanced physics UI ${this.uiState.showAdvancedControls ? 'shown' : 'hidden'}`);
    }
    
    /**
     * Update physics feature visibility based on mode
     */
    updatePhysicsFeatureVisibility(mode) {
        const featuresPanel = this.featurePanels.physics?.querySelector('.physics-features');
        if (!featuresPanel) return;
        
        if (mode === 'kepler') {
            featuresPanel.style.opacity = '0.5';
            featuresPanel.style.pointerEvents = 'none';
        } else {
            featuresPanel.style.opacity = '1';
            featuresPanel.style.pointerEvents = 'auto';
        }
    }
    
    /**
     * Update performance statistics display
     */
    updatePerformanceDisplay() {
        if (!this.physicsIntegration) return;
        
        const stats = this.physicsIntegration.getPhysicsPerformance();
        
        // Update performance values
        const updates = {
            physicsFps: Math.round(stats.iterationsPerSecond || 0),
            calculationsPerSec: Math.round(stats.calculationsPerSecond || 0),
            bodyInteractions: stats.bodyInteractions || 0,
            gpuStatus: stats.gpuAcceleration ? 'Enabled' : 'Disabled',
            memoryUsage: (stats.memoryUsage || 0).toFixed(1),
            updateTime: (stats.updateTime || 0).toFixed(2)
        };
        
        Object.entries(updates).forEach(([key, value]) => {
            const element = this.uiElements.get(key);
            if (element) {
                element.textContent = value + (key === 'updateTime' ? ' ms' : '');
            }
        });
    }
    
    /**
     * Update UI state
     */
    updateUIState() {
        // Update performance display every second
        setInterval(() => {
            this.updatePerformanceDisplay();
        }, 1000);
        
        // Update physics mode based on integration manager
        if (this.physicsIntegration) {
            const modeSelect = this.uiElements.get('physicsMode');
            if (modeSelect) {
                modeSelect.value = this.physicsIntegration.simulationMode;
                this.handlePhysicsModeChange(this.physicsIntegration.simulationMode);
            }
        }
    }
    
    /**
     * Convert data to CSV format
     */
    convertToCSV(data) {
        // Simple CSV conversion for body positions
        let csv = 'Body,X,Y,Z,VX,VY,VZ,Mass\n';
        
        Object.entries(data.bodies).forEach(([name, body]) => {
            csv += `${name},${body.position.join(',')},${body.velocity.join(',')},${body.mass}\n`;
        });
        
        return csv;
    }
    
    /**
     * Convert data to XML format
     */
    convertToXML(data) {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<simulation>\n';
        xml += `  <timestamp>${data.timestamp}</timestamp>\n`;
        xml += `  <mode>${data.mode}</mode>\n`;
        xml += '  <bodies>\n';
        
        Object.entries(data.bodies).forEach(([name, body]) => {
            xml += `    <body name="${name}">\n`;
            xml += `      <position>${body.position.join(',')}</position>\n`;
            xml += `      <velocity>${body.velocity.join(',')}</velocity>\n`;
            xml += `      <mass>${body.mass}</mass>\n`;
            xml += '    </body>\n';
        });
        
        xml += '  </bodies>\n</simulation>';
        return xml;
    }
    
    /**
     * Download file helper
     */
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Dispose of UI resources
     */
    dispose() {
        // Remove event listeners and clean up UI elements
        Object.values(this.featurePanels).forEach(panel => {
            if (panel && panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }
        });
        
        const physicsToggle = this.uiElements.get('physicsToggle');
        if (physicsToggle && physicsToggle.parentNode) {
            physicsToggle.parentNode.removeChild(physicsToggle);
        }
        
        this.uiElements.clear();
        console.log('Advanced Physics UI disposed');
    }
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPhysicsUI;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.AdvancedPhysicsUI = AdvancedPhysicsUI;
}