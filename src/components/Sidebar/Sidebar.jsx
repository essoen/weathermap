import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SearchBox from './SearchBox';
import DistanceSlider from './DistanceSlider';
import WeatherProfileSelector from './WeatherProfileSelector';
import POIFilter from './POIFilter';
import DateTimePicker from './DateTimePicker';
import JourneyPanel from './JourneyPanel';
import LanguageSwitcher from './LanguageSwitcher';

export default function Sidebar() {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Toggle button — visible when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium flex items-center gap-1.5"
        >
          <span>⛅</span>
          <span>{t('sidebar.expand')}</span>
        </button>
      )}

      {/* Backdrop on mobile when sidebar is open */}
      {!collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          className="fixed inset-0 bg-black/20 z-[999] md:hidden"
        />
      )}

      <div
        className={`
          fixed z-[1000] bg-white shadow-xl overflow-y-auto
          transition-transform duration-300 ease-in-out

          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 h-[70vh] rounded-t-2xl

          /* Desktop: left sidebar */
          md:top-0 md:bottom-0 md:right-auto md:h-full md:w-[380px] md:rounded-none

          ${collapsed
            ? 'translate-y-full md:translate-y-0 md:-translate-x-full'
            : 'translate-y-0 md:translate-x-0'
          }
        `}
      >
        {/* Drag handle on mobile */}
        <div className="md:hidden flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">⛅ {t('app.title')}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setCollapsed(true)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              {t('sidebar.collapse')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-5">
          <SearchBox />
          <DateTimePicker />
          <DistanceSlider />
          <WeatherProfileSelector />
          <POIFilter />
          <JourneyPanel />
        </div>

        {/* Attribution + Sponsor */}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 space-y-1">
          <div>{t('attribution.weather')}</div>
          <div>{t('attribution.transport')} | {t('attribution.poi_source')}</div>
          <div className="pt-1">
            <a
              href="https://github.com/sponsors/essoen"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-pink-500 hover:text-pink-600 font-medium"
            >
              ♥ Støtt prosjektet
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
