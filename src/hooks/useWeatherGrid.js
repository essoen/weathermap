import { useQuery } from '@tanstack/react-query';
import { useTripContext } from '../contexts/TripContext';
import { generateGridPoints } from '../utils/geo';
import { fetchWeather } from '../api/weather';
import { batchFetch } from '../utils/rateLimiter';
import { AVG_SPEED_KMH, WEATHER_GRID_STEP_DEG } from '../constants';

export function useWeatherGrid() {
  const { origin, radiusHours } = useTripContext();
  const radiusKm = radiusHours * AVG_SPEED_KMH;

  return useQuery({
    queryKey: ['weatherGrid', origin?.lat, origin?.lon, radiusHours],
    queryFn: async () => {
      const points = generateGridPoints(origin.lat, origin.lon, radiusKm, WEATHER_GRID_STEP_DEG);

      const tasks = points.map((pt) => () => fetchWeather(pt.lat, pt.lon));
      const results = await batchFetch(tasks, { concurrency: 5, pauseMs: 200 });

      return points.map((pt, i) => ({
        lat: pt.lat,
        lon: pt.lon,
        weather: results[i].data || null,
        error: results[i].error || null,
      }));
    },
    enabled: !!origin,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
