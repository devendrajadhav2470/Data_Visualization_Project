import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} WeatherGlobal</p>
        <p>Created by dj</p>
      </div>
    </footer>
  );
};

export default Footer;
