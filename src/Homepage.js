// import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
// import React from "react";
// import Sidebar from "./Sidebar";
// import { Link } from "react-router-dom";
// import "./Homepage.css";
// import Footer from "./Footer";

// const Homepage = () => {
//   const cities = [
//     "New York",
//     "Ahmedabad",
//     "Chicago",
//     "Toronto",
//     "Shanghai",
//     "Moscow",
//     "Pune",
//     "London",
//     "Surat",
//   ];
//   let citydata = [];
//   const fetchWeatherData = async () => {
//     try {
//       for (let i = 0; i < cities.length; i++) {
//         const API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";
//         const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${cities[i]}&appid=${API_KEY}&units=metric`;
//         const response = await axios.get(API_URL);
//         const data = response.data;
//         citydata.push(data);
//       }
//     } catch (error) {
//       console.error("Error fetching weather data:", error);
//     }
//   };
//   useEffect(() => {
//     const interval = setInterval(() => {
//       fetchWeatherData();
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [fetchWeatherData]);

//   return (
//     <div className="homepage-container">
//       <Sidebar />
//       <div className="homepage-content">

//         <Link to="/explore" className="explore-button">
//           Explore Data
//         </Link>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Homepage;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import "./Homepage.css";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Weather from "./components/weather";
// import CityCard from "./CityCard";

import ListGroup from "react-bootstrap/ListGroup";

function CityCard({ name, data }) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={`https://source.unsplash.com/150x100/?${name}`}
      />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Temperature: {data.main.temp}°C</ListGroup.Item>
        <ListGroup.Item>WindSpeed: {data.wind.speed}</ListGroup.Item>
        <ListGroup.Item>Humidity: {data.main.humidity}</ListGroup.Item>
        <ListGroup.Item>pressure: {data.main.pressure}</ListGroup.Item>
      </ListGroup>
    </Card>
  );
}
// function CityCard({ name, data }) {
//   console.log(data);
//   return (
//     <div className="city-card">
//       <img src={`https://source.unsplash.com/150x100/?${name}`} alt={name} />
//       <div className="city-details">
//         <h2>{name}</h2>
//         <p>Temperature: {data.main.temp}°C</p>
//         <p>WindSpeed: {data.wind.speed} </p>
//         <p>Humidity: {data.main.humidity}</p>
//         <p>pressure: {data.main.pressure}</p>
//         {/* Add other details as needed */}
//       </div>
//     </div>
//   );
// }
const Homepage = () => {
  const cities = [
    "New York",
    "Ahmedabad",
    "Chicago",
    "Toronto",
    "Shanghai",
    "Moscow",
    "Pune",
    "London",
    "Surat",
  ];
  const [cityData, setCityData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";
        const promises = cities.map((city) =>
          axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          )
        );
        const responses = await Promise.all(promises);
        const data = responses.map((response) => response.data);
        setCityData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();

    // const interval = setInterval(fetchWeatherData, 10000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage-container">
      <Sidebar />
      <div className="homepage-content">
        <div className="cards-container">
          {cityData.map((city, index) => (
            <div key={index} md={4}>
              {/* <CityCard name={cities[index]} data={city} /> */}

              <Weather weatherData={city} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Homepage;
