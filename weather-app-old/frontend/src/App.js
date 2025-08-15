import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { getCurrentWeather, getWeatherByCoords } from './services/weatherService';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 2.5rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
`;

const GeolocationButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px auto;
  display: block;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchedCity, setLastSearchedCity] = useState('');

  useEffect(() => {
    // Try to get user's location on app load
    if (navigator.geolocation) {
      getUserLocation();
    } else {
      // Fallback to default city
      handleCitySearch('London');
    }
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await getWeatherByCoords(latitude, longitude);
          setWeatherData(data);
          setLastSearchedCity(data.location);
        } catch (err) {
          setError('Failed to fetch weather for your location');
          // Fallback to default city
          handleCitySearch('London');
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setError('Location access denied. Showing weather for London.');
        handleCitySearch('London');
      },
      { timeout: 10000 }
    );
  };

  const handleCitySearch = async (city) => {
    if (!city.trim()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await getCurrentWeather(city);
      setWeatherData(data);
      setLastSearchedCity(city);
    } catch (err) {
      setError(`Could not find weather data for "${city}". Please try another city.`);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer>
      <Header>
        <Title>🌤️ Weather App</Title>
      </Header>
      
      <MainContent>
        <SearchBar onSearch={handleCitySearch} disabled={loading} />
        
        <GeolocationButton 
          onClick={getUserLocation} 
          disabled={loading}
        >
          📍 Use My Location
        </GeolocationButton>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {weatherData && !loading && (
          <WeatherCard 
            data={weatherData} 
            city={lastSearchedCity}
          />
        )}
      </MainContent>
    </AppContainer>
  );
}

export default App;