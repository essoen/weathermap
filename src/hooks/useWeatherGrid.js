import { useQuery } from '@tanstack/react-query';
import { useTripContext } from '../contexts/TripContext';
import { generateGridPoints } from '../utils/geo';
import { fetchWeather } from '../api/weather';
import { batchFetch } from '../utils/rateLimiter';
import { AVG_SPEED_KMH } from '../constants';

// Adaptive grid: finer resolution for smaller radii, coarser for larger
// Target ~40-60 grid points regardless of radius
function getStepDeg(radiusKm) {
  if (radiusKm <= 80) return 0.15;   // ~1h: dense grid
  if (radiusKm <= 150) return 0.2;   // ~2h
  if (radiusKm <= 250) return 0.3;   // ~3h
  if (radiusKm <= 350) return 0.4;   // ~4-5h
  return 0.5;                         // ~6h
}

export function useWeatherGrid() {
  const { origin, radiusHours } = useTripContext();
  const radiusKm = radiusHours * AVG_SPEED_KMH;
  const stepDeg = getStepDeg(radiusKm);

  return useQuery({
    queryKey: ['weatherGrid', origin?.lat, origin?.lon, radiusHours],
    queryFn: async () => {
      const points = generateGridPoints(origin.lat, origin.lon, radiusKm, stepDeg);

      const tasks = points.map((pt) => () => fetchWeather(pt.lat, pt.lon));
      const results = await batchFetch(tasks, { concurrency: 5, pauseMs: 200 });

      return points.map((pt, i) => ({
        lat: pt.lat,
        lon: pt.lon,
        stepDeg,
        weather: results[i].data || null,
        error: results[i].error || null,
      }));
    },
    enabled: !!origin,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
