// Physics Integration Module
// Bridges advanced physics engine with existing solar system simulation

/**
 * Physics Integration Manager
 * Handles the interface between advanced physics and visualization
 */
class PhysicsIntegrationManager {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.physicsEngine = null;
        this.isAdvancedPhysicsEnabled = false;
        this.simulationMode = 'kepler'; // 'kepler' or 'nbody'
        
        // Physics update frequency
        this.physicsUpdateFrequency = 60; // Hz
        this.lastPhysicsUpdate = 0;
        this.physicsTimestep = 1 / this.physicsUpdateFrequency;
        
        // Coordinate transformation
        this.scaleFactor = 1e-9; // Convert meters to simulation units
        this.timeScale = 1.0;
        
        // Performance monitoring
        this.physicsPerformance = {
            updateTime: 0,
            calculationsPerSecond: 0,
            memoryUsage: 0
        };
        
        // Advanced features
        this.visualizationFeatures = {
            lagrangePoints: false,
            gravitationalField: false,
            tidalField: false,
            orbitTrajectories: true,
            relativisticEffects: false
        };
        
        console.log('Physics Integration Manager initialized');
    }
    
    /**
     * Initialize advanced physics engine
     */
    async initializeAdvancedPhysics() {
        try {
            // Create advanced physics engine
            this.physicsEngine = new AdvancedPhysicsEngine();
            
            // Wait for WebGL initialization
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Initialize celestial bodies with enhanced data
            this.initializeCelestialBodies();
            
            // Setup physics configuration
            this.configurePhysicsEngine();
            
            // Initialize visualization features
            this.initializeVisualizationFeatures();
            
            this.isAdvancedPhysicsEnabled = true;
            console.log('Advanced physics engine initialized successfully');
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize advanced physics:', error);
            this.isAdvancedPhysicsEnabled = false;
            return false;
        }
    }
    
    /**
     * Initialize celestial bodies in physics engine
     */
    initializeCelestialBodies() {
        if (!this.physicsEngine) return;
        
        // Add all major bodies to physics simulation
        for (const [bodyName, bodyData] of Object.entries(ENHANCED_BODY_DATA)) {
            // Get initial position from NASA orbital mechanics
            const nasaPosition = this.getNASAPosition(bodyName);
            const nasaVelocity = this.getNASAVelocity(bodyName);
            
            // Convert to physics simulation coordinates (meters)
            const position = this.convertToPhysicsCoordinates(nasaPosition);
            const velocity = this.convertToPhysicsVelocity(nasaVelocity);
            
            // Add body to physics engine
            this.physicsEngine.addCelestialBody(
                bodyName,
                bodyData.mass,
                position,
                velocity,
                bodyData.radius
            );
            
            console.log(`Added ${bodyName} to advanced physics simulation`);
        }
        
        // Calculate initial Lagrange points
        this.calculateLagrangePoints();
        
        console.log('All celestial bodies initialized in physics engine');
    }
    
    /**
     * Get NASA position for body
     */
    getNASAPosition(bodyName) {
        if (!this.solarSystem.nasaOrbitalMechanics) {
            return [0, 0, 0];
        }
        
        const currentTime = this.solarSystem.getSimulationTime();
        
        if (bodyName === 'sun') {
            return [0, 0, 0];
        }
        
        if (bodyName === 'moon') {
            // Get lunar position relative to Earth
            const lunarPos = this.solarSystem.nasaOrbitalMechanics.calculateLunarPosition(
                this.solarSystem.nasaOrbitalMechanics.getJulianDay(currentTime)
            );
            
            // Convert km to meters and add Earth's position
            const earthPos = this.getNASAPosition('earth');
            return [
                earthPos[0] + lunarPos.x * 1000,
                earthPos[1] + lunarPos.y * 1000,
                earthPos[2] + lunarPos.z * 1000
            ];
        }
        
        // Get planetary position
        const planetData = NASA_ORBITAL_ELEMENTS[bodyName];
        if (!planetData) return [0, 0, 0];
        
        const julianDay = this.solarSystem.nasaOrbitalMechanics.getJulianDay(currentTime);
        const elements = this.solarSystem.nasaOrbitalMechanics.calculateOrbitalElements(planetData, julianDay);
        const position = this.solarSystem.nasaOrbitalMechanics.calculateHeliocentricPosition(elements, julianDay);
        
        // Convert km to meters
        return [position.x * 1000, position.y * 1000, position.z * 1000];
    }
    
    /**
     * Get NASA velocity for body
     */
    getNASAVelocity(bodyName) {
        if (!this.solarSystem.nasaOrbitalMechanics) {
            return [0, 0, 0];
        }
        
        // Calculate velocity by finite difference
        const dt = 3600; // 1 hour
        const currentTime = this.solarSystem.getSimulationTime();
        const futureTime = new Date(currentTime.getTime() + dt * 1000);
        
        const pos1 = this.getNASAPosition(bodyName);
        
        // Temporarily set future time
        const originalTime = this.solarSystem.simulationTime;
        this.solarSystem.simulationTime = futureTime;
        const pos2 = this.getNASAPosition(bodyName);
        this.solarSystem.simulationTime = originalTime;
        
        // Calculate velocity
        return [
            (pos2[0] - pos1[0]) / dt,
            (pos2[1] - pos1[1]) / dt,
            (pos2[2] - pos1[2]) / dt
        ];
    }
    
    /**
     * Convert visualization coordinates to physics coordinates
     */
    convertToPhysicsCoordinates(visualPosition) {
        // Convert from simulation units to meters
        return [
            visualPosition[0] / this.scaleFactor,
            visualPosition[1] / this.scaleFactor,
            visualPosition[2] / this.scaleFactor
        ];
    }
    
    /**
     * Convert physics coordinates to visualization coordinates
     */
    convertToVisualizationCoordinates(physicsPosition) {
        return {
            x: physicsPosition[0] * this.scaleFactor,
            y: physicsPosition[2] * this.scaleFactor, // Y-up in Three.js
            z: -physicsPosition[1] * this.scaleFactor // Correct handedness
        };
    }
    
    /**
     * Convert visualization velocity to physics velocity
     */
    convertToPhysicsVelocity(visualVelocity) {
        return [
            visualVelocity[0] / this.scaleFactor,
            visualVelocity[1] / this.scaleFactor,
            visualVelocity[2] / this.scaleFactor
        ];
    }
    
    /**
     * Configure physics engine parameters
     */
    configurePhysicsEngine() {
        if (!this.physicsEngine) return;
        
        // Set physics options from configuration
        this.physicsEngine.setPhysicsOptions({
            nBodyGravity: ADVANCED_SIMULATION_CONFIG.enableNBodyGravity,
            relativisticEffects: ADVANCED_SIMULATION_CONFIG.enableRelativisticEffects,
            tidalForces: ADVANCED_SIMULATION_CONFIG.enableTidalForces,
            perturbations: ADVANCED_SIMULATION_CONFIG.enableJ2Perturbations,
            timestep: ADVANCED_SIMULATION_CONFIG.maxTimestep
        });
        
        console.log('Physics engine configured with advanced parameters');
    }
    
    /**
     * Calculate Lagrange points for major systems
     */
    calculateLagrangePoints() {
        if (!this.physicsEngine) return;
        
        for (const system of LAGRANGE_SYSTEMS) {
            const primaryBody = this.physicsEngine.bodies.get(system.primary);
            const secondaryBody = this.physicsEngine.bodies.get(system.secondary);
            
            if (primaryBody && secondaryBody) {
                const lagrangePoints = this.physicsEngine.calculateLagrangePoints(primaryBody, secondaryBody);
                console.log(`Calculated Lagrange points for ${system.name}:`, lagrangePoints);
            }
        }
    }
    
    /**
     * Initialize visualization features
     */
    initializeVisualizationFeatures() {
        if (!this.physicsEngine || !this.solarSystem.scene) return;
        
        // Initialize gravitational field visualization
        if (this.visualizationFeatures.gravitationalField) {
            this.physicsEngine.gravityField.generateFieldVisualization(this.solarSystem.scene);
        }
        
        // Add Lagrange point markers
        if (this.visualizationFeatures.lagrangePoints) {
            this.addLagrangePointMarkers();
        }
        
        console.log('Visualization features initialized');
    }
    
    /**
     * Add Lagrange point markers to scene
     */
    addLagrangePointMarkers() {
        if (!this.solarSystem.scene) return;
        
        const lagrangeGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const lagrangeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff6600,
            transparent: true,
            opacity: 0.7
        });
        
        for (const [systemName, points] of this.physicsEngine.lagrangePoints) {
            Object.entries(points).forEach(([pointName, position]) => {
                const visualPos = this.convertToVisualizationCoordinates(position);
                
                const marker = new THREE.Mesh(lagrangeGeometry, lagrangeMaterial);
                marker.position.set(visualPos.x, visualPos.y, visualPos.z);
                marker.name = `${systemName}-${pointName}`;
                
                this.solarSystem.scene.add(marker);
            });
        }
        
        console.log('Lagrange point markers added to scene');
    }
    
    /**
     * Update physics simulation
     */
    update(deltaTime) {
        if (!this.isAdvancedPhysicsEnabled || !this.physicsEngine) {
            return;
        }
        
        const currentTime = performance.now();
        
        // Check if it's time for physics update
        if (currentTime - this.lastPhysicsUpdate < 1000 / this.physicsUpdateFrequency) {
            return;
        }
        
        const physicsStartTime = performance.now();
        
        // Update physics simulation
        if (this.simulationMode === 'nbody') {
            this.physicsEngine.integrate(deltaTime * this.timeScale);
            this.updateVisualizationFromPhysics();
        }
        
        // Update precession effects
        this.updatePrecessionEffects();
        
        // Update Lagrange points
        if (this.visualizationFeatures.lagrangePoints) {
            this.updateLagrangePointPositions();
        }
        
        // Update performance metrics
        this.physicsPerformance.updateTime = performance.now() - physicsStartTime;
        this.physicsPerformance.calculationsPerSecond = 1 / (deltaTime || 0.016);
        
        this.lastPhysicsUpdate = currentTime;
    }
    
    /**
     * Update visualization from physics simulation
     */
    updateVisualizationFromPhysics() {
        if (!this.physicsEngine || !this.solarSystem.planetFactory) return;
        
        // Update planet positions from physics engine
        for (const [bodyName, body] of this.physicsEngine.bodies) {
            const planet = this.solarSystem.planets.get(bodyName);
            if (planet && planet.mesh) {
                const visualPos = this.convertToVisualizationCoordinates(body.position);
                planet.mesh.position.set(visualPos.x, visualPos.y, visualPos.z);
            }
        }
    }
    
    /**
     * Update precession effects
     */
    updatePrecessionEffects() {
        if (!this.physicsEngine) return;
        
        // Update Earth's axial precession
        const earthPrecession = this.physicsEngine.calculatePrecession('earth');
        if (earthPrecession) {
            const earthPlanet = this.solarSystem.planets.get('earth');
            if (earthPlanet && earthPlanet.mesh) {
                // Apply precession rotation to Earth
                earthPlanet.mesh.rotation.z = earthPrecession.axialPrecession;
            }
        }
        
        // Update Mercury's perihelion precession
        const mercuryPrecession = this.physicsEngine.calculatePrecession('mercury');
        if (mercuryPrecession) {
            // Mercury's orbital precession affects its orbit visualization
            // This would be handled by the orbit trails system
        }
    }
    
    /**
     * Update Lagrange point positions
     */
    updateLagrangePointPositions() {
        if (!this.solarSystem.scene) return;
        
        // Recalculate Lagrange points
        this.calculateLagrangePoints();
        
        // Update marker positions
        for (const [systemName, points] of this.physicsEngine.lagrangePoints) {
            Object.entries(points).forEach(([pointName, position]) => {
                const markerName = `${systemName}-${pointName}`;
                const marker = this.solarSystem.scene.getObjectByName(markerName);
                
                if (marker) {
                    const visualPos = this.convertToVisualizationCoordinates(position);
                    marker.position.set(visualPos.x, visualPos.y, visualPos.z);
                }
            });
        }
    }
    
    /**
     * Switch between simulation modes
     */
    setSimulationMode(mode) {
        if (mode !== 'kepler' && mode !== 'nbody') {
            console.warn('Invalid simulation mode:', mode);
            return;
        }
        
        this.simulationMode = mode;
        
        if (mode === 'nbody' && !this.isAdvancedPhysicsEnabled) {
            console.warn('N-body mode requested but advanced physics not available, using Kepler mode');
            this.simulationMode = 'kepler';
        }
        
        console.log(`Simulation mode set to: ${this.simulationMode}`);
    }
    
    /**
     * Enable/disable visualization features
     */
    setVisualizationFeature(feature, enabled) {
        if (!(feature in this.visualizationFeatures)) {
            console.warn('Unknown visualization feature:', feature);
            return;
        }
        
        this.visualizationFeatures[feature] = enabled;
        
        // Apply changes immediately
        switch (feature) {
            case 'lagrangePoints':
                if (enabled) {
                    this.addLagrangePointMarkers();
                } else {
                    this.removeLagrangePointMarkers();
                }
                break;
                
            case 'gravitationalField':
                if (enabled && this.physicsEngine) {
                    this.physicsEngine.gravityField.generateFieldVisualization(this.solarSystem.scene);
                } else if (this.physicsEngine) {
                    this.physicsEngine.gravityField.dispose();
                }
                break;
                
            case 'relativisticEffects':
                if (this.physicsEngine) {
                    this.physicsEngine.enableRelativisticEffects = enabled;
                }
                break;
        }
        
        console.log(`Visualization feature ${feature} ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    /**
     * Remove Lagrange point markers
     */
    removeLagrangePointMarkers() {
        if (!this.solarSystem.scene) return;
        
        const markersToRemove = [];
        
        this.solarSystem.scene.traverse((object) => {
            if (object.name && object.name.includes('L1') || object.name.includes('L2') || 
                object.name.includes('L3') || object.name.includes('L4') || object.name.includes('L5')) {
                markersToRemove.push(object);
            }
        });
        
        markersToRemove.forEach(marker => {
            this.solarSystem.scene.remove(marker);
            if (marker.geometry) marker.geometry.dispose();
            if (marker.material) marker.material.dispose();
        });
        
        console.log('Lagrange point markers removed');
    }
    
    /**
     * Get physics performance statistics
     */
    getPhysicsPerformance() {
        const baseStats = this.physicsPerformance;
        
        if (this.physicsEngine) {
            const engineStats = this.physicsEngine.getPerformanceStats();
            return {
                ...baseStats,
                ...engineStats,
                mode: this.simulationMode,
                advancedPhysicsEnabled: this.isAdvancedPhysicsEnabled
            };
        }
        
        return {
            ...baseStats,
            mode: this.simulationMode,
            advancedPhysicsEnabled: this.isAdvancedPhysicsEnabled
        };
    }
    
    /**
     * Set time scale for physics simulation
     */
    setTimeScale(scale) {
        this.timeScale = scale;
        
        if (this.physicsEngine) {
            // Adjust timestep based on time scale
            const adjustedTimestep = ADVANCED_SIMULATION_CONFIG.maxTimestep / scale;
            this.physicsEngine.timestep = Math.max(
                ADVANCED_SIMULATION_CONFIG.minTimestep,
                Math.min(ADVANCED_SIMULATION_CONFIG.maxTimestep, adjustedTimestep)
            );
        }
        
        console.log(`Physics time scale set to ${scale}x`);
    }
    
    /**
     * Export simulation data
     */
    exportSimulationData() {
        if (!this.physicsEngine) return null;
        
        const data = {
            timestamp: Date.now(),
            simulationTime: this.solarSystem.getSimulationTime().toISOString(),
            mode: this.simulationMode,
            bodies: {}
        };
        
        // Export body data
        for (const [name, body] of this.physicsEngine.bodies) {
            data.bodies[name] = {
                position: [...body.position],
                velocity: [...body.velocity],
                mass: body.mass,
                force: [...body.force]
            };
        }
        
        // Export Lagrange points
        data.lagrangePoints = {};
        for (const [systemName, points] of this.physicsEngine.lagrangePoints) {
            data.lagrangePoints[systemName] = points;
        }
        
        // Export performance data
        data.performance = this.getPhysicsPerformance();
        
        return data;
    }
    
    /**
     * Cleanup resources
     */
    dispose() {
        if (this.physicsEngine) {
            this.physicsEngine.dispose();
        }
        
        // Remove visualization features
        this.removeLagrangePointMarkers();
        
        console.log('Physics Integration Manager disposed');
    }
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicsIntegrationManager;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.PhysicsIntegrationManager = PhysicsIntegrationManager;
}