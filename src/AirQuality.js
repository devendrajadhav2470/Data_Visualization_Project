import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Plot from "react-plotly.js";
import "./AirQuality.css";
const CITY = "London";
const API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";
const API_URL = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${50}&lon=${50}&appid=${API_KEY}`;
const POS_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${CITY}&limit=5&appid=${API_KEY}`;

function AirQuality() {
  const [city, setCity] = useState(CITY);
  const [url, setUrl] = useState(API_URL);
  const [posurl, setPosurl] = useState(POS_URL);
  const [latlon, setLatlon] = useState([50, 50]);
  const [aqData, setAqData] = useState(null);
  async function updateUrl() {
    const newposurl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`;
    const response0 = await axios.get(posurl);
    const lat = response0.data[0].lat;
    const lon = response0.data[0].lon;
    setLatlon([lat, lon]);
    setPosurl(newposurl);
  }
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from submitting normally

    // Call the function to update the URL or perform any other action
    updateUrl();
  };
  const fetchWeatherData = async () => {
    try {
      let newurl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latlon[0]}&lon=${latlon[1]}&appid=${API_KEY}`;
      const response = await axios.get(newurl);
      const data = response.data;
      setAqData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchWeatherData, posurl]);

  return (
    <div className="aq_container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="aq_main">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
              }}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        {/* <div className="aq_plots" style={{ display: "flex" }}>
          <div className="piechart"></div>
          <div className="lines">
            <div className="aqi_line"></div>
            <div className="multi_line"></div>
          </div>
        </div> */}
        <div className="aq_plots" style={{ display: "flex" }}>
          {aqData && (
            <>
              <div className="piechart">
                <Plot
                  data={[
                    {
                      values: [
                        aqData.list[0].components.co,
                        aqData.list[0].components.no2,
                        aqData.list[0].components.so2,
                        aqData.list[0].components.pm10,
                      ],
                      labels: ["CO", "NO2", "SO2", "PM10"],
                      type: "pie",
                    },
                  ]}
                  layout={{
                    width: 400,
                    height: 400,
                    title: "Pollutants Pie Chart",
                  }}
                />
              </div>
              <div
                className="lines"
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div className="aqi_line" style={{ color: " white" }}>
                  {/* <Plot
                    data={[
                      {
                        x: [aqData.list[0].dt],
                        y: [aqData.list[0].main.aqi],
                        type: "scatter",
                        mode: "lines+markers",
                      },
                    ]}
                    layout={{
                      width: 400,
                      height: 400,
                      title: "AQI Line Chart",
                    }}
                  /> */}
                  AQI: {aqData.list[0].main.aqi}
                </div>
                <div className="barplot">
                  <Plot
                    data={[
                      {
                        y: [
                          aqData.list[0].components.no2,
                          aqData.list[0].components.so2,
                          aqData.list[0].components.pm10,
                          aqData.list[0].components.pm2_5,
                          aqData.list[0].components.nh3,
                          aqData.list[0].components.no,
                          aqData.list[0].components.o3,
                        ],
                        type: "bar",
                        mode: "lines",
                        x: ["NO2", "SO2", "PM10", "pm2_5", "nh3", "no", "o3"],
                      },
                    ]}
                    layout={{
                      width: 400,
                      height: 400,
                      title: "Pollutants bar chart",
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default AirQuality;
