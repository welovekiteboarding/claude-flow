// Texture Preloader - Intelligent texture preloading system
// Handles background loading, prioritization, and bandwidth optimization

class TexturePreloader {
    constructor() {
        this.preloadQueue = [];
        this.currentLoading = new Set();
        this.maxConcurrentLoads = 3;
        this.loadingProgress = 0;
        this.priorityQueue = {
            high: [],
            medium: [],
            low: []
        };
        this.loadingStats = {
            totalTextures: 0,
            loadedTextures: 0,
            failedTextures: 0,
            bytesLoaded: 0,
            startTime: null,
            endTime: null
        };
        this.progressCallbacks = [];
        this.isPreloading = false;
        
        // Bandwidth detection
        this.connectionType = this.detectConnectionType();
        this.adaptiveLoading = true;
        
        // Browser storage for caching
        this.storageEnabled = this.checkStorageSupport();
        
        console.log(`Texture Preloader initialized. Connection: ${this.connectionType}, Storage: ${this.storageEnabled ? 'available' : 'unavailable'}`);
    }
    
    // Detect connection type for adaptive loading
    detectConnectionType() {
        if (navigator.connection) {
            const connection = navigator.connection;
            const effectiveType = connection.effectiveType;
            
            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                return 'slow';
            } else if (effectiveType === '3g') {
                return 'medium';
            } else if (effectiveType === '4g') {
                return 'fast';
            }
        }
        
        return 'unknown';
    }
    
    // Check if browser storage is available
    checkStorageSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Add texture to preload queue with priority
    addTextureToQueue(url, options = {}) {
        const priority = options.priority || 'medium';
        const planetName = options.planetName || 'unknown';
        const textureType = options.textureType || 'texture';
        const quality = options.quality || 'medium';
        
        const textureItem = {
            url,
            planetName,
            textureType,
            quality,
            priority,
            retryCount: 0,
            maxRetries: 3,
            options: options.textureOptions || {}
        };
        
        // Add to appropriate priority queue
        this.priorityQueue[priority].push(textureItem);
        this.loadingStats.totalTextures++;
        
        console.log(`Added texture to ${priority} priority queue: ${planetName} - ${textureType}`);
    }
    
    // Populate preload queue from planetary data
    populateFromPlanetaryData() {
        if (typeof PLANETARY_DATA === 'undefined') {
            console.error('PLANETARY_DATA not available');
            return;
        }
        
        // Prioritize planets based on visual importance
        const planetPriorities = {
            'earth': 'high',
            'sun': 'high',
            'mars': 'medium',
            'jupiter': 'medium',
            'saturn': 'medium',
            'venus': 'medium',
            'mercury': 'low',
            'uranus': 'low',
            'neptune': 'low'
        };
        
        Object.entries(PLANETARY_DATA).forEach(([planetName, planetData]) => {
            const priority = planetPriorities[planetName] || 'medium';
            
            // Add main texture
            if (planetData.textureUrl) {
                this.addTextureToQueue(planetData.textureUrl, {
                    planetName,
                    textureType: 'main',
                    priority,
                    quality: 'medium'
                });
            }
            
            // Add additional textures with lower priority
            const additionalTextures = [
                { url: planetData.normalMapUrl, type: 'normal' },
                { url: planetData.specularMapUrl, type: 'specular' },
                { url: planetData.cloudsUrl, type: 'clouds' },
                { url: planetData.nightMapUrl, type: 'night' },
                { url: planetData.atmosphereUrl, type: 'atmosphere' },
                { url: planetData.ringsUrl, type: 'rings' }
            ];
            
            additionalTextures.forEach(({ url, type }) => {
                if (url) {
                    this.addTextureToQueue(url, {
                        planetName,
                        textureType: type,
                        priority: priority === 'high' ? 'medium' : 'low',
                        quality: 'medium'
                    });
                }
            });
            
            // Add moon textures
            if (planetData.moons) {
                planetData.moons.forEach(moon => {
                    if (moon.textureUrl) {
                        this.addTextureToQueue(moon.textureUrl, {
                            planetName: `${planetName}-${moon.name}`,
                            textureType: 'moon',
                            priority: 'low',
                            quality: 'medium'
                        });
                    }
                });
            }
        });
        
        console.log(`Populated preload queue: ${this.loadingStats.totalTextures} textures total`);
    }
    
    // Start preloading process
    async startPreloading() {
        if (this.isPreloading) {
            console.log('Preloading already in progress');
            return;
        }
        
        this.isPreloading = true;
        this.loadingStats.startTime = Date.now();
        
        console.log('Starting texture preloading...');
        
        // Adjust concurrent loads based on connection
        this.adjustConcurrentLoads();
        
        // Start loading from priority queues
        await this.processQueues();
        
        this.isPreloading = false;
        this.loadingStats.endTime = Date.now();
        
        const loadTime = (this.loadingStats.endTime - this.loadingStats.startTime) / 1000;
        console.log(`Preloading completed in ${loadTime.toFixed(2)}s. Loaded: ${this.loadingStats.loadedTextures}/${this.loadingStats.totalTextures}`);
        
        // Notify completion
        this.notifyProgress(100, 'Preloading complete');
    }
    
    // Adjust concurrent loads based on connection type
    adjustConcurrentLoads() {
        switch (this.connectionType) {
            case 'slow':
                this.maxConcurrentLoads = 1;
                break;
            case 'medium':
                this.maxConcurrentLoads = 2;
                break;
            case 'fast':
                this.maxConcurrentLoads = 4;
                break;
            default:
                this.maxConcurrentLoads = 3;
        }
        
        console.log(`Adjusted concurrent loads to ${this.maxConcurrentLoads} for ${this.connectionType} connection`);
    }
    
    // Process priority queues
    async processQueues() {
        const allTextures = [
            ...this.priorityQueue.high,
            ...this.priorityQueue.medium,
            ...this.priorityQueue.low
        ];
        
        const loadPromises = [];
        
        for (const textureItem of allTextures) {
            // Wait if we have too many concurrent loads
            while (this.currentLoading.size >= this.maxConcurrentLoads) {
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            // Start loading
            const promise = this.loadTexture(textureItem);
            loadPromises.push(promise);
        }
        
        // Wait for all textures to load
        await Promise.allSettled(loadPromises);
    }
    
    // Load individual texture
    async loadTexture(textureItem) {
        this.currentLoading.add(textureItem.url);
        
        try {
            // Check cache first
            const cached = await this.checkCache(textureItem.url);
            if (cached) {
                console.log(`Texture loaded from cache: ${textureItem.planetName} - ${textureItem.textureType}`);
                this.loadingStats.loadedTextures++;
                this.updateProgress();
                return cached;
            }
            
            // Load from network
            const texture = await this.loadFromNetwork(textureItem);
            
            if (texture) {
                // Cache the texture
                await this.cacheTexture(textureItem.url, texture);
                
                this.loadingStats.loadedTextures++;
                console.log(`Texture loaded: ${textureItem.planetName} - ${textureItem.textureType}`);
            } else {
                this.loadingStats.failedTextures++;
                console.warn(`Failed to load texture: ${textureItem.planetName} - ${textureItem.textureType}`);
            }
            
            this.updateProgress();
            return texture;
            
        } catch (error) {
            this.loadingStats.failedTextures++;
            console.error(`Error loading texture ${textureItem.url}:`, error);
            
            // Retry if possible
            if (textureItem.retryCount < textureItem.maxRetries) {
                textureItem.retryCount++;
                console.log(`Retrying texture load (${textureItem.retryCount}/${textureItem.maxRetries}): ${textureItem.url}`);
                return this.loadTexture(textureItem);
            }
            
            this.updateProgress();
            return null;
        } finally {
            this.currentLoading.delete(textureItem.url);
        }
    }
    
    // Load texture from network
    async loadFromNetwork(textureItem) {
        return new Promise((resolve, reject) => {
            if (typeof textureLoader === 'undefined') {
                reject(new Error('textureLoader not available'));
                return;
            }
            
            textureLoader.loadTexture(textureItem.url, textureItem.options)
                .then(texture => {
                    resolve(texture);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
    
    // Check cache for texture
    async checkCache(url) {
        if (!this.storageEnabled) return null;
        
        try {
            const cacheKey = `texture_${btoa(url)}`;
            const cached = localStorage.getItem(cacheKey);
            
            if (cached) {
                // For this implementation, we'll just return true
                // In a real implementation, you'd reconstruct the texture from stored data
                return true;
            }
        } catch (error) {
            console.warn('Cache check failed:', error);
        }
        
        return null;
    }
    
    // Cache texture
    async cacheTexture(url, texture) {
        if (!this.storageEnabled) return;
        
        try {
            const cacheKey = `texture_${btoa(url)}`;
            // For this implementation, we'll just store the URL
            // In a real implementation, you'd store the texture data
            localStorage.setItem(cacheKey, url);
        } catch (error) {
            console.warn('Texture caching failed:', error);
        }
    }
    
    // Update loading progress
    updateProgress() {
        const progress = (this.loadingStats.loadedTextures / this.loadingStats.totalTextures) * 100;
        this.loadingProgress = progress;
        
        const status = `Loaded ${this.loadingStats.loadedTextures}/${this.loadingStats.totalTextures} textures`;
        this.notifyProgress(progress, status);
    }
    
    // Notify progress callbacks
    notifyProgress(progress, status) {
        this.progressCallbacks.forEach(callback => {
            callback(progress, status, this.loadingStats);
        });
    }
    
    // Add progress callback
    onProgress(callback) {
        this.progressCallbacks.push(callback);
    }
    
    // Clear cache
    clearCache() {
        if (!this.storageEnabled) return;
        
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('texture_')) {
                    localStorage.removeItem(key);
                }
            });
            
            console.log('Texture cache cleared');
        } catch (error) {
            console.warn('Cache clearing failed:', error);
        }
    }
    
    // Get loading statistics
    getStatistics() {
        return {
            ...this.loadingStats,
            loadingProgress: this.loadingProgress,
            connectionType: this.connectionType,
            maxConcurrentLoads: this.maxConcurrentLoads,
            currentLoading: this.currentLoading.size,
            queueSizes: {
                high: this.priorityQueue.high.length,
                medium: this.priorityQueue.medium.length,
                low: this.priorityQueue.low.length
            }
        };
    }
    
    // Preload specific planet textures
    async preloadPlanet(planetName) {
        if (typeof PLANETARY_DATA === 'undefined') {
            console.error('PLANETARY_DATA not available');
            return;
        }
        
        const planetData = PLANETARY_DATA[planetName];
        if (!planetData) {
            console.error(`Planet data not found for: ${planetName}`);
            return;
        }
        
        console.log(`Preloading textures for ${planetName}...`);
        
        const texturePromises = [];
        
        // Load main texture
        if (planetData.textureUrl) {
            texturePromises.push(this.loadTexture({
                url: planetData.textureUrl,
                planetName,
                textureType: 'main',
                priority: 'high',
                options: {}
            }));
        }
        
        // Load additional textures
        const additionalTextures = [
            { url: planetData.normalMapUrl, type: 'normal' },
            { url: planetData.specularMapUrl, type: 'specular' },
            { url: planetData.cloudsUrl, type: 'clouds' },
            { url: planetData.nightMapUrl, type: 'night' },
            { url: planetData.atmosphereUrl, type: 'atmosphere' },
            { url: planetData.ringsUrl, type: 'rings' }
        ];
        
        additionalTextures.forEach(({ url, type }) => {
            if (url) {
                texturePromises.push(this.loadTexture({
                    url,
                    planetName,
                    textureType: type,
                    priority: 'medium',
                    options: {}
                }));
            }
        });
        
        await Promise.allSettled(texturePromises);
        console.log(`Preloading completed for ${planetName}`);
    }
    
    // Stop preloading
    stopPreloading() {
        this.isPreloading = false;
        console.log('Texture preloading stopped');
    }
    
    // Get progress percentage
    getProgress() {
        return this.loadingProgress;
    }
    
    // Check if preloading is active
    isActive() {
        return this.isPreloading;
    }
}

// Create global instance
const texturePreloader = new TexturePreloader();

// Auto-populate queue when planetary data is available
document.addEventListener('DOMContentLoaded', () => {
    if (typeof PLANETARY_DATA !== 'undefined') {
        texturePreloader.populateFromPlanetaryData();
    }
});