import { CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { useTripContext } from '../../contexts/TripContext';
import { useWeatherGrid } from '../../hooks/useWeatherGrid';
import { scoreWeather } from '../../utils/weatherScoring';
import { scoreToColor } from '../../utils/colorScale';

export default function WeatherHeatmap() {
  const {
    origin, weatherProfile, customProfileParams,
    selectedDate, selectedEndDate, scoreThreshold,
  } = useTripContext();
  const { data: gridData } = useWeatherGrid();
  const map = useMap();

  if (!origin || !gridData?.length) return null;

  const zoom = map.getZoom();
  const stepDeg = gridData[0]?.stepDeg || 0.4;
  const pixelsPerDeg = (256 * Math.pow(2, zoom)) / 360;
  const radiusPx = Math.max(8, Math.min(40, (stepDeg * pixelsPerDeg) / 2.2));

  return (
    <>
      {gridData.map((point) => {
        if (!point.weather) return null;
        const { score, entry } = scoreWeather(
          point.weather,
          weatherProfile,
          customProfileParams,
          selectedDate,
          selectedEndDate,
        );

        // Hide cells below threshold
        if (score < scoreThreshold) return null;

        const color = scoreToColor(score, 1);

        return (
          <CircleMarker
            key={`${point.lat}-${point.lon}`}
            center={[point.lat, point.lon]}
            radius={radiusPx}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.5,
              color: color,
              weight: 0,
            }}
          >
            <Tooltip>
              <div className="text-xs">
                <div>{entry?.temp != null ? `${entry.temp.toFixed(1)}°C` : '—'}</div>
                <div>{entry?.windSpeed != null ? `${entry.windSpeed.toFixed(1)} m/s` : '—'}</div>
                <div>{entry?.precip != null ? `${entry.precip.toFixed(1)} mm` : '—'}</div>
                <div>{entry?.cloudCover != null ? `☁ ${Math.round(entry.cloudCover)}%` : ''}</div>
                <div className="font-medium mt-1">{Math.round(score * 100)}% match</div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}
