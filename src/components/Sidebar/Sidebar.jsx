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
      {/* Mobile toggle button */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium md:hidden"
        >
          {t('sidebar.expand')}
        </button>
      )}

      <div
        className={`
          fixed z-[1000] bg-white shadow-xl overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${collapsed ? '-translate-x-full md:-translate-x-full' : 'translate-x-0'}

          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 h-[60vh] rounded-t-2xl

          /* Desktop: left sidebar */
          md:top-0 md:bottom-0 md:right-auto md:h-full md:w-[380px] md:rounded-none
        `}
      >
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

        {/* Attribution */}
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 space-y-0.5">
          <div>{t('attribution.weather')}</div>
          <div>{t('attribution.transport')} | {t('attribution.poi_source')}</div>
        </div>
      </div>
    </>
  );
}
