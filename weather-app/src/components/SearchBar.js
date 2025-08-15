import React, { useState } from 'react';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setError('');
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (error) setError('');
          }}
          placeholder="Enter city name..."
          className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-weather-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm focus:shadow-md"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 px-4 py-2 text-white bg-weather-blue-500 rounded-lg hover:bg-weather-blue-600 focus:ring-2 focus:ring-weather-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[2rem]"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-slide-up">{error}</p>
      )}
    </form>
  );
};

export default SearchBar;