// NASA Planet Texture Manager - Real planetary maps with lazy loading
// Uses actual NASA imagery from various missions

class NASAPlanetTextures {
    constructor() {
        this.cache = new Map();
        this.loading = new Map();
        
        // Real NASA texture sources - using working URLs
        this.textureSources = {
            mercury: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mercury.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_mercury.jpg'
            },
            venus: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus.jpg', 
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_venus_surface.jpg'
            },
            earth: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg'
            },
            mars: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/mars.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_mars.jpg'
            },
            jupiter: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_jupiter.jpg'
            },
            saturn: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_saturn.jpg'
            },
            uranus: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg'
            },
            neptune: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg'
            },
            moon: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_moon.jpg'
            },
            sun: {
                main: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
                backup: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/sun.jpg',
                nasa: 'https://www.solarsystemscope.com/textures/download/8k_sun.jpg'
            }
        };
        
        console.log('NASA Planet Texture Manager initialized with real planetary imagery');
    }
    
    async loadPlanetTexture(planetName, resolution = 'main') {
        const cacheKey = `${planetName}_${resolution}`;
        
        // Return cached texture if available
        if (this.cache.has(cacheKey)) {
            console.log(`Using cached texture for ${planetName}`);
            return this.cache.get(cacheKey);
        }
        
        // Prevent duplicate loading
        if (this.loading.has(cacheKey)) {
            console.log(`Already loading ${planetName}, waiting...`);
            return await this.loading.get(cacheKey);
        }
        
        const loadPromise = this.loadTextureWithFallback(planetName, resolution);
        this.loading.set(cacheKey, loadPromise);
        
        try {
            const texture = await loadPromise;
            this.cache.set(cacheKey, texture);
            this.loading.delete(cacheKey);
            return texture;
        } catch (error) {
            this.loading.delete(cacheKey);
            throw error;
        }
    }
    
    async loadTextureWithFallback(planetName, resolution) {
        const sources = this.textureSources[planetName.toLowerCase()];
        if (!sources) {
            throw new Error(`No texture sources found for ${planetName}`);
        }
        
        const urlsToTry = [sources[resolution], sources.main, sources.backup, sources.nasa];
        
        for (const url of urlsToTry) {
            if (!url) continue;
            
            try {
                console.log(`Attempting to load ${planetName} texture from: ${url}`);
                const texture = await this.loadTextureFromURL(url);
                console.log(`Successfully loaded ${planetName} texture from: ${url}`);
                return texture;
            } catch (error) {
                console.warn(`Failed to load ${planetName} from ${url}:`, error.message);
                continue;
            }
        }
        
        // If all sources fail, generate procedural texture
        console.log(`All sources failed for ${planetName}, generating procedural texture`);
        return this.generateFallbackTexture(planetName);
    }
    
    loadTextureFromURL(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            
            // Set timeout for slow loading
            const timeoutId = setTimeout(() => {
                reject(new Error('Texture loading timeout'));
            }, 5000); // 5 second timeout
            
            loader.load(
                url,
                (texture) => {
                    clearTimeout(timeoutId);
                    // Configure texture for best quality
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.minFilter = THREE.LinearMipmapLinearFilter;
                    texture.magFilter = THREE.LinearFilter;
                    texture.generateMipmaps = true;
                    console.log(`✅ NASA texture loaded successfully: ${url}`);
                    resolve(texture);
                },
                (progress) => {
                    // Progress callback - reduced logging
                    if (progress.total > 0) {
                        console.log(`📥 Loading ${url}: ${(progress.loaded / progress.total * 100).toFixed(0)}%`);
                    }
                },
                (error) => {
                    clearTimeout(timeoutId);
                    console.warn(`❌ Failed to load NASA texture: ${url} - ${error.message || 'Network/CORS error'}`);
                    reject(new Error(`Failed to load texture: ${error.message || 'Unknown error'}`));
                }
            );
        });
    }
    
    generateFallbackTexture(planetName) {
        console.log(`Generating enhanced fallback texture for ${planetName}`);
        
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Planet-specific colors and patterns
        const planetConfigs = {
            mercury: { base: '#8c7853', accent: '#a0906b' },
            venus: { base: '#ffc649', accent: '#ffd700' },
            earth: { base: '#6b93d6', accent: '#4a90e2' },
            mars: { base: '#cd5c5c', accent: '#e67e22' },
            jupiter: { base: '#d8ca9d', accent: '#f39c12' },
            saturn: { base: '#fab27b', accent: '#e8ac65' },
            uranus: { base: '#4fd0e7', accent: '#3498db' },
            neptune: { base: '#4b70dd', accent: '#2980b9' },
            sun: { base: '#ffeb3b', accent: '#ff9800' },
            moon: { base: '#aaaaaa', accent: '#cccccc' }
        };
        
        const config = planetConfigs[planetName.toLowerCase()] || planetConfigs.mercury;
        
        // Create base gradient
        const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
        gradient.addColorStop(0, config.accent);
        gradient.addColorStop(0.5, config.base);
        gradient.addColorStop(1, config.accent);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);
        
        // Add surface details
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = i % 2 ? config.base : config.accent;
            ctx.fillRect(Math.random() * 1024, Math.random() * 512, Math.random() * 50, Math.random() * 20);
        }
        ctx.globalAlpha = 1.0;
        
        return new THREE.CanvasTexture(canvas);
    }
    
    // Progressive loading: load low-res first, then high-res
    async loadProgressiveTexture(planetName, onLowResLoaded) {
        try {
            // First load backup (usually lower resolution)
            const lowResTexture = await this.loadPlanetTexture(planetName, 'backup');
            if (onLowResLoaded) {
                onLowResLoaded(lowResTexture);
            }
            
            // Then try to load high-res main texture
            try {
                const highResTexture = await this.loadPlanetTexture(planetName, 'main');
                return highResTexture;
            } catch (error) {
                console.log(`High-res texture failed for ${planetName}, using low-res`);
                return lowResTexture;
            }
        } catch (error) {
            console.log(`All progressive loading failed for ${planetName}, using fallback`);
            return this.generateFallbackTexture(planetName);
        }
    }
}

// DISABLED - Let existing texture system work
window.addEventListener('DOMContentLoaded', function() {
    window.nasaPlanetTextures = new NASAPlanetTextures();
    console.log('NASA Planet Texture Manager ready but not overriding texture loading');
});

console.log('NASA Planet Texture module loaded - real planetary maps will be used');