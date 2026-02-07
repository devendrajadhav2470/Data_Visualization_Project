# GlobalWeather Dashboard

A real-time weather data visualization dashboard built with React and Plotly.js. Features interactive maps, air quality monitoring, live weather charts, and a dark/light theme toggle.

## Features

- **Global Weather Overview** - Weather cards for cities worldwide showing temperature, humidity, wind speed, and pressure
- **Real-Time Dashboard** - Live-updating charts (temperature line chart, humidity bar chart, wind speed area chart, wind direction polar chart) with customizable widget visibility
- **Air Quality Index** - Pollutant distribution (CO, NO2, SO2, PM10, PM2.5, O3) with donut and bar charts, color-coded AQI badge
- **Interactive Weather Maps** - Leaflet-based interactive map with toggleable weather overlay layers (temperature, precipitation, clouds, wind, pressure). Click anywhere to get local weather data
- **City Search with Autocomplete** - Debounced search using OpenWeatherMap Geocoding API with dropdown suggestions
- **Dark/Light Mode** - Theme toggle with localStorage persistence and CSS custom properties
- **Dashboard Customization** - Toggle visibility of chart widgets with preferences saved to localStorage
- **Responsive Design** - Collapsible sidebar on mobile, adaptive grid layouts, resizable charts

## Tech Stack

- **React 18** - UI framework with functional components and hooks
- **React Router v6** - Client-side routing
- **Plotly.js** (via react-plotly.js) - Interactive data visualization charts
- **Leaflet** (via react-leaflet) - Interactive maps with weather tile overlays
- **OpenWeatherMap API** - Weather data, air quality data, geocoding, and map tiles
- **CSS Custom Properties** - Theme system for dark/light mode

## Project Structure

```
src/
  components/      # Reusable UI components (Sidebar, Footer, CitySearch, LoadingSpinner)
  context/         # React Context (ThemeContext for dark/light mode)
  pages/           # Page components (Homepage, RealTime, AirQuality, Maps)
  services/        # API service layer (weatherService.js)
  assets/          # City images
  logos/            # Brand logos
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- An OpenWeatherMap API key (free tier works)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/global-weather-dashboard.git
   cd global-weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   REACT_APP_OWM_API_KEY=your_openweathermap_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is configured for easy deployment to Vercel:

```bash
npm run build
```

The `build/` folder contains the production-ready static files.

## API Reference

This project uses the [OpenWeatherMap API](https://openweathermap.org/api):

- **Current Weather** - `/data/2.5/weather`
- **Air Pollution** - `/data/2.5/air_pollution`
- **Geocoding** - `/geo/1.0/direct`
- **Weather Map Tiles** - `tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png`

## License

MIT
