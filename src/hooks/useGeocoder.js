import { useQuery } from '@tanstack/react-query';
import { geocoderAutocomplete } from '../api/entur';

export function useGeocoder(text) {
  return useQuery({
    queryKey: ['geocoder', text],
    queryFn: () => geocoderAutocomplete(text),
    enabled: text.length >= 3,
    staleTime: 10 * 60 * 1000,
  });
}
