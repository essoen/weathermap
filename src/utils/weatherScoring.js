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
 * Find all hourly entries within a date range, filtered to daytime (8-20).
 */
function findEntriesInRange(hourly, startTime, endTime) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return hourly.filter((e) => {
    const t = new Date(e.time);
    const ms = t.getTime();
    const hour = t.getHours();
    return ms >= start && ms <= end && hour >= 8 && hour <= 20;
  });
}

function scoreEntry(entry, params) {
  let totalScore = 0;
  let totalWeight = 0;
  for (const p of params) {
    const value = entry[p.key];
    const s = scoreParam(value, p.idealMin, p.idealMax, p.falloff);
    totalScore += s * p.weight;
    totalWeight += p.weight;
  }
  return totalWeight > 0 ? totalScore / totalWeight : 0;
}

/**
 * Score weather data against a profile.
 * If endTime is provided, scores across the range (daytime hours) and returns the average.
 * Returns { score: 0-1, entry: representative weather entry }
 */
export function scoreWeather(weatherData, profileId, customParams, targetTime, endTime) {
  if (!weatherData?.hourly?.length) return { score: 0, entry: null };

  const params = profileId === 'custom'
    ? (customParams || getDefaultCustomParams())
    : PROFILES[profileId]?.params;

  if (!params) return { score: 0, entry: null };

  // Single point in time
  if (!endTime) {
    const entry = findClosestEntry(weatherData.hourly, targetTime);
    if (!entry) return { score: 0, entry: null };
    const score = scoreEntry(entry, params);
    return { score, entry };
  }

  // Date range: average score across daytime hours
  const entries = findEntriesInRange(weatherData.hourly, targetTime, endTime);
  if (!entries.length) {
    const entry = findClosestEntry(weatherData.hourly, targetTime);
    const score = entry ? scoreEntry(entry, params) : 0;
    return { score, entry };
  }

  let totalScore = 0;
  for (const entry of entries) {
    totalScore += scoreEntry(entry, params);
  }
  const score = totalScore / entries.length;

  // Use the midpoint entry as representative for display
  const midEntry = entries[Math.floor(entries.length / 2)];
  return { score, entry: midEntry };
}
