import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { useWeatherAtPoint } from '../../hooks/useWeatherAtPoint';
import { scoreWeather } from '../../utils/weatherScoring';
import { scoreToColor } from '../../utils/colorScale';
import { POI_TYPES } from '../../constants';

export default function POIPopup({ poi }) {
  const { t } = useTranslation();
  const { origin, weatherProfile, customProfileParams, selectedDate, selectedEndDate, setShowJourney, setSelectedPOI } = useTripContext();
  const { data: weather, isLoading } = useWeatherAtPoint(poi.lat, poi.lon);

  const { score, entry } = weather
    ? scoreWeather(weather, weatherProfile, customProfileParams, selectedDate, selectedEndDate)
    : { score: 0, entry: null };

  const typeInfo = POI_TYPES[poi.type] || { emoji: '📍' };

  function handleShowRoute() {
    setSelectedPOI(poi);
    setShowJourney(true);
  }

  return (
    <div className="text-sm min-w-[200px]">
      <div className="font-bold text-base mb-1">
        {typeInfo.emoji} {poi.name}
      </div>

      {poi.tags?.description && (
        <div className="text-gray-500 text-xs mb-2">{poi.tags.description}</div>
      )}

      {isLoading && <div className="text-xs text-gray-400">{t('common.loading')}</div>}

      {entry && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs mb-2">
          <div>🌡️ {entry.temp?.toFixed(1)}°C</div>
          <div>💨 {entry.windSpeed?.toFixed(1)} m/s</div>
          <div>🌧️ {entry.precip?.toFixed(1)} mm</div>
          <div>☁️ {entry.cloudCover != null ? Math.round(entry.cloudCover) : '—'}%</div>
        </div>
      )}

      {weather && (
        <div
          className="inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2"
          style={{
            backgroundColor: scoreToColor(score, 0.2),
            color: score > 0.6 ? '#166534' : score > 0.3 ? '#854d0e' : '#991b1b',
          }}
        >
          {t('poi.match', { score: Math.round(score * 100) })}
        </div>
      )}

      {entry?.symbol && (
        <img
          src={`https://api.met.no/images/weathericons/svg/${entry.symbol}.svg`}
          alt={entry.symbol}
          className="w-8 h-8 inline-block ml-2 align-middle"
        />
      )}

      <div className="mt-2">
        <button
          onClick={handleShowRoute}
          disabled={!origin}
          className="w-full bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-blue-600 disabled:opacity-40"
        >
          🚌 {t('poi.show_route')}
        </button>
      </div>
    </div>
  );
}
