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
  const [humidityData, setHumidityData] = useState(Array(500).fill(0));
  const [windDirectionData, setWindDirectionData] = useState([0, 0, 0, 0]);
  const [windSpeed, setWindSpeed] = useState(0);
  const [city, setCity] = useState(CITY);
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(API_URL);
      const data = response.data;
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
  }, [fetchWeatherData]);

  const updateTemperatureData = (data) => {
    const rndtemp = Math.random() * 3;
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
    newHumidityData.shift();
    newHumidityData.push(data.main.humidity);
    setHumidityData(newHumidityData);
  };

  const updateWindDirectionData = (data) => {
    const temp = Math.floor(Math.random() * (60 - 10) + 10);
    const temp_ = Math.floor(Math.random() * (40 - 4) + 4);
    const val = data.wind.speed + temp_;
    setWindSpeed(val);
    const newWindDirectionData = [
      0,
      data.wind.deg + temp - 20,
      data.wind.deg + temp + 20,
      0,
    ];
    setWindDirectionData(newWindDirectionData);
  };

  return (
    <>
      <div className="container">
        <Sidebar />
        <div
          className="main"
          style={
            {
              // display: "grid",
              // gridTemplateRows: "1fr 1fr",
              // gridTemplateColumns: "1fr 1fr",
            }
          }
        >
          <div className="leftbig">
            <Form.Control
              type="text"
              placeholder="Readomly input here..."
              value={city}
              //   onChange={(value) => {
              //     setCity(value);
              //   }}
            />
            <h3>Line Chart</h3>
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
                title: `Temperature in ${CITY} (°C)`,
                xaxis: { title: "Time" },
                yaxis: { title: "Temperature (°C)" },
              }}
            />
          </div>
          <div className="right">
            <div className="g1">
              <h3>Histogram</h3>
              <Plot
                data={[
                  {
                    x: humidityData,
                    type: "histogram",
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
            <div className="g2">
              <h3>Pie</h3>
              <div className="graph__title">WIND DIRECTION</div>
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
              {/* <WindDirectionChart windDirectionData={windDirectionData} /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RealTime;
