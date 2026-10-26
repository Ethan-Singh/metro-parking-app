# Metro Parking web app implementation spec

## Goal

Bring the React app in line with the current backend contract and its rolling data ingestion, then refine the mobile experience around a modern MUI design system. Keep the existing blue, sunrise amber, and warm neutral identity. Do not imply that stored samples are real-time observations.

## Current app and backend behavior

- React, TypeScript, Vite, MUI, TanStack Query, and Apache ECharts.
- Routes: overview (`/`) and facility detail (`/facility/:slug`).
- The backend reads the upstream service on a scheduled loop every 2.2 seconds. Four out of each five turns refresh one enabled facility's current Sydney day; the fifth turn advances historical backfill. The current facility rotates each time.
- Therefore, a facility's refresh interval is approximately `enabled facility count × 2.75 seconds`, plus upstream request and processing time. The 2.2 second scheduler delay is not the refresh interval for each facility.
- The API exposes the latest stored upstream sample. Its `timeMs` is the source event time, so it can lag the current time.
- The backend API rate limit is 60 requests per minute per client IP. Overview and facility queries should use a shared, conservative refresh cadence and avoid rapid retries.

The frontend currently polls list, facility live data, and current-day history every two minutes. This is a practical cadence for the rotating ingestion loop and rate limit; it is not a guarantee that every facility has a new sample every two minutes. Revisit it if the enabled-facility count, ingestion schedule, or backend rate limit changes. Keep the source sample time visible and format it in `Australia/Sydney`.

## API contract

The backend repository publishes `docs/apis/metro-parking-api-v1.yaml`. Frontend types are generated from the live `main` branch URL using `openapi-typescript`:

```sh
npm run api:sync
```

The generated `openapi.generated.d.ts` is committed, and normal frontend builds use that checked-in snapshot without network access. Regenerate and review its diff when the backend contract changes. Because the sync URL tracks `main`, regenerate after backend changes and review the resulting types before adapting UI code.

Contract endpoints and payloads:

- `GET /api/v1/parking` returns `LiveCarPark[]`.
- `GET /api/v1/parking/{slug}/live` returns one `LiveCarPark`.
- `GET /api/v1/parking/{slug}/history?from=YYYY-MM-DD&to=YYYY-MM-DD&resolution=AUTO` returns `{ from, to, resolution, points }`.
- A history point is `[timeMs, occupancyRate, available]`. `timeMs` is Unix epoch milliseconds, and `resolution` is the actual interval selected by the server.
- Requested resolutions are `AUTO`, `TEN_MINUTE`, `ONE_HOUR`, `SIX_HOUR`, `TWELVE_HOUR`, and `TWENTY_FOUR_HOUR`.
- History dates are Sydney calendar dates. The backend clamps the range to its configured 31-day window and caps responses at 200 points.

Use generated schema types in one API module and avoid duplicate hand-written DTO definitions. Preserve backend values, including occupancy above capacity. Do not restore old `/overview`, ISO timestamp, `dataPoints`, or `granularity` assumptions.

## Data and query behavior

- Keep API base configuration centralized. Default to same-origin `/api/v1/parking`; allow `VITE_API_BASE` for deployed API hosting.
- Encode slugs and URL parameters. Query keys include slug, Sydney `from`/`to`, and requested resolution.
- Calculate date-only values in `Australia/Sydney`; do not use browser-local date accessors or `toISOString()` for query ranges.
- Keep today's history in the selected chart range so it can show newly ingested samples. Default to one Sydney day at `TEN_MINUTE`, which best supports commuters checking morning and evening patterns without the backend coarsening the response. The chart offers 1, 7, 14, and 31 Sydney-day ranges and a stock-chart style interval picker for `AUTO`, `TEN_MINUTE`, `ONE_HOUR`, `SIX_HOUR`, `TWELVE_HOUR`, and `TWENTY_FOUR_HOUR`.
- Include range and requested resolution in query keys. Poll live and selected history at the shared two-minute cadence, refresh on focus/reconnect, and keep background polling disabled.
- Show the actual returned resolution and date range; the backend may coarsen a requested interval to stay within 200 points. Fine-grained summaries are shown only for `TEN_MINUTE` and should not imply exact threshold times for coarser data.
- Handle 400, 429, and 500 errors clearly. Avoid aggressive retries, especially for 429.

## Mobile-first interface and search

- Keep one-column facility cards on phones; use two or three columns only when names, availability, and update times remain readable.
- Make each facility card a semantic link with visible keyboard focus and a comfortable touch area. Keep occupancy counts readable when occupancy exceeds capacity; never hide overflow in the source data.
- Refine the shared search into a MUI autocomplete-style control: searchable facility name and slug, clear keyboard selection, touch-sized suggestions, visible result count, and a compact no-results state. Keep suggestions inside the viewport on narrow screens and avoid obscuring page actions.
- Let the content breathe on mobile: compact header and page padding, clear section headings, stable card spacing, and no horizontal overflow at 320, 360, and 390 px.
- Use semantic status labels and icons as well as color. Do not rely on hover-only details.

## Chart and optional prediction

- Plot epoch milliseconds against occupancy rate on an ECharts time axis. For a one-day range, label ticks with local hours (including AM/PM); for longer ranges, show both the Sydney weekday and hour so morning and evening patterns remain readable. Format tooltips and summaries explicitly in `Australia/Sydney`.
- Let the parent control chart height at breakpoints, use ECharts resize handling after rotation/container changes, reduce tick/margin clutter on phones, and avoid requiring horizontal page scrolling.
- Include a text summary or accessible data alternative for the key values. Preserve rates over 100% and make the 100% threshold visible.
- Render commuter metrics in a separate card above historical occupancy so changing chart period or resolution never hides the metrics. Compare the latest three Sydney dates, with 7 AM free, 8 AM free, 50% full, 90% full, and the time each day first reached 100% capacity. Calculate every date independently; do not carry one day's milestones into another.
- The frontend currently derives these rows from ten-minute history samples. The backend daily-metrics endpoint should expose the same per-day values through its OpenAPI contract and service; fetch it independently of the downsampled chart series.
- Consider a small forecast as a later, explicitly experimental feature. A client-side short-horizon trend can be misleading with sparse/coarsened observations and daily commuter patterns. Only show it when enough recent `TEN_MINUTE` points exist; label it as an estimate, visually separate it from observed data, and omit it when the trend is unstable. A backend forecast with a documented method and uncertainty range is preferable if the feature becomes a product requirement.

## MUI design system refactor

Refactor the current scattered styling into a small, semantic token layer used by both the MUI theme and components. Keep the three brand colors as the core identity: blue for primary actions/data, sunrise amber for secondary emphasis, and warm cream for the page/surface base. Treat success, warning, and error colors as semantic status roles, not extra brand colors.

- Define tokens for semantic palette roles, typography scale, spacing, shape, elevation, focus ring, and motion. Avoid repeating raw hex, rgba, pixel, and shadow values in feature components.
- Map tokens into MUI `createTheme` palette, typography, shape, and component defaults/variants. Prefer `sx` theme keys such as `primary.main`, `text.secondary`, `divider`, and spacing values over hard-coded styles.
- Use consistent MUI component variants for cards, inputs, chips, and buttons. Keep component-specific styling limited to layout or genuine one-off behavior.
- Check text and status contrast, keyboard focus visibility, reduced-motion behavior, and dark/light surface combinations before consolidating tokens.
- Keep the sunrise impression subtle in background/surface treatment; do not add extra decorative hues that weaken the three-color identity.

## Test organization and acceptance

- Keep Vitest component/unit tests in `src/test`; keep Playwright scenarios in `src/test/e2e`. The Playwright config targets that directory, and Vitest excludes it.
- Update API mocks and fixtures from generated contract types. Playwright scenarios are present but can be expanded in the later responsive implementation pass.
- Verify that no frontend API call uses the old endpoint or payload fields.
- Confirm that Sydney date/time is stable on devices configured for other time zones.
- Confirm that list/live/history polling reflects the two-minute policy and that current-day history refreshes while historical ranges remain cacheable.
- Review overview and facility layouts at phone, tablet, and desktop sizes; check chart resizing after rotation and container changes.
- Check generated OpenAPI type changes as a reviewed diff after running `npm run api:sync`.
