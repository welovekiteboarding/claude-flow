// NASA HORIZONS API Integration - Real-time Astronomical Data
// State-of-the-art integration with JPL's HORIZONS system for live planetary ephemeris

class NASAHorizonsAPI {
    constructor() {
        this.baseURL = 'https://ssd.jpl.nasa.gov/api/horizons.api';
        this.batchURL = 'https://ssd.jpl.nasa.gov/api/horizons_batch.api';
        this.smallBodyURL = 'https://ssd.jpl.nasa.gov/api/sbdb.api';
        
        // Cache for API responses
        this.cache = new Map();
        this.cacheTimeout = 3600000; // 1 hour
        
        // Rate limiting
        this.requestQueue = [];
        this.isProcessing = false;
        this.maxRequestsPerSecond = 10;
        
        // Supported celestial bodies (HORIZONS body IDs)
        this.bodyIDs = {
            sun: '10',
            mercury: '199',
            venus: '299',
            earth: '399',
            mars: '499',
            jupiter: '599',
            saturn: '699',
            uranus: '799',
            neptune: '899',
            moon: '301',
            io: '501',
            europa: '502',
            ganymede: '503',
            callisto: '504',
            titan: '606',
            enceladus: '602',
            triton: '801'
        };
        
        // Observer location codes
        this.observerCodes = {
            geocentric: '500',
            sun: '10',
            earth_surface: '399',
            moon: '301'
        };
        
        console.log('NASA HORIZONS API initialized');
    }
    
    // Get real-time ephemeris data for a celestial body
    async getEphemeris(bodyName, startTime, endTime, options = {}) {
        const cacheKey = `${bodyName}_${startTime}_${endTime}_${JSON.stringify(options)}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`Using cached ephemeris for ${bodyName}`);
                return cached.data;
            }
        }
        
        const bodyID = this.bodyIDs[bodyName.toLowerCase()];
        if (!bodyID) {
            throw new Error(`Unsupported celestial body: ${bodyName}`);
        }
        
        const params = {
            format: 'json',
            COMMAND: bodyID,
            OBJ_DATA: 'YES',
            MAKE_EPHEM: 'YES',
            EPHEM_TYPE: 'VECTORS',
            CENTER: options.center || '500@10', // Geocentric
            START_TIME: this.formatDate(startTime),
            STOP_TIME: this.formatDate(endTime),
            STEP_SIZE: options.stepSize || '1h',
            OUT_UNITS: 'AU-D',
            VEC_TABLE: '2',
            REF_PLANE: 'ECLIPTIC',
            REF_SYSTEM: 'J2000',
            VEC_CORR: 'NONE',
            TIME_DIGITS: 'FRACSEC',
            RANGE_UNITS: 'AU',
            APPARENT: 'GEOMETRIC',
            SOLAR_ELONG: '0,180',
            SKIP_DAYLT: 'NO',
            EXTRA_PREC: 'NO',
            R_T_S_ONLY: 'NO',
            CSV_FORMAT: 'NO'
        };
        
        try {
            const response = await this.makeRequest(params);
            const ephemeris = this.parseEphemerisResponse(response);
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: ephemeris,
                timestamp: Date.now()
            });
            
            console.log(`Retrieved ephemeris for ${bodyName}: ${ephemeris.length} data points`);
            return ephemeris;
            
        } catch (error) {
            console.error(`Failed to get ephemeris for ${bodyName}:`, error);
            throw error;
        }
    }
    
    // Get current position and velocity for a celestial body
    async getCurrentState(bodyName, observerLocation = 'geocentric') {
        const now = new Date();
        const oneHour = new Date(now.getTime() + 3600000); // 1 hour from now
        
        const ephemeris = await this.getEphemeris(bodyName, now, oneHour, {
            center: this.observerCodes[observerLocation] || '500@10',
            stepSize: '1h'
        });
        
        if (ephemeris.length === 0) {
            throw new Error(`No ephemeris data available for ${bodyName}`);
        }
        
        const currentState = ephemeris[0];
        return {
            position: {
                x: currentState.x,
                y: currentState.y,
                z: currentState.z
            },
            velocity: {
                vx: currentState.vx,
                vy: currentState.vy,
                vz: currentState.vz
            },
            timestamp: currentState.timestamp,
            julianDate: currentState.julianDate
        };
    }
    
    // Get orbital elements for a celestial body
    async getOrbitalElements(bodyName, epoch = null) {
        const bodyID = this.bodyIDs[bodyName.toLowerCase()];
        if (!bodyID) {
            throw new Error(`Unsupported celestial body: ${bodyName}`);
        }
        
        const epochDate = epoch || new Date();
        
        const params = {
            format: 'json',
            COMMAND: bodyID,
            OBJ_DATA: 'YES',
            MAKE_EPHEM: 'YES',
            EPHEM_TYPE: 'ELEMENTS',
            CENTER: '500@10',
            START_TIME: this.formatDate(epochDate),
            STOP_TIME: this.formatDate(epochDate),
            STEP_SIZE: '1d',
            OUT_UNITS: 'AU-D',
            REF_PLANE: 'ECLIPTIC',
            REF_SYSTEM: 'J2000',
            TP_TYPE: 'ABSOLUTE',
            ELEM_LABELS: 'YES',
            ELM_LABELS: 'YES',
            TIME_DIGITS: 'FRACSEC'
        };
        
        try {
            const response = await this.makeRequest(params);
            const elements = this.parseElementsResponse(response);
            
            console.log(`Retrieved orbital elements for ${bodyName}`);
            return elements;
            
        } catch (error) {
            console.error(`Failed to get orbital elements for ${bodyName}:`, error);
            throw error;
        }
    }
    
    // Get physical characteristics of a celestial body
    async getPhysicalData(bodyName) {
        const bodyID = this.bodyIDs[bodyName.toLowerCase()];
        if (!bodyID) {
            throw new Error(`Unsupported celestial body: ${bodyName}`);
        }
        
        const params = {
            format: 'json',
            COMMAND: bodyID,
            OBJ_DATA: 'YES',
            MAKE_EPHEM: 'NO'
        };
        
        try {
            const response = await this.makeRequest(params);
            const physicalData = this.parsePhysicalDataResponse(response);
            
            console.log(`Retrieved physical data for ${bodyName}`);
            return physicalData;
            
        } catch (error) {
            console.error(`Failed to get physical data for ${bodyName}:`, error);
            throw error;
        }
    }
    
    // Get asteroid or comet data
    async getSmallBodyData(designation) {
        const params = {
            sstr: designation,
            full_precision: true
        };
        
        try {
            const response = await fetch(this.smallBodyURL + '?' + new URLSearchParams(params));
            const data = await response.json();
            
            if (data.code !== '200') {
                throw new Error(`SBDB API error: ${data.message}`);
            }
            
            return this.parseSmallBodyResponse(data);
            
        } catch (error) {
            console.error(`Failed to get small body data for ${designation}:`, error);
            throw error;
        }
    }
    
    // Make HTTP request with rate limiting
    async makeRequest(params) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ params, resolve, reject });
            this.processQueue();
        });
    }
    
    // Process request queue with rate limiting
    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        
        while (this.requestQueue.length > 0) {
            const { params, resolve, reject } = this.requestQueue.shift();
            
            try {
                const url = this.baseURL + '?' + new URLSearchParams(params);
                const response = await fetch(url);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.result) {
                    resolve(data);
                } else {
                    reject(new Error(`API error: ${data.message || 'Unknown error'}`));
                }
                
            } catch (error) {
                reject(error);
            }
            
            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 1000 / this.maxRequestsPerSecond));
        }
        
        this.isProcessing = false;
    }
    
    // Parse ephemeris response from HORIZONS
    parseEphemerisResponse(response) {
        const ephemeris = [];
        
        if (!response.result || !response.result.includes('$$SOE')) {
            return ephemeris;
        }
        
        const lines = response.result.split('\n');
        let inDataSection = false;
        
        for (const line of lines) {
            if (line.includes('$$SOE')) {
                inDataSection = true;
                continue;
            }
            if (line.includes('$$EOE')) {
                inDataSection = false;
                break;
            }
            
            if (inDataSection && line.trim()) {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 7) {
                    const jd = parseFloat(parts[0]);
                    const timestamp = this.julianToDate(jd);
                    
                    ephemeris.push({
                        julianDate: jd,
                        timestamp: timestamp,
                        x: parseFloat(parts[2]),
                        y: parseFloat(parts[3]),
                        z: parseFloat(parts[4]),
                        vx: parseFloat(parts[5]),
                        vy: parseFloat(parts[6]),
                        vz: parseFloat(parts[7])
                    });
                }
            }
        }
        
        return ephemeris;
    }
    
    // Parse orbital elements response
    parseElementsResponse(response) {
        const elements = {};
        
        if (!response.result || !response.result.includes('$$SOE')) {
            return elements;
        }
        
        const lines = response.result.split('\n');
        let inDataSection = false;
        
        for (const line of lines) {
            if (line.includes('$$SOE')) {
                inDataSection = true;
                continue;
            }
            if (line.includes('$$EOE')) {
                inDataSection = false;
                break;
            }
            
            if (inDataSection && line.trim()) {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 8) {
                    elements.julianDate = parseFloat(parts[0]);
                    elements.eccentricity = parseFloat(parts[1]);
                    elements.periapsis = parseFloat(parts[2]);
                    elements.inclination = parseFloat(parts[3]);
                    elements.longitudeNode = parseFloat(parts[4]);
                    elements.argumentPeriapsis = parseFloat(parts[5]);
                    elements.meanAnomaly = parseFloat(parts[6]);
                    elements.semiMajorAxis = parseFloat(parts[7]);
                    break;
                }
            }
        }
        
        return elements;
    }
    
    // Parse physical data response
    parsePhysicalDataResponse(response) {
        const physicalData = {};
        
        if (!response.result) {
            return physicalData;
        }
        
        const lines = response.result.split('\n');
        
        for (const line of lines) {
            // Extract mass if available
            if (line.includes('Mass')) {
                const match = line.match(/Mass.*?([\d.]+e[+-]?\d+)/i);
                if (match) {
                    physicalData.mass = parseFloat(match[1]);
                }
            }
            
            // Extract radius if available
            if (line.includes('radius') || line.includes('Radius')) {
                const match = line.match(/([\d.]+)\s*km/i);
                if (match) {
                    physicalData.radius = parseFloat(match[1]) * 1000; // Convert to meters
                }
            }
            
            // Extract rotation period if available
            if (line.includes('rotation') || line.includes('Rotation')) {
                const match = line.match(/([\d.]+)\s*h/i);
                if (match) {
                    physicalData.rotationPeriod = parseFloat(match[1]) / 24; // Convert to days
                }
            }
        }
        
        return physicalData;
    }
    
    // Parse small body response
    parseSmallBodyResponse(response) {
        const data = response.object;
        
        return {
            name: data.fullname,
            designation: data.des,
            orbit: {
                eccentricity: parseFloat(data.orbit.e),
                semiMajorAxis: parseFloat(data.orbit.a),
                inclination: parseFloat(data.orbit.i),
                longitudeNode: parseFloat(data.orbit.om),
                argumentPeriapsis: parseFloat(data.orbit.w),
                meanAnomaly: parseFloat(data.orbit.ma),
                epoch: parseFloat(data.orbit.epoch)
            },
            physical: {
                diameter: data.phys_par ? parseFloat(data.phys_par.diameter) : null,
                albedo: data.phys_par ? parseFloat(data.phys_par.albedo) : null,
                rotationPeriod: data.phys_par ? parseFloat(data.phys_par.rot_per) : null
            }
        };
    }
    
    // Format date for HORIZONS API
    formatDate(date) {
        return date.toISOString().replace('T', ' ').replace('Z', '');
    }
    
    // Convert Julian date to JavaScript Date
    julianToDate(julianDate) {
        return new Date((julianDate - 2440587.5) * 86400000);
    }
    
    // Convert JavaScript Date to Julian date
    dateToJulian(date) {
        return (date.getTime() / 86400000) + 2440587.5;
    }
    
    // Get multiple bodies' ephemeris in batch
    async getBatchEphemeris(bodyNames, startTime, endTime, options = {}) {
        const promises = bodyNames.map(name => 
            this.getEphemeris(name, startTime, endTime, options)
        );
        
        try {
            const results = await Promise.all(promises);
            const batchData = {};
            
            bodyNames.forEach((name, index) => {
                batchData[name] = results[index];
            });
            
            return batchData;
            
        } catch (error) {
            console.error('Batch ephemeris request failed:', error);
            throw error;
        }
    }
    
    // Get real-time solar system snapshot
    async getSolarSystemSnapshot() {
        const bodies = ['sun', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
        const now = new Date();
        
        try {
            const states = {};
            
            for (const bodyName of bodies) {
                states[bodyName] = await this.getCurrentState(bodyName);
            }
            
            return {
                timestamp: now.toISOString(),
                bodies: states
            };
            
        } catch (error) {
            console.error('Failed to get solar system snapshot:', error);
            throw error;
        }
    }
    
    // Validate ephemeris data
    validateEphemerisData(ephemeris) {
        return ephemeris.every(point => {
            return !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z) &&
                   !isNaN(point.vx) && !isNaN(point.vy) && !isNaN(point.vz) &&
                   point.timestamp instanceof Date;
        });
    }
    
    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('NASA HORIZONS API cache cleared');
    }
    
    // Get cache statistics
    getCacheStats() {
        const stats = {
            totalEntries: this.cache.size,
            totalSize: 0,
            oldestEntry: null,
            newestEntry: null
        };
        
        this.cache.forEach((value, key) => {
            stats.totalSize += JSON.stringify(value).length;
            
            if (!stats.oldestEntry || value.timestamp < stats.oldestEntry) {
                stats.oldestEntry = value.timestamp;
            }
            
            if (!stats.newestEntry || value.timestamp > stats.newestEntry) {
                stats.newestEntry = value.timestamp;
            }
        });
        
        return stats;
    }
    
    // Set cache timeout
    setCacheTimeout(timeout) {
        this.cacheTimeout = timeout;
        console.log(`Cache timeout set to ${timeout}ms`);
    }
    
    // Set rate limiting
    setRateLimit(requestsPerSecond) {
        this.maxRequestsPerSecond = requestsPerSecond;
        console.log(`Rate limit set to ${requestsPerSecond} requests/second`);
    }
    
    // Check API availability
    async checkAPIAvailability() {
        try {
            const response = await this.getCurrentState('earth');
            return {
                available: true,
                latency: Date.now() - response.timestamp.getTime(),
                message: 'API is available'
            };
        } catch (error) {
            return {
                available: false,
                latency: null,
                message: error.message
            };
        }
    }
    
    // Cleanup
    dispose() {
        this.clearCache();
        this.requestQueue = [];
        this.isProcessing = false;
        console.log('NASA HORIZONS API disposed');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NASAHorizonsAPI;
}