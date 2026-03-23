import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { useGeocoder } from '../../hooks/useGeocoder';

export default function SearchBox() {
  const { t } = useTranslation();
  const { origin, setOrigin, clearOrigin, mapRef, radiusHours } = useTripContext();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Sync search field when origin is set externally (e.g. geolocation)
  useEffect(() => {
    if (origin?.label && !query) setQuery(origin.label);
  }, [origin]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { data: results = [], isLoading } = useGeocoder(debouncedQuery);

  function handleSelect(result) {
    setOrigin({ lat: result.lat, lon: result.lon, label: result.label });
    setQuery(result.label);
    setShowDropdown(false);
    // Auto-fit map to show the full travel radius circle
    if (mapRef) {
      const radiusKm = radiusHours * 70;
      const latDelta = radiusKm / 111.32;
      const lonDelta = radiusKm / (111.32 * Math.cos((result.lat * Math.PI) / 180));
      mapRef.fitBounds(
        [[result.lat - latDelta, result.lon - lonDelta], [result.lat + latDelta, result.lon + lonDelta]],
        { padding: [20, 20], duration: 1.5 },
      );
    }
  }

  function handleClear() {
    setQuery('');
    setDebouncedQuery('');
    clearOrigin();
    setShowDropdown(false);
  }

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        📍 {t('sidebar.search_placeholder')}
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => { if (results.length) setShowDropdown(true); }}
          placeholder={t('sidebar.search_placeholder')}
          className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {(query || origin) && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b border-gray-50 last:border-0"
              >
                <span className="font-medium">{r.label}</span>
                {r.category && (
                  <span className="text-xs text-gray-400 ml-2">{r.category}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isLoading && debouncedQuery.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-400">
          {t('common.loading')}
        </div>
      )}
    </div>
  );
}
