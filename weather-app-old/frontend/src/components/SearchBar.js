import React, { useState } from 'react';
import styled from 'styled-components';

const SearchContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 60px 15px 20px;
  border: none;
  border-radius: 50px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #2d3436;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #636e72;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: #74b9ff;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  cursor: pointer;
  color: white;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: #0984e3;
    transform: translateY(-50%) scale(1.05);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: translateY(-50%);
  }
`;

const SearchBar = ({ onSearch, disabled }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && !disabled) {
      onSearch(searchTerm.trim());
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit}>
        <SearchInput
          type="text"
          placeholder="Search for a city..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          autoComplete="off"
        />
        <SearchButton 
          type="submit" 
          disabled={disabled || !searchTerm.trim()}
          title="Search weather"
        >
          🔍
        </SearchButton>
      </form>
    </SearchContainer>
  );
};

export default SearchBar;