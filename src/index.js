import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Homepage from "./Homepage";
import RealTime from "./RealTime0";
import AirQuality from "./AirQuality";
import Map from "./Maps0";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path={"/"} Component={Homepage} />
        <Route path={"/realtime"} Component={RealTime} />
        <Route path={"/airquality"} Component={AirQuality} />
        <Route path={"/maps"} Component={Map} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analyebVitics endpoint. Learn more: https://bit.ly/CRA-vitals
