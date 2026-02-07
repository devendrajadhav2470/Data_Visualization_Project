const API_KEY = process.env.REACT_APP_OWM_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

export async function getWeatherByCity(city) {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) throw new Error(`Failed to fetch weather for ${city}`);
  return response.json();
}

export async function getWeatherByCoords(lat, lon) {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');
  return response.json();
}

export async function getAirQuality(lat, lon) {
  const response = await fetch(
    `${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch air quality data');
  return response.json();
}

export async function geocodeCity(query) {
  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to geocode city');
  return response.json();
}

export async function getMultipleCitiesWeather(cities) {
  const promises = cities.map((city) => getWeatherByCity(city));
  return Promise.all(promises);
}

export function getWeatherTileUrl(layer) {
  return `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${API_KEY}`;
}
