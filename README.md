# weathermap

Find good weather within travel distance — a client-side trip planner for Norway using open APIs from MET Norway, Entur, and OpenStreetMap.

**Live:** [svorstol.com/weathermap](https://www.svorstol.com/weathermap/)

## Features

- **Weather heatmap** — colored grid overlay showing how well conditions match your preferred activity
- **Activity profiles** — Fine weather, Kite wind, Hiking, Beach/swimming, or fully custom parameters
- **Score threshold** — filter out low-match areas to only see the best spots
- **Points of interest** — cabins, beaches, kite spots, viewpoints, and camping from OpenStreetMap + 20 curated Norwegian kite spots
- **Multi-day view** — score weather across a date range (e.g. full weekend) instead of a single hour
- **Public transit** — route planning via Entur Journey Planner for any selected destination
- **Bilingual** — Norwegian (default) and English

## Usage

Pick a starting point (auto-detected or search), set travel distance, choose a weather profile, and the map lights up with color-coded weather scores. Enable POI categories to find places to go, click one for detailed weather and transit options.

## Development

Requires Node.js >= 20.

```bash
git clone https://github.com/essoen/weathermap.git
cd weathermap
npm install
npm run dev        # http://localhost:5173
npm run build      # Production build
```

### Structure

```
src/
  api/
    met.js              # MET Norway Locationforecast 2.0
    openmeteo.js        # Open-Meteo fallback with km/h → m/s conversion
    weather.js          # Unified interface — tries MET, falls back to Open-Meteo
    entur.js            # Geocoder autocomplete + Journey Planner GraphQL
    overpass.js          # Overpass QL queries for POIs from OpenStreetMap
  components/
    Map/                # MapView, WeatherHeatmap, POIMarkers, POIPopup, RadiusCircle
    Sidebar/            # SearchBox, DateTimePicker, WeatherProfileSelector, POIFilter, JourneyPanel
    common/             # LoadingSpinner, ErrorBanner, ErrorBoundary
  hooks/
    useWeatherGrid.js   # Batch-fetches weather for adaptive grid within travel radius
    useGeocoder.js      # Debounced Entur Geocoder with 300ms delay
    usePOIs.js          # Overpass API + static kite spots, merged
    useJourneyPlanner.js # Entur trip query
    useWeatherAtPoint.js # Single-point weather for POI popups
  utils/
    weatherScoring.js   # Profile-based 0→1 scoring, supports single time or date range
    weatherProfiles.js  # Profile definitions with ideal ranges, falloffs, and weights
    colorScale.js       # Score → red/yellow/green color mapping
    geo.js              # Haversine distance, grid generation, bounding box
    rateLimiter.js      # Batch fetch with concurrency control + pause between batches
  contexts/
    TripContext.jsx     # All app state: origin, radius, date, profile, POI selection
public/
  data/kite-spots.json  # 20 curated Norwegian kite spots
  locales/              # i18n translations (no, en)
```

### Architecture

```
Browser Geolocation ──→ TripContext ←── SearchBox (Entur Geocoder)
                            │
                    ┌───────┼───────┐
                    ▼       ▼       ▼
              Weather    Overpass   Entur Journey
              Grid       API       Planner
              (MET/OM)   (POIs)    (Transit)
                    │       │       │
                    ▼       ▼       ▼
              Heatmap   Markers   Route
              overlay   on map    panel
```

All API calls go directly from the browser — no backend. Weather requests are batched (5 concurrent, 200ms pause) and cached via [TanStack Query](https://tanstack.com/query).

### APIs

| API | Purpose | Auth |
|-----|---------|------|
| [MET Norway Locationforecast](https://api.met.no/) | Primary weather data | Browser User-Agent |
| [Open-Meteo](https://open-meteo.com/) | Weather fallback, 10-day forecast | None |
| [Entur Geocoder](https://developer.entur.org/) | Place search + reverse geocode | `ET-Client-Name` header |
| [Entur Journey Planner](https://developer.entur.org/) | Public transit routing | `ET-Client-Name` header |
| [Overpass API](https://overpass-api.de/) | POIs from OpenStreetMap | None |
| [Kartverket](https://www.kartverket.no/) | Topographic map tiles | None |

### Deployment

Pushes to `main` auto-deploy to GitHub Pages via Actions. The `GITHUB_PAGES` env var sets `base: '/weathermap/'` in Vite config.
