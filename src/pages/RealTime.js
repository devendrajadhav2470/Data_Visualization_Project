import React, { useState, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { getWeatherByCity } from '../services/weatherService';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import CitySearch from '../components/CitySearch';
import LoadingSpinner from '../components/LoadingSpinner';
import './RealTime.css';

const WIDGET_DEFAULTS = {
  temperature: true,
  humidity: true,
  windSpeed: true,
  windDirection: true,
};

export default function RealTime() {
  const { plotlyTheme } = useTheme();
  const [city, setCity] = useState('New York');
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [windSpeed, setWindSpeed] = useState(0);
  const [windSpeedData, setWindSpeedData] = useState([]);
  const [windDirectionData, setWindDirectionData] = useState([0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibleWidgets, setVisibleWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    return saved ? JSON.parse(saved) : WIDGET_DEFAULTS;
  });

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(visibleWidgets));
  }, [visibleWidgets]);

  const toggleWidget = (widget) => {
    setVisibleWidgets((prev) => ({ ...prev, [widget]: !prev[widget] }));
  };

  const fetchWeatherData = useCallback(async () => {
    try {
      const data = await getWeatherByCity(city);
      setLoading(false);
      setError(null);

      setTemperatureData((prev) => {
        const next = [...prev, data.main.temp];
        return next.length > 20 ? next.slice(-20) : next;
      });

      setHumidityData((prev) => {
        const next = [...prev, data.main.humidity];
        return next.length > 20 ? next.slice(-20) : next;
      });

      setWindSpeed(data.wind.speed);
      setWindSpeedData((prev) => {
        const next = [...prev, data.wind.speed];
        return next.length > 20 ? next.slice(-20) : next;
      });

      const deg = data.wind.deg || 0;
      setWindDirectionData([0, deg - 15, deg + 15, 0]);
    } catch (err) {
      setError(`Failed to fetch weather for "${city}". Please check the city name.`);
      setLoading(false);
      console.error(err);
    }
  }, [city]);

  useEffect(() => {
    setTemperatureData([]);
    setHumidityData([]);
    setWindSpeedData([]);
    setWindDirectionData([0, 0, 0, 0]);
    setLoading(true);
    setError(null);

    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 5000);
    return () => clearInterval(interval);
  }, [fetchWeatherData]);

  const handleCitySelect = (cityData) => {
    setCity(cityData.name);
  };

  const timeLabels = Array.from(
    { length: temperatureData.length },
    (_, i) => i + 1
  );

  const WIDGET_LABELS = {
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    windDirection: 'Wind Direction',
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-content">
        <div className="page-header">
          <h1>Real-Time Weather Dashboard</h1>
          <p className="page-subtitle">Live weather data for {city}</p>
        </div>

        <div className="dashboard-toolbar">
          <CitySearch
            onCitySelect={handleCitySelect}
            placeholder="Search city..."
          />
          <div className="widget-toggles">
            {Object.keys(WIDGET_DEFAULTS).map((key) => (
              <label key={key} className="widget-toggle">
                <input
                  type="checkbox"
                  checked={visibleWidgets[key]}
                  onChange={() => toggleWidget(key)}
                />
                <span>{WIDGET_LABELS[key]}</span>
              </label>
            ))}
          </div>
        </div>

        {loading && <LoadingSpinner message={`Connecting to ${city}...`} />}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="charts-grid">
            {visibleWidgets.temperature && (
              <div className="chart-card">
                <Plot
                  data={[
                    {
                      x: timeLabels,
                      y: temperatureData,
                      mode: 'lines+markers',
                      type: 'scatter',
                      name: 'Temperature',
                      line: { color: '#FF6B6B', width: 2, shape: 'spline' },
                      marker: { size: 6 },
                    },
                  ]}
                  layout={{
                    title: 'Temperature (\u00B0C)',
                    ...plotlyTheme,
                    xaxis: { ...plotlyTheme.xaxis, title: 'Reading' },
                    yaxis: { ...plotlyTheme.yaxis, title: '\u00B0C' },
                    autosize: true,
                    margin: { l: 50, r: 20, t: 40, b: 40 },
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}

            {visibleWidgets.humidity && (
              <div className="chart-card">
                <Plot
                  data={[
                    {
                      x: timeLabels,
                      y: humidityData,
                      type: 'bar',
                      name: 'Humidity',
                      marker: {
                        color: humidityData.map((v) =>
                          v > 80 ? '#FF6B6B' : v > 60 ? '#FFEAA7' : '#4ECDC4'
                        ),
                      },
                    },
                  ]}
                  layout={{
                    title: 'Humidity (%)',
                    ...plotlyTheme,
                    xaxis: { ...plotlyTheme.xaxis, title: 'Reading' },
                    yaxis: { ...plotlyTheme.yaxis, title: '%', range: [0, 100] },
                    autosize: true,
                    margin: { l: 50, r: 20, t: 40, b: 40 },
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}

            {visibleWidgets.windSpeed && (
              <div className="chart-card">
                <Plot
                  data={[
                    {
                      x: timeLabels,
                      y: windSpeedData,
                      fill: 'tozeroy',
                      type: 'scatter',
                      name: 'Wind Speed',
                      fillcolor: 'rgba(69, 123, 157, 0.3)',
                      line: { color: '#457B9D', width: 2, shape: 'spline' },
                    },
                  ]}
                  layout={{
                    title: 'Wind Speed (m/s)',
                    ...plotlyTheme,
                    xaxis: { ...plotlyTheme.xaxis, title: 'Reading' },
                    yaxis: { ...plotlyTheme.yaxis, title: 'm/s' },
                    autosize: true,
                    margin: { l: 50, r: 20, t: 40, b: 40 },
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}

            {visibleWidgets.windDirection && (
              <div className="chart-card">
                <Plot
                  data={[
                    {
                      r: [0, windSpeed, windSpeed, 0],
                      theta: windDirectionData,
                      mode: 'lines',
                      fill: 'toself',
                      type: 'scatterpolar',
                      fillcolor: 'rgba(8, 78, 138, 0.7)',
                      line: { color: 'rgba(32, 32, 32, 0.6)', width: 1 },
                      name: 'Direction',
                    },
                    {
                      r: [0, windSpeed * 0.65, windSpeed * 0.65, 0],
                      theta: windDirectionData,
                      mode: 'lines',
                      fill: 'toself',
                      type: 'scatterpolar',
                      fillcolor: 'rgba(180, 225, 250, 0.7)',
                      line: { color: 'rgba(32, 32, 32, 0.6)', width: 1 },
                      showlegend: false,
                    },
                  ]}
                  layout={{
                    title: 'Wind Direction',
                    ...plotlyTheme,
                    polar: {
                      radialaxis: {
                        range: [0, Math.max(windSpeed * 1.2, 10)],
                        angle: 45,
                        dtick: 5,
                      },
                      angularaxis: {
                        showline: false,
                        tickcolor: plotlyTheme.font.color,
                      },
                      bgcolor: 'rgba(0,0,0,0)',
                    },
                    autosize: true,
                    margin: { l: 40, r: 40, t: 40, b: 40 },
                    showlegend: false,
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                  config={{ displayModeBar: false }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

