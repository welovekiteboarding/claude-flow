const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Get current weather by city name
router.get('/current/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const weatherData = {
      location: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feels_like: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      wind_speed: response.data.wind.speed,
      timestamp: new Date().toISOString()
    };

    res.json(weatherData);
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch weather data' });
    }
  }
});

// Get weather by coordinates
router.get('/coords/:lat/:lon', async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const weatherData = {
      location: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feels_like: Math.round(response.data.main.feels_like),
      humidity: response.data.main.humidity,
      pressure: response.data.main.pressure,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      wind_speed: response.data.wind.speed,
      coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
      timestamp: new Date().toISOString()
    };

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Get 5-day forecast
router.get('/forecast/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const forecastData = response.data.list.map(item => ({
      datetime: item.dt_txt,
      temperature: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      wind_speed: item.wind.speed
    }));

    res.json({
      city: response.data.city.name,
      country: response.data.city.country,
      forecast: forecastData
    });
  } catch (error) {
    if (error.response?.status === 404) {
      res.status(404).json({ error: 'City not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch forecast data' });
    }
  }
});

module.exports = router;