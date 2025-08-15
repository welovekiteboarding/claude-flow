// Enhanced Planet Texture Generator
// Creates realistic planet textures when external URLs fail

class PlanetTextureGenerator {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 1024;
        this.canvas.height = 512;
        this.ctx = this.canvas.getContext('2d');
    }
    
    generatePlanetTexture(planetName) {
        const config = this.getPlanetConfig(planetName);
        this.ctx.clearRect(0, 0, 1024, 512);
        
        // Create base surface
        this.createBaseTexture(config);
        
        // Add planet-specific features
        switch(planetName.toLowerCase()) {
            case 'mercury':
                this.addCraters();
                break;
            case 'venus':
                this.addClouds(config.colors.accent);
                break;
            case 'mars':
                this.addMarsFeatures();
                break;
            case 'jupiter':
                this.addGasGiantBands(config.colors);
                break;
            case 'saturn':
                this.addGasGiantBands(config.colors);
                break;
            case 'uranus':
                this.addIceGiantFeatures(config.colors);
                break;
            case 'neptune':
                this.addIceGiantFeatures(config.colors);
                this.addStorms();
                break;
            case 'sun':
                this.addSolarFlares();
                break;
        }
        
        return new THREE.CanvasTexture(this.canvas);
    }
    
    getPlanetConfig(planetName) {
        const configs = {
            mercury: {
                colors: { base: '#8c7853', accent: '#a0906b', dark: '#6b5d42' },
                roughness: 0.9
            },
            venus: {
                colors: { base: '#ffc649', accent: '#ffd700', dark: '#e6b13a' },
                roughness: 0.3
            },
            mars: {
                colors: { base: '#cd5c5c', accent: '#e67e22', dark: '#a0443b' },
                roughness: 0.8
            },
            jupiter: {
                colors: { base: '#d8ca9d', accent: '#f39c12', dark: '#b8a082' },
                roughness: 0.1
            },
            saturn: {
                colors: { base: '#fab27b', accent: '#e8ac65', dark: '#d19654' },
                roughness: 0.1
            },
            uranus: {
                colors: { base: '#4fd0e7', accent: '#3498db', dark: '#2e86c1' },
                roughness: 0.2
            },
            neptune: {
                colors: { base: '#4b70dd', accent: '#2980b9', dark: '#1f4e79' },
                roughness: 0.2
            },
            sun: {
                colors: { base: '#ffeb3b', accent: '#ff9800', dark: '#f57c00' },
                roughness: 0.0
            }
        };
        
        return configs[planetName.toLowerCase()] || configs.mercury;
    }
    
    createBaseTexture(config) {
        // Create spherical gradient mapping
        const imageData = this.ctx.createImageData(1024, 512);
        const data = imageData.data;
        
        for (let y = 0; y < 512; y++) {
            for (let x = 0; x < 1024; x++) {
                const index = (y * 1024 + x) * 4;
                
                // Convert to spherical coordinates
                const lon = (x / 1024) * 2 * Math.PI;
                const lat = (y / 512) * Math.PI;
                
                // Calculate lighting based on sphere position
                const nx = Math.sin(lat) * Math.cos(lon);
                const ny = Math.cos(lat);
                const nz = Math.sin(lat) * Math.sin(lon);
                
                // Simple lighting calculation
                const light = Math.max(0.2, nx * 0.8 + 0.2);
                
                // Add noise for surface variation
                const noise = this.noise(x * 0.01, y * 0.01) * 0.3 + 0.7;
                
                // Blend base and accent colors
                const baseColor = this.hexToRgb(config.colors.base);
                const accentColor = this.hexToRgb(config.colors.accent);
                
                const blend = noise * light;
                
                data[index] = baseColor.r * (1 - blend) + accentColor.r * blend;
                data[index + 1] = baseColor.g * (1 - blend) + accentColor.g * blend;
                data[index + 2] = baseColor.b * (1 - blend) + accentColor.b * blend;
                data[index + 3] = 255;
            }
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    addCraters() {
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const radius = Math.random() * 20 + 5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    addClouds(color) {
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        
        for (let i = 0; i < 300; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const radius = Math.random() * 30 + 10;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.globalCompositeOperation = 'source-over';
    }
    
    addMarsFeatures() {
        // Add polar ice caps
        this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
        this.ctx.fillRect(0, 0, 1024, 40);
        this.ctx.fillRect(0, 472, 1024, 40);
        
        // Add dust storms
        this.ctx.fillStyle = 'rgba(139,69,19,0.3)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const width = Math.random() * 100 + 50;
            const height = Math.random() * 20 + 10;
            
            this.ctx.fillRect(x, y, width, height);
        }
    }
    
    addGasGiantBands(colors) {
        const bandCount = 15 + Math.random() * 10;
        const bandHeight = 512 / bandCount;
        
        for (let i = 0; i < bandCount; i++) {
            const intensity = Math.random();
            const color = intensity > 0.5 ? colors.accent : colors.base;
            
            this.ctx.fillStyle = this.addAlpha(color, 0.7);
            this.ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
            
            // Add band variations
            for (let j = 0; j < 20; j++) {
                const x = Math.random() * 1024;
                const y = i * bandHeight + Math.random() * bandHeight;
                const width = Math.random() * 200 + 50;
                const height = Math.random() * 5 + 2;
                
                this.ctx.fillStyle = this.addAlpha(colors.dark, 0.3);
                this.ctx.fillRect(x, y, width, height);
            }
        }
    }
    
    addIceGiantFeatures(colors) {
        // Create smooth gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 512);
        gradient.addColorStop(0, colors.accent);
        gradient.addColorStop(0.5, colors.base);
        gradient.addColorStop(1, colors.dark);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 1024, 512);
    }
    
    addStorms() {
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const radius = Math.random() * 40 + 20;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    addSolarFlares() {
        const gradient = this.ctx.createRadialGradient(512, 256, 100, 512, 256, 300);
        gradient.addColorStop(0, '#ffeb3b');
        gradient.addColorStop(0.5, '#ff9800');
        gradient.addColorStop(1, '#f57c00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, 1024, 512);
        
        // Add flare effects
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const radius = Math.random() * 10 + 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // Utility functions
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    addAlpha(color, alpha) {
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
    }
}

// Initialize and patch texture loader IMMEDIATELY
window.planetTextureGenerator = new PlanetTextureGenerator();

// Patch the texture loader immediately when this script loads
(function() {
    function patchTextureLoader() {
        if (typeof textureLoader !== 'undefined' && textureLoader.loadTexture) {
            const originalLoadTexture = textureLoader.loadTexture;
            textureLoader.loadTexture = async function(url, options = {}) {
                console.log(`Attempting to load texture: ${url}`);
                
                try {
                    const texture = await originalLoadTexture.call(this, url, options);
                    console.log(`Successfully loaded texture: ${url}`);
                    return texture;
                } catch (error) {
                    console.log(`Texture failed, generating procedural texture for: ${url}`);
                    
                    // Extract planet name from URL
                    const planetNames = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun', 'moon'];
                    let planetName = 'mercury'; // default
                    
                    for (const name of planetNames) {
                        if (url.toLowerCase().includes(name)) {
                            planetName = name;
                            break;
                        }
                    }
                    
                    const proceduralTexture = window.planetTextureGenerator.generatePlanetTexture(planetName);
                    console.log(`Generated procedural ${planetName} texture`);
                    return proceduralTexture;
                }
            };
            
            console.log('Enhanced planet texture generator installed and ready');
            return true;
        }
        return false;
    }
    
    // Try to patch immediately
    if (!patchTextureLoader()) {
        // If not available yet, retry periodically
        const retryInterval = setInterval(() => {
            if (patchTextureLoader()) {
                clearInterval(retryInterval);
            }
        }, 100);
        
        // Stop trying after 5 seconds
        setTimeout(() => clearInterval(retryInterval), 5000);
    }
})();