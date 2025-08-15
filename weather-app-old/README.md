# 🌤️ Weather App

A modern, responsive weather application built with React frontend and Node.js backend, featuring real-time weather data, geolocation, and beautiful UI design.

## 🚀 Features

- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **Geolocation Support**: Automatically detect and display weather for your current location
- **City Search**: Search for weather in any city with intelligent error handling
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading States**: Beautiful loading indicators for better UX
- **Rate Limiting**: Built-in API rate limiting for production use

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Styled Components** - CSS-in-JS for component styling
- **Axios** - HTTP client for API requests
- **Responsive Design** - Mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **OpenWeatherMap API** - Weather data provider
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Environment Variables** - Secure configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd weather-app
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env and add your OpenWeatherMap API key
# OPENWEATHER_API_KEY=your_api_key_here

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
NODE_ENV=development
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables (Optional)

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🌍 API Endpoints

### Weather Routes

- `GET /api/weather/current/:city` - Get current weather for a city
- `GET /api/weather/coords/:lat/:lon` - Get weather by coordinates
- `GET /api/weather/forecast/:city` - Get 5-day forecast for a city
- `GET /api/health` - Health check endpoint

### Example Response

```json
{
  "location": "London",
  "country": "GB",
  "temperature": 15,
  "feels_like": 13,
  "humidity": 82,
  "pressure": 1013,
  "description": "light rain",
  "icon": "10d",
  "wind_speed": 3.6,
  "timestamp": "2025-01-20T10:30:00.000Z"
}
```

## 🎨 UI Components

### Main Components
- **App.js** - Main application component
- **WeatherCard.js** - Displays weather information
- **SearchBar.js** - City search functionality
- **LoadingSpinner.js** - Loading state indicator
- **ErrorMessage.js** - Error handling component

### Services
- **weatherService.js** - API communication layer

## 📱 Responsive Design

The app is built with mobile-first design principles:

- **Mobile** (< 768px): Single column, touch-friendly interface
- **Tablet** (768px - 1024px): Optimized layout with larger touch targets
- **Desktop** (> 1024px): Full-featured layout with hover effects

## 🔒 Security Features

- **API Key Protection** - Environment variables for sensitive data
- **Rate Limiting** - Prevents API abuse
- **Input Sanitization** - Prevents injection attacks
- **CORS Configuration** - Controlled cross-origin access
- **Error Handling** - No sensitive information leaked

## 🚀 Deployment

### Backend Deployment (Heroku, Railway, etc.)

1. Set environment variables on your hosting platform
2. Ensure `NODE_ENV=production`
3. Configure allowed origins for CORS

### Frontend Deployment (Vercel, Netlify, etc.)

1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenWeatherMap for providing free weather data API
- React team for the amazing framework
- The open-source community for inspiration

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Include error logs and environment information

---

**Built with ❤️ by the Hive Mind Collective**