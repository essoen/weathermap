import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { PROFILES, getDefaultCustomParams } from '../../utils/weatherProfiles';

const PROFILE_IDS = ['fine_weather', 'kite_wind', 'hiking', 'beach', 'custom'];

export default function WeatherProfileSelector() {
  const { t } = useTranslation();
  const {
    origin,
    weatherProfile, setWeatherProfile,
    customProfileParams, setCustomProfileParams,
  } = useTripContext();

  const activeParams = weatherProfile === 'custom'
    ? (customProfileParams || getDefaultCustomParams())
    : PROFILES[weatherProfile]?.params || [];

  function handleProfileChange(id) {
    setWeatherProfile(id);
    if (id === 'custom' && !customProfileParams) {
      setCustomProfileParams(getDefaultCustomParams());
    }
  }

  function handleParamChange(index, field, value) {
    if (weatherProfile !== 'custom') {
      // Switching to custom when user tweaks a preset
      const params = activeParams.map((p) => ({ ...p }));
      params[index] = { ...params[index], [field]: value };
      setCustomProfileParams(params);
      setWeatherProfile('custom');
    } else {
      const params = (customProfileParams || getDefaultCustomParams()).map((p) => ({ ...p }));
      params[index] = { ...params[index], [field]: value };
      setCustomProfileParams(params);
    }
  }

  return (
    <div className={!origin ? 'opacity-40 pointer-events-none' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        🌤️ {t('sidebar.weather_profile')}
      </label>

      {/* Profile buttons */}
      <div className="flex flex-wrap gap-1 mb-3">
        {PROFILE_IDS.map((id) => (
          <button
            key={id}
            onClick={() => handleProfileChange(id)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors
              ${weatherProfile === id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {t(`profiles.${id}`)}
          </button>
        ))}
      </div>

      {/* Parameter sliders */}
      <div className="space-y-3">
        {activeParams.map((param, i) => (
          <div key={param.key} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>{t(param.labelKey)}</span>
              <span className="font-mono">
                {param.idealMin}–{param.idealMax} {param.unit}
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="range"
                min={param.key === 'temp' ? -20 : 0}
                max={param.key === 'temp' ? 40 : param.key === 'windSpeed' || param.key === 'windGusts' ? 30 : param.key === 'precip' ? 20 : 100}
                step={param.key === 'precip' ? 0.5 : 1}
                value={param.idealMin}
                onChange={(e) => handleParamChange(i, 'idealMin', parseFloat(e.target.value))}
                className="flex-1 accent-blue-500 h-1"
              />
              <input
                type="range"
                min={param.key === 'temp' ? -20 : 0}
                max={param.key === 'temp' ? 40 : param.key === 'windSpeed' || param.key === 'windGusts' ? 30 : param.key === 'precip' ? 20 : 100}
                step={param.key === 'precip' ? 0.5 : 1}
                value={param.idealMax}
                onChange={(e) => handleParamChange(i, 'idealMax', parseFloat(e.target.value))}
                className="flex-1 accent-green-500 h-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
