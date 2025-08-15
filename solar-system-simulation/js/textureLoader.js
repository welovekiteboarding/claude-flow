// Texture Loader - Texture & Rendering Specialist Agent
// High-performance texture loading and management system

class TextureLoader {
    constructor() {
        this.loader = new THREE.TextureLoader();
        this.loadingManager = new THREE.LoadingManager();
        this.cache = new Map();
        this.loadedTextures = 0;
        this.totalTextures = 0;
        this.loadingCallbacks = [];
        
        this.setupLoadingManager();
    }
    
    setupLoadingManager() {
        this.loadingManager.onLoad = () => {
            console.log('All textures loaded successfully');
            this.loadingCallbacks.forEach(callback => callback('complete'));
        };
        
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            console.log(`Loading progress: ${progress.toFixed(1)}% (${url})`);
            this.loadingCallbacks.forEach(callback => callback('progress', progress, url));
        };
        
        this.loadingManager.onError = (url) => {
            console.error(`Failed to load texture: ${url}`);
            this.loadingCallbacks.forEach(callback => callback('error', url));
        };
        
        this.loader.manager = this.loadingManager;
    }
    
    onProgress(callback) {
        this.loadingCallbacks.push(callback);
    }
    
    async loadTexture(url, options = {}) {
        console.log('🎨 TEXTURE DEBUG: loadTexture called with URL:', url);
        console.log('🎨 TEXTURE DEBUG: options:', options);
        
        if (!url) {
            console.warn('🎨 TEXTURE DEBUG: No texture URL provided');
            return null;
        }
        
        // Check cache first
        if (this.cache.has(url)) {
            console.log('🎨 TEXTURE DEBUG: Using cached texture for:', url);
            return this.cache.get(url);
        }
        
        console.log('🎨 TEXTURE DEBUG: Starting texture load for:', url);
        
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (texture) => {
                    console.log('🎨 TEXTURE DEBUG: ✅ Successfully loaded texture:', url);
                    console.log('🎨 TEXTURE DEBUG: Texture dimensions:', texture.image.width, 'x', texture.image.height);
                    
                    // Configure texture settings
                    this.configureTexture(texture, options);
                    
                    // Cache the texture
                    this.cache.set(url, texture);
                    
                    console.log('🎨 TEXTURE DEBUG: Texture configured and cached');
                    console.log('🎨 TEXTURE DEBUG: Texture ready for material application');
                    resolve(texture);
                },
                (progress) => {
                    console.log('🎨 TEXTURE DEBUG: Loading progress for', url, ':', progress);
                },
                (error) => {
                    console.error('🎨 TEXTURE DEBUG: ❌ Failed to load texture:', url, error);
                    console.log('🎨 TEXTURE DEBUG: Creating fallback texture with color:', options.color || 0xffffff);
                    
                    const fallbackTexture = this.createDefaultTexture(options.color || 0xffffff);
                    console.log('🎨 TEXTURE DEBUG: Fallback texture created:', fallbackTexture);
                    
                    this.cache.set(url, fallbackTexture);
                    resolve(fallbackTexture);
                }
            );
        });
    }
    
    // Enhanced texture loading with progressive support
    async loadTextureProgressive(planetData, textureType = 'textureUrl', onProgress) {
        // Connect to TEXTURE_MANAGER for progressive loading
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            // Link the texture manager to this loader
            TEXTURE_MANAGER.loadSingleTexture = this.loadTexture.bind(this);
            
            return await TEXTURE_MANAGER.loadTextureProgressive(planetData, textureType, onProgress);
        }
        
        // Fallback to regular loading if TEXTURE_MANAGER is not available
        const url = planetData[textureType];
        return await this.loadTexture(url);
    }
    
    // Load texture with fallback URLs
    async loadTextureWithFallback(urls, options = {}) {
        if (!Array.isArray(urls)) {
            urls = [urls];
        }
        
        for (const url of urls) {
            if (!url) continue;
            
            try {
                const texture = await this.loadTexture(url, options);
                if (texture) {
                    return texture;
                }
            } catch (error) {
                console.warn(`Failed to load texture from ${url}:`, error);
                continue;
            }
        }
        
        // If all URLs fail, return a default texture
        console.warn('All texture URLs failed, using default texture');
        return this.createDefaultTexture(options.color || 0xffffff);
    }
    
    configureTexture(texture, options = {}) {
        // Set wrapping
        texture.wrapS = options.wrapS || THREE.RepeatWrapping;
        texture.wrapT = options.wrapT || THREE.RepeatWrapping;
        
        // Set filtering for better quality
        texture.magFilter = options.magFilter || THREE.LinearFilter;
        texture.minFilter = options.minFilter || THREE.LinearMipmapLinearFilter;
        
        // Enable anisotropic filtering for better quality at angles
        const maxAnisotropy = options.maxAnisotropy || 16;
        texture.anisotropy = Math.min(maxAnisotropy, this.getMaxAnisotropy());
        
        // Set repeat if specified
        if (options.repeat) {
            texture.repeat.set(options.repeat.x || 1, options.repeat.y || 1);
        }
        
        // Generate mipmaps
        texture.generateMipmaps = options.generateMipmaps !== false;
        
        return texture;
    }
    
    getMaxAnisotropy() {
        // This would be set by the renderer context
        return 16; // Default value
    }
    
    createDefaultTexture(color = 0xffffff, size = 512) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size / 2; // Equirectangular projection
        
        const context = canvas.getContext('2d');
        
        // Create a realistic planet-like texture with gradient and noise
        const gradient = context.createRadialGradient(size/2, size/4, 0, size/2, size/4, size/3);
        
        // Convert hex color to RGB
        const r = (color >> 16) & 255;
        const g = (color >> 8) & 255;
        const b = color & 255;
        
        gradient.addColorStop(0, `rgb(${Math.min(255, r + 50)}, ${Math.min(255, g + 50)}, ${Math.min(255, b + 50)})`);
        gradient.addColorStop(0.5, `rgb(${r}, ${g}, ${b})`);
        gradient.addColorStop(1, `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`);
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size / 2);
        
        // Add surface texture noise
        const imageData = context.getImageData(0, 0, size, size / 2);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 40;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        
        context.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.configureTexture(texture);
        
        console.log(`Created enhanced fallback texture for color #${color.toString(16).padStart(6, '0')}`);
        return texture;
    }
    
    createProceduralTexture(type, options = {}) {
        const size = options.size || 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        
        switch (type) {
            case 'stars':
                return this.createStarsTexture(canvas, context, options);
            case 'clouds':
                return this.createCloudsTexture(canvas, context, options);
            case 'rings':
                return this.createRingsTexture(canvas, context, options);
            case 'atmosphere':
                return this.createAtmosphereTexture(canvas, context, options);
            default:
                return this.createDefaultTexture(options.color);
        }
    }
    
    createStarsTexture(canvas, context, options) {
        const size = canvas.width;
        const starCount = options.starCount || 1000;
        
        // Black background
        context.fillStyle = '#000000';
        context.fillRect(0, 0, size, size);
        
        // Generate stars
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const brightness = Math.random();
            const starSize = Math.random() * 2 + 0.5;
            
            context.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            context.beginPath();
            context.arc(x, y, starSize, 0, 2 * Math.PI);
            context.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        this.configureTexture(texture, {
            wrapS: THREE.RepeatWrapping,
            wrapT: THREE.RepeatWrapping
        });
        
        return texture;
    }
    
    createCloudsTexture(canvas, context, options) {
        const size = canvas.width;
        
        // Create cloud-like noise pattern
        const imageData = context.createImageData(size, size);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % size;
            const y = Math.floor((i / 4) / size);
            
            // Generate noise for clouds
            const noise = this.noise(x * 0.01, y * 0.01) * 0.5 + 0.5;
            const cloud = Math.pow(noise, 2) * 255;
            
            data[i] = cloud;     // Red
            data[i + 1] = cloud; // Green
            data[i + 2] = cloud; // Blue
            data[i + 3] = cloud; // Alpha
        }
        
        context.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.configureTexture(texture);
        
        return texture;
    }
    
    createRingsTexture(canvas, context, options) {
        const size = canvas.width;
        const centerX = size / 2;
        const centerY = size / 2;
        
        const imageData = context.createImageData(size, size);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const x = (i / 4) % size;
            const y = Math.floor((i / 4) / size);
            
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const normalizedDistance = distance / (size / 2);
            
            // Create ring pattern
            const ringValue = Math.sin(normalizedDistance * Math.PI * 20) * 0.5 + 0.5;
            const alpha = (1 - normalizedDistance) * ringValue * 255;
            
            data[i] = 200;     // Red
            data[i + 1] = 180; // Green
            data[i + 2] = 120; // Blue
            data[i + 3] = alpha; // Alpha
        }
        
        context.putImageData(imageData, 0, 0);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.configureTexture(texture);
        
        return texture;
    }
    
    createAtmosphereTexture(canvas, context, options) {
        const size = canvas.width;
        const gradient = context.createRadialGradient(
            size/2, size/2, 0,
            size/2, size/2, size/2
        );
        
        gradient.addColorStop(0, 'rgba(135, 206, 250, 0.8)');
        gradient.addColorStop(0.7, 'rgba(135, 206, 250, 0.3)');
        gradient.addColorStop(1, 'rgba(135, 206, 250, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);
        
        const texture = new THREE.CanvasTexture(canvas);
        this.configureTexture(texture);
        
        return texture;
    }
    
    // Simple noise function for procedural generation
    noise(x, y) {
        const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        return n - Math.floor(n);
    }
    
    async preloadAllTextures() {
        const textureUrls = TEXTURE_MANAGER.preloadTextures();
        const loadPromises = [];
        
        console.log(`Preloading ${textureUrls.length} textures...`);
        
        for (const url of textureUrls) {
            loadPromises.push(this.loadTexture(url));
        }
        
        try {
            await Promise.all(loadPromises);
            console.log('All textures preloaded successfully');
            return true;
        } catch (error) {
            console.error('Error preloading textures:', error);
            return false;
        }
    }
    
    dispose() {
        // Clean up textures
        this.cache.forEach(texture => {
            texture.dispose();
        });
        this.cache.clear();
    }
    
    getMemoryUsage() {
        let totalMemory = 0;
        this.cache.forEach(texture => {
            const image = texture.image;
            if (image && image.width && image.height) {
                // Rough estimate: width * height * 4 bytes per pixel
                totalMemory += image.width * image.height * 4;
            }
        });
        
        return {
            textures: this.cache.size,
            memoryMB: (totalMemory / (1024 * 1024)).toFixed(2)
        };
    }
}

// Global singleton instance for use across the application
window.textureLoader = new TextureLoader();

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextureLoader;
}