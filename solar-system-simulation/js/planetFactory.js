// Planet Factory - 3D Graphics Specialist Agent
// High-performance planet creation with NASA orbital integration

class PlanetFactory {
    constructor(scene, textureLoader, nasaOrbitalMechanics) {
        this.scene = scene;
        this.textureLoader = textureLoader;
        this.nasaOrbitalMechanics = nasaOrbitalMechanics;
        this.planets = new Map();
        this.moons = new Map();
        this.qualitySettings = 'medium';
        this.objectCount = 0;
        
        // Quality presets
        this.qualityPresets = {
            low: { segments: 16, textureSize: 512, shadowQuality: 'low' },
            medium: { segments: 32, textureSize: 1024, shadowQuality: 'medium' },
            high: { segments: 64, textureSize: 2048, shadowQuality: 'high' },
            ultra: { segments: 128, textureSize: 4096, shadowQuality: 'ultra' }
        };
        
        this.setupLighting();
    }
    
    setupLighting() {
        // Primary sun light
        this.sunLight = new THREE.PointLight(0xffffff, 1, 0);
        this.sunLight.position.set(0, 0, 0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.1;
        this.sunLight.shadow.camera.far = 200;
        this.scene.add(this.sunLight);
        
        // Ambient light for visibility
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        this.scene.add(this.ambientLight);
    }
    
    setQuality(quality) {
        this.qualitySettings = quality;
        // Trigger planet recreation if needed
    }
    
    async createPlanet(planetName, planetData, useNASAPosition = true) {
        console.log(`🪐 PLANET DEBUG: Creating ${planetName}...`);
        console.log(`🪐 PLANET DEBUG: Planet data:`, planetData);
        
        const quality = this.qualityPresets[this.qualitySettings];
        console.log(`🪐 PLANET DEBUG: Quality settings:`, quality);
        
        const group = new THREE.Group();
        group.name = planetName;
        
        try {
            // Create main planet
            console.log(`🪐 PLANET DEBUG: Creating mesh for ${planetName}`);
            const planet = await this.createPlanetMesh(planetData, quality);
            console.log(`🪐 PLANET DEBUG: Mesh created for ${planetName}:`, planet);
            group.add(planet);
            
            // Add special effects
            if (planetName === 'sun') {
                this.addSunGlow(group, planetData);
            } else if (planetName === 'earth') {
                await this.addEarthAtmosphere(group, planetData, quality);
                await this.addEarthClouds(group, planetData, quality);
            } else if (planetName === 'venus') {
                await this.addVenusAtmosphere(group, planetData, quality);
            } else if (planetName === 'saturn') {
                await this.addSaturnRings(group, planetData, quality);
            }
            
            // Add moons
            if (planetData.moons && planetData.moons.length > 0) {
                await this.addMoons(group, planetData.moons, quality);
            }
            
            // Set initial position
            if (useNASAPosition) {
                this.updatePlanetPosition(group, planetName, new Date());
            } else {
                group.position.set(planetData.displayDistance || 0, 0, 0);
            }
            
            // Store reference
            this.planets.set(planetName, {
                group: group,
                planet: planet,
                data: planetData,
                animationData: {
                    rotationSpeed: this.calculateRotationSpeed(planetData),
                    orbitSpeed: planetData.orbitSpeed || 0
                }
            });
            
            this.scene.add(group);
            this.objectCount++;
            
            console.log(`Created planet: ${planetName}`);
            return group;
            
        } catch (error) {
            console.error(`Failed to create planet ${planetName}:`, error);
            return this.createFallbackPlanet(planetData, quality);
        }
    }
    
    async createPlanetMesh(planetData, quality) {
        const radius = planetData.displayRadius || 1;
        const geometry = new THREE.SphereGeometry(radius, quality.segments, quality.segments / 2);
        
        // Load textures
        const textures = await this.loadPlanetTextures(planetData);
        
        // Create material based on planet type
        let material;
        
        console.log(`🪐 PLANET DEBUG: Creating material for ${planetData.name}, textures available:`, Object.keys(textures));
        
        if (planetData.name === 'Sun') {
            material = this.createSunMaterial(textures);
        } else if (planetData.gasGiant) {
            material = this.createGasGiantMaterial(textures, planetData);
        } else if (planetData.iceGiant) {
            material = this.createIceGiantMaterial(textures, planetData);
        } else {
            material = this.createTerrestrialMaterial(textures, planetData);
        }
        
        console.log(`🪐 PLANET DEBUG: Material created for ${planetData.name}:`, material);
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = planetData.name !== 'Sun';
        mesh.receiveShadow = planetData.name !== 'Sun';
        mesh.userData = { type: 'planet', name: planetData.name };
        
        return mesh;
    }
    
    async loadPlanetTextures(planetData) {
        console.log(`🎨 TEXTURE LOADING DEBUG: Loading textures for:`, planetData.name);
        console.log(`🎨 TEXTURE LOADING DEBUG: Planet data:`, planetData);
        
        const textures = {};
        const texturePromises = [];
        
        // Enhanced progressive texture loading
        const loadTextureProgressive = async (textureType, textureName) => {
            console.log(`🎨 TEXTURE LOADING DEBUG: Loading ${textureName} for ${planetData.name}`);
            console.log(`🎨 TEXTURE LOADING DEBUG: Texture type: ${textureType}, URL:`, planetData[textureType]);
            
            try {
                const texture = await this.textureLoader.loadTextureProgressive(
                    planetData,
                    textureType,
                    (loadedTexture, quality) => {
                        console.log(`🎨 TEXTURE LOADING DEBUG: Progressive callback - ${textureName} loaded with quality:`, quality);
                        // Progressive update callback
                        console.log(`Loaded ${textureName} for ${planetData.name} (${quality} quality)`);
                        textures[textureName] = loadedTexture;
                        
                        // Trigger material update if needed
                        this.updatePlanetMaterial(planetData.name, textures);
                    }
                );
                
                if (texture) {
                    textures[textureName] = texture;
                }
            } catch (error) {
                console.warn(`Failed to load ${textureName} for ${planetData.name}:`, error);
                
                // Try fallback loading
                const fallbackUrls = this.getFallbackUrls(planetData, textureType);
                if (fallbackUrls.length > 0) {
                    try {
                        const fallbackTexture = await this.textureLoader.loadTextureWithFallback(fallbackUrls);
                        textures[textureName] = fallbackTexture;
                    } catch (fallbackError) {
                        console.warn(`Fallback texture loading failed for ${textureName}:`, fallbackError);
                    }
                }
            }
        };
        
        // Load all texture types
        const textureTypes = [
            { type: 'textureUrl', name: 'map' },
            { type: 'normalMapUrl', name: 'normalMap' },
            { type: 'specularMapUrl', name: 'specularMap' },
            { type: 'cloudsUrl', name: 'cloudsMap' },
            { type: 'nightMapUrl', name: 'nightMap' },
            { type: 'atmosphereUrl', name: 'atmosphereMap' }
        ];
        
        textureTypes.forEach(({ type, name }) => {
            if (planetData[type]) {
                texturePromises.push(loadTextureProgressive(type, name));
            }
        });
        
        // Wait for all textures to load
        await Promise.all(texturePromises);
        
        return textures;
    }
    
    // Get fallback URLs for a texture type
    getFallbackUrls(planetData, textureType) {
        const backupKey = textureType.replace('Url', 'UrlBackup');
        const fallbackKey = textureType.replace('Url', 'UrlFallback');
        
        return [
            planetData[backupKey],
            planetData[fallbackKey]
        ].filter(url => url);
    }
    
    // Update planet material with new textures (for progressive loading)
    updatePlanetMaterial(planetName, textures) {
        const planetInfo = this.planets.get(planetName);
        if (!planetInfo || !planetInfo.planet) return;
        
        const material = planetInfo.planet.material;
        if (!material) return;
        
        console.log(`🎨 MATERIAL UPDATE: Updating material for ${planetName}`);
        console.log(`🎨 MATERIAL UPDATE: Available textures:`, textures);
        
        // Update material properties
        if (textures.map) {
            console.log(`🎨 MATERIAL UPDATE: Applying texture to ${planetName}`);
            material.map = textures.map;
        }
        
        // For MeshBasicMaterial, we don't need normal or specular maps
        // They don't affect the rendering anyway
        
        // CRITICAL: Mark material for update
        material.needsUpdate = true;
        
        console.log(`🎨 MATERIAL UPDATE: Material updated for ${planetName}`);
    }
    
    createSunMaterial(textures) {
        return new THREE.MeshBasicMaterial({
            map: textures.map || this.textureLoader.createDefaultTexture(0xffeb3b),
            emissive: new THREE.Color(0xffaa00),
            emissiveIntensity: 0.5
        });
    }
    
    createTerrestrialMaterial(textures, planetData) {
        console.log(`🎨 MATERIAL DEBUG: Creating terrestrial material for ${planetData.name}`);
        console.log(`🎨 MATERIAL DEBUG: Available textures:`, textures);
        console.log(`🎨 MATERIAL DEBUG: Main texture (map):`, textures.map);
        console.log(`🎨 MATERIAL DEBUG: Planet color fallback:`, planetData.color);
        
        // CRITICAL FIX: Use MeshBasicMaterial for reliable texture display
        // This matches the working implementation from immediate-fix.html
        const materialConfig = {
            color: planetData.color || 0xffffff
        };
        
        if (textures.map) {
            materialConfig.map = textures.map;
            console.log(`🎨 MATERIAL DEBUG: Using loaded texture for ${planetData.name}`);
        } else {
            // Keep the color as fallback if no texture
            console.log(`🎨 MATERIAL DEBUG: Using fallback color for ${planetData.name}:`, planetData.color);
        }
        
        // Use MeshBasicMaterial for guaranteed texture visibility
        const material = new THREE.MeshBasicMaterial(materialConfig);
        
        console.log(`🎨 MATERIAL DEBUG: Final material for ${planetData.name}:`, material);
        return material;
    }
    
    createGasGiantMaterial(textures, planetData) {
        const materialConfig = {
            color: planetData.color || 0xffffff,
            transparent: true,
            opacity: 0.95
        };
        
        if (textures.map) {
            materialConfig.map = textures.map;
        }
        
        // Use MeshBasicMaterial for reliable texture display
        return new THREE.MeshBasicMaterial(materialConfig);
    }
    
    createIceGiantMaterial(textures, planetData) {
        const materialConfig = {
            color: planetData.color || 0xffffff,
            emissive: new THREE.Color(planetData.color),
            emissiveIntensity: 0.1
        };
        
        if (textures.map) {
            materialConfig.map = textures.map;
        }
        
        // Use MeshBasicMaterial for reliable texture display
        return new THREE.MeshBasicMaterial(materialConfig);
    }
    
    addSunGlow(group, planetData) {
        const glowGeometry = new THREE.SphereGeometry(planetData.displayRadius * 1.5, 32, 16);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(planetData.glowColor || 0xffaa00) }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPositionNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec3 vNormal;
                varying vec3 vPositionNormal;
                void main() {
                    float intensity = pow(0.8 - dot(vNormal, vPositionNormal), 2.0);
                    intensity *= (0.8 + 0.2 * sin(time * 2.0));
                    gl_FragColor = vec4(color, intensity * 0.3);
                }
            `,
            blending: THREE.AdditiveBlending,
            transparent: true,
            side: THREE.BackSide
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        group.add(glow);
        group.userData.glow = glow;
    }
    
    async addEarthAtmosphere(group, planetData, quality) {
        const radius = planetData.displayRadius * 1.05;
        const geometry = new THREE.SphereGeometry(radius, quality.segments / 2, quality.segments / 4);
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x87ceeb,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(geometry, material);
        group.add(atmosphere);
    }
    
    async addEarthClouds(group, planetData, quality) {
        if (!planetData.cloudsUrl) return;
        
        try {
            const cloudTexture = await this.textureLoader.loadTexture(planetData.cloudsUrl);
            const cloudGeometry = new THREE.SphereGeometry(planetData.displayRadius * 1.01, quality.segments, quality.segments / 2);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: 0.8
            });
            
            const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
            group.add(clouds);
            group.userData.clouds = clouds;
        } catch (error) {
            console.warn('Failed to add Earth clouds:', error);
        }
    }
    
    async addVenusAtmosphere(group, planetData, quality) {
        const radius = planetData.displayRadius * 1.1;
        const geometry = new THREE.SphereGeometry(radius, quality.segments / 2, quality.segments / 4);
        
        const material = new THREE.MeshPhongMaterial({
            color: 0xffc649,
            transparent: true,
            opacity: 0.6,
            side: THREE.BackSide
        });
        
        const atmosphere = new THREE.Mesh(geometry, material);
        group.add(atmosphere);
    }
    
    async addSaturnRings(group, planetData, quality) {
        const innerRadius = planetData.ringInnerRadius || planetData.displayRadius * 1.2;
        const outerRadius = planetData.ringOuterRadius || planetData.displayRadius * 2.3;
        
        const geometry = new THREE.RingGeometry(innerRadius, outerRadius, quality.segments);
        
        let material;
        if (planetData.ringsUrl) {
            try {
                // Use progressive loading for ring texture
                const ringTexture = await this.textureLoader.loadTextureProgressive(
                    planetData,
                    'ringsUrl',
                    (loadedTexture, quality) => {
                        console.log(`Loaded Saturn rings texture (${quality} quality)`);
                        if (material) {
                            material.map = loadedTexture;
                            material.needsUpdate = true;
                        }
                    }
                );
                
                material = new THREE.MeshBasicMaterial({
                    map: ringTexture,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
            } catch (error) {
                console.warn('Failed to load Saturn ring texture:', error);
                material = this.createProceduralRingMaterial();
            }
        } else {
            material = this.createProceduralRingMaterial();
        }
        
        const rings = new THREE.Mesh(geometry, material);
        rings.rotation.x = Math.PI / 2;
        rings.rotation.z = planetData.tilt || 0;
        group.add(rings);
        group.userData.rings = rings;
    }
    
    createProceduralRingMaterial() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        
        // Create ring texture
        const gradient = context.createLinearGradient(0, 0, 1024, 0);
        gradient.addColorStop(0, 'rgba(200, 180, 120, 0)');
        gradient.addColorStop(0.3, 'rgba(200, 180, 120, 0.8)');
        gradient.addColorStop(0.7, 'rgba(180, 160, 100, 0.6)');
        gradient.addColorStop(1, 'rgba(160, 140, 80, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 1024, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        
        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
    }
    
    async addMoons(group, moons, quality) {
        for (const moonData of moons) {
            try {
                const moon = await this.createMoon(moonData, quality);
                group.add(moon);
                
                // Store moon reference
                const moonKey = `${group.name}_${moonData.name}`;
                this.moons.set(moonKey, {
                    mesh: moon,
                    data: moonData,
                    parent: group.name
                });
                
                this.objectCount++;
            } catch (error) {
                console.warn(`Failed to create moon ${moonData.name}:`, error);
            }
        }
    }
    
    async createMoon(moonData, quality) {
        const radius = moonData.displayRadius || 0.1;
        const distance = moonData.displayDistance || 2;
        
        // Lower quality for moons to optimize performance
        const moonQuality = Math.max(quality.segments / 4, 8);
        const geometry = new THREE.SphereGeometry(radius, moonQuality, moonQuality / 2);
        
        let material;
        if (moonData.textureUrl) {
            try {
                // Use progressive loading for moon texture
                const texture = await this.textureLoader.loadTextureProgressive(
                    moonData,
                    'textureUrl',
                    (loadedTexture, quality) => {
                        console.log(`Loaded ${moonData.name} texture (${quality} quality)`);
                        if (material) {
                            material.map = loadedTexture;
                            material.needsUpdate = true;
                        }
                    }
                );
                
                material = new THREE.MeshPhongMaterial({ map: texture });
            } catch (error) {
                console.warn(`Failed to load texture for ${moonData.name}:`, error);
                material = new THREE.MeshPhongMaterial({ 
                    color: moonData.color || 0xaaaaaa 
                });
            }
        } else {
            material = new THREE.MeshPhongMaterial({ 
                color: moonData.color || 0xaaaaaa 
            });
        }
        
        const moon = new THREE.Mesh(geometry, material);
        moon.position.set(distance, 0, 0);
        moon.castShadow = true;
        moon.receiveShadow = true;
        moon.userData = { 
            type: 'moon', 
            name: moonData.name,
            orbitRadius: distance,
            orbitSpeed: moonData.period ? (2 * Math.PI) / (moonData.period * 24 * 60 * 60) : 0.01,
            angle: Math.random() * Math.PI * 2
        };
        
        return moon;
    }
    
    createFallbackPlanet(planetData, quality) {
        const geometry = new THREE.SphereGeometry(planetData.displayRadius || 1, 16, 8);
        const material = new THREE.MeshPhongMaterial({ 
            color: planetData.color || 0xffffff 
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        const group = new THREE.Group();
        group.add(mesh);
        group.name = planetData.name + '_fallback';
        
        return group;
    }
    
    calculateRotationSpeed(planetData) {
        // Convert rotation period (days) to radians per second
        if (planetData.rotationPeriod && planetData.rotationPeriod !== 0) {
            return (2 * Math.PI) / (Math.abs(planetData.rotationPeriod) * 24 * 60 * 60);
        }
        return 0.001; // Default slow rotation
    }
    
    updatePlanetPosition(planetGroup, planetName, date) {
        if (!this.nasaOrbitalMechanics) return;
        
        try {
            const positions = this.nasaOrbitalMechanics.getAllPlanetPositions(date);
            const position = positions[planetName];
            
            if (position && planetGroup) {
                // Convert to simulation coordinates
                const simPos = this.nasaOrbitalMechanics.convertToSimulationCoordinates(position);
                planetGroup.position.set(simPos.x, simPos.y, simPos.z);
            }
        } catch (error) {
            console.warn(`Failed to update position for ${planetName}:`, error);
        }
    }
    
    animatePlanets(deltaTime, timeScale = 1) {
        const scaledDelta = deltaTime * timeScale;
        
        this.planets.forEach((planetInfo, name) => {
            const { group, planet, animationData, planetData } = planetInfo;
            
            // Rotate planet
            if (planet && animationData.rotationSpeed) {
                planet.rotation.y += animationData.rotationSpeed * scaledDelta;
            }
            
            // Smooth orbital movement using simple orbital simulation
            if (group && planetData && planetData.orbitSpeed) {
                // Update orbital angle smoothly
                if (!animationData.orbitalAngle) animationData.orbitalAngle = 0;
                animationData.orbitalAngle += planetData.orbitSpeed * scaledDelta * timeScale;
                
                // Calculate smooth orbital position
                const distance = planetData.displayDistance || 10;
                const x = Math.cos(animationData.orbitalAngle) * distance;
                const z = Math.sin(animationData.orbitalAngle) * distance;
                
                // Smooth interpolation to new position
                const lerpFactor = 0.1; // Smooth transition
                group.position.x += (x - group.position.x) * lerpFactor;
                group.position.z += (z - group.position.z) * lerpFactor;
            }
            
            // Animate special effects
            if (group.userData.glow) {
                group.userData.glow.material.uniforms.time.value += scaledDelta;
            }
            
            if (group.userData.clouds) {
                group.userData.clouds.rotation.y += animationData.rotationSpeed * scaledDelta * 0.8;
            }
            
            // Animate moons
            group.children.forEach(child => {
                if (child.userData.type === 'moon') {
                    child.userData.angle += child.userData.orbitSpeed * scaledDelta;
                    const radius = child.userData.orbitRadius;
                    child.position.x = Math.cos(child.userData.angle) * radius;
                    child.position.z = Math.sin(child.userData.angle) * radius;
                    
                    // Tidal locking - moon rotation matches orbit
                    child.rotation.y = child.userData.angle;
                }
            });
        });
    }
    
    updatePositions(date) {
        this.planets.forEach((planetInfo, name) => {
            this.updatePlanetPosition(planetInfo.group, name, date);
        });
    }
    
    getPlanet(name) {
        return this.planets.get(name);
    }
    
    getAllPlanets() {
        return Array.from(this.planets.values());
    }
    
    getObjectCount() {
        return this.objectCount;
    }
    
    dispose() {
        this.planets.forEach(planetInfo => {
            this.scene.remove(planetInfo.group);
            
            // Dispose geometries and materials
            planetInfo.group.traverse(child => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        });
        
        this.planets.clear();
        this.moons.clear();
        this.objectCount = 0;
    }
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlanetFactory;
}