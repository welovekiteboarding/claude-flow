// Physics Constants and Enhanced Data for Advanced Solar System Simulation
// Real astronomical and physical constants for accurate N-body dynamics

/**
 * Fundamental Physical Constants
 */
const PHYSICS_CONSTANTS = {
    // Universal constants
    G: 6.67430e-11,           // Gravitational constant (m³/kg⋅s²)
    c: 299792458,             // Speed of light (m/s)
    h: 6.62607015e-34,        // Planck constant (J⋅s)
    k_B: 1.380649e-23,        // Boltzmann constant (J/K)
    
    // Astronomical constants
    AU: 1.495978707e11,       // Astronomical Unit (m)
    PARSEC: 3.0857e16,        // Parsec (m)
    SOLAR_MASS: 1.98847e30,   // Solar mass (kg)
    EARTH_MASS: 5.972168e24,  // Earth mass (kg)
    LUNAR_MASS: 7.342e22,     // Lunar mass (kg)
    
    // Solar system reference values
    SOLAR_RADIUS: 6.96e8,     // Solar radius (m)
    EARTH_RADIUS: 6.371e6,    // Earth radius (m)
    LUNAR_RADIUS: 1.737e6,    // Lunar radius (m)
    
    // Time constants
    SIDEREAL_YEAR: 31558149.504,  // Sidereal year (s)
    SIDEREAL_DAY: 86164.0905,     // Sidereal day (s)
    TROPICAL_YEAR: 31556925.1,    // Tropical year (s)
    
    // Relativistic parameters
    SCHWARZSCHILD_SUN: 2.95e3,    // Schwarzschild radius of Sun (m)
    EINSTEIN_RADIUS: 8.87e-13,    // Einstein radius (m)
    
    // Tidal parameters
    ROCHE_LIMIT_FACTOR: 2.44,     // Roche limit factor
    LOVE_NUMBER_EARTH: 0.299,     // Earth Love number
    LOVE_NUMBER_MOON: 0.024,      // Moon Love number
};

/**
 * Enhanced Celestial Body Data with Advanced Physics Parameters
 */
const ENHANCED_BODY_DATA = {
    sun: {
        // Basic properties
        name: "Sun",
        mass: 1.98847e30,           // kg
        radius: 6.96e8,             // m
        position: [0, 0, 0],        // m (heliocentric)
        velocity: [0, 0, 0],        // m/s
        
        // Gravitational parameters
        GM: 1.3271244e20,           // Standard gravitational parameter (m³/s²)
        J2: 2.0e-7,                 // Quadrupole moment
        J4: -2.0e-14,               // Fourth-order moment
        
        // Physical characteristics
        density: 1408,              // kg/m³
        surfaceGravity: 274.0,      // m/s²
        escapeVelocity: 617500,     // m/s
        rotationPeriod: 2.164e6,    // s (25.05 days)
        obliquity: 0.127,           // radians (7.25°)
        
        // Thermal properties
        luminosity: 3.828e26,       // W
        effectiveTemperature: 5778, // K
        surfaceTemperature: 5778,   // K
        
        // Magnetic field
        magneticMoment: 6.4e22,     // A⋅m²
        magneticFieldStrength: 1e-4, // T at surface
        
        // Advanced properties
        tidalParameter: 0,          // No tidal effects on Sun
        relativistic: true,         // Include relativistic effects
        bodyType: 'star'
    },
    
    mercury: {
        name: "Mercury",
        mass: 3.3011e23,
        radius: 2.4397e6,
        
        // Orbital elements (will be set dynamically)
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        // Gravitational parameters
        GM: 2.2032e13,
        J2: 5.0e-5,
        J4: 0,
        
        // Physical characteristics
        density: 5427,
        surfaceGravity: 3.7,
        escapeVelocity: 4250,
        rotationPeriod: 5.067e6,    // s (58.646 days)
        obliquity: 0.034,           // radians (2°)
        
        // Thermal properties
        meanTemperature: 440,       // K (167°C)
        albedo: 0.068,
        
        // Orbital characteristics
        semiMajorAxis: 5.79e10,     // m (0.387 AU)
        eccentricity: 0.2056,
        inclination: 0.122,         // radians (7°)
        orbitalPeriod: 7.6e6,       // s (87.97 days)
        
        // Advanced properties
        tidalParameter: 0.1,
        relativistic: true,         // Important for perihelion precession
        precessionRate: 5.75e-7,    // rad/s (43"/century)
        bodyType: 'terrestrial'
    },
    
    venus: {
        name: "Venus",
        mass: 4.8675e24,
        radius: 6.0518e6,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 3.2486e14,
        J2: 4.458e-6,
        J4: 0,
        
        density: 5243,
        surfaceGravity: 8.87,
        escapeVelocity: 10360,
        rotationPeriod: -2.1e7,     // s (retrograde, 243 days)
        obliquity: 3.095,           // radians (177.4°)
        
        meanTemperature: 737,       // K (464°C)
        albedo: 0.77,
        
        semiMajorAxis: 1.082e11,    // m (0.723 AU)
        eccentricity: 0.0067,
        inclination: 0.059,         // radians (3.4°)
        orbitalPeriod: 1.94e7,      // s (224.7 days)
        
        tidalParameter: 0.05,
        relativistic: false,
        atmosphericMass: 4.8e20,    // kg (massive atmosphere)
        bodyType: 'terrestrial'
    },
    
    earth: {
        name: "Earth",
        mass: 5.972168e24,
        radius: 6.371e6,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 3.986004418e14,
        J2: 1.08263e-3,             // Important for satellite orbits
        J4: -1.61e-6,
        
        density: 5514,
        surfaceGravity: 9.80665,
        escapeVelocity: 11180,
        rotationPeriod: 86164.0905, // s (sidereal day)
        obliquity: 0.4091,          // radians (23.44°)
        
        meanTemperature: 288,       // K (15°C)
        albedo: 0.306,
        
        semiMajorAxis: 1.496e11,    // m (1 AU)
        eccentricity: 0.0167,
        inclination: 0,             // radians (reference plane)
        orbitalPeriod: 3.156e7,     // s (365.25 days)
        
        // Advanced Earth properties
        tidalParameter: 1.0,        // Strong tidal effects with Moon
        relativistic: false,
        loveNumber: 0.299,          // Tidal Love number
        tidalQLater: 12,            // Tidal quality factor
        
        // Precession parameters
        precessionPeriod: 8.2e11,   // s (26,000 years)
        nutationAmplitude: 1.7e-4,  // radians (9.2")
        
        bodyType: 'terrestrial'
    },
    
    mars: {
        name: "Mars",
        mass: 6.4171e23,
        radius: 3.3895e6,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 4.282837e13,
        J2: 1.964e-3,
        J4: -1.8e-5,
        
        density: 3933,
        surfaceGravity: 3.71,
        escapeVelocity: 5030,
        rotationPeriod: 88775,      // s (24.62 hours)
        obliquity: 0.4397,          // radians (25.19°)
        
        meanTemperature: 210,       // K (-63°C)
        albedo: 0.25,
        
        semiMajorAxis: 2.279e11,    // m (1.52 AU)
        eccentricity: 0.0934,
        inclination: 0.0323,        // radians (1.85°)
        orbitalPeriod: 5.94e7,      // s (687 days)
        
        tidalParameter: 0.02,
        relativistic: false,
        bodyType: 'terrestrial'
    },
    
    jupiter: {
        name: "Jupiter",
        mass: 1.8982e27,
        radius: 6.9911e7,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 1.26686534e17,
        J2: 1.4697e-2,              // Strong oblateness
        J4: -5.84e-4,
        J6: 0.31e-4,
        
        density: 1326,
        surfaceGravity: 24.79,
        escapeVelocity: 59500,
        rotationPeriod: 35730,      // s (9.925 hours)
        obliquity: 0.0546,          // radians (3.13°)
        
        meanTemperature: 165,       // K (-108°C)
        albedo: 0.343,
        
        semiMajorAxis: 7.786e11,    // m (5.20 AU)
        eccentricity: 0.0489,
        inclination: 0.0227,        // radians (1.30°)
        orbitalPeriod: 3.74e8,      // s (11.86 years)
        
        // Gas giant properties
        tidalParameter: 0.8,        // Strong tidal effects on moons
        relativistic: false,
        magneticMoment: 1.55e27,    // A⋅m²
        magnetosphere: true,
        
        bodyType: 'gas_giant'
    },
    
    saturn: {
        name: "Saturn",
        mass: 5.6834e26,
        radius: 5.8232e7,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 3.7931187e16,
        J2: 1.645e-2,               // Very oblate
        J4: -9.19e-4,
        J6: 8.0e-5,
        
        density: 687,               // Less dense than water
        surfaceGravity: 10.44,
        escapeVelocity: 35500,
        rotationPeriod: 38052,      // s (10.57 hours)
        obliquity: 0.4665,          // radians (26.73°)
        
        meanTemperature: 134,       // K (-139°C)
        albedo: 0.342,
        
        semiMajorAxis: 1.432e12,    // m (9.57 AU)
        eccentricity: 0.0565,
        inclination: 0.0434,        // radians (2.49°)
        orbitalPeriod: 9.29e8,      // s (29.46 years)
        
        // Ring system
        tidalParameter: 0.6,
        relativistic: false,
        ringSystem: true,
        ringsInnerRadius: 7.0e7,    // m
        ringsOuterRadius: 1.4e8,    // m
        
        bodyType: 'gas_giant'
    },
    
    uranus: {
        name: "Uranus",
        mass: 8.6810e25,
        radius: 2.5362e7,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 5.793939e15,
        J2: 3.343e-3,
        J4: -3.0e-5,
        
        density: 1271,
        surfaceGravity: 8.69,
        escapeVelocity: 21300,
        rotationPeriod: -62063,     // s (retrograde, 17.24 hours)
        obliquity: 1.706,           // radians (97.77°) - on its side!
        
        meanTemperature: 76,        // K (-197°C)
        albedo: 0.30,
        
        semiMajorAxis: 2.867e12,    // m (19.16 AU)
        eccentricity: 0.0463,
        inclination: 0.0135,        // radians (0.77°)
        orbitalPeriod: 2.65e9,      // s (84.01 years)
        
        tidalParameter: 0.2,
        relativistic: false,
        bodyType: 'ice_giant'
    },
    
    neptune: {
        name: "Neptune",
        mass: 1.02413e26,
        radius: 2.4622e7,
        
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        
        GM: 6.836529e15,
        J2: 3.411e-3,
        J4: -3.3e-5,
        
        density: 1638,
        surfaceGravity: 11.15,
        escapeVelocity: 23500,
        rotationPeriod: 57996,      // s (16.11 hours)
        obliquity: 0.4943,          // radians (28.32°)
        
        meanTemperature: 72,        // K (-201°C)
        albedo: 0.29,
        
        semiMajorAxis: 4.515e12,    // m (30.18 AU)
        eccentricity: 0.0113,
        inclination: 0.0309,        // radians (1.77°)
        orbitalPeriod: 5.20e9,      // s (164.8 years)
        
        tidalParameter: 0.1,
        relativistic: false,
        bodyType: 'ice_giant'
    },
    
    moon: {
        name: "Moon",
        mass: 7.342e22,
        radius: 1.737e6,
        
        position: [0, 0, 0],        // Will be set relative to Earth
        velocity: [0, 0, 0],
        
        GM: 4.9048695e12,
        J2: 2.027e-4,
        J4: 0,
        
        density: 3344,
        surfaceGravity: 1.62,
        escapeVelocity: 2380,
        rotationPeriod: 2.36e6,     // s (tidally locked)
        obliquity: 0.0267,          // radians (1.53°)
        
        meanTemperature: 220,       // K (-53°C)
        albedo: 0.136,
        
        // Lunar orbital parameters (geocentric)
        semiMajorAxis: 3.844e8,     // m (384,400 km)
        eccentricity: 0.0549,
        inclination: 0.0898,        // radians (5.145°)
        orbitalPeriod: 2.36e6,      // s (27.32 days)
        
        // Tidal properties
        tidalParameter: 1.5,        // Strong tidal coupling with Earth
        relativistic: false,
        loveNumber: 0.024,
        tidalQLater: 27,
        
        // Orbital evolution
        recessionRate: 3.8e-2,      // m/year (3.8 cm/year)
        
        bodyType: 'satellite'
    }
};

/**
 * Lagrange Point Systems
 */
const LAGRANGE_SYSTEMS = [
    { primary: 'sun', secondary: 'earth', name: 'Sun-Earth' },
    { primary: 'earth', secondary: 'moon', name: 'Earth-Moon' },
    { primary: 'sun', secondary: 'jupiter', name: 'Sun-Jupiter' },
    { primary: 'sun', secondary: 'mars', name: 'Sun-Mars' }
];

/**
 * Tidal Force Pairs
 */
const TIDAL_PAIRS = [
    { primary: 'earth', secondary: 'moon', strength: 1.0, type: 'synchronous' },
    { primary: 'sun', secondary: 'mercury', strength: 0.3, type: 'solar' },
    { primary: 'jupiter', secondary: 'io', strength: 0.8, type: 'satellite' },
    { primary: 'jupiter', secondary: 'europa', strength: 0.6, type: 'satellite' },
    { primary: 'saturn', secondary: 'titan', strength: 0.4, type: 'satellite' }
];

/**
 * Relativistic Effects Configuration
 */
const RELATIVISTIC_EFFECTS = {
    mercury: {
        perihelionPrecession: true,
        framedraggery: false,
        geodetic: false
    },
    earth: {
        perihelionPrecession: false,
        framedraggery: true,  // Earth's rotation affects spacetime
        geodetic: true        // Gravitomagnetic effects
    },
    jupiter: {
        perihelionPrecession: false,
        framedraggery: true,  // Massive rotating body
        geodetic: false
    }
};

/**
 * Perturbation Sources
 */
const PERTURBATIONS = {
    j2_oblateness: {
        earth: 1.08263e-3,
        jupiter: 1.4697e-2,
        saturn: 1.645e-2,
        mars: 1.964e-3,
        neptune: 3.411e-3,
        uranus: 3.343e-3
    },
    solar_radiation_pressure: {
        coefficient: 1.0,           // For small bodies
        affected_bodies: ['moon']   // Affects spacecraft more
    },
    asteroid_perturbations: {
        ceres: { mass: 9.1e20, position: [4.14e11, 0, 0] },
        vesta: { mass: 2.6e20, position: [3.53e11, 0, 0] },
        pallas: { mass: 2.0e20, position: [4.14e11, 0, 0] }
    }
};

/**
 * Simulation Parameters
 */
const ADVANCED_SIMULATION_CONFIG = {
    // Integration parameters
    integrationMethod: 'verlet',   // or 'rk4', 'leapfrog'
    adaptiveTimestepping: true,
    maxTimestep: 3600,            // seconds (1 hour)
    minTimestep: 60,              // seconds (1 minute)
    tolerance: 1e-12,             // Integration tolerance
    
    // Physics toggles
    enableNBodyGravity: true,
    enableRelativisticEffects: true,
    enableTidalForces: true,
    enableJ2Perturbations: true,
    enableRadiationPressure: false,
    enableAsteroidPerturbations: false,
    
    // Performance settings
    useGPUAcceleration: true,
    maxGPUBodies: 1000,
    updateFrequency: 60,          // Hz
    
    // Visualization parameters
    trajectoryLength: 1000,       // Points to keep in trails
    fieldVisualization: false,    // Gravitational field lines
    lagrangePointDisplay: true,
    tidalFieldDisplay: false,
    
    // Coordinate systems
    coordinateSystem: 'heliocentric', // or 'barycentric', 'geocentric'
    referenceFrame: 'j2000',          // or 'ecliptic', 'equatorial'
    
    // Data output
    exportTrajectories: false,
    exportInterval: 86400,        // seconds (1 day)
    highPrecisionOutput: false
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PHYSICS_CONSTANTS,
        ENHANCED_BODY_DATA,
        LAGRANGE_SYSTEMS,
        TIDAL_PAIRS,
        RELATIVISTIC_EFFECTS,
        PERTURBATIONS,
        ADVANCED_SIMULATION_CONFIG
    };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.PHYSICS_CONSTANTS = PHYSICS_CONSTANTS;
    window.ENHANCED_BODY_DATA = ENHANCED_BODY_DATA;
    window.LAGRANGE_SYSTEMS = LAGRANGE_SYSTEMS;
    window.TIDAL_PAIRS = TIDAL_PAIRS;
    window.RELATIVISTIC_EFFECTS = RELATIVISTIC_EFFECTS;
    window.PERTURBATIONS = PERTURBATIONS;
    window.ADVANCED_SIMULATION_CONFIG = ADVANCED_SIMULATION_CONFIG;
}