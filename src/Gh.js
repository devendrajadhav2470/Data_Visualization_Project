import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
// import { Dimmer, Loader } from "semantic-ui-react";
import Weather from "./components/weather";
import Forecast from "./components/forecast";
const REACT_APP_API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";
const REACT_APP_API_URL = `http://api.openweathermap.org/data/2.5`;

export default function App() {
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude);
    });

    getWeather(lat, long)
      .then((weather) => {
        setWeatherData(weather);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });

    getForecast(lat, long)
      .then((data) => {
        setForecast(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [lat, long, error]);

  function handleResponse(response) {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Please Enable your Location in your browser!");
    }
  }

  async function getWeather(lat, long) {
    console.log(lat, long);
    const requrl = `${REACT_APP_API_URL}/weather/?lat=${lat}&lon=${long}&APPID=${REACT_APP_API_KEY}`;
    const response = await axios.get(requrl);
    const weather = response.data;
    console.log(weather);
    // return fetch(requrl)
    //   .then((res) => handleResponse(res))
    //   .then((weather) => {
    //     if (Object.entries(weather).length) {
    //       const mappedData = mapDataToWeatherInterface(weather);
    //       return mappedData;
    //     }
    //   });
    if (Object.entries(weather).length) {
      const mappedData = mapDataToWeatherInterface(weather);
      return mappedData;
    }
  }

  async function getForecast(lat, long) {
    console.log(lat, long);
    const requrl = `${REACT_APP_API_URL}/forecast/?lat=${lat}&lon=${long}&APPID=${REACT_APP_API_KEY}`;
    console.log(requrl);
    const response = await axios.get(requrl);
    const forecastData = response.data;
    console.log(forecastData);
    if (Object.entries(forecastData).length) {
      return forecastData.list
        .filter((forecast) => forecast.dt_txt.match(/09:00:00/))
        .map(mapDataToWeatherInterface);
    }
    // return fetch(requrl)
    //   .then((res) => handleResponse(res))
    //   .then((forecastData) => {
    //     if (Object.entries(forecastData).length) {
    //       return forecastData.list
    //         .filter((forecast) => forecast.dt_txt.match(/09:00:00/))
    //         .map(mapDataToWeatherInterface);
    //     }
    //   });
  }

  function mapDataToWeatherInterface(data) {
    const mapped = {
      date: data.dt * 1000, // convert from seconds to milliseconds
      description: data.weather[0].main,
      temperature: Math.round(data.main.temp),
    };

    // Add extra properties for the five day forecast: dt_txt, icon, min, max
    if (data.dt_txt) {
      mapped.dt_txt = data.dt_txt;
    }

    return mapped;
  }

  return (
    <div className="App">
      {typeof weatherData.main != "undefined" ? (
        <div>
          <Weather weatherData={weatherData} />
          <Forecast forecast={forecast} weatherData={weatherData} />
        </div>
      ) : (
        <div>
          {/* <Dimmer active>
            <Loader>Loading..</Loader>
          </Dimmer> */}
        </div>
      )}
    </div>
  );
}
