/**
 * Weather profile definitions.
 * Each parameter has: key, idealMin, idealMax, weight, unit, labelKey
 * Score = 1.0 when value is within [idealMin, idealMax].
 * Linear falloff outside the range over `falloff` distance.
 */
export const PROFILES = {
  fine_weather: {
    labelKey: 'profiles.fine_weather',
    params: [
      { key: 'temp', idealMin: 15, idealMax: 25, falloff: 10, weight: 0.3, unit: '°C', labelKey: 'params.temperature' },
      { key: 'cloudCover', idealMin: 0, idealMax: 25, falloff: 50, weight: 0.3, unit: '%', labelKey: 'params.cloud_cover' },
      { key: 'precip', idealMin: 0, idealMax: 0.1, falloff: 3, weight: 0.25, unit: 'mm', labelKey: 'params.precipitation' },
      { key: 'windSpeed', idealMin: 0, idealMax: 5, falloff: 8, weight: 0.15, unit: 'm/s', labelKey: 'params.wind_speed' },
    ],
  },
  kite_wind: {
    labelKey: 'profiles.kite_wind',
    params: [
      { key: 'windSpeed', idealMin: 6, idealMax: 12, falloff: 5, weight: 0.4, unit: 'm/s', labelKey: 'params.wind_speed' },
      { key: 'windGusts', idealMin: 0, idealMax: 15, falloff: 8, weight: 0.2, unit: 'm/s', labelKey: 'params.wind_gusts' },
      { key: 'precip', idealMin: 0, idealMax: 0.5, falloff: 3, weight: 0.2, unit: 'mm', labelKey: 'params.precipitation' },
      { key: 'temp', idealMin: 5, idealMax: 30, falloff: 10, weight: 0.2, unit: '°C', labelKey: 'params.temperature' },
    ],
  },
  hiking: {
    labelKey: 'profiles.hiking',
    params: [
      { key: 'precip', idealMin: 0, idealMax: 0.5, falloff: 4, weight: 0.3, unit: 'mm', labelKey: 'params.precipitation' },
      { key: 'windSpeed', idealMin: 0, idealMax: 8, falloff: 8, weight: 0.2, unit: 'm/s', labelKey: 'params.wind_speed' },
      { key: 'temp', idealMin: 5, idealMax: 20, falloff: 10, weight: 0.25, unit: '°C', labelKey: 'params.temperature' },
      { key: 'cloudCover', idealMin: 0, idealMax: 60, falloff: 40, weight: 0.25, unit: '%', labelKey: 'params.cloud_cover' },
    ],
  },
  beach: {
    labelKey: 'profiles.beach',
    params: [
      { key: 'temp', idealMin: 20, idealMax: 35, falloff: 10, weight: 0.35, unit: '°C', labelKey: 'params.temperature' },
      { key: 'cloudCover', idealMin: 0, idealMax: 20, falloff: 40, weight: 0.3, unit: '%', labelKey: 'params.cloud_cover' },
      { key: 'windSpeed', idealMin: 0, idealMax: 4, falloff: 6, weight: 0.2, unit: 'm/s', labelKey: 'params.wind_speed' },
      { key: 'precip', idealMin: 0, idealMax: 0, falloff: 2, weight: 0.15, unit: 'mm', labelKey: 'params.precipitation' },
    ],
  },
};

/** Get the default custom profile (same as fine_weather but all editable) */
export function getDefaultCustomParams() {
  return PROFILES.fine_weather.params.map((p) => ({ ...p }));
}
