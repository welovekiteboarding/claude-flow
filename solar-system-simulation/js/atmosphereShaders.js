// Atmosphere Shaders - Advanced WebGL Shaders for Realistic Planetary Atmospheres
// State-of-the-art atmospheric rendering with Rayleigh and Mie scattering

class AtmosphereShaders {
    constructor() {
        this.shaders = new Map();
        this.materials = new Map();
        this.atmosphereUniforms = new Map();
        
        // Physical constants for atmospheric scattering
        this.scatteringConstants = {
            rayleighCoeff: new THREE.Vector3(0.0000055, 0.0000130, 0.0000224), // Blue scattering
            mieCoeff: 0.000021,
            sunIntensity: 20.0,
            atmosphereRadius: 1.025, // 2.5% above surface
            planetRadius: 1.0,
            scaleHeight: 0.25,
            mieDirectionalG: 0.8 // Mie scattering anisotropy
        };
        
        console.log('Atmosphere Shaders initialized');
    }
    
    // Create Earth atmosphere shader with accurate scattering
    createEarthAtmosphereShader() {
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vSunDirection;
            varying float vSunfade;
            varying vec3 vBetaR;
            varying vec3 vBetaM;
            varying float vSunE;
            
            uniform vec3 sunPosition;
            uniform float luminance;
            uniform float mieDirectionalG;
            uniform float mieCoefficient;
            uniform float rayleigh;
            uniform float turbidity;
            uniform float reileighCoefficient;
            
            const vec3 up = vec3(0.0, 1.0, 0.0);
            
            // Constants for atmospheric scattering
            const float e = 2.71828182845904523536028747135266249775724709369995957;
            const float pi = 3.141592653589793238462643383279502884197169;
            
            // Wavelength of used primaries, according to preetham
            const vec3 lambda = vec3(686e-9, 678e-9, 614e-9);
            
            // Mie stuff
            const float v = 4.0;
            const vec3 K = vec3(0.686, 0.678, 0.614);
            const vec3 MieConst = vec3(1.8395, 1.8395, 1.8395);
            
            // Earth shadow hack
            const float cutoffAngle = 1.6110731556870734;
            const float steepness = 1.5;
            const float EE = 1000.0;
            
            float sunIntensity(float zenithAngleCos) {
                float cutoff = cutoffAngle;
                return EE * max(0.0, 1.0 - pow(e, -((cutoff - acos(zenithAngleCos))/steepness)));
            }
            
            vec3 totalRayleigh(vec3 lambda) {
                return (8.0 * pow(pi, 3.0) * pow(pow(reileighCoefficient, 2.0) * (6.0 + 3.0 * rayleigh), 2.0) / (3.0 * rayleigh * pow(lambda, vec3(4.0)))) * (6.0 + 3.0 * rayleigh);
            }
            
            vec3 totalMie(vec3 lambda, vec3 K, float T) {
                float c = (0.2 * T) * 10e-18;
                return 0.434 * c * MieConst;
            }
            
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                
                vSunDirection = normalize(sunPosition);
                vSunE = sunIntensity(dot(vSunDirection, up));
                vSunfade = 1.0 - clamp(1.0 - exp((sunPosition.y / 450000.0)), 0.0, 1.0);
                
                float rayleighCoefficient = rayleigh - (1.0 * (1.0 - vSunfade));
                vBetaR = totalRayleigh(lambda) * rayleighCoefficient;
                vBetaM = totalMie(lambda, K, turbidity) * mieCoefficient;
            }
        `;
        
        const fragmentShader = `
            varying vec3 vWorldPosition;
            varying vec3 vSunDirection;
            varying float vSunfade;
            varying vec3 vBetaR;
            varying vec3 vBetaM;
            varying float vSunE;
            
            uniform float luminance;
            uniform float mieDirectionalG;
            uniform vec3 up;
            
            const float pi = 3.141592653589793238462643383279502884197169;
            
            float rayleighPhase(float cosTheta) {
                return (3.0 / (16.0 * pi)) * (1.0 + pow(cosTheta, 2.0));
            }
            
            float miePhase(float cosTheta, float g) {
                return (1.0 / (4.0 * pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0 * g * cosTheta + pow(g, 2.0), 1.5));
            }
            
            void main() {
                vec3 direction = normalize(vWorldPosition - cameraPosition);
                float zenithAngle = acos(max(0.0, dot(up, direction)));
                float inverse = 1.0 / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));
                float sR = rayleighCoefficient * inverse;
                float sM = mieCoefficient * inverse;
                
                vec3 Fex = exp(-(vBetaR * sR + vBetaM * sM));
                
                float cosTheta = dot(direction, vSunDirection);
                
                float rPhase = rayleighPhase(cosTheta * 0.5 + 0.5);
                vec3 betaRTheta = vBetaR * rPhase;
                
                float mPhase = miePhase(cosTheta, mieDirectionalG);
                vec3 betaMTheta = vBetaM * mPhase;
                
                vec3 Lin = pow(vSunE * ((betaRTheta + betaMTheta) / (vBetaR + vBetaM)) * (1.0 - Fex), vec3(1.5));
                Lin *= mix(vec3(1.0), pow(vSunE * ((betaRTheta + betaMTheta) / (vBetaR + vBetaM)) * Fex, vec3(1.0 / 2.0)), clamp(pow(1.0 - dot(up, vSunDirection), 5.0), 0.0, 1.0));
                
                vec3 direction2 = normalize(vWorldPosition - cameraPosition);
                float theta = acos(direction2.y);
                float phi = atan(direction2.z, direction2.x);
                vec2 uv = vec2(phi, theta) / vec2(2.0 * pi, pi) + vec2(0.5, 0.0);
                vec3 L0 = vec3(0.1) * Fex;
                
                float sundisk = smoothstep(sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta);
                L0 += (vSunE * 19000.0 * Fex) * sundisk;
                
                vec3 texColor = (Lin + L0) * 0.04 + vec3(0.0, 0.0003, 0.00075);
                
                vec3 curr = Uncharted2Tonemap((log2(2.0 / pow(luminance, 4.0))) * texColor);
                vec3 color = curr * whiteScale;
                
                vec3 retColor = pow(color, vec3(1.0 / (1.2 + (1.2 * vSunfade))));
                
                gl_FragColor = vec4(retColor, 1.0);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                luminance: { value: 1.0 },
                turbidity: { value: 10.0 },
                rayleigh: { value: 2.0 },
                mieCoefficient: { value: 0.005 },
                mieDirectionalG: { value: 0.8 },
                sunPosition: { value: new THREE.Vector3(0, 0, 1) },
                up: { value: new THREE.Vector3(0, 1, 0) },
                reileighCoefficient: { value: 0.0025 },
                sunAngularDiameterCos: { value: Math.cos(0.00935 / 2) },
                whiteScale: { value: 1.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            transparent: true
        });
        
        this.shaders.set('earth_atmosphere', { vertexShader, fragmentShader });
        this.materials.set('earth_atmosphere', material);
        
        return material;
    }
    
    // Create Mars atmosphere shader (thin CO2 atmosphere)
    createMarsAtmosphereShader() {
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec3 vSunDirection;
            
            uniform vec3 sunPosition;
            
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                vNormal = normalize(normalMatrix * normal);
                vSunDirection = normalize(sunPosition);
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec3 vSunDirection;
            
            uniform vec3 atmosphereColor;
            uniform float atmosphereDensity;
            uniform float sunIntensity;
            
            void main() {
                vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
                
                // Mars atmosphere is much thinner and more orange/red
                float sunInfluence = max(0.0, dot(vNormal, vSunDirection));
                
                vec3 color = atmosphereColor * atmosphereDensity * fresnel * sunInfluence;
                
                gl_FragColor = vec4(color, fresnel * atmosphereDensity * 0.3);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                atmosphereColor: { value: new THREE.Vector3(0.8, 0.4, 0.2) },
                atmosphereDensity: { value: 0.1 },
                sunIntensity: { value: 1.0 },
                sunPosition: { value: new THREE.Vector3(0, 0, 1) }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.shaders.set('mars_atmosphere', { vertexShader, fragmentShader });
        this.materials.set('mars_atmosphere', material);
        
        return material;
    }
    
    // Create Venus atmosphere shader (dense, sulfuric atmosphere)
    createVenusAtmosphereShader() {
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                vNormal = normalize(normalMatrix * normal);
                vUv = uv;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            uniform float time;
            uniform vec3 sunPosition;
            uniform float cloudDensity;
            uniform float sulfuricIntensity;
            
            // Simple noise function for cloud simulation
            float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
            }
            
            void main() {
                vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                vec3 sunDirection = normalize(sunPosition);
                
                // Animate clouds
                vec2 cloudUv = vUv + vec2(time * 0.001, 0.0);
                float cloudPattern = noise(cloudUv * 10.0) * 0.5 + noise(cloudUv * 20.0) * 0.3 + noise(cloudUv * 40.0) * 0.2;
                
                // Venus atmosphere is very dense and yellowish
                vec3 baseColor = vec3(0.9, 0.8, 0.4);
                vec3 sulfuricColor = vec3(1.0, 0.9, 0.6);
                
                float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
                float sunInfluence = max(0.0, dot(vNormal, sunDirection));
                
                vec3 finalColor = mix(baseColor, sulfuricColor, sulfuricIntensity * cloudPattern);
                finalColor *= cloudDensity * fresnel * (0.5 + 0.5 * sunInfluence);
                
                gl_FragColor = vec4(finalColor, fresnel * cloudDensity * 0.8);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                sunPosition: { value: new THREE.Vector3(0, 0, 1) },
                cloudDensity: { value: 0.8 },
                sulfuricIntensity: { value: 0.3 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            transparent: true
        });
        
        this.shaders.set('venus_atmosphere', { vertexShader, fragmentShader });
        this.materials.set('venus_atmosphere', material);
        
        return material;
    }
    
    // Create gas giant atmosphere shader (Jupiter/Saturn)
    createGasGiantAtmosphereShader() {
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                vNormal = normalize(normalMatrix * normal);
                vUv = uv;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            varying vec2 vUv;
            
            uniform float time;
            uniform vec3 sunPosition;
            uniform vec3 primaryColor;
            uniform vec3 secondaryColor;
            uniform float bandIntensity;
            uniform float stormIntensity;
            
            // Enhanced noise for gas giant turbulence
            float turbulence(vec2 uv, float time) {
                float noise = 0.0;
                float amplitude = 1.0;
                float frequency = 1.0;
                
                for (int i = 0; i < 5; i++) {
                    noise += amplitude * abs(sin(frequency * uv.x + time * 0.1) * cos(frequency * uv.y * 2.0));
                    amplitude *= 0.5;
                    frequency *= 2.0;
                }
                
                return noise;
            }
            
            void main() {
                vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                vec3 sunDirection = normalize(sunPosition);
                
                // Create atmospheric bands
                float bands = sin(vUv.y * 20.0 + time * 0.05) * 0.5 + 0.5;
                float turbulenceEffect = turbulence(vUv, time);
                
                // Mix colors based on bands and turbulence
                vec3 bandColor = mix(primaryColor, secondaryColor, bands * bandIntensity);
                vec3 stormColor = mix(bandColor, vec3(1.0, 0.3, 0.1), stormIntensity * turbulenceEffect);
                
                float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
                float sunInfluence = max(0.0, dot(vNormal, sunDirection));
                
                vec3 finalColor = stormColor * fresnel * (0.3 + 0.7 * sunInfluence);
                
                gl_FragColor = vec4(finalColor, fresnel * 0.6);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                sunPosition: { value: new THREE.Vector3(0, 0, 1) },
                primaryColor: { value: new THREE.Vector3(0.8, 0.7, 0.5) },
                secondaryColor: { value: new THREE.Vector3(0.9, 0.6, 0.4) },
                bandIntensity: { value: 0.5 },
                stormIntensity: { value: 0.3 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            transparent: true
        });
        
        this.shaders.set('gas_giant_atmosphere', { vertexShader, fragmentShader });
        this.materials.set('gas_giant_atmosphere', material);
        
        return material;
    }
    
    // Create atmospheric glow shader for distant viewing
    createAtmosphericGlowShader() {
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            
            void main() {
                vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                vNormal = normalize(normalMatrix * normal);
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            varying vec3 vWorldPosition;
            varying vec3 vNormal;
            
            uniform vec3 glowColor;
            uniform float glowIntensity;
            uniform float falloff;
            
            void main() {
                vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
                float fresnel = 1.0 - abs(dot(viewDirection, vNormal));
                
                float glow = pow(fresnel, falloff) * glowIntensity;
                
                gl_FragColor = vec4(glowColor, glow);
            }
        `;
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Vector3(0.3, 0.6, 1.0) },
                glowIntensity: { value: 0.5 },
                falloff: { value: 2.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        
        this.shaders.set('atmospheric_glow', { vertexShader, fragmentShader });
        this.materials.set('atmospheric_glow', material);
        
        return material;
    }
    
    // Update shader uniforms for animation
    updateShaderUniforms(deltaTime) {
        const time = performance.now() * 0.001;
        
        // Update time-based uniforms
        this.materials.forEach((material, name) => {
            if (material.uniforms.time) {
                material.uniforms.time.value = time;
            }
        });
        
        // Update sun position for all atmospheric materials
        const sunPosition = new THREE.Vector3(0, 0, 1); // This should come from your sun's actual position
        this.materials.forEach((material, name) => {
            if (material.uniforms.sunPosition) {
                material.uniforms.sunPosition.value.copy(sunPosition);
            }
        });
    }
    
    // Create atmosphere for specific planet
    createAtmosphereForPlanet(planetName, planetMesh, scene) {
        let atmosphereMaterial;
        let atmosphereScale = 1.05; // Default 5% larger than planet
        
        switch (planetName) {
            case 'earth':
                atmosphereMaterial = this.createEarthAtmosphereShader();
                atmosphereScale = 1.025;
                break;
            case 'mars':
                atmosphereMaterial = this.createMarsAtmosphereShader();
                atmosphereScale = 1.01;
                break;
            case 'venus':
                atmosphereMaterial = this.createVenusAtmosphereShader();
                atmosphereScale = 1.03;
                break;
            case 'jupiter':
                atmosphereMaterial = this.createGasGiantAtmosphereShader();
                atmosphereMaterial.uniforms.primaryColor.value.set(0.8, 0.7, 0.5);
                atmosphereMaterial.uniforms.secondaryColor.value.set(0.9, 0.6, 0.4);
                atmosphereScale = 1.02;
                break;
            case 'saturn':
                atmosphereMaterial = this.createGasGiantAtmosphereShader();
                atmosphereMaterial.uniforms.primaryColor.value.set(0.9, 0.8, 0.6);
                atmosphereMaterial.uniforms.secondaryColor.value.set(0.8, 0.7, 0.5);
                atmosphereScale = 1.02;
                break;
            default:
                atmosphereMaterial = this.createAtmosphericGlowShader();
                atmosphereScale = 1.01;
        }
        
        // Create atmosphere geometry
        const atmosphereGeometry = new THREE.SphereGeometry(1, 64, 64);
        const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        
        // Scale and position atmosphere
        atmosphereMesh.scale.setScalar(atmosphereScale);
        atmosphereMesh.position.copy(planetMesh.position);
        
        // Add to scene
        scene.add(atmosphereMesh);
        
        // Store reference for updates
        this.atmosphereUniforms.set(planetName, {
            mesh: atmosphereMesh,
            material: atmosphereMaterial,
            scale: atmosphereScale
        });
        
        console.log(`Created ${planetName} atmosphere with scale ${atmosphereScale}`);
        return atmosphereMesh;
    }
    
    // Update atmosphere positions to match planets
    updateAtmospherePositions(planets) {
        this.atmosphereUniforms.forEach((atmosphere, planetName) => {
            const planet = planets.get(planetName);
            if (planet && atmosphere.mesh) {
                atmosphere.mesh.position.copy(planet.position);
                atmosphere.mesh.rotation.copy(planet.rotation);
            }
        });
    }
    
    // Get shader source for external use
    getShaderSource(shaderName) {
        return this.shaders.get(shaderName);
    }
    
    // Get material for external use
    getMaterial(materialName) {
        return this.materials.get(materialName);
    }
    
    // Dispose of all shader materials
    dispose() {
        this.materials.forEach((material, name) => {
            material.dispose();
        });
        
        this.atmosphereUniforms.forEach((atmosphere, name) => {
            if (atmosphere.mesh) {
                atmosphere.mesh.geometry.dispose();
                atmosphere.material.dispose();
            }
        });
        
        this.shaders.clear();
        this.materials.clear();
        this.atmosphereUniforms.clear();
        
        console.log('Atmosphere Shaders disposed');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AtmosphereShaders;
}