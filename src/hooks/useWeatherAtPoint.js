import { useQuery } from '@tanstack/react-query';
import { fetchWeather } from '../api/weather';

export function useWeatherAtPoint(lat, lon) {
  return useQuery({
    queryKey: ['weather', lat?.toFixed(3), lon?.toFixed(3)],
    queryFn: () => fetchWeather(lat, lon),
    enabled: lat != null && lon != null,
    staleTime: 15 * 60 * 1000,
  });
}
