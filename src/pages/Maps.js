import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getWeatherByCoords, getWeatherTileUrl } from '../services/weatherService';
import Sidebar from '../components/Sidebar';
import './Maps.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

export default function Maps() {
  const [markerData, setMarkerData] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMapClick = async (lat, lng) => {
    setLoading(true);
    setMarkerPos([lat, lng]);
    try {
      const data = await getWeatherByCoords(lat, lng);
      setMarkerData(data);
    } catch (err) {
      console.error('Failed to fetch weather:', err);
      setMarkerData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="page-content">
        <div className="page-header">
          <h1>Weather Maps</h1>
          <p className="page-subtitle">
            Click anywhere on the map to see weather data. Toggle layers using
            the control in the top-right corner.
          </p>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={[20, 0]}
            zoom={3}
            className="weather-map"
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LayersControl position="topright">
              <LayersControl.Overlay name="Temperature" checked>
                <TileLayer
                  url={getWeatherTileUrl('temp_new')}
                  opacity={0.6}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Precipitation">
                <TileLayer
                  url={getWeatherTileUrl('precipitation_new')}
                  opacity={0.6}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Clouds">
                <TileLayer
                  url={getWeatherTileUrl('clouds_new')}
                  opacity={0.6}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Wind">
                <TileLayer
                  url={getWeatherTileUrl('wind_new')}
                  opacity={0.6}
                />
              </LayersControl.Overlay>
              <LayersControl.Overlay name="Pressure">
                <TileLayer
                  url={getWeatherTileUrl('pressure_new')}
                  opacity={0.6}
                />
              </LayersControl.Overlay>
            </LayersControl>

            <MapClickHandler onMapClick={handleMapClick} />

            {markerPos && (
              <Marker position={markerPos}>
                <Popup>
                  {loading ? (
                    <span>Loading weather data...</span>
                  ) : markerData ? (
                    <div className="map-popup">
                      <strong>
                        {markerData.name || 'Unknown Location'}
                      </strong>
                      <p>
                        {Math.round(markerData.main.temp)}&deg;C &mdash;{' '}
                        {markerData.weather[0].description}
                      </p>
                      <p>Humidity: {markerData.main.humidity}%</p>
                      <p>Wind: {markerData.wind.speed} m/s</p>
                    </div>
                  ) : (
                    <span>No data available for this location</span>
                  )}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

