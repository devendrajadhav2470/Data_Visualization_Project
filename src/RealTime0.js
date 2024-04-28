import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import "./style.css";
import Sidebar from "./Sidebar";
import { useRef } from "react";
import Chart from "chart.js/auto";
import Form from "react-bootstrap/Form";
const API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";
const CITY = "New York";
const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
const app_color = { graph_bg: "#082255", graph_line: "#007ACE" };

function RealTime() {
  const [temperatureData, setTemperatureData] = useState([0]);
  const [humidityData, setHumidityData] = useState([0]);
  const [windDirectionData, setWindDirectionData] = useState([0, 0, 0, 0]);
  const [windSpeed, setWindSpeed] = useState(0);
  const [wsdata, setWsdata] = useState([0]);
  const [city, setCity] = useState(CITY);
  const [url, setUrl] = useState(API_URL);
  async function updateUrl() {
    const newposurl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    setUrl(newposurl);
    setTemperatureData([0]);
    setHumidityData([0]);
    setWindDirectionData([0, 0, 0, 0]);
    setWsdata([0]);
  }
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the form from submitting normally

    // Call the function to update the URL or perform any other action
    updateUrl();
  };
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
      console.log(data);
      updateTemperatureData(data);
      updateHumidityData(data);
      updateWindDirectionData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchWeatherData, url]);

  const updateTemperatureData = (data) => {
    const rndtemp = Math.random();
    let newTemperatureData = [...temperatureData];
    if (newTemperatureData.length == 10) {
      newTemperatureData = newTemperatureData.slice(1);
      newTemperatureData.push(data.main.temp + rndtemp);
    } else {
      newTemperatureData.push(data.main.temp + rndtemp);
    }
    setTemperatureData(newTemperatureData);
  };

  const updateHumidityData = (data) => {
    const newHumidityData = [...humidityData];
    const temp = Math.floor(Math.random() * 7);
    if (newHumidityData.length == 10) {
      newHumidityData.shift();
      newHumidityData.push(data.main.humidity + temp);
    } else {
      newHumidityData.push(data.main.humidity + temp);
    }
    setHumidityData(newHumidityData);
  };

  const updateWindDirectionData = (data) => {
    const temp = Math.floor(Math.random() * (60 - 10) + 10);
    const temp_ = Math.floor(Math.random() * (40 - 4) + 4);
    const val = data.wind.speed + temp_;
    setWindSpeed(val);
    const newwsdata = [...wsdata];

    if (newwsdata.length == 10) {
      newwsdata.shift();
      newwsdata.push(data.wind.speed);
    } else {
      newwsdata.push(data.wind.speed);
    }
    setWsdata(newwsdata);
    const newWindDirectionData = [
      0,
      data.wind.deg + temp - 20,
      data.wind.deg + temp + 20,
      0,
    ];
    setWindDirectionData(newWindDirectionData);
  };

  return (
    <div className="rt_container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="rn_main">
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
        <div className="rn_plots" style={{ display: "flex" }}>
          <div className="linechart">
            <div className="templine">
              <Plot
                data={[
                  {
                    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    y: temperatureData,
                    mode: "lines+markers",
                    type: "scatter",
                    name: "Temperature",
                  },
                ]}
                layout={{
                  title: `Temperature in ${city} (°C)`,
                  xaxis: { title: "Time" },
                  yaxis: { title: "Temperature (°C)" },
                }}
              />
            </div>
            <div className="windspeed">
              <Plot
                data={[
                  {
                    x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    y: wsdata,
                    fill: "tozeroy",
                    type: "scatter",
                    name: "windspeed",
                  },
                ]}
                layout={{
                  title: `Wind speed in ${city}`,
                  xaxis: { title: "Time" },
                  yaxis: { title: "windspeed (m/s)" },
                }}
              />
            </div>
          </div>
          <div className="hist">
            <div className="rn_line">
              <Plot
                data={[
                  {
                    y: humidityData,
                    type: "bar",
                    name: "Humidity",
                  },
                ]}
                layout={{
                  title: "Humidity",
                  xaxis: { title: "Time" },
                  plot_bgcolor: app_color["graph_bg"],
                  paper_bgcolor: app_color["graph_bg"],
                  font: { color: "#fff" },
                }}
              />
            </div>
            <div className="wind">
              <Plot
                data={[
                  {
                    r: [0, windSpeed, windSpeed, 0],
                    theta: windDirectionData,
                    mode: "lines",
                    fill: "toself",
                    type: "scatterpolar",
                    fillcolor: "#084E8A",
                    line: { color: "rgba(32, 32, 32, .6)", width: 1 },
                  },
                  {
                    r: [0, windSpeed * 0.65, windSpeed * 0.65, 0],
                    theta: windDirectionData,
                    mode: "lines",
                    fill: "toself",
                    type: "scatterpolar",
                    fillcolor: "#B4E1FA",
                    line: { color: "rgba(32, 32, 32, .6)", width: 1 },
                  },
                  {
                    r: [0, windSpeed * 0.3, windSpeed * 0.3, 0],
                    theta: windDirectionData,
                    mode: "lines",
                    fill: "toself",
                    type: "scatterpolar",
                    fillcolor: "#EBF5FA",
                    line: { color: "rgba(32, 32, 32, .6)", width: 1 },
                  },
                ]}
                layout={{
                  title: "Wind Direction",
                  polar: {
                    radialaxis: { range: [0, 45], angle: 45, dtick: 10 },
                    angularaxis: { showline: false, tickcolor: "white" },
                  },
                  height: 350,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealTime;
