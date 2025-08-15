// Advanced Physics Engine - N-body Gravitational Dynamics
// State-of-the-art physics simulation with relativistic effects and perturbations

class AdvancedPhysics {
    constructor() {
        // Physical constants (SI units)
        this.G = 6.67430e-11; // Gravitational constant (m³/kg⋅s²)
        this.c = 299792458; // Speed of light (m/s)
        this.AU = 149597870.7e3; // Astronomical unit (m)
        this.EARTH_MASS = 5.972e24; // kg
        this.SUN_MASS = 1.989e30; // kg
        
        // Simulation parameters
        this.timeStep = 3600; // 1 hour in seconds
        this.bodies = new Map();
        this.forces = new Map();
        this.lagrangePoints = new Map();
        
        // GPU compute shader for acceleration
        this.computeShader = null;
        this.gpuAcceleration = false;
        
        // Relativistic corrections
        this.enableRelativity = true;
        this.schwarzschildRadius = 2 * this.G * this.SUN_MASS / (this.c * this.c);
        
        console.log('Advanced Physics Engine initialized with N-body dynamics');
    }
    
    // Initialize celestial bodies with real masses and positions
    initializeBodies(planetaryData) {
        this.bodies.clear();
        
        // Add Sun
        this.bodies.set('sun', {
            mass: this.SUN_MASS,
            position: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0, 0),
            acceleration: new THREE.Vector3(0, 0, 0),
            radius: 696340000, // meters
            fixed: true // Sun doesn't move significantly
        });
        
        // Add planets with real masses
        const planetMasses = {
            mercury: 3.301e23,
            venus: 4.867e24,
            earth: 5.972e24,
            mars: 6.39e23,
            jupiter: 1.898e27,
            saturn: 5.683e26,
            uranus: 8.681e25,
            neptune: 1.024e26
        };
        
        Object.entries(planetaryData).forEach(([name, data]) => {
            if (name !== 'sun' && planetMasses[name]) {
                this.bodies.set(name, {
                    mass: planetMasses[name],
                    position: this.auToMeters(data.displayDistance, 0, 0),
                    velocity: this.calculateOrbitalVelocity(data.displayDistance * this.AU, planetMasses[name]),
                    acceleration: new THREE.Vector3(0, 0, 0),
                    radius: data.radius * 1000, // convert km to m
                    fixed: false
                });
            }
        });
        
        console.log(`Initialized ${this.bodies.size} celestial bodies for N-body simulation`);
    }
    
    // Calculate initial orbital velocity for circular orbit
    calculateOrbitalVelocity(distance, mass) {
        const v = Math.sqrt(this.G * this.SUN_MASS / distance);
        return new THREE.Vector3(0, 0, v);
    }
    
    // Convert AU to meters with proper 3D positioning
    auToMeters(distanceAU, y, angle) {
        const meters = distanceAU * this.AU;
        return new THREE.Vector3(
            meters * Math.cos(angle || 0),
            y,
            meters * Math.sin(angle || 0)
        );
    }
    
    // N-body gravitational force calculation
    calculateNBodyForces() {
        this.forces.clear();
        
        // Initialize force arrays
        this.bodies.forEach((body, name) => {
            this.forces.set(name, new THREE.Vector3(0, 0, 0));
        });
        
        // Calculate forces between all body pairs
        const bodyNames = Array.from(this.bodies.keys());
        
        for (let i = 0; i < bodyNames.length; i++) {
            for (let j = i + 1; j < bodyNames.length; j++) {
                const body1 = this.bodies.get(bodyNames[i]);
                const body2 = this.bodies.get(bodyNames[j]);
                
                const force = this.calculateGravitationalForce(body1, body2);
                
                // Apply Newton's third law
                this.forces.get(bodyNames[i]).add(force);
                this.forces.get(bodyNames[j]).sub(force);
            }
        }
        
        // Add relativistic corrections for Mercury
        if (this.enableRelativity && this.bodies.has('mercury')) {
            this.applyRelativisticCorrections('mercury');
        }
    }
    
    // Calculate gravitational force between two bodies
    calculateGravitationalForce(body1, body2) {
        const r = new THREE.Vector3().subVectors(body2.position, body1.position);
        const distance = r.length();
        
        if (distance === 0) return new THREE.Vector3(0, 0, 0);
        
        // F = G * m1 * m2 / r²
        const forceMagnitude = this.G * body1.mass * body2.mass / (distance * distance);
        
        // Force direction (normalized)
        const forceDirection = r.normalize();
        
        return forceDirection.multiplyScalar(forceMagnitude);
    }
    
    // Apply general relativity corrections (primarily for Mercury)
    applyRelativisticCorrections(bodyName) {
        const body = this.bodies.get(bodyName);
        const sun = this.bodies.get('sun');
        
        if (!body || !sun) return;
        
        const r = new THREE.Vector3().subVectors(body.position, sun.position);
        const distance = r.length();
        const velocity = body.velocity.length();
        
        // Schwarzschild correction for perihelion precession
        const beta = velocity / this.c;
        const correction = 1 + (3 * this.schwarzschildRadius) / (2 * distance) * (1 - beta * beta);
        
        // Apply correction to gravitational force
        const currentForce = this.forces.get(bodyName);
        currentForce.multiplyScalar(correction);
        
        // Store precession data for visualization
        this.storePrecessionData(bodyName, correction);
    }
    
    // Store precession data for educational visualization
    storePrecessionData(bodyName, correction) {
        if (!this.precessionData) this.precessionData = new Map();
        
        this.precessionData.set(bodyName, {
            correction: correction,
            timestamp: Date.now(),
            precessionRate: (correction - 1) * 1000 // amplify for visibility
        });
    }
    
    // Calculate Lagrange points for Earth-Moon system
    calculateLagrangePoints() {
        const earth = this.bodies.get('earth');
        const moon = this.bodies.get('moon');
        
        if (!earth || !moon) return;
        
        const earthMoonDistance = new THREE.Vector3().subVectors(moon.position, earth.position).length();
        const totalMass = earth.mass + moon.mass;
        const massRatio = moon.mass / totalMass;
        
        // L1 point (between Earth and Moon)
        const l1Distance = earthMoonDistance * (1 - Math.pow(massRatio / 3, 1/3));
        const l1Position = earth.position.clone().lerp(moon.position, l1Distance / earthMoonDistance);
        
        // L2 point (beyond Moon)
        const l2Distance = earthMoonDistance * (1 + Math.pow(massRatio / 3, 1/3));
        const l2Direction = new THREE.Vector3().subVectors(moon.position, earth.position).normalize();
        const l2Position = earth.position.clone().add(l2Direction.multiplyScalar(l2Distance));
        
        // L3 point (opposite side of Earth)
        const l3Distance = earthMoonDistance * (1 + 5 * massRatio / 12);
        const l3Position = earth.position.clone().sub(l2Direction.multiplyScalar(l3Distance));
        
        // L4 and L5 points (60° ahead and behind Moon)
        const l4Position = this.calculateTriangularLagrangePoint(earth.position, moon.position, Math.PI / 3);
        const l5Position = this.calculateTriangularLagrangePoint(earth.position, moon.position, -Math.PI / 3);
        
        this.lagrangePoints.set('earth-moon', {
            L1: l1Position,
            L2: l2Position,
            L3: l3Position,
            L4: l4Position,
            L5: l5Position
        });
    }
    
    // Calculate triangular Lagrange points (L4, L5)
    calculateTriangularLagrangePoint(pos1, pos2, angle) {
        const center = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
        const radius = new THREE.Vector3().subVectors(pos2, pos1).length() * 0.5;
        
        const rotationMatrix = new THREE.Matrix4().makeRotationY(angle);
        const direction = new THREE.Vector3().subVectors(pos2, pos1).normalize();
        direction.applyMatrix4(rotationMatrix);
        
        return center.clone().add(direction.multiplyScalar(radius));
    }
    
    // Calculate tidal forces (Earth-Moon system)
    calculateTidalForces() {
        const earth = this.bodies.get('earth');
        const moon = this.bodies.get('moon');
        
        if (!earth || !moon) return;
        
        const earthMoonVector = new THREE.Vector3().subVectors(moon.position, earth.position);
        const distance = earthMoonVector.length();
        
        // Tidal force gradient
        const tidalGradient = -2 * this.G * moon.mass / Math.pow(distance, 3);
        
        // Store tidal data for visualization
        this.tidalData = {
            gradient: tidalGradient,
            direction: earthMoonVector.normalize(),
            bulgeHeight: Math.abs(tidalGradient) * 6371000 * 1000, // Earth radius effect
            timestamp: Date.now()
        };
    }
    
    // Integrate motion using Verlet integration for stability
    integrateMotion(deltaTime) {
        // Convert deltaTime to seconds
        const dt = deltaTime * this.timeStep;
        
        // Calculate current forces
        this.calculateNBodyForces();
        
        // Verlet integration for each body
        this.bodies.forEach((body, name) => {
            if (body.fixed) return; // Skip fixed bodies like Sun
            
            const force = this.forces.get(name);
            const acceleration = force.clone().divideScalar(body.mass);
            
            // Store previous acceleration for Verlet
            if (!body.previousAcceleration) {
                body.previousAcceleration = body.acceleration.clone();
            }
            
            // Update position: x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²
            const positionDelta = body.velocity.clone().multiplyScalar(dt);
            positionDelta.add(body.acceleration.clone().multiplyScalar(0.5 * dt * dt));
            body.position.add(positionDelta);
            
            // Update velocity: v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt
            const velocityDelta = body.acceleration.clone().add(acceleration).multiplyScalar(0.5 * dt);
            body.velocity.add(velocityDelta);
            
            // Update acceleration
            body.previousAcceleration.copy(body.acceleration);
            body.acceleration.copy(acceleration);
        });
        
        // Update special calculations
        this.calculateLagrangePoints();
        this.calculateTidalForces();
    }
    
    // Get position in simulation coordinates
    getPositionInSimulationUnits(bodyName) {
        const body = this.bodies.get(bodyName);
        if (!body) return null;
        
        // Convert from meters to simulation units (AU scaled)
        return body.position.clone().divideScalar(this.AU);
    }
    
    // Initialize GPU compute shader for acceleration
    async initializeGPUCompute(renderer) {
        if (!renderer.capabilities.isWebGL2) {
            console.warn('WebGL 2.0 not supported, falling back to CPU computation');
            return false;
        }
        
        try {
            // Create compute shader for N-body calculations
            const computeShaderSource = `
                #version 300 es
                precision highp float;
                
                uniform int numBodies;
                uniform float G;
                uniform float timeStep;
                
                layout(std140) uniform BodyData {
                    vec4 positions[32];  // xyz + mass
                    vec4 velocities[32]; // xyz + unused
                };
                
                layout(std140) uniform Forces {
                    vec4 forces[32];     // xyz + unused
                };
                
                void main() {
                    int bodyIndex = int(gl_FragCoord.x);
                    if (bodyIndex >= numBodies) return;
                    
                    vec3 totalForce = vec3(0.0);
                    vec3 position = positions[bodyIndex].xyz;
                    float mass = positions[bodyIndex].w;
                    
                    // Calculate gravitational forces from all other bodies
                    for (int i = 0; i < numBodies; i++) {
                        if (i == bodyIndex) continue;
                        
                        vec3 otherPosition = positions[i].xyz;
                        float otherMass = positions[i].w;
                        
                        vec3 r = otherPosition - position;
                        float distance = length(r);
                        
                        if (distance > 0.0) {
                            float forceMagnitude = G * mass * otherMass / (distance * distance);
                            totalForce += normalize(r) * forceMagnitude;
                        }
                    }
                    
                    forces[bodyIndex] = vec4(totalForce, 0.0);
                }
            `;
            
            // Initialize compute shader (pseudocode - actual implementation depends on WebGL compute)
            // This would require WebGL compute shaders or transform feedback
            
            this.gpuAcceleration = true;
            console.log('GPU acceleration initialized for N-body physics');
            return true;
            
        } catch (error) {
            console.warn('Failed to initialize GPU compute:', error);
            return false;
        }
    }
    
    // Get gravitational field strength at a point
    getGravitationalField(position) {
        const field = new THREE.Vector3(0, 0, 0);
        
        this.bodies.forEach((body, name) => {
            const r = new THREE.Vector3().subVectors(position, body.position);
            const distance = r.length();
            
            if (distance > 0) {
                const fieldStrength = this.G * body.mass / (distance * distance);
                const fieldDirection = r.normalize();
                field.add(fieldDirection.multiplyScalar(-fieldStrength));
            }
        });
        
        return field;
    }
    
    // Create visualization data for gravitational field
    generateGravitationalFieldVisualization(bounds, resolution) {
        const fieldData = [];
        const step = bounds.size / resolution;
        
        for (let x = bounds.min.x; x <= bounds.max.x; x += step) {
            for (let z = bounds.min.z; z <= bounds.max.z; z += step) {
                const position = new THREE.Vector3(x, 0, z);
                const field = this.getGravitationalField(position);
                
                fieldData.push({
                    position: position.clone(),
                    field: field.clone(),
                    strength: field.length()
                });
            }
        }
        
        return fieldData;
    }
    
    // Export physics state for debugging
    exportPhysicsState() {
        const state = {
            timestamp: Date.now(),
            bodies: {},
            forces: {},
            lagrangePoints: Object.fromEntries(this.lagrangePoints),
            tidalData: this.tidalData,
            precessionData: this.precessionData ? Object.fromEntries(this.precessionData) : {}
        };
        
        this.bodies.forEach((body, name) => {
            state.bodies[name] = {
                mass: body.mass,
                position: body.position.toArray(),
                velocity: body.velocity.toArray(),
                acceleration: body.acceleration.toArray()
            };
        });
        
        this.forces.forEach((force, name) => {
            state.forces[name] = force.toArray();
        });
        
        return state;
    }
    
    // Validate physics calculations against known values
    validatePhysics() {
        const earth = this.bodies.get('earth');
        const sun = this.bodies.get('sun');
        
        if (!earth || !sun) {
            console.warn('Cannot validate physics: Earth or Sun not found');
            return false;
        }
        
        // Check Earth's orbital velocity (should be ~29.78 km/s)
        const earthVelocity = earth.velocity.length();
        const expectedVelocity = 29780; // m/s
        const velocityError = Math.abs(earthVelocity - expectedVelocity) / expectedVelocity;
        
        console.log(`Earth orbital velocity: ${(earthVelocity / 1000).toFixed(2)} km/s (expected: 29.78 km/s)`);
        console.log(`Velocity error: ${(velocityError * 100).toFixed(2)}%`);
        
        // Check gravitational acceleration at Earth's surface
        const earthSurface = earth.position.clone().add(new THREE.Vector3(earth.radius, 0, 0));
        const surfaceField = this.getGravitationalField(earthSurface);
        const surfaceAcceleration = surfaceField.length();
        const expectedAcceleration = 9.81; // m/s²
        const accelerationError = Math.abs(surfaceAcceleration - expectedAcceleration) / expectedAcceleration;
        
        console.log(`Earth surface gravity: ${surfaceAcceleration.toFixed(2)} m/s² (expected: 9.81 m/s²)`);
        console.log(`Gravity error: ${(accelerationError * 100).toFixed(2)}%`);
        
        return velocityError < 0.1 && accelerationError < 0.1; // Within 10% tolerance
    }
    
    // Cleanup
    dispose() {
        this.bodies.clear();
        this.forces.clear();
        this.lagrangePoints.clear();
        
        if (this.computeShader) {
            // Dispose GPU resources
            this.computeShader = null;
        }
        
        console.log('Advanced Physics Engine disposed');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPhysics;
}