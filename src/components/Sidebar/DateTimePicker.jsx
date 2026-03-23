import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTripContext } from '../../contexts/TripContext';

function toDateString(date) {
  return date.toISOString().split('T')[0];
}

function getNextSaturday() {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSat = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysUntilSat);
  d.setHours(10, 0, 0, 0);
  return d;
}

function getNextSunday() {
  const d = getNextSaturday();
  d.setDate(d.getDate() + 1);
  d.setHours(18, 0, 0, 0);
  return d;
}

export default function DateTimePicker() {
  const { t } = useTranslation();
  const { selectedDate, setSelectedDate, selectedEndDate, setSelectedEndDate } = useTripContext();

  const today = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 9);
    return d;
  }, []);

  const dateStr = toDateString(selectedDate);
  const endDateStr = selectedEndDate ? toDateString(selectedEndDate) : '';
  const hourStr = String(selectedDate.getHours()).padStart(2, '0');
  const isRange = !!selectedEndDate;

  function setDate(newDateStr) {
    const d = new Date(selectedDate);
    const [y, m, day] = newDateStr.split('-').map(Number);
    d.setFullYear(y, m - 1, day);
    setSelectedDate(d);
    // Clear end date if it's before start
    if (selectedEndDate && d > selectedEndDate) setSelectedEndDate(null);
  }

  function setEndDate(newDateStr) {
    if (!newDateStr) { setSelectedEndDate(null); return; }
    const d = new Date(newDateStr);
    d.setHours(20, 0, 0, 0);
    setSelectedEndDate(d);
  }

  function setHour(newHour) {
    const d = new Date(selectedDate);
    d.setHours(parseInt(newHour, 10), 0, 0, 0);
    setSelectedDate(d);
  }

  function setQuick(start, end) {
    setSelectedDate(start);
    setSelectedEndDate(end || null);
  }

  const quickButtons = [
    {
      label: t('sidebar.today'),
      start: (() => { const d = new Date(); d.setHours(12, 0, 0, 0); return d; })(),
      end: null,
    },
    {
      label: t('sidebar.tomorrow'),
      start: (() => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(10, 0, 0, 0); return d; })(),
      end: null,
    },
    {
      label: t('sidebar.weekend'),
      start: getNextSaturday(),
      end: getNextSunday(),
    },
  ];

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        📅 {t('sidebar.date_time')}
      </label>

      {/* Quick buttons */}
      <div className="flex gap-1 mb-2">
        {quickButtons.map((q) => {
          const isActive = toDateString(selectedDate) === toDateString(q.start)
            && ((!q.end && !selectedEndDate) || (q.end && selectedEndDate && toDateString(selectedEndDate) === toDateString(q.end)));
          return (
            <button
              key={q.label}
              onClick={() => setQuick(q.start, q.end)}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors
                ${isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {q.label}
            </button>
          );
        })}
      </div>

      {/* Date inputs */}
      <div className="flex gap-2 items-center">
        <input
          type="date"
          value={dateStr}
          min={toDateString(today)}
          max={toDateString(maxDate)}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs"
        />
        {!isRange && (
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
        )}
        {isRange && (
          <>
            <span className="text-xs text-gray-400">→</span>
            <input
              type="date"
              value={endDateStr}
              min={dateStr}
              max={toDateString(maxDate)}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-xs"
            />
          </>
        )}
      </div>

      {/* Toggle range mode */}
      <button
        onClick={() => setSelectedEndDate(isRange ? null : (() => { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); d.setHours(20, 0, 0, 0); return d; })())}
        className="text-xs text-blue-500 hover:text-blue-700 mt-1.5"
      >
        {isRange ? '← Velg enkelt tidspunkt' : 'Velg periode (f.eks. helg) →'}
      </button>

      {isRange && (
        <p className="text-xs text-gray-400 mt-1 italic">
          Viser gjennomsnittlig vær for dagtid (08-20) i perioden
        </p>
      )}
    </div>
  );
}
