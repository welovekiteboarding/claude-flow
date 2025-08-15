import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const weatherAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
weatherAPI.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
weatherAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    }
    if (error.response) {
      throw new Error(error.response.data.error || 'Weather service error');
    }
    if (error.request) {
      throw new Error('Unable to connect to weather service. Please try again.');
    }
    throw new Error('An unexpected error occurred');
  }
);

export const getCurrentWeather = async (city) => {
  try {
    const response = await weatherAPI.get(`/weather/current/${encodeURIComponent(city)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const getWeatherByCoords = async (latitude, longitude) => {
  try {
    const response = await weatherAPI.get(`/weather/coords/${latitude}/${longitude}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

export const getWeatherForecast = async (city) => {
  try {
    const response = await weatherAPI.get(`/weather/forecast/${encodeURIComponent(city)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

export const checkAPIHealth = async () => {
  try {
    const response = await weatherAPI.get('/health');
    return response.data;
  } catch (error) {
    console.error('API health check failed:', error);
    throw error;
  }
};

export default weatherAPI;