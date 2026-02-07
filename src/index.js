import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Homepage from './pages/Homepage';
import RealTime from './pages/RealTime';
import AirQuality from './pages/AirQuality';
import Maps from './pages/Maps';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/realtime" element={<RealTime />} />
          <Route path="/airquality" element={<AirQuality />} />
          <Route path="/maps" element={<Maps />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
