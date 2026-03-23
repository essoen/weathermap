import { fetchMETForecast } from './met';
import { fetchOpenMeteoForecast } from './openmeteo';

/**
 * Fetch weather for a coordinate. Tries MET Norway first, falls back to Open-Meteo.
 */
export async function fetchWeather(lat, lon) {
  try {
    return await fetchMETForecast(lat, lon);
  } catch {
    return await fetchOpenMeteoForecast(lat, lon);
  }
}
