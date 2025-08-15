import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #e17055;
  border-radius: 15px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(225, 112, 85, 0.2);
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ErrorTitle = styled.h3`
  color: #d63031;
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const ErrorText = styled.p`
  color: #636e72;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
`;

const TryAgainText = styled.p`
  color: #636e72;
  font-size: 0.9rem;
  margin: 0;
  font-style: italic;
`;

const ErrorMessage = ({ message, title = "Oops! Something went wrong" }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>{title}</ErrorTitle>
      <ErrorText>{message}</ErrorText>
      <TryAgainText>Please try searching for another city or check your internet connection.</TryAgainText>
    </ErrorContainer>
  );
};

export default ErrorMessage;