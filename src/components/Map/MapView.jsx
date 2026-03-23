import { MapContainer, TileLayer, LayersControl, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { useWeatherGrid } from '../../hooks/useWeatherGrid';
import { usePOIs } from '../../hooks/usePOIs';
import {
  DEFAULT_CENTER, DEFAULT_ZOOM,
  OSM_TILE_URL, OSM_ATTRIBUTION,
  KARTVERKET_TOPO_URL, KARTVERKET_ATTRIBUTION,
} from '../../constants';
import RadiusCircle from './RadiusCircle';
import WeatherHeatmap from './WeatherHeatmap';
import POIMarkers from './POIMarkers';

function MapRefSetter() {
  const map = useMap();
  const { setMapRef } = useTripContext();
  useEffect(() => { setMapRef(map); }, [map, setMapRef]);
  return null;
}

function MapLoadingOverlay() {
  const { t } = useTranslation();
  const { origin } = useTripContext();
  const { isLoading: weatherLoading } = useWeatherGrid();
  const { isLoading: poiLoading } = usePOIs();

  if (!origin || (!weatherLoading && !poiLoading)) return null;

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      <span className="text-sm text-gray-600">
        {weatherLoading ? t('common.loading') : 'POI...'}
      </span>
    </div>
  );
}

export default function MapView() {
  const { t } = useTranslation();
  const { origin } = useTripContext();

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full z-0"
        zoomControl={true}
      >
        <MapRefSetter />

        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name={t('layers.osm')}>
            <TileLayer url={OSM_TILE_URL} attribution={OSM_ATTRIBUTION} maxZoom={18} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name={t('layers.topo')}>
            <TileLayer url={KARTVERKET_TOPO_URL} attribution={KARTVERKET_ATTRIBUTION} maxZoom={16} />
          </LayersControl.BaseLayer>
        </LayersControl>

        {origin && (
          <CircleMarker
            center={[origin.lat, origin.lon]}
            radius={8}
            pathOptions={{ fillColor: '#2563eb', fillOpacity: 1, color: '#fff', weight: 3 }}
          >
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="text-xs font-medium">{origin.label}</span>
            </Tooltip>
          </CircleMarker>
        )}

        <RadiusCircle />
        <WeatherHeatmap />
        <POIMarkers />
      </MapContainer>

      <MapLoadingOverlay />
    </div>
  );
}
