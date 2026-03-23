import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { useJourneyPlanner } from '../../hooks/useJourneyPlanner';

const MODE_ICONS = {
  foot: '🚶', bus: '🚌', tram: '🚋', rail: '🚃', metro: '🚇',
  water: '⛴️', air: '✈️', coach: '🚌', car: '🚗',
};

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}t ${m}min` : `${m}min`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
}

export default function JourneyPanel() {
  const { t } = useTranslation();
  const { showJourney, selectedPOI, setShowJourney } = useTripContext();
  const { data: patterns = [], isLoading, error } = useJourneyPlanner();

  if (!showJourney || !selectedPOI) return null;

  return (
    <div className="border-t border-gray-100 pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-gray-700">
          🚌 {t('journey.title')} → {selectedPOI.name}
        </h3>
        <button
          onClick={() => setShowJourney(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </div>

      {isLoading && <div className="text-xs text-gray-400">{t('common.loading')}</div>}

      {error && (
        <div className="text-xs text-red-500">{t('poi.no_route')}</div>
      )}

      {patterns.length === 0 && !isLoading && !error && (
        <div className="text-xs text-gray-400">{t('poi.no_route')}</div>
      )}

      <div className="space-y-3">
        {patterns.map((pattern, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2.5">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium text-gray-500">
                {t('journey.option', { n: i + 1 })}
              </span>
              <span className="text-xs font-bold text-blue-600">
                {formatDuration(pattern.duration)}
              </span>
            </div>

            <div className="space-y-1">
              {pattern.legs.map((leg, j) => (
                <div key={j} className="flex items-center gap-1.5 text-xs">
                  <span className="text-base">{MODE_ICONS[leg.mode] || '🔵'}</span>
                  <span className="text-gray-500">{formatTime(leg.expectedStartTime)}</span>
                  <span className="flex-1 truncate">
                    {leg.line
                      ? <span className="font-medium">{leg.line.publicCode} {leg.line.name}</span>
                      : <span className="text-gray-400">{leg.fromPlace?.name} → {leg.toPlace?.name}</span>
                    }
                  </span>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-400 mt-1">
              {formatTime(pattern.startTime)} → {formatTime(pattern.endTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
