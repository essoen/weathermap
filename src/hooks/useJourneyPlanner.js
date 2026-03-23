import { useQuery } from '@tanstack/react-query';
import { useTripContext } from '../contexts/TripContext';
import { fetchTrip } from '../api/entur';

export function useJourneyPlanner() {
  const { origin, selectedPOI, showJourney, selectedDate } = useTripContext();

  return useQuery({
    queryKey: ['journey', origin?.lat, origin?.lon, selectedPOI?.lat, selectedPOI?.lon, selectedDate?.toISOString()],
    queryFn: () => fetchTrip(
      origin.lat, origin.lon,
      selectedPOI.lat, selectedPOI.lon,
      selectedDate.toISOString(),
    ),
    enabled: !!origin && !!selectedPOI && showJourney,
    staleTime: 5 * 60 * 1000,
  });
}
