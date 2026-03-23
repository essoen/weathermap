import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [origin, setOrigin] = useState(null); // { lat, lon, label }
  const [geolocating, setGeolocating] = useState(false);
  const [radiusHours, setRadiusHours] = useState(3);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(12, 0, 0, 0);
    return d; // Default to tomorrow at noon
  });
  const [weatherProfile, setWeatherProfile] = useState('fine_weather');
  const [scoreThreshold, setScoreThreshold] = useState(0); // 0 = show all, 0.7 = only 70%+ match
  const [selectedEndDate, setSelectedEndDate] = useState(null); // null = single time, Date = range end
  const [customProfileParams, setCustomProfileParams] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [enabledPOITypes, setEnabledPOITypes] = useState({
    cabin: false,
    beach: false,
    kite: false,
    viewpoint: false,
    camping: false,
  });
  const [showJourney, setShowJourney] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  const clearOrigin = useCallback(() => {
    setOrigin(null);
    setSelectedPOI(null);
    setShowJourney(false);
  }, []);

  // Auto-detect user location on load
  useEffect(() => {
    if (origin || !navigator.geolocation) return;
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        // Reverse geocode via Entur to get a place name
        let label = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        try {
          const res = await fetch(
            `https://api.entur.io/geocoder/v1/reverse?point.lat=${lat}&point.lon=${lon}&size=1&layers=locality,address`,
            { headers: { 'ET-Client-Name': 'vaertur-mvp' } },
          );
          const data = await res.json();
          if (data.features?.[0]?.properties?.label) {
            label = data.features[0].properties.label;
          }
        } catch { /* use coordinate fallback */ }
        setOrigin({ lat, lon, label });
        setGeolocating(false);
      },
      () => setGeolocating(false), // permission denied or error — silently ignore
      { timeout: 8000, enableHighAccuracy: false },
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TripContext.Provider
      value={{
        origin, setOrigin, clearOrigin, geolocating,
        radiusHours, setRadiusHours,
        selectedDate, setSelectedDate,
        selectedEndDate, setSelectedEndDate,
        weatherProfile, setWeatherProfile,
        scoreThreshold, setScoreThreshold,
        customProfileParams, setCustomProfileParams,
        selectedPOI, setSelectedPOI,
        enabledPOITypes, setEnabledPOITypes,
        showJourney, setShowJourney,
        mapRef, setMapRef,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTripContext() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTripContext must be used within TripProvider');
  return ctx;
}
