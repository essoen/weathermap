import { Circle } from 'react-leaflet';
import { useTripContext } from '../../contexts/TripContext';
import { AVG_SPEED_KMH } from '../../constants';

export default function RadiusCircle() {
  const { origin, radiusHours } = useTripContext();

  if (!origin) return null;

  const radiusMeters = radiusHours * AVG_SPEED_KMH * 1000;

  return (
    <Circle
      center={[origin.lat, origin.lon]}
      radius={radiusMeters}
      pathOptions={{
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.05,
        weight: 2,
        dashArray: '8 4',
      }}
    />
  );
}
