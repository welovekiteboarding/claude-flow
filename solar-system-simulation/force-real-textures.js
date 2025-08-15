// Force Real Texture Loading - Direct approach to ensure real textures are applied
console.log('🎯 Starting direct texture application system...');

// Wait for simulation to be ready, then force apply real textures
window.addEventListener('load', function() {
    setTimeout(() => {
        forceApplyRealTextures();
    }, 8000); // Wait 8 seconds for simulation to fully load
});

async function forceApplyRealTextures() {
    console.log('🎯 Force applying real planetary textures...');
    
    if (!window.solarSystem || !window.solarSystem.planetFactory) {
        console.warn('❌ Solar system not ready for texture application');
        setTimeout(forceApplyRealTextures, 2000);
        return;
    }

    // Direct texture URLs that work
    const workingTextureUrls = {
        earth: 'https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg',
        mars: 'https://www.solarsystemscope.com/textures/download/2k_mars.jpg',
        jupiter: 'https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg',
        saturn: 'https://www.solarsystemscope.com/textures/download/2k_saturn.jpg',
        venus: 'https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg',
        mercury: 'https://www.solarsystemscope.com/textures/download/2k_mercury.jpg',
        uranus: 'https://www.solarsystemscope.com/textures/download/2k_uranus.jpg',
        neptune: 'https://www.solarsystemscope.com/textures/download/2k_neptune.jpg',
        sun: 'https://www.solarsystemscope.com/textures/download/2k_sun.jpg',
        moon: 'https://www.solarsystemscope.com/textures/download/2k_moon.jpg'
    };

    // Get all planets from the scene
    const planets = window.solarSystem.planets;
    
    for (const [planetName, textureUrl] of Object.entries(workingTextureUrls)) {
        if (planetName === 'moon') continue; // Handle moon separately
        
        const planetInfo = planets.get(planetName);
        if (planetInfo && planetInfo.planet && planetInfo.planet.material) {
            console.log(`🌍 Loading real texture for ${planetName}: ${textureUrl}`);
            
            try {
                await loadAndApplyTexture(planetInfo.planet, textureUrl, planetName);
            } catch (error) {
                console.warn(`❌ Failed to load texture for ${planetName}:`, error);
            }
        } else {
            console.warn(`❌ Planet not found: ${planetName}`);
        }
    }
    
    // Handle Earth's moon separately
    const earthInfo = planets.get('earth');
    if (earthInfo && earthInfo.moons && earthInfo.moons.length > 0) {
        const moon = earthInfo.moons[0];
        if (moon.planet && moon.planet.material) {
            console.log(`🌙 Loading real texture for Moon`);
            try {
                await loadAndApplyTexture(moon.planet, workingTextureUrls.moon, 'moon');
            } catch (error) {
                console.warn(`❌ Failed to load texture for Moon:`, error);
            }
        }
    }
    
    console.log('✅ Real texture application complete!');
}

async function loadAndApplyTexture(planetMesh, textureUrl, planetName) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.TextureLoader();
        
        loader.load(
            textureUrl,
            (texture) => {
                // Configure texture for best quality
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = true;
                
                // Apply texture to planet
                planetMesh.material.map = texture;
                planetMesh.material.needsUpdate = true;
                
                console.log(`✅ Applied real texture to ${planetName}: ${textureUrl}`);
                resolve(texture);
            },
            (progress) => {
                if (progress.total > 0) {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    console.log(`📥 Loading ${planetName}: ${percent}%`);
                }
            },
            (error) => {
                console.error(`❌ Texture loading failed for ${planetName}:`, error);
                reject(error);
            }
        );
    });
}

console.log('🎯 Direct texture application system loaded');