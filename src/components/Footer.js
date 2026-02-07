import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} GlobalWeather Dashboard</p>
    </footer>
  );
}

