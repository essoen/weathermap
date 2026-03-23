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
  const { origin, radiusHours } = useTripContext();
  const radiusKm = radiusHours * AVG_SPEED_KMH;

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
    enabled: !!origin,
    staleTime: 60 * 60 * 1000, // 1 hour — POI data rarely changes
  });
}
