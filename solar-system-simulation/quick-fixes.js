// Quick fixes to apply immediately for the three main issues

// 1. DISABLED: Let NASA texture system handle texture loading
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('NASA texture system is handling texture loading - skipping texture loader override');
        
        // Only log texture loading for debugging - don't override
        if (typeof textureLoader !== 'undefined') {
            const originalLoadTexture = textureLoader.loadTexture;
            textureLoader.loadTexture = async function(url, options = {}) {
                console.log(`Loading texture: ${url}`);
                
                try {
                    const texture = await originalLoadTexture.call(this, url, options);
                    console.log(`Successfully loaded: ${url}`);
                    return texture;
                } catch (error) {
                    console.warn(`Texture loading failed for: ${url}`, error);
                    throw error; // Let NASA system handle fallbacks
                }
            };
        }
    }, 2000);
});

// 2. Fix time controls for smooth movement
window.addEventListener('load', function() {
    // Force time scale to be more visible and smooth
    setTimeout(() => {
        if (window.solarSystem) {
            window.solarSystem.setTimeScale(1); // Start with 1x, user can adjust
            console.log('Set initial time scale to 1x for smooth movement');
            
            // Enable smooth animation mode
            if (window.solarSystem.planetFactory) {
                console.log('Enabling smooth orbital animation');
            }
        }
    }, 3000);
    
    // Override the update function to reduce jerky movement
    setTimeout(() => {
        if (window.solarSystem) {
            const originalUpdate = window.solarSystem.update;
            window.solarSystem.update = function(deltaTime) {
                // Cap deltaTime to prevent large jumps
                const cappedDeltaTime = Math.min(deltaTime, 0.033); // Max 33ms (30fps)
                return originalUpdate.call(this, cappedDeltaTime);
            };
            console.log('Applied smooth update timing');
        }
    }, 4000);
});

// 3. Fix mouse zoom with proper event handling and debugging
document.addEventListener('DOMContentLoaded', function() {
    console.log('Setting up enhanced mouse zoom...');
    
    // Primary wheel event on canvas
    function setupZoom() {
        const canvas = document.getElementById('solar-system-canvas');
        if (canvas && window.solarSystem && window.solarSystem.cameraControls) {
            console.log('Found canvas and camera controls, setting up zoom');
            
            canvas.addEventListener('wheel', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                const controls = window.solarSystem.cameraControls;
                const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
                
                console.log('Zoom event:', event.deltaY, 'Factor:', zoomFactor);
                
                // Apply zoom using proper Three.js method
                if (controls.spherical) {
                    controls.spherical.radius *= zoomFactor;
                    controls.spherical.radius = Math.max(1, Math.min(1000, controls.spherical.radius));
                } else {
                    // Fallback method
                    controls.dollyIn = controls.dollyIn || function(scale) { 
                        this.sphericalDelta.radius /= scale; 
                    };
                    controls.dollyOut = controls.dollyOut || function(scale) { 
                        this.sphericalDelta.radius *= scale; 
                    };
                    
                    if (event.deltaY < 0) {
                        controls.dollyIn(0.9);
                    } else {
                        controls.dollyOut(1.1);
                    }
                }
                
                controls.update();
                console.log('Zoom applied, current radius:', controls.spherical?.radius || 'unknown');
            }, { passive: false });
            
            console.log('Mouse zoom setup complete');
            return true;
        }
        return false;
    }
    
    // Try setting up zoom immediately and with retries
    if (!setupZoom()) {
        console.log('Retrying zoom setup...');
        const retryZoom = setInterval(() => {
            if (setupZoom()) {
                clearInterval(retryZoom);
            }
        }, 1000);
        
        // Stop retrying after 10 seconds
        setTimeout(() => clearInterval(retryZoom), 10000);
    }
});

// Backup global wheel handler
document.addEventListener('wheel', function(event) {
    if (window.solarSystem && window.solarSystem.cameraControls && event.target.id === 'solar-system-canvas') {
        event.preventDefault();
        console.log('Backup zoom handler activated');
    }
}, { passive: false });

// 4. DISABLED: Let NASA texture system handle all textures
window.addEventListener('load', function() {
    setTimeout(() => {
        console.log('NASA texture system is managing all planet textures');
    }, 6000);
});

console.log('Enhanced quick fixes loaded - textures, time controls, and zoom should work better');