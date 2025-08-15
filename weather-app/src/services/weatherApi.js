import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const weatherApi = {
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  },

  getForecast: async (city) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch forecast data');
    }
  },

  getWeatherByCoords: async (lat, lon) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
    }
  }
};

export default weatherApi;