import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { getCurrentWeather, getForecast } from './services/weatherApi';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [location, setLocation] = useState('New York');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [currentWeather, forecast] = await Promise.all([
        getCurrentWeather(location),
        getForecast(location)
      ]);
      
      setWeatherData(currentWeather);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Weather App</h1>
          <p className="text-blue-100">Real-time weather information around the world</p>
        </header>

        <SearchBar onSearch={handleLocationSearch} />

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={fetchWeatherData} />}

        <div className="grid gap-6">
          {weatherData && !loading && !error && (
            <CurrentWeather data={weatherData} />
          )}
          
          {forecastData && !loading && !error && (
            <Forecast data={forecastData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
