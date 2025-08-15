// Texture Quality Manager - Real-time texture quality control system
// Manages texture loading, quality settings, and progressive enhancement

class TextureQualityManager {
    constructor() {
        this.currentQuality = 'medium';
        this.autoProgressiveLoading = true;
        this.preloadingEnabled = true;
        this.cacheEnabled = true;
        this.loadingProgress = 0;
        this.loadingCallbacks = [];
        this.qualityChangeCallbacks = [];
        this.textureStatistics = {
            totalTextures: 0,
            loadedTextures: 0,
            failedTextures: 0,
            cacheHits: 0,
            memoryUsage: 0
        };
        
        this.setupUI();
    }
    
    setupUI() {
        // Create quality control panel
        const controlPanel = document.createElement('div');
        controlPanel.id = 'texture-quality-controls';
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            padding: 15px;
            border-radius: 10px;
            color: white;
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 1000;
            min-width: 200px;
            border: 1px solid #444;
        `;
        
        controlPanel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #4CAF50;">Texture Quality</h3>
            
            <div style="margin-bottom: 10px;">
                <label>Quality Level:</label>
                <select id="quality-selector" style="width: 100%; margin-top: 5px;">
                    <option value="low">Low (512px)</option>
                    <option value="medium" selected>Medium (1K)</option>
                    <option value="high">High (2K)</option>
                    <option value="ultra">Ultra (4K)</option>
                </select>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="progressive-loading" checked>
                    Progressive Loading
                </label>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="preloading-enabled" checked>
                    Preload Textures
                </label>
            </div>
            
            <div style="margin-bottom: 10px;">
                <label>
                    <input type="checkbox" id="cache-enabled" checked>
                    Enable Caching
                </label>
            </div>
            
            <div id="loading-progress" style="margin-bottom: 10px; display: none;">
                <div style="color: #4CAF50; margin-bottom: 5px;">Loading Textures...</div>
                <div style="background: #333; height: 10px; border-radius: 5px; overflow: hidden;">
                    <div id="progress-bar" style="height: 100%; background: #4CAF50; width: 0%; transition: width 0.3s;"></div>
                </div>
                <div id="progress-text" style="margin-top: 5px; font-size: 10px; color: #aaa;"></div>
            </div>
            
            <div id="texture-stats" style="font-size: 10px; color: #ccc;">
                <div>Loaded: <span id="loaded-count">0</span>/<span id="total-count">0</span></div>
                <div>Failed: <span id="failed-count">0</span></div>
                <div>Cache Hits: <span id="cache-hits">0</span></div>
                <div>Memory: <span id="memory-usage">0 MB</span></div>
            </div>
            
            <div style="margin-top: 10px;">
                <button id="reload-textures" style="width: 100%; padding: 5px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Reload Textures
                </button>
            </div>
            
            <div style="margin-top: 5px;">
                <button id="clear-cache" style="width: 100%; padding: 5px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">
                    Clear Cache
                </button>
            </div>
        `;
        
        document.body.appendChild(controlPanel);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update statistics periodically
        setInterval(() => this.updateStatistics(), 5000);
    }
    
    setupEventListeners() {
        // Quality selector
        document.getElementById('quality-selector').addEventListener('change', (e) => {
            this.setQuality(e.target.value);
        });
        
        // Progressive loading toggle
        document.getElementById('progressive-loading').addEventListener('change', (e) => {
            this.setProgressiveLoading(e.target.checked);
        });
        
        // Preloading toggle
        document.getElementById('preloading-enabled').addEventListener('change', (e) => {
            this.setPreloading(e.target.checked);
        });
        
        // Cache toggle
        document.getElementById('cache-enabled').addEventListener('change', (e) => {
            this.setCaching(e.target.checked);
        });
        
        // Reload button
        document.getElementById('reload-textures').addEventListener('click', () => {
            this.reloadAllTextures();
        });
        
        // Clear cache button
        document.getElementById('clear-cache').addEventListener('click', () => {
            this.clearCache();
        });
    }
    
    setQuality(quality) {
        if (this.currentQuality === quality) return;
        
        const oldQuality = this.currentQuality;
        this.currentQuality = quality;
        
        // Update TEXTURE_MANAGER if available
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            TEXTURE_MANAGER.setQuality(quality);
        }
        
        // Notify callbacks
        this.qualityChangeCallbacks.forEach(callback => {
            callback(quality, oldQuality);
        });
        
        console.log(`Texture quality changed: ${oldQuality} → ${quality}`);
        
        // Auto-reload if enabled
        if (this.autoProgressiveLoading) {
            this.reloadAllTextures();
        }
    }
    
    setProgressiveLoading(enabled) {
        this.autoProgressiveLoading = enabled;
        
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            TEXTURE_MANAGER.setProgressiveLoading(enabled);
        }
        
        console.log(`Progressive loading: ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    setPreloading(enabled) {
        this.preloadingEnabled = enabled;
        console.log(`Texture preloading: ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    setCaching(enabled) {
        this.cacheEnabled = enabled;
        
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            TEXTURE_MANAGER.setCaching(enabled);
        }
        
        console.log(`Texture caching: ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    async reloadAllTextures() {
        if (!this.preloadingEnabled) {
            console.log('Texture preloading is disabled');
            return;
        }
        
        console.log('Reloading all textures...');
        this.showLoadingProgress();
        
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            try {
                await TEXTURE_MANAGER.preloadAllTextures((progress, planetName, textureType, quality) => {
                    this.updateProgress(progress, `${planetName} - ${textureType} (${quality})`);
                });
                
                this.hideLoadingProgress();
                console.log('All textures reloaded successfully');
            } catch (error) {
                console.error('Error reloading textures:', error);
                this.hideLoadingProgress();
            }
        }
    }
    
    clearCache() {
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            TEXTURE_MANAGER.clearCache();
        }
        
        // Clear textureLoader cache if available
        if (typeof textureLoader !== 'undefined') {
            textureLoader.cache.clear();
        }
        
        this.textureStatistics.cacheHits = 0;
        this.updateStatistics();
        console.log('Texture cache cleared');
    }
    
    showLoadingProgress() {
        document.getElementById('loading-progress').style.display = 'block';
        this.loadingProgress = 0;
        this.updateProgress(0, 'Starting...');
    }
    
    hideLoadingProgress() {
        document.getElementById('loading-progress').style.display = 'none';
    }
    
    updateProgress(progress, status) {
        this.loadingProgress = progress;
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = status || `${progress.toFixed(1)}%`;
        }
        
        // Notify callbacks
        this.loadingCallbacks.forEach(callback => {
            callback(progress, status);
        });
    }
    
    updateStatistics() {
        // Get statistics from TEXTURE_MANAGER
        if (typeof TEXTURE_MANAGER !== 'undefined') {
            const stats = TEXTURE_MANAGER.getCacheStats();
            this.textureStatistics.totalTextures = TEXTURE_MANAGER.getTotalTextureCount();
            this.textureStatistics.loadedTextures = stats.totalCached;
            this.textureStatistics.memoryUsage = stats.memoryUsage;
        }
        
        // Get statistics from textureLoader
        if (typeof textureLoader !== 'undefined') {
            const memoryStats = textureLoader.getMemoryUsage();
            this.textureStatistics.memoryUsage = parseFloat(memoryStats.memoryMB);
        }
        
        // Update UI
        this.updateStatisticsUI();
    }
    
    updateStatisticsUI() {
        const stats = this.textureStatistics;
        
        const elements = {
            'loaded-count': stats.loadedTextures,
            'total-count': stats.totalTextures,
            'failed-count': stats.failedTextures,
            'cache-hits': stats.cacheHits,
            'memory-usage': `${stats.memoryUsage.toFixed(1)} MB`
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    onLoadingProgress(callback) {
        this.loadingCallbacks.push(callback);
    }
    
    onQualityChange(callback) {
        this.qualityChangeCallbacks.push(callback);
    }
    
    getCurrentQuality() {
        return this.currentQuality;
    }
    
    isProgressiveLoadingEnabled() {
        return this.autoProgressiveLoading;
    }
    
    isPreloadingEnabled() {
        return this.preloadingEnabled;
    }
    
    isCachingEnabled() {
        return this.cacheEnabled;
    }
    
    getStatistics() {
        return { ...this.textureStatistics };
    }
    
    // Adaptive quality based on performance
    enableAdaptiveQuality() {
        let frameCount = 0;
        let lastTime = Date.now();
        
        const checkPerformance = () => {
            frameCount++;
            const now = Date.now();
            
            if (now - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = now;
                
                // Adjust quality based on FPS
                if (fps < 30 && this.currentQuality === 'ultra') {
                    this.setQuality('high');
                    console.log('Adaptive quality: Reduced to high due to low FPS');
                } else if (fps < 20 && this.currentQuality === 'high') {
                    this.setQuality('medium');
                    console.log('Adaptive quality: Reduced to medium due to low FPS');
                } else if (fps < 15 && this.currentQuality === 'medium') {
                    this.setQuality('low');
                    console.log('Adaptive quality: Reduced to low due to low FPS');
                } else if (fps > 45 && this.currentQuality === 'low') {
                    this.setQuality('medium');
                    console.log('Adaptive quality: Increased to medium due to good FPS');
                } else if (fps > 55 && this.currentQuality === 'medium') {
                    this.setQuality('high');
                    console.log('Adaptive quality: Increased to high due to good FPS');
                }
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        checkPerformance();
    }
    
    // Auto-detect device capabilities
    detectDeviceCapabilities() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            console.warn('WebGL not supported, using low quality');
            this.setQuality('low');
            return;
        }
        
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxAnisotropy = gl.getExtension('EXT_texture_filter_anisotropic');
        
        // Auto-select quality based on capabilities
        if (maxTextureSize >= 4096) {
            this.setQuality('high');
        } else if (maxTextureSize >= 2048) {
            this.setQuality('medium');
        } else {
            this.setQuality('low');
        }
        
        console.log(`Device capabilities: Max texture size: ${maxTextureSize}, Selected quality: ${this.currentQuality}`);
    }
}

// Create global instance
const textureQualityManager = new TextureQualityManager();

// Auto-detect device capabilities on load
document.addEventListener('DOMContentLoaded', () => {
    textureQualityManager.detectDeviceCapabilities();
});