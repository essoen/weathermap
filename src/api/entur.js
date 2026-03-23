import { ENTUR_GEOCODER_URL, ENTUR_JOURNEY_URL, ENTUR_CLIENT_NAME } from '../constants';

const enturHeaders = {
  'ET-Client-Name': ENTUR_CLIENT_NAME,
};

export async function geocoderAutocomplete(text, lang = 'no') {
  const params = new URLSearchParams({
    text,
    lang,
    size: '8',
    layers: 'venue,address,locality',
  });

  const res = await fetch(`${ENTUR_GEOCODER_URL}?${params}`, { headers: enturHeaders });
  if (!res.ok) throw new Error(`Geocoder error: ${res.status}`);
  const data = await res.json();

  return (data.features || []).map((f) => ({
    id: f.properties.id,
    label: f.properties.label || f.properties.name,
    // GeoJSON is [lon, lat] — swap for Leaflet
    lat: f.geometry.coordinates[1],
    lon: f.geometry.coordinates[0],
    category: f.properties.layer,
  }));
}

export async function fetchTrip(fromLat, fromLon, toLat, toLon, dateTime) {
  const query = `{
    trip(
      from: {coordinates: {latitude: ${fromLat}, longitude: ${fromLon}}}
      to: {coordinates: {latitude: ${toLat}, longitude: ${toLon}}}
      dateTime: "${dateTime}"
      numTripPatterns: 3
    ) {
      tripPatterns {
        startTime
        endTime
        duration
        legs {
          mode
          fromPlace { name }
          toPlace { name }
          expectedStartTime
          expectedEndTime
          line { publicCode name }
        }
      }
    }
  }`;

  const res = await fetch(ENTUR_JOURNEY_URL, {
    method: 'POST',
    headers: {
      ...enturHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) throw new Error(`Journey planner error: ${res.status}`);
  const data = await res.json();

  if (data.errors?.length) {
    throw new Error(data.errors[0].message);
  }

  return data.data?.trip?.tripPatterns || [];
}
