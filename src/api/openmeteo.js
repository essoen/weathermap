import { OPENMETEO_API_BASE } from '../constants';

export async function fetchOpenMeteoForecast(lat, lon) {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lon.toFixed(4),
    hourly: 'temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,cloudcover,relative_humidity_2m',
    forecast_days: '10',
  });

  const res = await fetch(`${OPENMETEO_API_BASE}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

  const data = await res.json();
  return normalizeOpenMeteo(data);
}

function normalizeOpenMeteo(data) {
  const h = data.hourly || {};
  const times = h.time || [];

  return {
    source: 'openmeteo',
    hourly: times.map((time, i) => ({
      time: new Date(time).toISOString(),
      temp: h.temperature_2m?.[i] ?? null,
      windSpeed: h.wind_speed_10m?.[i] != null ? h.wind_speed_10m[i] / 3.6 : null, // km/h → m/s
      windGusts: h.wind_gusts_10m?.[i] != null ? h.wind_gusts_10m[i] / 3.6 : null,
      windDir: h.wind_direction_10m?.[i] ?? null,
      precip: h.precipitation?.[i] ?? null,
      cloudCover: h.cloudcover?.[i] ?? null,
      humidity: h.relative_humidity_2m?.[i] ?? null,
      symbol: null, // Open-Meteo doesn't provide MET-style symbols
    })),
  };
}
