import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logo from '../logos/GlobalWeather_transparent.png';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: '\u{1F3E0}' },
  { path: '/realtime', label: 'Real-Time', icon: '\u{1F4CA}' },
  { path: '/airquality', label: 'Air Quality', icon: '\u{1F32C}\uFE0F' },
  { path: '/maps', label: 'Maps', icon: '\u{1F5FA}\uFE0F' },
];

export default function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation"
      >
        {mobileOpen ? '\u2715' : '\u2630'}
      </button>

      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logo} alt="GlobalWeather" className="sidebar-logo" />
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-text">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span>{isDark ? '\u2600\uFE0F' : '\u{1F319}'}</span>
            <span className="theme-toggle-label">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}

