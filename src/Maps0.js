import React, { useState } from "react";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Sidebar from "./Sidebar";
import "./Maps.css";
const API_KEY = "4cd182317f73e98ed9b1a3107e7c30a3";

function MapCard({ mapType }) {
  const [xyz, setXyz] = useState([2, 2, 2]);
  console.log(
    `https://tile.openweathermap.org/map/${mapType}_new/${xyz[0]}/${xyz[1]}/${xyz[2]}.png?appid=${API_KEY}`
  );
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Img
        variant="top"
        src={`https://tile.openweathermap.org/map/${mapType}_new/${xyz[0]}/${xyz[1]}/${xyz[2]}.png?appid=${API_KEY}`}
      />
      <Card.Body>
        <Card.Title>{mapType}</Card.Title>
      </Card.Body>
    </Card>
  );
}

const Map = () => {
  const [city, setCity] = useState("");
  const [mapType, setMapType] = useState("precipitation");
  const [mapURL, setMapURL] = useState("");

  return (
    <div className="map_container" style={{ display: "flex" }}>
      <Sidebar />
      <div className="aq_main">
        <div
          className="maps-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: "100px",
            paddingLeft: "300px",
          }}
        >
          <MapCard mapType={"precipitation"} />
          <MapCard mapType={"clouds"} />
          <MapCard mapType={"pressure"} />
          <MapCard mapType={"wind"} />
          <MapCard mapType={"temp"} />
        </div>
      </div>

      {/* {mapURL && (
        <div>
          <img src={mapURL} alt={`Weather Map - ${mapType}`} />
        </div>
      )} */}
    </div>
  );
};

export default Map;
