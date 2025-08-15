import React from 'react';
import { useState, useEffect } from 'react';

const CurrentWeather = ({ data }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0');

  useEffect(() => {
    if (data) {
      const timer = setTimeout(() => {
        setAnimationClass('opacity-100 animate-slide-up');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) {
    return null;
  }

  const getWeatherIcon = (weatherMain) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
    };
    return icons[weatherMain] || '🌤️';
  };

  const convertToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

  return (
    <div 
      className={`bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/30 transform transition-all duration-500 ${animationClass}`}
    >
      <div className="text-center">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">{data.name}</h2>
          <p className="text-7xl my-4">{getWeatherIcon(data.weather[0].main)}</p>
          <p className="text-gray-600 text-lg capitalize">{data.weather[0].description}</p>
        </div>
        
        <div className="my-6">
          <span className="text-6xl font-bold text-weather-blue-500">
            {convertToCelsius(data.main.temp)}°C
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-gray-600 text-sm">Feels like</p>
            <p className="text-xl font-semibold text-gray-800">{convertToCelsius(data.main.feels_like)}°C</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-gray-600 text-sm">Humidity</p>
            <p className="text-xl font-semibold text-gray-800">{data.main.humidity}%</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="text-gray-600 text-sm">Wind</p>
            <p className="text-xl font-semibold text-gray-800">{(data.wind.speed * 3.6).toFixed(1)} km/h</p>
          </div>
        </div>

        <div className="flex items-center justify-center mt-6 space-x-8 text-sm text-gray-600">
          <div>
            <span>Min: </span>
            <span className="font-semibold">{convertToCelsius(data.main.temp_min)}°C</span>
          </div>
          <div>
            <span>Max: </span>
            <span className="font-semibold">{convertToCelsius(data.main.temp_max)}°C</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;