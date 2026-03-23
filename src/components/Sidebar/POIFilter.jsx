import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { POI_TYPES } from '../../constants';

export default function POIFilter() {
  const { t } = useTranslation();
  const { origin, enabledPOITypes, setEnabledPOITypes } = useTripContext();

  function toggle(type) {
    setEnabledPOITypes((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  return (
    <div className={!origin ? 'opacity-40 pointer-events-none' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        📍 {t('sidebar.poi_filter')}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(POI_TYPES).map(([key, { labelKey, emoji }]) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors
              ${enabledPOITypes[key]
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-50 text-gray-400 border border-gray-100'
              }`}
          >
            <span>{emoji}</span>
            <span>{t(labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
