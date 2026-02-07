import React, { useState, useRef, useEffect } from 'react';
import { geocodeCity } from '../services/weatherService';
import './CitySearch.css';

export default function CitySearch({ onCitySelect, placeholder = 'Search for a city...' }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await geocodeCity(value);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error('Search failed:', err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (city) => {
    setQuery(`${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`);
    setIsOpen(false);
    setSuggestions([]);
    onCitySelect(city);
  };

  return (
    <div className="city-search" ref={wrapperRef}>
      <div className="city-search-input-wrapper">
        <svg
          className="city-search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="city-search-input"
        />
        {loading && <span className="city-search-spinner" />}
      </div>
      {isOpen && (
        <ul className="city-search-dropdown">
          {suggestions.map((s, i) => (
            <li
              key={`${s.lat}-${s.lon}-${i}`}
              onClick={() => handleSelect(s)}
              className="city-search-item"
            >
              <span className="city-search-item-name">{s.name}</span>
              <span className="city-search-item-detail">
                {s.state ? `${s.state}, ` : ''}
                {s.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

