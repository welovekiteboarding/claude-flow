// Planet Data - Astronomical Data Specialist Agent
// Real astronomical data for accurate solar system simulation

const PLANETARY_DATA = {
    sun: {
        name: "Sun",
        radius: 696340, // km (scaled down for visualization)
        displayRadius: 5.0,
        color: 0xffeb3b,
        distance: 0,
        period: 0, // days
        rotationPeriod: 25.05, // days
        temperature: "5778K surface",
        moons: 0,
        description: "Our star, containing 99.86% of the solar system's mass",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_sun.jpg",
        textureUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/sun.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/sun.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_sun.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_sun.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_sun.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_sun.jpg"
        },
        emissive: true,
        glowColor: 0xffaa00,
        glowIntensity: 0.3
    },
    
    mercury: {
        name: "Mercury",
        radius: 2439.7,
        displayRadius: 0.15,
        color: 0x8c7853,
        distance: 57.9, // million km
        displayDistance: 8,
        period: 87.97, // days
        rotationPeriod: 58.65, // days
        temperature: "167°C average",
        moons: 0,
        description: "Smallest planet, closest to the Sun",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
        textureUrlBackup: "https://nasa3d.arc.nasa.gov/shared_assets/images/mercury/mercury_1024.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/mercury.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_mercury.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_mercury.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_mercury.jpg"
        },
        fallbackColor: 0x8c7853,
        orbitSpeed: 0.02, // radians per frame
        tilt: 0.034 // radians
    },
    
    venus: {
        name: "Venus",
        radius: 6051.8,
        displayRadius: 0.25,
        color: 0xffc649,
        distance: 108.2,
        displayDistance: 12,
        period: 224.7,
        rotationPeriod: -243.02, // retrograde rotation
        temperature: "464°C surface",
        moons: 0,
        description: "Hottest planet, thick atmosphere",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
        textureUrlBackup: "https://nasa3d.arc.nasa.gov/shared_assets/images/venus/venus_1024.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/venus.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_venus_surface.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_venus_surface.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_venus_surface.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_venus_surface.jpg"
        },
        fallbackColor: 0xffc649,
        atmosphereUrl: "https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg",
        atmosphereUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/venus_atmosphere.jpg",
        atmosphereResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_venus_atmosphere.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_venus_atmosphere.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_venus_atmosphere.jpg"
        },
        orbitSpeed: 0.015,
        tilt: 3.10
    },
    
    earth: {
        name: "Earth",
        radius: 6371,
        displayRadius: 0.3,
        color: 0x6b93d6,
        distance: 149.6,
        displayDistance: 16,
        period: 365.25,
        rotationPeriod: 0.99726968, // sidereal day
        temperature: "15°C average",
        moons: 1,
        description: "Our home planet, the only known planet with life",
        textureUrl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg",
        textureUrlBackup: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
        textureUrlFallback: "https://visibleearth.nasa.gov/images/57752/blue-marble-land-surface-shallow-water-and-shaded-topography/57752l.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_earth_daymap.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_earth_daymap.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg"
        },
        normalMapUrl: "https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg",
        normalMapUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg",
        normalMapResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_earth_normal_map.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_earth_normal_map.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_earth_normal_map.jpg"
        },
        specularMapUrl: "https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg",
        specularMapUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg",
        specularMapResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_earth_specular_map.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_earth_specular_map.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_earth_specular_map.jpg"
        },
        cloudsUrl: "https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg",
        cloudsUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_clouds_1024.png",
        cloudsResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_earth_clouds.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_earth_clouds.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_earth_clouds.jpg"
        },
        nightMapUrl: "https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg",
        nightMapUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_lights_2048.png",
        nightMapResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_earth_nightmap.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_earth_nightmap.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_earth_nightmap.jpg"
        },
        orbitSpeed: 0.012,
        tilt: 0.41,
        atmosphere: true,
        hasOceans: true,
        moons: [
            {
                name: "Moon",
                radius: 1737.4,
                displayRadius: 0.08,
                distance: 384.4, // thousand km
                displayDistance: 1.2,
                period: 27.32,
                color: 0xaaaaaa,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_moon.jpg",
                textureUrlBackup: "https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg",
                textureUrlFallback: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_moon.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_moon.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_moon.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_moon.jpg"
                }
            }
        ]
    },
    
    mars: {
        name: "Mars",
        radius: 3389.5,
        displayRadius: 0.2,
        color: 0xcd5c5c,
        distance: 227.9,
        displayDistance: 22,
        period: 686.98,
        rotationPeriod: 1.026,
        temperature: "-65°C average",
        moons: 2,
        description: "The Red Planet, potential for past/present life",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
        textureUrlBackup: "https://nasa3d.arc.nasa.gov/shared_assets/images/mars/mars_1024.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/mars.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_mars.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_mars.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_mars.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_mars.jpg"
        },
        normalMapUrl: "https://www.solarsystemscope.com/textures/download/2k_mars_normal_map.jpg",
        normalMapUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/mars_1k_normal.jpg",
        normalMapResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_mars_normal_map.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_mars_normal_map.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_mars_normal_map.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_mars_normal_map.jpg"
        },
        orbitSpeed: 0.008,
        tilt: 0.44,
        moons: [
            {
                name: "Phobos",
                radius: 11.1,
                displayRadius: 0.02,
                distance: 9.376,
                displayDistance: 0.4,
                period: 0.32,
                color: 0x8c7853
            },
            {
                name: "Deimos", 
                radius: 6.2,
                displayRadius: 0.015,
                distance: 23.463,
                displayDistance: 0.7,
                period: 1.26,
                color: 0x8c7853
            }
        ]
    },
    
    jupiter: {
        name: "Jupiter",
        radius: 69911,
        displayRadius: 1.2,
        color: 0xd8ca9d,
        distance: 778.5,
        displayDistance: 35,
        period: 4332.59,
        rotationPeriod: 0.41354,
        temperature: "-110°C average",
        moons: 95,
        description: "Largest planet, gas giant with Great Red Spot",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
        textureUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/jupiter_2k.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/jupiter.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_jupiter.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_jupiter.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_jupiter.jpg"
        },
        orbitSpeed: 0.003,
        tilt: 0.055,
        gasGiant: true,
        moons: [
            {
                name: "Io",
                radius: 1821.6,
                displayRadius: 0.12,
                distance: 421.7,
                displayDistance: 2.5,
                period: 1.77,
                color: 0xffff99,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_io.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/io.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_io.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_io.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_io.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_io.jpg"
                }
            },
            {
                name: "Europa",
                radius: 1560.8,
                displayRadius: 0.11,
                distance: 671.034,
                displayDistance: 3.2,
                period: 3.55,
                color: 0xaaddff,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_europa.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/europa.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_europa.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_europa.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_europa.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_europa.jpg"
                }
            },
            {
                name: "Ganymede",
                radius: 2634.1,
                displayRadius: 0.15,
                distance: 1070.412,
                displayDistance: 4.0,
                period: 7.15,
                color: 0x888888,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_ganymede.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/ganymede.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_ganymede.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_ganymede.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_ganymede.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_ganymede.jpg"
                }
            },
            {
                name: "Callisto",
                radius: 2410.3,
                displayRadius: 0.13,
                distance: 1882.709,
                displayDistance: 5.5,
                period: 16.69,
                color: 0x666666,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_callisto.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/callisto.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_callisto.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_callisto.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_callisto.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_callisto.jpg"
                }
            }
        ]
    },
    
    saturn: {
        name: "Saturn",
        radius: 58232,
        displayRadius: 1.0,
        color: 0xfad5a5,
        distance: 1432,
        displayDistance: 50,
        period: 10759.22,
        rotationPeriod: 0.445,
        temperature: "-140°C average",
        moons: 146,
        description: "Ringed planet, less dense than water",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
        textureUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/saturn_2k.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/saturn.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_saturn.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_saturn.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_saturn.jpg"
        },
        ringsUrl: "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
        ringsUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/saturn_ring_alpha.png",
        ringsResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_saturn_ring_alpha.png",
            medium: "https://www.solarsystemscope.com/textures/download/1k_saturn_ring_alpha.png",
            high: "https://www.solarsystemscope.com/textures/download/2k_saturn_ring_alpha.png",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_saturn_ring_alpha.png"
        },
        orbitSpeed: 0.002,
        tilt: 0.47,
        gasGiant: true,
        hasRings: true,
        ringInnerRadius: 1.2,
        ringOuterRadius: 2.3,
        moons: [
            {
                name: "Titan",
                radius: 2574,
                displayRadius: 0.18,
                distance: 1221.83,
                displayDistance: 6.0,
                period: 15.95,
                color: 0xffcc99,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_titan.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/titan.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_titan.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_titan.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_titan.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_titan.jpg"
                }
            },
            {
                name: "Enceladus",
                radius: 252.1,
                displayRadius: 0.06,
                distance: 238.02,
                displayDistance: 3.5,
                period: 1.37,
                color: 0xffffff,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_enceladus.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/enceladus.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_enceladus.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_enceladus.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_enceladus.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_enceladus.jpg"
                }
            }
        ]
    },
    
    uranus: {
        name: "Uranus",
        radius: 25362,
        displayRadius: 0.7,
        color: 0x4fd0e7,
        distance: 2867,
        displayDistance: 70,
        period: 30688.5,
        rotationPeriod: -0.72, // retrograde rotation
        temperature: "-195°C average",
        moons: 27,
        description: "Ice giant, rotates on its side",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
        textureUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/uranus_2k.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/uranus.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_uranus.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_uranus.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_uranus.jpg"
        },
        orbitSpeed: 0.001,
        tilt: 1.71, // extreme tilt - rotates on its side
        iceGiant: true,
        moons: [
            {
                name: "Miranda",
                radius: 235.8,
                displayRadius: 0.05,
                distance: 129.39,
                displayDistance: 1.8,
                period: 1.41,
                color: 0xaaaaaa
            },
            {
                name: "Ariel",
                radius: 578.9,
                displayRadius: 0.08,
                distance: 190.9,
                displayDistance: 2.5,
                period: 2.52,
                color: 0xbbbbbb
            }
        ]
    },
    
    neptune: {
        name: "Neptune",
        radius: 24622,
        displayRadius: 0.68,
        color: 0x4b70dd,
        distance: 4515,
        displayDistance: 90,
        period: 60182,
        rotationPeriod: 0.67,
        temperature: "-200°C average",
        moons: 16,
        description: "Windiest planet, deep blue color",
        textureUrl: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
        textureUrlBackup: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/neptune_2k.jpg",
        textureUrlFallback: "https://planetpixelemporium.com/planets/neptune.jpg",
        textureResolutions: {
            low: "https://www.solarsystemscope.com/textures/download/512_neptune.jpg",
            medium: "https://www.solarsystemscope.com/textures/download/1k_neptune.jpg",
            high: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
            ultra: "https://www.solarsystemscope.com/textures/download/4k_neptune.jpg"
        },
        orbitSpeed: 0.0008,
        tilt: 0.49,
        iceGiant: true,
        moons: [
            {
                name: "Triton",
                radius: 1353.4,
                displayRadius: 0.12,
                distance: 354.76,
                displayDistance: 3.0,
                period: -5.88, // retrograde orbit
                color: 0xccddff,
                textureUrl: "https://www.solarsystemscope.com/textures/download/2k_triton.jpg",
                textureUrlBackup: "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/triton.jpg",
                textureResolutions: {
                    low: "https://www.solarsystemscope.com/textures/download/512_triton.jpg",
                    medium: "https://www.solarsystemscope.com/textures/download/1k_triton.jpg",
                    high: "https://www.solarsystemscope.com/textures/download/2k_triton.jpg",
                    ultra: "https://www.solarsystemscope.com/textures/download/4k_triton.jpg"
                }
            }
        ]
    }
};

// Physical constants for realistic simulation
const SIMULATION_CONSTANTS = {
    AU: 149597870.7, // km - Astronomical Unit
    EARTH_RADIUS: 6371, // km
    SCALE_FACTOR: 0.00001, // Scale down for visualization
    TIME_SCALE: 1, // Simulation speed multiplier
    GRAVITY_CONSTANT: 6.67430e-11, // m³/kg⋅s²
    SUN_MASS: 1.98847e30, // kg
    
    // Visual settings
    ORBIT_SEGMENTS: 128, // Segments for orbit lines
    ORBIT_OPACITY: 0.6,
    ORBIT_COLOR: 0x00ff44, // Green color for orbits
    ORBIT_WIDTH: 2,
    
    // Camera settings
    CAMERA_FOV: 75,
    CAMERA_NEAR: 0.1,
    CAMERA_FAR: 2000,
    CAMERA_INITIAL_DISTANCE: 25,
    
    // Performance settings
    MAX_ORBIT_POINTS: 256, // Maximum points for orbit trails
    LOD_DISTANCE_MULTIPLIER: 1.5, // Level of detail distance
    TEXTURE_QUALITY: {
        LOW: 512,
        MEDIUM: 1024,
        HIGH: 2048,
        ULTRA: 4096
    }
};

// Orbital mechanics calculations
const ORBITAL_MECHANICS = {
    // Calculate orbital velocity (simplified)
    calculateOrbitalVelocity(distance, centralMass = SIMULATION_CONSTANTS.SUN_MASS) {
        const r = distance * 1000 * SIMULATION_CONSTANTS.AU; // Convert to meters
        const G = SIMULATION_CONSTANTS.GRAVITY_CONSTANT;
        return Math.sqrt(G * centralMass / r);
    },
    
    // Calculate position in elliptical orbit
    calculateOrbitalPosition(semiMajorAxis, eccentricity, meanAnomaly) {
        // Simplified circular orbit for this simulation
        const angle = meanAnomaly;
        return {
            x: semiMajorAxis * Math.cos(angle),
            z: semiMajorAxis * Math.sin(angle)
        };
    },
    
    // Convert real astronomical data to simulation scale
    scaleDistance(realDistance) {
        return realDistance * SIMULATION_CONSTANTS.SCALE_FACTOR;
    },
    
    scaleRadius(realRadius) {
        return realRadius * SIMULATION_CONSTANTS.SCALE_FACTOR * 100; // Scale planets up for visibility
    },
    
    // Calculate planet position based on time
    calculatePlanetPosition(planetData, time) {
        const angle = (time * planetData.orbitSpeed) % (2 * Math.PI);
        const distance = planetData.displayDistance;
        
        return {
            x: distance * Math.cos(angle),
            y: 0,
            z: distance * Math.sin(angle),
            angle: angle
        };
    }
};

// Enhanced texture quality management with progressive loading
const TEXTURE_MANAGER = {
    currentQuality: 'medium',
    loadingQueue: new Map(),
    loadedTextures: new Map(),
    progressiveLoading: true,
    cacheEnabled: true,
    
    // Quality to resolution mapping
    qualityResolutions: {
        low: '512',
        medium: '1k', 
        high: '2k',
        ultra: '4k'
    },
    
    // Get texture URL for specific quality
    getTextureUrl(planetData, textureType = 'textureUrl', quality = null) {
        if (!quality) quality = this.currentQuality;
        
        // Check if planet has resolution options
        const resolutionKey = textureType.replace('Url', 'Resolutions');
        if (planetData[resolutionKey] && planetData[resolutionKey][quality]) {
            return planetData[resolutionKey][quality];
        }
        
        // Fall back to main URL
        return planetData[textureType];
    },
    
    // Get backup URLs for progressive loading
    getBackupUrls(planetData, textureType = 'textureUrl') {
        const backupKey = textureType.replace('Url', 'UrlBackup');
        const fallbackKey = textureType.replace('Url', 'UrlFallback');
        
        return [
            planetData[backupKey],
            planetData[fallbackKey]
        ].filter(url => url);
    },
    
    // Progressive texture loading: start with low quality, upgrade to high
    async loadTextureProgressive(planetData, textureType = 'textureUrl', onProgress) {
        const cacheKey = `${planetData.name}_${textureType}`;
        
        // Check cache first
        if (this.cacheEnabled && this.loadedTextures.has(cacheKey)) {
            const cached = this.loadedTextures.get(cacheKey);
            if (cached.quality === this.currentQuality) {
                return cached.texture;
            }
        }
        
        // Start with low quality for immediate display
        const lowQualityUrl = this.getTextureUrl(planetData, textureType, 'low');
        const highQualityUrl = this.getTextureUrl(planetData, textureType, this.currentQuality);
        
        let texture = null;
        
        try {
            // Load low quality first
            if (lowQualityUrl && lowQualityUrl !== highQualityUrl) {
                texture = await this.loadTextureWithFallback(lowQualityUrl, this.getBackupUrls(planetData, textureType));
                
                if (texture && onProgress) {
                    onProgress(texture, 'low');
                }
                
                // Cache low quality
                this.loadedTextures.set(cacheKey, {
                    texture: texture,
                    quality: 'low',
                    timestamp: Date.now()
                });
            }
            
            // Load high quality in background
            if (highQualityUrl && highQualityUrl !== lowQualityUrl) {
                const highQualityTexture = await this.loadTextureWithFallback(highQualityUrl, this.getBackupUrls(planetData, textureType));
                
                if (highQualityTexture) {
                    texture = highQualityTexture;
                    
                    if (onProgress) {
                        onProgress(texture, this.currentQuality);
                    }
                    
                    // Cache high quality
                    this.loadedTextures.set(cacheKey, {
                        texture: texture,
                        quality: this.currentQuality,
                        timestamp: Date.now()
                    });
                }
            }
            
            return texture;
            
        } catch (error) {
            console.warn(`Progressive texture loading failed for ${planetData.name} ${textureType}:`, error);
            return null;
        }
    },
    
    // Load texture with fallback URLs
    async loadTextureWithFallback(primaryUrl, backupUrls = []) {
        const urls = [primaryUrl, ...backupUrls].filter(url => url);
        
        for (const url of urls) {
            try {
                const texture = await this.loadSingleTexture(url);
                if (texture) {
                    return texture;
                }
            } catch (error) {
                console.warn(`Failed to load texture from ${url}:`, error);
                continue;
            }
        }
        
        throw new Error(`All texture URLs failed for: ${primaryUrl}`);
    },
    
    // Load single texture (to be implemented by textureLoader)
    async loadSingleTexture(url) {
        // This will be called by the actual texture loader
        return null;
    },
    
    // Set quality and trigger reload if needed
    setQuality(quality) {
        const oldQuality = this.currentQuality;
        this.currentQuality = quality;
        
        if (oldQuality !== quality) {
            // Clear cache for quality change
            this.loadedTextures.clear();
            console.log(`Texture quality changed from ${oldQuality} to ${quality}`);
        }
    },
    
    // Preload textures for all planets
    async preloadAllTextures(onProgress) {
        const texturePromises = [];
        const totalTextures = this.getTotalTextureCount();
        let loadedCount = 0;
        
        const updateProgress = (planetName, textureType, quality) => {
            loadedCount++;
            const progress = (loadedCount / totalTextures) * 100;
            
            if (onProgress) {
                onProgress(progress, planetName, textureType, quality);
            }
        };
        
        // Load textures for all planets
        Object.entries(PLANETARY_DATA).forEach(([planetName, planetData]) => {
            const textureTypes = ['textureUrl', 'normalMapUrl', 'specularMapUrl', 'cloudsUrl', 'nightMapUrl', 'atmosphereUrl', 'ringsUrl'];
            
            textureTypes.forEach(textureType => {
                if (planetData[textureType]) {
                    const promise = this.loadTextureProgressive(
                        planetData,
                        textureType,
                        (texture, quality) => updateProgress(planetName, textureType, quality)
                    );
                    texturePromises.push(promise);
                }
            });
            
            // Load moon textures
            if (planetData.moons) {
                planetData.moons.forEach(moon => {
                    if (moon.textureUrl) {
                        const promise = this.loadTextureProgressive(
                            moon,
                            'textureUrl',
                            (texture, quality) => updateProgress(planetName, `${moon.name}_texture`, quality)
                        );
                        texturePromises.push(promise);
                    }
                });
            }
        });
        
        try {
            await Promise.all(texturePromises);
            console.log('All textures preloaded successfully');
            return true;
        } catch (error) {
            console.error('Error preloading textures:', error);
            return false;
        }
    },
    
    // Get total texture count for progress tracking
    getTotalTextureCount() {
        let count = 0;
        const textureTypes = ['textureUrl', 'normalMapUrl', 'specularMapUrl', 'cloudsUrl', 'nightMapUrl', 'atmosphereUrl', 'ringsUrl'];
        
        Object.values(PLANETARY_DATA).forEach(planetData => {
            textureTypes.forEach(textureType => {
                if (planetData[textureType]) count++;
            });
            
            if (planetData.moons) {
                planetData.moons.forEach(moon => {
                    if (moon.textureUrl) count++;
                });
            }
        });
        
        return count;
    },
    
    // Clear cache
    clearCache() {
        this.loadedTextures.clear();
        console.log('Texture cache cleared');
    },
    
    // Get cache statistics
    getCacheStats() {
        const stats = {
            totalCached: this.loadedTextures.size,
            memoryUsage: 0,
            qualityDistribution: { low: 0, medium: 0, high: 0, ultra: 0 }
        };
        
        this.loadedTextures.forEach(cached => {
            stats.qualityDistribution[cached.quality]++;
            
            // Estimate memory usage
            if (cached.texture && cached.texture.image) {
                const img = cached.texture.image;
                stats.memoryUsage += (img.width * img.height * 4) / (1024 * 1024); // MB
            }
        });
        
        return stats;
    },
    
    // Enable/disable progressive loading
    setProgressiveLoading(enabled) {
        this.progressiveLoading = enabled;
        console.log(`Progressive loading ${enabled ? 'enabled' : 'disabled'}`);
    },
    
    // Enable/disable caching
    setCaching(enabled) {
        this.cacheEnabled = enabled;
        if (!enabled) {
            this.clearCache();
        }
        console.log(`Texture caching ${enabled ? 'enabled' : 'disabled'}`);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PLANETARY_DATA,
        SIMULATION_CONSTANTS,
        ORBITAL_MECHANICS,
        TEXTURE_MANAGER
    };
}