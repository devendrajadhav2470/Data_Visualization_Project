import React, { useState, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { getAirQuality } from '../services/weatherService';
import { useTheme } from '../context/ThemeContext';
import Sidebar from '../components/Sidebar';
import CitySearch from '../components/CitySearch';
import LoadingSpinner from '../components/LoadingSpinner';
import './AirQuality.css';

const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
const AQI_COLORS = ['', '#4CAF50', '#8BC34A', '#FFC107', '#FF9800', '#F44336'];

export default function AirQuality() {
  const { plotlyTheme } = useTheme();
  const [city, setCity] = useState('London');
  const [latlon, setLatlon] = useState([51.5074, -0.1278]);
  const [aqData, setAqData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAirQuality = useCallback(async () => {
    try {
      const data = await getAirQuality(latlon[0], latlon[1]);
      setAqData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch air quality data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [latlon]);

  useEffect(() => {
    setLoading(true);
    fetchAirQuality();
    const interval = setInterval(fetchAirQuality, 30000);
    return () => clearInterval(interval);
  }, [fetchAirQuality]);

  const handleCitySelect = (cityData) => {
    setCity(cityData.name);
    setLatlon([cityData.lat, cityData.lon]);
  };

  const components = aqData?.list?.[0]?.components;
  const aqi = aqData?.list?.[0]?.main?.aqi;

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-content">
        <div className="page-header">
          <h1>Air Quality Index</h1>
          <p className="page-subtitle">Air pollution data for {city}</p>
        </div>

        <div className="dashboard-toolbar">
          <CitySearch
            onCitySelect={handleCitySelect}
            placeholder="Search city..."
          />
        </div>

        {loading && <LoadingSpinner message="Fetching air quality data..." />}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && components && (
          <>
            <div className="aqi-badge-container">
              <div
                className="aqi-badge"
                style={{ backgroundColor: AQI_COLORS[aqi] || '#666' }}
              >
                <span className="aqi-value">{aqi}</span>
                <span className="aqi-label">
                  {AQI_LABELS[aqi] || 'Unknown'}
                </span>
              </div>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <Plot
                  data={[
                    {
                      values: [
                        components.co,
                        components.no2,
                        components.so2,
                        components.pm10,
                        components.pm2_5,
                        components.o3,
                      ],
                      labels: [
                        'CO',
                        'NO\u2082',
                        'SO\u2082',
                        'PM10',
                        'PM2.5',
                        'O\u2083',
                      ],
                      type: 'pie',
                      hole: 0.4,
                      marker: {
                        colors: [
                          '#FF6B6B',
                          '#4ECDC4',
                          '#45B7D1',
                          '#96CEB4',
                          '#FFEAA7',
                          '#DDA0DD',
                        ],
                      },
                      textinfo: 'label+percent',
                      textfont: { color: plotlyTheme.font.color },
                    },
                  ]}
                  layout={{
                    title: 'Pollutant Distribution',
                    ...plotlyTheme,
                    autosize: true,
                    margin: { l: 20, r: 20, t: 40, b: 20 },
                    showlegend: true,
                    legend: { font: { color: plotlyTheme.font.color } },
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                  config={{ displayModeBar: false }}
                />
              </div>

              <div className="chart-card">
                <Plot
                  data={[
                    {
                      x: [
                        'NO\u2082',
                        'SO\u2082',
                        'PM10',
                        'PM2.5',
                        'NH\u2083',
                        'NO',
                        'O\u2083',
                      ],
                      y: [
                        components.no2,
                        components.so2,
                        components.pm10,
                        components.pm2_5,
                        components.nh3,
                        components.no,
                        components.o3,
                      ],
                      type: 'bar',
                      marker: {
                        color: [
                          '#4ECDC4',
                          '#45B7D1',
                          '#96CEB4',
                          '#FFEAA7',
                          '#DDA0DD',
                          '#FF6B6B',
                          '#F8B500',
                        ],
                      },
                    },
                  ]}
                  layout={{
                    title: 'Pollutant Concentrations (\u03BCg/m\u00B3)',
                    ...plotlyTheme,
                    xaxis: { ...plotlyTheme.xaxis, title: 'Pollutant' },
                    yaxis: {
                      ...plotlyTheme.yaxis,
                      title: '\u03BCg/m\u00B3',
                    },
                    autosize: true,
                    margin: { l: 60, r: 20, t: 40, b: 40 },
                  }}
                  useResizeHandler
                  style={{ width: '100%', height: '100%' }}
                  config={{ displayModeBar: false }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

