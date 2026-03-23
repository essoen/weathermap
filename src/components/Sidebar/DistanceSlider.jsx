import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';
import { AVG_SPEED_KMH } from '../../constants';

export default function DistanceSlider() {
  const { t } = useTranslation();
  const { origin, radiusHours, setRadiusHours } = useTripContext();
  const km = Math.round(radiusHours * AVG_SPEED_KMH);

  return (
    <div className={!origin ? 'opacity-40 pointer-events-none' : ''}>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        🚗 {t('sidebar.distance_label')}
      </label>
      <input
        type="range"
        min={1}
        max={6}
        step={0.5}
        value={radiusHours}
        onChange={(e) => setRadiusHours(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
        disabled={!origin}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{radiusHours} {t('sidebar.hours')}</span>
        <span>{t('sidebar.approx_km', { km })}</span>
      </div>
    </div>
  );
}
