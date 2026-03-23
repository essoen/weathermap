import { OVERPASS_API_URL } from '../constants';

const TAG_QUERIES = {
  cabin: [
    'node["tourism"~"alpine_hut|wilderness_hut"]',
    'way["tourism"~"alpine_hut|wilderness_hut"]',
  ],
  beach: [
    'node["natural"="beach"]',
    'way["natural"="beach"]',
    'node["leisure"="bathing_place"]',
  ],
  viewpoint: [
    'node["tourism"="viewpoint"]',
  ],
  camping: [
    'node["tourism"~"camp_site|caravan_site"]',
    'way["tourism"~"camp_site|caravan_site"]',
  ],
};

export async function fetchPOIs(bbox) {
  const { minLat, minLon, maxLat, maxLon } = bbox;
  const bboxStr = `${minLat},${minLon},${maxLat},${maxLon}`;

  // Build union query for all types
  const queries = Object.values(TAG_QUERIES)
    .flat()
    .map((q) => `${q}(${bboxStr});`)
    .join('\n  ');

  const overpassQuery = `[out:json][timeout:25];
(
  ${queries}
);
out center 500;`;

  const res = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  });

  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();

  return (data.elements || []).map((el) => {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) return null;

    const type = categorize(el.tags);
    return {
      id: `osm-${el.type}-${el.id}`,
      name: el.tags?.name || el.tags?.tourism || el.tags?.natural || 'Ukjent',
      lat,
      lon,
      type,
      tags: el.tags || {},
      source: 'osm',
    };
  }).filter(Boolean);
}

function categorize(tags = {}) {
  if (tags.tourism === 'alpine_hut' || tags.tourism === 'wilderness_hut') return 'cabin';
  if (tags.natural === 'beach' || tags.leisure === 'bathing_place') return 'beach';
  if (tags.tourism === 'viewpoint') return 'viewpoint';
  if (tags.tourism === 'camp_site' || tags.tourism === 'caravan_site') return 'camping';
  return 'other';
}
