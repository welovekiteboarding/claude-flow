// NASA Orbital Elements - Real JPL/NASA Data
// Astronomy Data Specialist Agent - Accurate orbital mechanics from NASA JPL

// NASA JPL Orbital Elements for J2000.0 Epoch (January 1, 2000, 12:00 TT)
// Source: JPL Small-Body Database and NASA Planetary Fact Sheets
const NASA_ORBITAL_ELEMENTS = {
    // Orbital elements for major planets (J2000.0)
    // Format: [a, e, I, L, long_peri, long_node] + rates of change
    
    mercury: {
        name: "Mercury",
        // Orbital elements at J2000.0
        semiMajorAxis: 0.38709927,      // au
        eccentricity: 0.20563593,       // dimensionless
        inclination: 7.00497902,        // degrees
        meanLongitude: 252.25032350,    // degrees
        longitudePerihelion: 77.45779628, // degrees
        longitudeAscendingNode: 48.33076593, // degrees
        
        // Rates of change per century (Cy = 36525 days)
        semiMajorAxisRate: 0.00000037,
        eccentricityRate: 0.00001906,
        inclinationRate: -0.00594749,
        meanLongitudeRate: 149472.67411175,
        longitudePerihelionRate: 0.16047689,
        longitudeAscendingNodeRate: -0.12534081,
        
        // Physical characteristics from NASA
        mass: 3.3011e23,                // kg
        radius: 2439.7,                 // km
        rotationPeriod: 58.646,         // days
        obliquity: 0.034,               // degrees
        albedo: 0.068
    },
    
    venus: {
        name: "Venus",
        semiMajorAxis: 0.72333566,
        eccentricity: 0.00677672,
        inclination: 3.39467605,
        meanLongitude: 181.97909950,
        longitudePerihelion: 131.60246718,
        longitudeAscendingNode: 76.67984255,
        
        semiMajorAxisRate: 0.00000390,
        eccentricityRate: -0.00004107,
        inclinationRate: -0.00078890,
        meanLongitudeRate: 58517.81538729,
        longitudePerihelionRate: 0.00268329,
        longitudeAscendingNodeRate: -0.27769418,
        
        mass: 4.8675e24,
        radius: 6051.8,
        rotationPeriod: -243.025,       // retrograde
        obliquity: 177.36,
        albedo: 0.77
    },
    
    earth: {
        name: "Earth",
        semiMajorAxis: 1.00000261,
        eccentricity: 0.01671123,
        inclination: -0.00001531,
        meanLongitude: 100.46457166,
        longitudePerihelion: 102.93768193,
        longitudeAscendingNode: 0.0,
        
        semiMajorAxisRate: 0.00000562,
        eccentricityRate: -0.00004392,
        inclinationRate: -0.01294668,
        meanLongitudeRate: 35999.37244981,
        longitudePerihelionRate: 0.32327364,
        longitudeAscendingNodeRate: 0.0,
        
        mass: 5.9724e24,
        radius: 6371.0,
        rotationPeriod: 0.99726968,     // sidereal day
        obliquity: 23.44,
        albedo: 0.306
    },
    
    mars: {
        name: "Mars",
        semiMajorAxis: 1.52371034,
        eccentricity: 0.09339410,
        inclination: 1.84969142,
        meanLongitude: -4.55343205,
        longitudePerihelion: -23.94362959,
        longitudeAscendingNode: 49.55953891,
        
        semiMajorAxisRate: 0.00001847,
        eccentricityRate: 0.00007882,
        inclinationRate: -0.00813131,
        meanLongitudeRate: 19140.30268499,
        longitudePerihelionRate: 0.44441088,
        longitudeAscendingNodeRate: -0.29257343,
        
        mass: 6.4171e23,
        radius: 3389.5,
        rotationPeriod: 1.025957,
        obliquity: 25.19,
        albedo: 0.25
    },
    
    jupiter: {
        name: "Jupiter",
        semiMajorAxis: 5.20288700,
        eccentricity: 0.04838624,
        inclination: 1.30439695,
        meanLongitude: 34.39644051,
        longitudePerihelion: 14.72847983,
        longitudeAscendingNode: 100.47390909,
        
        semiMajorAxisRate: -0.00011607,
        eccentricityRate: -0.00013253,
        inclinationRate: -0.00183714,
        meanLongitudeRate: 3034.74612775,
        longitudePerihelionRate: 0.21252668,
        longitudeAscendingNodeRate: 0.20469106,
        
        mass: 1.8982e27,
        radius: 69911,
        rotationPeriod: 0.41354,
        obliquity: 3.13,
        albedo: 0.343
    },
    
    saturn: {
        name: "Saturn",
        semiMajorAxis: 9.53667594,
        eccentricity: 0.05386179,
        inclination: 2.48599187,
        meanLongitude: 49.95424423,
        longitudePerihelion: 92.59887831,
        longitudeAscendingNode: 113.66242448,
        
        semiMajorAxisRate: -0.00125060,
        eccentricityRate: -0.00050991,
        inclinationRate: 0.00193609,
        meanLongitudeRate: 1222.49362201,
        longitudePerihelionRate: -0.41897216,
        longitudeAscendingNodeRate: -0.28867794,
        
        mass: 5.6834e26,
        radius: 58232,
        rotationPeriod: 0.445,
        obliquity: 26.73,
        albedo: 0.342
    },
    
    uranus: {
        name: "Uranus",
        semiMajorAxis: 19.18916464,
        eccentricity: 0.04725744,
        inclination: 0.77263783,
        meanLongitude: 313.23810451,
        longitudePerihelion: 170.95427630,
        longitudeAscendingNode: 74.01692503,
        
        semiMajorAxisRate: -0.00196176,
        eccentricityRate: -0.00004397,
        inclinationRate: -0.00242939,
        meanLongitudeRate: 428.48202785,
        longitudePerihelionRate: 0.40805281,
        longitudeAscendingNodeRate: 0.04240589,
        
        mass: 8.6810e25,
        radius: 25362,
        rotationPeriod: -0.71833,       // retrograde
        obliquity: 97.77,              // extreme tilt
        albedo: 0.3
    },
    
    neptune: {
        name: "Neptune",
        semiMajorAxis: 30.06992276,
        eccentricity: 0.00859048,
        inclination: 1.77004347,
        meanLongitude: -55.12002969,
        longitudePerihelion: 44.96476227,
        longitudeAscendingNode: 131.78422574,
        
        semiMajorAxisRate: 0.00026291,
        eccentricityRate: 0.00005105,
        inclinationRate: 0.00035372,
        meanLongitudeRate: 218.45945325,
        longitudePerihelionRate: -0.32241464,
        longitudeAscendingNodeRate: -0.00508664,
        
        mass: 1.02413e26,
        radius: 24622,
        rotationPeriod: 0.6713,
        obliquity: 28.32,
        albedo: 0.29
    }
};

// Earth's Moon orbital elements (geocentric)
const MOON_ORBITAL_ELEMENTS = {
    name: "Moon",
    // Lunar orbital elements (Earth-centered)
    semiMajorAxis: 384399,             // km (mean distance)
    eccentricity: 0.0549,              // orbital eccentricity
    inclination: 5.145,                // degrees to ecliptic
    meanLongitude: 218.3164477,        // degrees
    argumentOfPerigee: 83.3532465,     // degrees
    longitudeAscendingNode: 125.1228929, // degrees
    
    // Rates per day
    meanMotion: 13.0649929509,         // degrees/day
    meanLongitudeRate: 13.0649929509,
    argumentOfPerigeeRate: 0.1114040803,
    longitudeAscendingNodeRate: -0.0529921953,
    
    // Physical characteristics
    mass: 7.342e22,                    // kg
    radius: 1737.4,                    // km
    rotationPeriod: 27.321661,         // days (tidally locked)
    obliquity: 6.687,                  // degrees
    albedo: 0.136,
    
    // Orbital characteristics
    orbitalPeriod: 27.321661,          // days
    synodicPeriod: 29.530589,          // days (lunar month)
    anomalisticPeriod: 27.554550,      // days
    tropicalPeriod: 27.321582          // days
};

// NASA JPL Ephemeris calculation functions
class NASAOrbitalMechanics {
    constructor() {
        this.J2000_EPOCH = 2451545.0;  // Julian day number for J2000.0
        this.DAYS_PER_CENTURY = 36525;
        this.AU_TO_KM = 149597870.7;
        this.DEG_TO_RAD = Math.PI / 180;
        this.RAD_TO_DEG = 180 / Math.PI;
    }
    
    // Calculate Julian day number from date
    getJulianDay(date = new Date()) {
        // Use UTC time components for astronomical calculations
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const second = date.getUTCSeconds();
        const millisecond = date.getUTCMilliseconds();
        
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        
        const jdn = day + Math.floor((153 * m + 2) / 5) + 
                   365 * y + Math.floor(y / 4) - Math.floor(y / 100) + 
                   Math.floor(y / 400) - 32045;
        
        // Calculate day fraction with millisecond precision
        const dayFraction = (hour - 12) / 24 + minute / 1440 + second / 86400 + millisecond / 86400000;
        
        return jdn + dayFraction;
    }
    
    // Calculate centuries since J2000.0
    getCenturiesSinceJ2000(julianDay) {
        return (julianDay - this.J2000_EPOCH) / this.DAYS_PER_CENTURY;
    }
    
    // Calculate orbital elements at given time
    calculateOrbitalElements(planetData, julianDay) {
        const T = this.getCenturiesSinceJ2000(julianDay);
        
        return {
            semiMajorAxis: planetData.semiMajorAxis + planetData.semiMajorAxisRate * T,
            eccentricity: planetData.eccentricity + planetData.eccentricityRate * T,
            inclination: planetData.inclination + planetData.inclinationRate * T,
            meanLongitude: planetData.meanLongitude + planetData.meanLongitudeRate * T,
            longitudePerihelion: planetData.longitudePerihelion + planetData.longitudePerihelionRate * T,
            longitudeAscendingNode: planetData.longitudeAscendingNode + planetData.longitudeAscendingNodeRate * T
        };
    }
    
    // Solve Kepler's equation for eccentric anomaly
    solveKeplersEquation(meanAnomaly, eccentricity, tolerance = 1e-8) {
        let E = meanAnomaly; // Initial guess
        let delta = 1;
        let iterations = 0;
        const maxIterations = 100;
        
        while (Math.abs(delta) > tolerance && iterations < maxIterations) {
            delta = E - eccentricity * Math.sin(E) - meanAnomaly;
            E = E - delta / (1 - eccentricity * Math.cos(E));
            iterations++;
        }
        
        return E;
    }
    
    // Calculate heliocentric position from orbital elements
    calculateHeliocentricPosition(elements, julianDay) {
        // Convert degrees to radians
        const L = elements.meanLongitude * this.DEG_TO_RAD;
        const w = elements.longitudePerihelion * this.DEG_TO_RAD;
        const Omega = elements.longitudeAscendingNode * this.DEG_TO_RAD;
        const i = elements.inclination * this.DEG_TO_RAD;
        const e = elements.eccentricity;
        const a = elements.semiMajorAxis;
        
        // Calculate mean anomaly
        const M = L - w;
        
        // Solve Kepler's equation
        const E = this.solveKeplersEquation(M, e);
        
        // Calculate true anomaly
        const nu = 2 * Math.atan2(
            Math.sqrt(1 + e) * Math.sin(E / 2),
            Math.sqrt(1 - e) * Math.cos(E / 2)
        );
        
        // Calculate distance from central body
        const r = a * (1 - e * Math.cos(E));
        
        // Calculate position in orbital plane
        const x_orb = r * Math.cos(nu);
        const y_orb = r * Math.sin(nu);
        const z_orb = 0;
        
        // Transform to heliocentric ecliptic coordinates
        const cosOmega = Math.cos(Omega);
        const sinOmega = Math.sin(Omega);
        const cosw = Math.cos(w - Omega);
        const sinw = Math.sin(w - Omega);
        const cosi = Math.cos(i);
        const sini = Math.sin(i);
        
        const x = (cosOmega * cosw - sinOmega * sinw * cosi) * x_orb +
                 (-cosOmega * sinw - sinOmega * cosw * cosi) * y_orb;
        
        const y = (sinOmega * cosw + cosOmega * sinw * cosi) * x_orb +
                 (-sinOmega * sinw + cosOmega * cosw * cosi) * y_orb;
        
        const z = (sinw * sini) * x_orb + (cosw * sini) * y_orb;
        
        return {
            x: x * this.AU_TO_KM,  // Convert to km
            y: y * this.AU_TO_KM,
            z: z * this.AU_TO_KM,
            distance: r * this.AU_TO_KM,
            trueAnomaly: nu * this.RAD_TO_DEG,
            eccentricAnomaly: E * this.RAD_TO_DEG,
            meanAnomaly: M * this.RAD_TO_DEG
        };
    }
    
    // Calculate lunar position (geocentric)
    calculateLunarPosition(julianDay) {
        const T = this.getCenturiesSinceJ2000(julianDay);
        const T2 = T * T;
        const T3 = T2 * T;
        const T4 = T3 * T;
        
        // Mean longitude of the Moon
        const L_prime = 218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + 
                       T3 / 538841 - T4 / 65194000;
        
        // Mean elongation of the Moon from the Sun
        const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + 
                 T3 / 545868 - T4 / 113065000;
        
        // Mean anomaly of the Sun
        const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + 
                 T3 / 24490000;
        
        // Mean anomaly of the Moon
        const M_prime = 134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + 
                       T3 / 69699 - T4 / 14712000;
        
        // Moon's argument of latitude
        const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - 
                 T3 / 3526000 + T4 / 863310000;
        
        // Convert to radians
        const D_rad = D * this.DEG_TO_RAD;
        const M_rad = M * this.DEG_TO_RAD;
        const M_prime_rad = M_prime * this.DEG_TO_RAD;
        const F_rad = F * this.DEG_TO_RAD;
        
        // Calculate lunar distance (simplified)
        const distance = 385000.56 + 20905.355 * Math.cos(M_prime_rad) +
                        3699.111 * Math.cos(2 * D_rad - M_prime_rad) +
                        2955.968 * Math.cos(2 * D_rad);
        
        // Calculate longitude and latitude (simplified)
        const longitude = L_prime + 6.289 * Math.sin(M_prime_rad) +
                         1.274 * Math.sin(2 * D_rad - M_prime_rad) +
                         0.658 * Math.sin(2 * D_rad);
        
        const latitude = 5.128 * Math.sin(F_rad) +
                        0.281 * Math.sin(M_prime_rad + F_rad) +
                        0.278 * Math.sin(M_prime_rad - F_rad);
        
        // Convert to Cartesian coordinates
        const lon_rad = longitude * this.DEG_TO_RAD;
        const lat_rad = latitude * this.DEG_TO_RAD;
        
        const x = distance * Math.cos(lat_rad) * Math.cos(lon_rad);
        const y = distance * Math.cos(lat_rad) * Math.sin(lon_rad);
        const z = distance * Math.sin(lat_rad);
        
        return {
            x: x,
            y: y,
            z: z,
            distance: distance,
            longitude: longitude,
            latitude: latitude
        };
    }
    
    // Get current positions for all planets
    getAllPlanetPositions(date = new Date()) {
        const julianDay = this.getJulianDay(date);
        const positions = {};
        
        for (const [planetName, planetData] of Object.entries(NASA_ORBITAL_ELEMENTS)) {
            const elements = this.calculateOrbitalElements(planetData, julianDay);
            positions[planetName] = this.calculateHeliocentricPosition(elements, julianDay);
        }
        
        // Add Moon position (geocentric)
        positions.moon = this.calculateLunarPosition(julianDay);
        
        return positions;
    }
    
    // Convert NASA data to simulation coordinates
    convertToSimulationCoordinates(nasaPosition, scaleFactor = 1e-7) {
        return {
            x: nasaPosition.x * scaleFactor,
            y: nasaPosition.z * scaleFactor, // Y-up in Three.js
            z: -nasaPosition.y * scaleFactor // Correct handedness
        };
    }
}

// Singleton instance for orbital calculations
const nasaOrbitalMechanics = new NASAOrbitalMechanics();

// Make variables globally available for browser use
if (typeof window !== 'undefined') {
    window.NASA_ORBITAL_ELEMENTS = NASA_ORBITAL_ELEMENTS;
    window.MOON_ORBITAL_ELEMENTS = MOON_ORBITAL_ELEMENTS;
    window.NASAOrbitalMechanics = NASAOrbitalMechanics;
    window.nasaOrbitalMechanics = nasaOrbitalMechanics;
}

// Export for use in main simulation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NASA_ORBITAL_ELEMENTS,
        MOON_ORBITAL_ELEMENTS,
        NASAOrbitalMechanics,
        nasaOrbitalMechanics
    };
}