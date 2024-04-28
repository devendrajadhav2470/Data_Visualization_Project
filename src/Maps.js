import React, { useState } from "react";
import axios from "axios";
const API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";
const Map = () => {
  const [city, setCity] = useState("");
  const [mapType, setMapType] = useState("precipitation");
  const [mapURL, setMapURL] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setMapURL(
        `https://tile.openweathermap.org/map/${mapType}_new/${2}/${2}/${2}.png?appid=${API_KEY}`
      );
    } catch (error) {
      console.error("Error fetching weather map data:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Enter city name"
        />
        <select
          value={mapType}
          onChange={(event) => setMapType(event.target.value)}
        >
          <option value="precipitation">Precipitation</option>
          <option value="clouds">Clouds</option>
          <option value="pressure">Pressure</option>
          <option value="temperature">Temperature</option>
          <option value="wind">Wind</option>
        </select>
        <button type="submit">Submit</button>
      </form>

      {mapURL && (
        <div>
          <img src={mapURL} alt={`Weather Map - ${mapType}`} />
        </div>
      )}
    </div>
  );
};

export default Map;
