// Weather API Sample Code Snippets for Top 2 Recommendations
// Research conducted by Hive Mind Weather API Researcher

// TOP RECOMMENDATION #1: Tomorrow.io Weather API
// Rationale: Best overall accuracy, 80+ data layers, 99.9% uptime

const fetchTomorrowIOWeather = async (latitude, longitude, apiKey) => {
  const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,humidity,windSpeed,precipitationIntensity&timesteps=current&units=metric&apikey=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Tomorrow.io Response Structure:
    // {
    //   "data": {
    //     "timelines": [{
    //       "timestep": "current",
    //       "intervals": [{
    //         "startTime": "2025-07-21T20:57:00Z",
    //         "values": {
    //           "temperature": 22.5,
    //           "humidity": 65,
    //           "windSpeed": 3.2,
    //           "precipitationIntensity": 0
    //         }
    //       }]
    //     }]
    //   }
    // }
    
    return {
      temperature: data.data.timelines[0].intervals[0].values.temperature,
      humidity: data.data.timelines[0].intervals[0].values.humidity,
      windSpeed: data.data.timelines[0].intervals[0].values.windSpeed,
      precipitation: data.data.timelines[0].intervals[0].values.precipitationIntensity
    };
  } catch (error) {
    throw new Error(`Tomorrow.io API Error: ${error.message}`);
  }
};

// TOP RECOMMENDATION #2: OpenWeatherMap API  
// Rationale: Most generous free tier (1000 calls/day), mature ecosystem

const fetchOpenWeatherMapWeather = async (latitude, longitude, apiKey) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // OpenWeatherMap Response Structure:
    // {
    //   "coord": { "lon": -73.99, "lat": 40.75 },
    //   "weather": [{ "id": 800, "main": "Clear", "description": "clear sky", "icon": "01d" }],
    //   "base": "stations",
    //   "main": {
    //     "temp": 22.5, "feels_like": 24.1, "temp_min": 20.2, "temp_max": 25.1,
    //     "pressure": 1013, "humidity": 65
    //   },
    //   "visibility": 10000,
    //   "wind": { "speed": 3.2, "deg": 180 },
    //   "clouds": { "all": 0 },
    //   "dt": 1721598420,
    //   "sys": { "type": 2, "id": 2039034, "country": "US", "sunrise": 1721559542, "sunset": 1721611021 },
    //   "timezone": -14400,
    //   "id": 5128581,
    //   "name": "New York",
    //   "cod": 200
    // }
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      pressure: data.main.pressure
    };
  } catch (error) {
    throw new Error(`OpenWeatherMap API Error: ${error.message}`);
  }
};

// BACKUP RECOMMENDATION: Visual Crossing API
// Rationale: Best free tier (1000 records/day), lowest pay-as-you-go costs

const fetchVisualCrossingWeather = async (location, apiKey) => {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?unitGroup=metric&include=current&key=${apiKey}&contentType=json`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Visual Crossing Response Structure:
    // {
    //   "queryCost": 1,
    //   "latitude": 40.75,
    //   "longitude": -73.99,
    //   "resolvedAddress": "New York, NY, United States",
    //   "address": "New York",
    //   "timezone": "America/New_York",
    //   "tzoffset": -4.0,
    //   "currentConditions": {
    //     "datetime": "20:57:00",
    //     "temp": 22.5,
    //     "humidity": 65.0,
    //     "windspeed": 11.5,
    //     "conditions": "Clear"
    //   }
    // }
    
    return {
      temperature: data.currentConditions.temp,
      humidity: data.currentConditions.humidity,
      windSpeed: data.currentConditions.windspeed,
      conditions: data.currentConditions.conditions
    };
  } catch (error) {
    throw new Error(`Visual Crossing API Error: ${error.message}`);
  }
};

// Usage Examples
const testWeatherAPIs = async () => {
  const lat = 40.7589; // New York latitude
  const lon = -73.9851; // New York longitude
  
  // Note: Replace with actual API keys
  const tomorrowApiKey = 'YOUR_TOMORROW_IO_API_KEY';
  const openWeatherApiKey = 'YOUR_OPENWEATHER_API_KEY';
  const visualCrossingApiKey = 'YOUR_VISUAL_CROSSING_API_KEY';
  
  try {
    console.log('Testing Tomorrow.io API...');
    const tomorrowData = await fetchTomorrowIOWeather(lat, lon, tomorrowApiKey);
    console.log('Tomorrow.io:', tomorrowData);
    
    console.log('Testing OpenWeatherMap API...');
    const openWeatherData = await fetchOpenWeatherMapWeather(lat, lon, openWeatherApiKey);
    console.log('OpenWeatherMap:', openWeatherData);
    
    console.log('Testing Visual Crossing API...');
    const visualCrossingData = await fetchVisualCrossingWeather('New York', visualCrossingApiKey);
    console.log('Visual Crossing:', visualCrossingData);
    
  } catch (error) {
    console.error('API Test Error:', error.message);
  }
};

// Primary + Backup Strategy Implementation
class WeatherAPIManager {
  constructor(primaryApiKey, backupApiKey) {
    this.primaryApiKey = primaryApiKey; // Tomorrow.io
    this.backupApiKey = backupApiKey;   // OpenWeatherMap
    this.failoverCount = 0;
  }
  
  async getWeather(latitude, longitude) {
    try {
      // Try primary API (Tomorrow.io)
      return await fetchTomorrowIOWeather(latitude, longitude, this.primaryApiKey);
    } catch (error) {
      console.warn('Primary API failed, switching to backup:', error.message);
      this.failoverCount++;
      
      try {
        // Fallback to OpenWeatherMap
        return await fetchOpenWeatherMapWeather(latitude, longitude, this.backupApiKey);
      } catch (backupError) {
        throw new Error(`Both APIs failed. Primary: ${error.message}, Backup: ${backupError.message}`);
      }
    }
  }
  
  getFailoverStats() {
    return { failoverCount: this.failoverCount };
  }
}

module.exports = {
  fetchTomorrowIOWeather,
  fetchOpenWeatherMapWeather,
  fetchVisualCrossingWeather,
  WeatherAPIManager,
  testWeatherAPIs
};