import { PROFILES, getDefaultCustomParams } from './weatherProfiles';

/**
 * Score a single parameter value against an ideal range.
 * Returns 0-1 where 1 = perfect match.
 */
function scoreParam(value, idealMin, idealMax, falloff) {
  if (value == null) return 0.5; // unknown → neutral
  if (value >= idealMin && value <= idealMax) return 1.0;
  if (value < idealMin) return Math.max(0, 1 - (idealMin - value) / falloff);
  return Math.max(0, 1 - (value - idealMax) / falloff);
}

/**
 * Find the closest hourly entry to the target time.
 */
function findClosestEntry(hourly, targetTime) {
  if (!hourly?.length) return null;
  const target = new Date(targetTime).getTime();
  let closest = hourly[0];
  let minDiff = Math.abs(new Date(hourly[0].time).getTime() - target);

  for (let i = 1; i < hourly.length; i++) {
    const diff = Math.abs(new Date(hourly[i].time).getTime() - target);
    if (diff < minDiff) {
      minDiff = diff;
      closest = hourly[i];
    }
  }
  return closest;
}

/**
 * Score weather data against a profile at a specific time.
 * Returns { score: 0-1, entry: weather data for that time }
 */
export function scoreWeather(weatherData, profileId, customParams, targetTime) {
  if (!weatherData?.hourly?.length) return { score: 0, entry: null };

  const entry = findClosestEntry(weatherData.hourly, targetTime);
  if (!entry) return { score: 0, entry: null };

  const params = profileId === 'custom'
    ? (customParams || getDefaultCustomParams())
    : PROFILES[profileId]?.params;

  if (!params) return { score: 0, entry };

  let totalScore = 0;
  let totalWeight = 0;

  for (const p of params) {
    const value = entry[p.key];
    const s = scoreParam(value, p.idealMin, p.idealMax, p.falloff);
    totalScore += s * p.weight;
    totalWeight += p.weight;
  }

  const score = totalWeight > 0 ? totalScore / totalWeight : 0;
  return { score, entry };
}
