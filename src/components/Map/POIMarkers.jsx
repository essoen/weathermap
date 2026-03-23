import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useTripContext } from '../../contexts/TripContext';
import { usePOIs } from '../../hooks/usePOIs';
import { POI_TYPES } from '../../constants';
import POIPopup from './POIPopup';

function createIcon(type) {
  const info = POI_TYPES[type] || { emoji: '📍' };
  return L.divIcon({
    className: 'poi-marker',
    html: `<div style="font-size:20px;text-align:center;line-height:28px;width:28px;height:28px;background:white;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)">${info.emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

const iconCache = {};
function getIcon(type) {
  if (!iconCache[type]) iconCache[type] = createIcon(type);
  return iconCache[type];
}

export default function POIMarkers() {
  const { origin, enabledPOITypes, setSelectedPOI, setShowJourney } = useTripContext();
  const { data: pois = [] } = usePOIs();

  if (!origin) return null;

  const filtered = pois.filter((p) => enabledPOITypes[p.type] !== false);

  return (
    <>
      {filtered.map((poi) => (
        <Marker
          key={poi.id}
          position={[poi.lat, poi.lon]}
          icon={getIcon(poi.type)}
          eventHandlers={{
            click: () => {
              setSelectedPOI(poi);
              setShowJourney(false);
            },
          }}
        >
          <Popup maxWidth={280}>
            <POIPopup poi={poi} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}
