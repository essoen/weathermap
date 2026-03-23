import { MET_API_BASE } from '../constants';

export async function fetchMETForecast(lat, lon) {
  const url = `${MET_API_BASE}?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`MET API error: ${res.status}`);

  const data = await res.json();
  return normalizeMET(data);
}

function normalizeMET(data) {
  const timeseries = data.properties?.timeseries || [];

  return {
    source: 'met',
    hourly: timeseries.map((entry) => {
      const d = entry.data;
      const instant = d.instant?.details || {};
      const next1h = d.next_1_hours;
      const next6h = d.next_6_hours;

      return {
        time: entry.time,
        temp: instant.air_temperature ?? null,
        windSpeed: instant.wind_speed ?? null,
        windGusts: instant.wind_speed_of_gust ?? null,
        windDir: instant.wind_from_direction ?? null,
        precip: next1h?.details?.precipitation_amount ?? next6h?.details?.precipitation_amount ?? null,
        cloudCover: instant.cloud_area_fraction ?? null,
        humidity: instant.relative_humidity ?? null,
        symbol: next1h?.summary?.symbol_code ?? next6h?.summary?.symbol_code ?? null,
      };
    }),
  };
}
