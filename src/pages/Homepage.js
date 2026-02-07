import React, { useEffect, useState } from 'react';
import { getMultipleCitiesWeather } from '../services/weatherService';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import './Homepage.css';

import ahmedabadImg from '../assets/ahmedabad.jpeg';
import chicagoImg from '../assets/chicago.jpeg';
import londonImg from '../assets/london.jpeg';
import moscowImg from '../assets/moscow.jpg';
import newYorkImg from '../assets/new york.jpeg';
import puneImg from '../assets/pune.jpeg';
import suratImg from '../assets/surat.jpg';
import torontoImg from '../assets/toronto.jpeg';
import beijingImg from '../assets/beijing.jpeg';

const CITY_IMAGES = {
  'New York': newYorkImg,
  'Ahmedabad': ahmedabadImg,
  'Chicago': chicagoImg,
  'Toronto': torontoImg,
  'Beijing': beijingImg,
  'Moscow': moscowImg,
  'Pune': puneImg,
  'London': londonImg,
  'Surat': suratImg,
};

const DEFAULT_CITIES = [
  'New York', 'Ahmedabad', 'Chicago', 'Toronto',
  'Beijing', 'Moscow', 'Pune', 'London', 'Surat',
];

function WeatherCard({ name, data, image }) {
  const temp = Math.round(data.main.temp);
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  return (
    <div className="weather-card">
      <div
        className="weather-card-image"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="weather-card-overlay">
          <h3 className="weather-card-city">{name}</h3>
          <img
            src={icon}
            alt={data.weather[0].description}
            className="weather-card-icon"
          />
        </div>
      </div>
      <div className="weather-card-body">
        <div className="weather-card-temp">{temp}&deg;C</div>
        <p className="weather-card-desc">{data.weather[0].description}</p>
        <div className="weather-card-details">
          <div className="weather-card-detail">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{data.main.humidity}%</span>
          </div>
          <div className="weather-card-detail">
            <span className="detail-label">Wind</span>
            <span className="detail-value">{data.wind.speed} m/s</span>
          </div>
          <div className="weather-card-detail">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{data.main.pressure} hPa</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Homepage() {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getMultipleCitiesWeather(DEFAULT_CITIES);
        setCityData(data);
        setError(null);
      } catch (err) {
        setError('Failed to load weather data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-content">
        <div className="page-header">
          <h1>Global Weather Overview</h1>
          <p className="page-subtitle">
            Real-time weather data for cities around the world
          </p>
        </div>

        {loading && <LoadingSpinner message="Fetching weather data..." />}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <div className="city-cards-grid">
            {cityData.map((data, index) => (
              <WeatherCard
                key={DEFAULT_CITIES[index]}
                name={DEFAULT_CITIES[index]}
                data={data}
                image={CITY_IMAGES[DEFAULT_CITIES[index]]}
              />
            ))}
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

