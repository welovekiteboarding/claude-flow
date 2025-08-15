import React from 'react';
import { CloudIcon, SunIcon, CloudRainIcon } from '@heroicons/react/24/outline';

const Forecast = ({ forecast }) => {
  if (!forecast || !forecast.forecastday) return null;

  const getWeatherIcon = (condition) => {
    const iconMap = {
      'Partly cloudy': <CloudIcon className="w-5 h-5" />,
      'Sunny': <SunIcon className="w-5 h-5" />,
      'Rain': <CloudRainIcon className="w-5 h-5" />,
    };
    return iconMap[condition] || <CloudIcon className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">7-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {forecast.forecastday.map((day) => (
          <div key={day.date} className="text-center">
            <p className="text-sm font-medium text-gray-600">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <div className="my-2 flex justify-center">
              {getWeatherIcon(day.day.condition.text)}
            </div>
            <p className="text-xs text-gray-500">{day.day.condition.text}</p>
            <p className="text-sm font-semibold mt-1">
              {Math.round(day.day.maxtemp_c)}°{Math.round(day.day.mintemp_c)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;