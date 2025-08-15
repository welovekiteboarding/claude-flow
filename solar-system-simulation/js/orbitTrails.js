// Orbit Trails - Orbital Mechanics Specialist Agent
// Real NASA orbital mechanics with 1/4 green trailing orbit lines

class OrbitTrails {
    constructor(scene, nasaOrbitalMechanics) {
        this.scene = scene;
        this.nasaOrbitalMechanics = nasaOrbitalMechanics;
        this.trails = new Map();
        this.trailGroup = new THREE.Group();
        this.trailGroup.name = 'orbitTrails';
        this.scene.add(this.trailGroup);
        
        // Trail configuration
        this.config = {
            trailLength: 0.25,           // 1/4 of orbit (25%)
            pointCount: 64,              // Points per trail
            color: 0x00ff44,             // Green color
            opacity: 0.6,
            lineWidth: 2,
            fadeEffect: true,
            updateInterval: 100,         // ms between updates
            visible: true,
            realtimeUpdate: true
        };
        
        this.lastUpdateTime = 0;
        this.currentDate = new Date();
        
        // LOD settings for performance
        this.lodSettings = {
            high: { pointCount: 128, updateInterval: 50 },
            medium: { pointCount: 64, updateInterval: 100 },
            low: { pointCount: 32, updateInterval: 200 }
        };
        
        console.log('OrbitTrails initialized with NASA orbital mechanics');
    }
    
    setLOD(level) {
        const settings = this.lodSettings[level];
        if (settings) {
            this.config.pointCount = settings.pointCount;
            this.config.updateInterval = settings.updateInterval;
            this.regenerateAllTrails();
        }
    }
    
    createPlanetTrail(planetName, planetData) {
        if (!this.nasaOrbitalMechanics || !NASA_ORBITAL_ELEMENTS[planetName]) {
            console.warn(`Cannot create trail for ${planetName}: missing orbital data`);
            return null;
        }
        
        try {
            const trailPoints = this.calculateOrbitTrail(planetName, this.currentDate);
            
            if (trailPoints.length === 0) {
                console.warn(`No trail points generated for ${planetName}`);
                return null;
            }
            
            const trail = this.createTrailMesh(trailPoints, planetName);
            this.trailGroup.add(trail);
            
            this.trails.set(planetName, {
                mesh: trail,
                points: trailPoints,
                lastUpdate: Date.now(),
                planetData: planetData,
                currentPosition: 0
            });
            
            console.log(`Created orbit trail for ${planetName} with ${trailPoints.length} points`);
            return trail;
            
        } catch (error) {
            console.error(`Failed to create trail for ${planetName}:`, error);
            return null;
        }
    }
    
    calculateOrbitTrail(planetName, currentDate) {
        const points = [];
        const pointCount = this.config.pointCount;
        const trailLength = this.config.trailLength;
        
        try {
            // Get orbital elements for the planet
            const planetElements = NASA_ORBITAL_ELEMENTS[planetName];
            if (!planetElements) {
                throw new Error(`No orbital elements found for ${planetName}`);
            }
            
            // Calculate orbital period in days
            const semiMajorAxis = planetElements.semiMajorAxis;
            const orbitalPeriod = this.calculateOrbitalPeriod(semiMajorAxis);
            
            // Calculate time span for 1/4 orbit trail
            const trailTimeSpan = orbitalPeriod * trailLength; // days
            const timeStep = trailTimeSpan / pointCount; // days per point
            
            // Generate points going backwards in time from current position
            for (let i = 0; i < pointCount; i++) {
                const timeOffset = -i * timeStep; // Go backwards in time
                const trailDate = new Date(currentDate.getTime() + timeOffset * 24 * 60 * 60 * 1000);
                
                const position = this.calculatePlanetPosition(planetName, trailDate);
                if (position) {
                    // Convert to simulation coordinates
                    const simPos = this.nasaOrbitalMechanics.convertToSimulationCoordinates(position);
                    points.push(new THREE.Vector3(simPos.x, simPos.y, simPos.z));
                }
            }
            
        } catch (error) {
            console.error(`Error calculating orbit trail for ${planetName}:`, error);
        }
        
        return points;
    }
    
    calculatePlanetPosition(planetName, date) {
        try {
            const julianDay = this.nasaOrbitalMechanics.getJulianDay(date);
            const planetElements = NASA_ORBITAL_ELEMENTS[planetName];
            
            // Calculate orbital elements at the given time
            const elements = this.nasaOrbitalMechanics.calculateOrbitalElements(planetElements, julianDay);
            
            // Calculate heliocentric position
            const position = this.nasaOrbitalMechanics.calculateHeliocentricPosition(elements, julianDay);
            
            return position;
            
        } catch (error) {
            console.error(`Error calculating position for ${planetName}:`, error);
            return null;
        }
    }
    
    calculateOrbitalPeriod(semiMajorAxis) {
        // Kepler's third law: P² = a³ (in units where G*M_sun = 1)
        // Return period in days
        return Math.sqrt(semiMajorAxis * semiMajorAxis * semiMajorAxis) * 365.25;
    }
    
    createMoonTrail(moonName, parentPlanetName, currentDate) {
        if (moonName === 'Moon' && parentPlanetName === 'earth') {
            // Special case for Earth's Moon - use geocentric coordinates
            return this.createLunarTrail(currentDate);
        }
        
        // For other moons, create simplified circular trails
        // This would need expansion for full accuracy
        console.log(`Moon trail creation for ${moonName} not yet implemented`);
        return null;
    }
    
    createLunarTrail(currentDate) {
        const points = [];
        const pointCount = this.config.pointCount;
        const lunarPeriod = 27.321661; // days
        const trailTimeSpan = lunarPeriod * this.config.trailLength;
        const timeStep = trailTimeSpan / pointCount;
        
        try {
            for (let i = 0; i < pointCount; i++) {
                const timeOffset = -i * timeStep;
                const trailDate = new Date(currentDate.getTime() + timeOffset * 24 * 60 * 60 * 1000);
                const julianDay = this.nasaOrbitalMechanics.getJulianDay(trailDate);
                
                const moonPos = this.nasaOrbitalMechanics.calculateLunarPosition(julianDay);
                if (moonPos) {
                    // Convert to simulation scale
                    const scale = 1e-7; // Adjust as needed
                    points.push(new THREE.Vector3(
                        moonPos.x * scale,
                        moonPos.z * scale,
                        -moonPos.y * scale
                    ));
                }
            }
            
            if (points.length > 0) {
                const trail = this.createTrailMesh(points, 'moon');
                this.trailGroup.add(trail);
                
                this.trails.set('moon', {
                    mesh: trail,
                    points: points,
                    lastUpdate: Date.now(),
                    currentPosition: 0
                });
                
                console.log(`Created lunar trail with ${points.length} points`);
                return trail;
            }
            
        } catch (error) {
            console.error('Error creating lunar trail:', error);
        }
        
        return null;
    }
    
    createTrailMesh(points, planetName) {
        if (points.length < 2) {
            console.warn(`Insufficient points for ${planetName} trail`);
            return new THREE.Group();
        }
        
        // Create geometry
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create colors for fade effect
        const colors = [];
        const alphas = [];
        
        for (let i = 0; i < points.length; i++) {
            const alpha = this.config.fadeEffect ? 
                (i / points.length) * this.config.opacity : 
                this.config.opacity;
            
            colors.push(
                ((this.config.color >> 16) & 255) / 255,  // R
                ((this.config.color >> 8) & 255) / 255,   // G
                (this.config.color & 255) / 255          // B
            );
            alphas.push(alpha);
        }
        
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geometry.setAttribute('alpha', new THREE.Float32BufferAttribute(alphas, 1));
        
        // Create material
        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: this.config.opacity,
            blending: THREE.AdditiveBlending,
            linewidth: this.config.lineWidth
        });
        
        // Create line
        const line = new THREE.Line(geometry, material);
        line.name = `${planetName}_trail`;
        line.userData = { type: 'orbit_trail', planet: planetName };
        
        return line;
    }
    
    updateTrails(currentDate, force = false) {
        if (!this.config.realtimeUpdate && !force) return;
        
        const now = Date.now();
        if (now - this.lastUpdateTime < this.config.updateInterval && !force) return;
        
        this.currentDate = currentDate;
        this.lastUpdateTime = now;
        
        this.trails.forEach((trailData, planetName) => {
            this.updateSingleTrail(planetName, trailData, currentDate);
        });
    }
    
    updateSingleTrail(planetName, trailData, currentDate) {
        try {
            // Recalculate trail points
            const newPoints = planetName === 'moon' ? 
                this.calculateLunarTrailPoints(currentDate) :
                this.calculateOrbitTrail(planetName, currentDate);
            
            if (newPoints.length > 0) {
                // Update geometry
                const geometry = trailData.mesh.geometry;
                geometry.setFromPoints(newPoints);
                geometry.attributes.position.needsUpdate = true;
                
                trailData.points = newPoints;
                trailData.lastUpdate = Date.now();
            }
            
        } catch (error) {
            console.error(`Error updating trail for ${planetName}:`, error);
        }
    }
    
    calculateLunarTrailPoints(currentDate) {
        const points = [];
        const pointCount = this.config.pointCount;
        const lunarPeriod = 27.321661;
        const trailTimeSpan = lunarPeriod * this.config.trailLength;
        const timeStep = trailTimeSpan / pointCount;
        
        for (let i = 0; i < pointCount; i++) {
            const timeOffset = -i * timeStep;
            const trailDate = new Date(currentDate.getTime() + timeOffset * 24 * 60 * 60 * 1000);
            const julianDay = this.nasaOrbitalMechanics.getJulianDay(trailDate);
            
            const moonPos = this.nasaOrbitalMechanics.calculateLunarPosition(julianDay);
            if (moonPos) {
                const scale = 1e-7;
                points.push(new THREE.Vector3(
                    moonPos.x * scale,
                    moonPos.z * scale,
                    -moonPos.y * scale
                ));
            }
        }
        
        return points;
    }
    
    regenerateAllTrails() {
        // Clear existing trails
        this.clearAllTrails();
        
        // Recreate trails with current settings
        Object.keys(NASA_ORBITAL_ELEMENTS).forEach(planetName => {
            const planetData = PLANETARY_DATA[planetName];
            if (planetData) {
                this.createPlanetTrail(planetName, planetData);
            }
        });
        
        // Recreate moon trail if needed
        if (PLANETARY_DATA.earth && PLANETARY_DATA.earth.moons) {
            this.createMoonTrail('Moon', 'earth', this.currentDate);
        }
    }
    
    setVisibility(visible) {
        this.config.visible = visible;
        this.trailGroup.visible = visible;
    }
    
    setColor(color) {
        this.config.color = color;
        
        this.trails.forEach((trailData) => {
            const geometry = trailData.mesh.geometry;
            const colors = [];
            const pointCount = geometry.attributes.position.count;
            
            for (let i = 0; i < pointCount; i++) {
                colors.push(
                    ((color >> 16) & 255) / 255,
                    ((color >> 8) & 255) / 255,
                    (color & 255) / 255
                );
            }
            
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.attributes.color.needsUpdate = true;
        });
    }
    
    setOpacity(opacity) {
        this.config.opacity = opacity;
        
        this.trails.forEach((trailData) => {
            trailData.mesh.material.opacity = opacity;
        });
    }
    
    setTrailLength(length) {
        this.config.trailLength = Math.max(0.1, Math.min(1.0, length));
        this.regenerateAllTrails();
    }
    
    getTrailCount() {
        return this.trails.size;
    }
    
    getTrail(planetName) {
        return this.trails.get(planetName);
    }
    
    clearAllTrails() {
        this.trails.forEach((trailData) => {
            this.trailGroup.remove(trailData.mesh);
            trailData.mesh.geometry.dispose();
            trailData.mesh.material.dispose();
        });
        this.trails.clear();
    }
    
    dispose() {
        this.clearAllTrails();
        this.scene.remove(this.trailGroup);
    }
    
    // Configuration methods
    getConfig() {
        return { ...this.config };
    }
    
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        
        if (newConfig.pointCount || newConfig.trailLength) {
            this.regenerateAllTrails();
        }
        
        if (newConfig.visible !== undefined) {
            this.setVisibility(newConfig.visible);
        }
        
        if (newConfig.color !== undefined) {
            this.setColor(newConfig.color);
        }
        
        if (newConfig.opacity !== undefined) {
            this.setOpacity(newConfig.opacity);
        }
    }
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrbitTrails;
}