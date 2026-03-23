import { useQuery } from '@tanstack/react-query';
import { useTripContext } from '../contexts/TripContext';
import { fetchPOIs } from '../api/overpass';
import { getBoundingBox } from '../utils/geo';
import { AVG_SPEED_KMH } from '../constants';

let kiteSpots = null;

async function loadKiteSpots() {
  if (kiteSpots) return kiteSpots;
  const res = await fetch(`${import.meta.env.BASE_URL}data/kite-spots.json`);
  const data = await res.json();
  kiteSpots = data.map((s, i) => ({
    id: `kite-${i}`,
    name: s.name,
    lat: s.lat,
    lon: s.lon,
    type: 'kite',
    tags: { description: s.description },
    source: 'static',
  }));
  return kiteSpots;
}

export function usePOIs() {
  const { origin, radiusHours, enabledPOITypes } = useTripContext();
  const radiusKm = radiusHours * AVG_SPEED_KMH;
  const anyEnabled = Object.values(enabledPOITypes).some(Boolean);

  return useQuery({
    queryKey: ['pois', origin?.lat, origin?.lon, radiusHours],
    queryFn: async () => {
      const bbox = getBoundingBox(origin.lat, origin.lon, radiusKm);

      const [osmPOIs, kites] = await Promise.all([
        fetchPOIs(bbox),
        loadKiteSpots(),
      ]);

      // Filter kite spots to those within the radius bbox
      const filteredKites = kites.filter(
        (k) => k.lat >= bbox.minLat && k.lat <= bbox.maxLat &&
               k.lon >= bbox.minLon && k.lon <= bbox.maxLon,
      );

      return [...osmPOIs, ...filteredKites];
    },
    // Only fetch when origin is set AND at least one POI type is enabled
    enabled: !!origin && anyEnabled,
    staleTime: 60 * 60 * 1000,
  });
}
