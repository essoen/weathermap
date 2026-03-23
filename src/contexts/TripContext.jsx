import { createContext, useContext, useState, useCallback } from 'react';

const TripContext = createContext(null);

export function TripProvider({ children }) {
  const [origin, setOrigin] = useState(null); // { lat, lon, label }
  const [radiusHours, setRadiusHours] = useState(3);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(12, 0, 0, 0);
    return d; // Default to tomorrow at noon
  });
  const [weatherProfile, setWeatherProfile] = useState('fine_weather');
  const [customProfileParams, setCustomProfileParams] = useState(null);
  const [selectedPOI, setSelectedPOI] = useState(null);
  const [enabledPOITypes, setEnabledPOITypes] = useState({
    cabin: true,
    beach: true,
    kite: true,
    viewpoint: true,
    camping: true,
  });
  const [showJourney, setShowJourney] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  const clearOrigin = useCallback(() => {
    setOrigin(null);
    setSelectedPOI(null);
    setShowJourney(false);
  }, []);

  return (
    <TripContext.Provider
      value={{
        origin, setOrigin, clearOrigin,
        radiusHours, setRadiusHours,
        selectedDate, setSelectedDate,
        weatherProfile, setWeatherProfile,
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
