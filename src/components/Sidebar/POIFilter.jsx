import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { POI_TYPES } from '../../constants';

export default function POIFilter() {
  const { t } = useTranslation();
  const { origin, enabledPOITypes, setEnabledPOITypes } = useTripContext();

  function toggle(type) {
    setEnabledPOITypes((prev) => ({ ...prev, [type]: !prev[type] }));
  }

  const anyEnabled = Object.values(enabledPOITypes).some(Boolean);

  return (
    <div className={!origin ? 'opacity-40 pointer-events-none' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        📍 {t('sidebar.poi_filter')}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(POI_TYPES).map(([key, { labelKey, emoji }]) => {
          const enabled = enabledPOITypes[key];
          return (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all border
                ${enabled
                  ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
            >
              <span>{emoji}</span>
              <span>{t(labelKey)}</span>
            </button>
          );
        })}
      </div>
      {!anyEnabled && origin && (
        <p className="text-xs text-gray-400 mt-1.5 italic">
          Velg en kategori for å vise steder på kartet
        </p>
      )}
    </div>
  );
}
