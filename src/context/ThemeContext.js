import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('weather-dashboard-theme');
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('weather-dashboard-theme', isDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const plotlyTheme = isDark
    ? {
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e2e8f0' },
        xaxis: { gridcolor: '#1a4080', zerolinecolor: '#1a4080' },
        yaxis: { gridcolor: '#1a4080', zerolinecolor: '#1a4080' },
      }
    : {
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#2d3748' },
        xaxis: { gridcolor: '#e2e8f0', zerolinecolor: '#e2e8f0' },
        yaxis: { gridcolor: '#e2e8f0', zerolinecolor: '#e2e8f0' },
      };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, plotlyTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
