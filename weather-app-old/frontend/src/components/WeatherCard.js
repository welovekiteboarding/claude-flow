import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LocationHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CityName = styled.h2`
  color: #2d3436;
  font-size: 2rem;
  margin: 0;
  font-weight: 300;
`;

const Country = styled.span`
  color: #636e72;
  font-size: 1.1rem;
  margin-left: 10px;
`;

const MainWeather = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

const WeatherIcon = styled.img`
  width: 100px;
  height: 100px;
  margin-right: 1rem;
`;

const TemperatureSection = styled.div`
  text-align: center;
`;

const Temperature = styled.div`
  font-size: 4rem;
  font-weight: 300;
  color: #2d3436;
  line-height: 1;
`;

const Description = styled.div`
  font-size: 1.3rem;
  color: #636e72;
  text-transform: capitalize;
  margin-top: 0.5rem;
`;

const FeelsLike = styled.div`
  font-size: 1rem;
  color: #636e72;
  margin-top: 0.5rem;
`;

const WeatherDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(99, 110, 114, 0.2);
`;

const DetailItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: rgba(116, 185, 255, 0.1);
  border-radius: 10px;
`;

const DetailLabel = styled.div`
  color: #636e72;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.div`
  color: #2d3436;
  font-size: 1.3rem;
  font-weight: 500;
`;

const Timestamp = styled.div`
  text-align: center;
  color: #636e72;
  font-size: 0.85rem;
  margin-top: 1rem;
  font-style: italic;
`;

const WeatherCard = ({ data, city }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <LocationHeader>
        <CityName>
          {data.location}
          <Country>{data.country}</Country>
        </CityName>
      </LocationHeader>

      <MainWeather>
        <WeatherIcon 
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
        />
        <TemperatureSection>
          <Temperature>{data.temperature}°C</Temperature>
          <Description>{data.description}</Description>
          <FeelsLike>Feels like {data.feels_like}°C</FeelsLike>
        </TemperatureSection>
      </MainWeather>

      <WeatherDetails>
        <DetailItem>
          <DetailLabel>Humidity</DetailLabel>
          <DetailValue>{data.humidity}%</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Pressure</DetailLabel>
          <DetailValue>{data.pressure} hPa</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>Wind Speed</DetailLabel>
          <DetailValue>{data.wind_speed} m/s</DetailValue>
        </DetailItem>
      </WeatherDetails>

      <Timestamp>
        Last updated: {formatTimestamp(data.timestamp)}
      </Timestamp>
    </Card>
  );
};

export default WeatherCard;