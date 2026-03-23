import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';

function toDateString(date) {
  return date.toISOString().split('T')[0];
}

function getNextWeekend() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSat = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSat);
  d.setHours(10, 0, 0, 0);
  return d;
}

export default function DateTimePicker() {
  const { t } = useTranslation();
  const { selectedDate, setSelectedDate } = useTripContext();

  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    return d;
  }, []);

  const dateStr = toDateString(selectedDate);
  const hourStr = String(selectedDate.getHours()).padStart(2, '0');

  function setDate(newDateStr) {
    const d = new Date(selectedDate);
    const [y, m, day] = newDateStr.split('-').map(Number);
    d.setFullYear(y, m - 1, day);
    setSelectedDate(d);
  }

  function setHour(newHour) {
    const d = new Date(selectedDate);
    d.setHours(parseInt(newHour, 10), 0, 0, 0);
    setSelectedDate(d);
  }

  function setQuick(date) {
    setSelectedDate(date);
  }

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        📅 {t('sidebar.date_time')}
      </label>

      {/* Quick buttons */}
      <div className="flex gap-1 mb-2">
        {[
          { label: t('sidebar.today'), date: (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })() },
          { label: t('sidebar.tomorrow'), date: (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(12, 0, 0, 0); return d; })() },
          { label: t('sidebar.weekend'), date: getNextWeekend() },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => setQuick(q.date)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors
              ${toDateString(selectedDate) === toDateString(q.date)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Date + hour inputs */}
      <div className="flex gap-2">
        <input
          type="date"
          value={dateStr}
          min={toDateString(today)}
          max={toDateString(maxDate)}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs"
        />
        <select
          value={hourStr}
          onChange={(e) => setHour(e.target.value)}
          className="px-2 py-1.5 border border-gray-200 rounded text-xs"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={String(i).padStart(2, '0')}>
              {String(i).padStart(2, '0')}:00
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
