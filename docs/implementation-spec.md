# Metro Parking web app implementation spec

## Goal

Bring the React app in line with the current backend contract and its rolling data ingestion, then refine the mobile experience around a modern MUI design system. Keep the existing blue, sunrise amber, and warm neutral identity. Do not imply that stored samples are real-time observations.

## Current app and backend behavior

- React, TypeScript, Vite, MUI, TanStack Query, and Apache ECharts.
- Routes: overview (`/`) and facility detail (`/facility/:slug`).
- The backend polls one enabled facility on a scheduled loop every 2.2 seconds. Four out of each five turns fetch a live snapshot from the upstream car-park endpoint; the fifth turn advances historical backfill through the upstream history endpoint. The facility rotates between turns.
- Therefore, a facility's refresh interval is approximately `enabled facility count × 2.75 seconds`, plus upstream request and processing time. The 2.2 second scheduler delay is not the refresh interval for each facility.
- The API exposes the latest stored upstream sample. Its `timeMs` is the source event time, so it can lag the current time.
- The backend API rate limit is 60 requests per minute per client IP. Overview and facility queries should use a shared, conservative refresh cadence and avoid rapid retries.

The frontend currently polls list, facility live data, selected history, and daily metrics every two minutes. This is a practical cadence for the rotating ingestion loop and rate limit; it is not a guarantee that every facility has a new sample every two minutes. Revisit it if the enabled-facility count, ingestion schedule, or backend rate limit changes. Keep the source sample time visible and format it in `Australia/Sydney`.

Freshness indicators should be presented by the frontend from source `timeMs` and the current time; show a stale state after one hour without implying that the backend poll itself failed. The backend owns the meaning and accuracy of the source timestamp. If freshness must be authoritative and consistent across clients, add an explicit server-calculated freshness field to the API contract. Do not infer staleness from when the browser received or cached the response.

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
- `GET /api/v1/parking/{slug}/metrics/daily?from=YYYY-MM-DD&to=YYYY-MM-DD` returns daily commuter metrics for the effective Sydney-date range, including expected availability near 7 AM and 8 AM plus 50%, 90%, and full-occupancy timestamps.
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
- Query daily metrics independently from chart history using facility slug and date range in the query key. Facility pages request the latest three Sydney dates; overview Quick Views request one date. Quick View intentionally makes a separate history request for its occupancy chart, so metric accuracy does not depend on the chart's selected resolution.
- Estimate points using the selected date range and interval, disable explicit intervals that would exceed the backend's 200-point cap, and move to the finest supported interval when a longer range is selected. `AUTO` stays available. Show the actual returned resolution and date range because the backend may still coarsen a request. Fine-grained summaries should not imply exact threshold times for coarser data.
- Handle 400, 429, and 500 errors clearly. Avoid aggressive retries, especially for 429.

## Mobile-first interface and search

- Keep one-column facility cards on phones; use two or three columns only when names, availability, and update times remain readable.
- Make each facility card a semantic link with visible keyboard focus and a comfortable touch area. Show occupied spaces / total parking spaces with the occupancy percentage in parentheses; keep counts readable when occupancy exceeds capacity and never hide upstream overflow.
- On the facility page, show current occupancy as a plain percentage, available spaces as a whole count, and total capacity under the label “Parking spaces”. Color occupancy and availability with the existing success, warning, and error tokens, and retain text labels so status is not conveyed by color alone.
- Keep the shared MUI autocomplete searchable by facility name and slug, with ArrowUp/ArrowDown/Enter selection, Escape dismissal, touch-sized suggestions, visible result count, and a compact no-results state. Keep suggestions inside the viewport on narrow screens and avoid obscuring page actions.
- Let the content breathe on mobile: compact header and page padding, clear section headings, stable card spacing, and no horizontal overflow at 320, 360, and 390 px.
- Use semantic status labels and icons as well as color. Do not rely on hover-only details.

## Accessibility, metadata, and crawlability

- Keep the document language set to English and provide a descriptive page title and meta description. Facility routes update title, description, canonical URL, Open Graph, and Twitter metadata when navigation changes.
- Keep a visible-on-focus skip link to the main landmark, semantic header/main/footer landmarks, one page-level `h1`, and visible keyboard focus. The facility search exposes combobox/listbox semantics and supports keyboard-only selection and dismissal.
- Give occupancy indicators accessible progress values and text equivalents. Give charts an accessible name and a concise text summary so the observed range and latest sample are available without interpreting the graphic. Respect reduced-motion preferences.
- Publish `robots.txt` and an XML sitemap. The sitemap currently lists the overview page; facility pages are data-driven and should be added only when a reliable canonical facility inventory is available.
- Treat client-updated metadata as useful for browser history and sharing after navigation, but remember that crawlers that do not execute JavaScript only see the static metadata in `index.html`. If search indexing of individual facilities becomes important, add server-side rendering or prerendered route metadata.

## Performance improvements

- Keep Apache ECharts tree-shaken and load its React/chart modules on demand when a Quick View or facility chart is opened. Lazy-load route-level facility and legal content where it reduces the initial bundle.
- Serve the Park&Ride and Transport for NSW marks as WebP with explicit intrinsic dimensions; retain meaningful alt text for informative images and empty alt text for decorative branding.
- Use the system font stack to avoid blocking first render on remote font downloads. Keep the overview loading skeleton dimensionally close to the facility list to reduce layout shifts while data loads.
- Recheck Lighthouse in a clean browser profile after changes. Separate API time-to-first-byte from client render time; the compact response payload alone does not explain a slow API response.

## Chart and optional prediction

- Plot epoch milliseconds against occupancy rate on an ECharts time axis. For a one-day range, label ticks with local hours (including AM/PM); for longer ranges, show both the Sydney weekday and hour so morning and evening patterns remain readable. Format tooltips and summaries explicitly in `Australia/Sydney`.
- Let the parent control chart height at breakpoints, use ECharts resize handling after rotation/container changes, reduce tick/margin clutter on phones, and avoid requiring horizontal page scrolling.
- Include a text summary or accessible data alternative for the key values. Preserve rates over 100% and make the 100% threshold visible.
- When a history response contains no points, keep the chart heading, selected date range, actual resolution, period controls, and interval controls visible. The empty state must not imply that no history exists globally or hide the controls needed to adjust the query.
- For an empty query covering only the current Sydney date, say that no samples have been recorded for today yet. For other empty ranges, say no samples were found for the selected period and suggest expanding the date range. Changing interval can only summarize samples that exist; expanding the range is the useful next step when the selected date has no samples.
- Render concise **Daily metrics** in a separate card above historical occupancy so changing chart period or resolution never hides them. Compare the latest three Sydney dates, with 7 AM free, 8 AM free, and the times each day first crossed 50%, crossed 90%, and reached full capacity. Calculate each date independently; never carry one day's milestones into another.
- Show the three occupancy milestones on a 24-hour horizontal timeline, with their time labels directly beneath the track. Use the existing semantic success, warning, and error tokens for the 50%, 90%, and full markers. Keep 7 AM and 8 AM expected free-space values as concise callouts, and show missing milestones as unavailable.
- Style Daily metrics like a rail departure board: infer the section accent from each facility's primary transit badge, use a hollow parking symbol, and keep clear date strips. Keep older days visually quieter and mark today and weekends without relying on color alone.
- Render these rows from the backend daily-metrics endpoint, independently of the downsampled chart series. Keep each date's milestones isolated and display missing metrics as unavailable rather than carrying values forward from another day.
- Consider a small forecast as a later, explicitly experimental feature. A client-side short-horizon trend can be misleading with sparse/coarsened observations and daily commuter patterns. Only show it when enough recent `TEN_MINUTE` points exist; label it as an estimate, visually separate it from observed data, and omit it when the trend is unstable. A backend forecast with a documented method and uncertainty range is preferable if the feature becomes a product requirement.

## MUI design system refactor

Refactor the current scattered styling into a small, semantic token layer used by both the MUI theme and components. Keep the sunrise warmth and use the supplied Transport for NSW pictograms for Sydney Trains, Sydney Metro, and parking. Grade page backgrounds through light sky, sunrise, and grassy neutrals so normal text maintains WCAG AA contrast. Treat warning and error colors as semantic status roles.

- Define tokens for semantic palette roles, typography scale, spacing, shape, elevation, focus ring, and motion. Avoid repeating raw hex, rgba, pixel, and shadow values in feature components.
- Map tokens into MUI `createTheme` palette, typography, shape, and component defaults/variants. Prefer `sx` theme keys such as `primary.main`, `text.secondary`, `divider`, and spacing values over hard-coded styles.
- Use consistent MUI component variants for cards, inputs, chips, and buttons. Keep component-specific styling limited to layout or genuine one-off behavior.
- Check text and status contrast, keyboard focus visibility, reduced-motion behavior, and dark/light surface combinations before consolidating tokens.
- Keep the sunrise impression subtle in background/surface treatment; do not add extra decorative hues that weaken the three-color identity.

## Test organization and acceptance

- Keep Vitest component/unit tests in `src/test`; keep Playwright scenarios in `src/test/e2e`. The Playwright config targets that directory, and Vitest excludes it.
- Update API mocks and fixtures from generated contract types. Unit tests cover metadata updates, keyboard search behavior, occupancy progress semantics and percent labels, the commuter timeline's expected-free callouts and color-coded milestone markers, chart text summaries, and empty-history messaging with controls still available. Playwright covers overview and facility navigation, skip navigation and landmarks, dynamic page metadata, crawl files, keyboard search, Quick View expansion/alignment, chart controls, commuter timeline rendering and marker colors, and the empty-history recovery path.
- Verify that no frontend API call uses the old endpoint or payload fields.
- Confirm that Sydney date/time is stable on devices configured for other time zones.
- Confirm that list/live/history polling reflects the two-minute policy and that current-day history refreshes while historical ranges remain cacheable.
- Review overview and facility layouts at phone, tablet, and desktop sizes; check chart resizing after rotation and container changes.
- Run the Vitest suite and Playwright projects in Chromium, Firefox, and WebKit. Keep accessibility assertions focused on user-visible keyboard and semantic behavior; add an automated axe scan if an accessibility engine is introduced as a project dependency.
- Re-run Lighthouse with browser extensions disabled and compare FCP/LCP, TBT, CLS, image transfer size, and the initial JavaScript payload against `docs/lighthouse/10272026.json`.
- Check generated OpenAPI type changes as a reviewed diff after running `npm run api:sync`.

## Deferred product work

These items are intentionally out of scope for the current implementation pass.

- Add a visible stale-sample indicator when `timeMs` is more than one hour old. The frontend should calculate and present this from the source timestamp; the backend should continue to define and document the timestamp's meaning. If freshness must be authoritative across clients, extend the API with a server-calculated freshness field.
- Design a trip-planner scaffold after its backend contract and ownership are agreed. Until then, avoid inventing frontend DTOs or implying that trip planning is available.
