export const DEFAULT_CENTER = [62.0, 10.0];
export const DEFAULT_ZOOM = 5;

export const OSM_TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const OSM_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const KARTVERKET_TOPO_URL = 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png';
export const KARTVERKET_ATTRIBUTION = '&copy; <a href="https://www.kartverket.no/">Kartverket</a>';

export const AVG_SPEED_KMH = 70;

export const MET_API_BASE = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
export const OPENMETEO_API_BASE = 'https://api.open-meteo.com/v1/forecast';
export const ENTUR_GEOCODER_URL = 'https://api.entur.io/geocoder/v1/autocomplete';
export const ENTUR_JOURNEY_URL = 'https://api.entur.io/journey-planner/v3/graphql';
export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

export const ENTUR_CLIENT_NAME = 'vaertur-mvp';

export const WEATHER_GRID_STEP_DEG = 0.4;

export const POI_TYPES = {
  cabin: { labelKey: 'poi.cabin', emoji: '🏠' },
  beach: { labelKey: 'poi.beach', emoji: '🏖️' },
  kite: { labelKey: 'poi.kite', emoji: '🪁' },
  viewpoint: { labelKey: 'poi.viewpoint', emoji: '👁️' },
  camping: { labelKey: 'poi.camping', emoji: '⛺' },
};
