const R = 6371; // Earth radius in km

export function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function getBoundingBox(lat, lon, radiusKm) {
  const latDelta = radiusKm / 111.32;
  const lonDelta = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180));
  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

export function generateGridPoints(centerLat, centerLon, radiusKm, stepDeg) {
  const bbox = getBoundingBox(centerLat, centerLon, radiusKm);
  const points = [];

  for (let lat = bbox.minLat; lat <= bbox.maxLat; lat += stepDeg) {
    for (let lon = bbox.minLon; lon <= bbox.maxLon; lon += stepDeg) {
      if (haversineDistance(centerLat, centerLon, lat, lon) <= radiusKm) {
        points.push({ lat: +lat.toFixed(4), lon: +lon.toFixed(4) });
      }
    }
  }

  return points;
}
