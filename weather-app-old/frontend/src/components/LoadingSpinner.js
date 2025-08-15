import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  margin: 2rem auto;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 1rem;
`;

const LoadingText = styled.p`
  color: white;
  font-size: 1.1rem;
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
  text-align: center;
`;

const WeatherIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 1rem;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingSpinner = ({ message = "Fetching weather data..." }) => {
  return (
    <LoadingContainer>
      <WeatherIcon>🌤️</WeatherIcon>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};

export default LoadingSpinner;