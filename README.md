# Metro Parking App

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=flat&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white)
![MUI](https://img.shields.io/badge/MUI_9-007FFF?style=flat&logo=mui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query_5-FF4154?style=flat&logo=reactquery&logoColor=white)
![ECharts](https://img.shields.io/badge/Apache_ECharts-AA344D?style=flat&logo=apacheecharts&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white)

A mobile-first dashboard for current and historical Transport for NSW car park occupancy. It provides a searchable overview of Park&Ride facilities, transit line badges, and per-facility occupancy history.

> **Backend:** [metro-parking-web-service](https://github.com/Ethan-Singh/metro-parking-web-service) ingests, stores, and serves the parking data used by this app.

## Architecture models

PlantUML sources and their scope are indexed in [`domain/models`](domain/models/README.md).

| Model                                                       | Description                                                          |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| [Frontend data flow](domain/models/frontend-data-flow.puml) | Pages, query cache, API adapter, and backend contract                |
| [Implementation spec](docs/implementation-spec.md)          | Contract migration, mobile improvements, and design system direction |

## Pages and data

- **Overview (`/`)** lists facilities, supports search by name or slug, and shows occupancy, availability, transit lines, and the latest source sample time.
- **Facility (`/facility/:slug`)** shows live occupancy metrics and a history chart with stock-style period and interval pickers. It defaults to one Sydney day at 10-minute detail; choose 1, 7, 14, or 31 days and `AUTO`, 10-minute, hourly, 6-hour, 12-hour, or 24-hour points. The chart shows local hours for a one-day view and weekday plus hour for longer ranges.
- API calls use the backend OpenAPI contract: list facilities, fetch `/{slug}/live`, request compact history points `[timeMs, occupancyRate, available]`, and retrieve dedicated daily commuter metrics from `/{slug}/metrics/daily`.
- Timestamps are epoch milliseconds and are displayed in `Australia/Sydney`. History dates are also calculated in the Sydney timezone.
- The backend ingests current-day data by rotating through enabled facilities. Its scheduler runs every 2.2 seconds, but an individual facility updates on a multi-minute sweep. The app polls every two minutes and shows the source sample time because this is the latest stored sample, not a real-time feed.
- The backend limits API traffic to 60 requests per minute per client IP. Client queries use a shared two-minute cadence, avoid background polling, and retry once.

History responses report the actual resolution used by the backend, which the chart displays. Daily commuter metrics are fetched independently, so they remain exact and available regardless of the selected chart interval. Facility pages request the latest three Sydney dates; overview Quick Views request the latest date and fetch history separately for the chart. Occupancy values are preserved if they exceed facility capacity.

## OpenAPI types

The backend's OpenAPI YAML is the API source of truth. TypeScript definitions are generated from the public backend repository's `main` branch and committed in `src/main/features/parking/api/openapi.generated.d.ts`.

```bash
npm run api:sync
```

Review generated type changes and update API handling or fixtures when the backend contract changes. The normal build uses the committed generated file and does not require a network connection.

## Development

Install dependencies and start the frontend:

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173` and proxies `/api` to `http://localhost:8080`. Run the [backend service](https://github.com/Ethan-Singh/metro-parking-web-service) locally, or set `VITE_API_BASE` to the deployed API base URL. Cross-origin deployments must allow the frontend origin through backend CORS configuration.

```bash
npm run build
npm run check
```

## Tests

Vitest unit and component tests live under `src/test`:

```bash
npm run test       # watch mode
npm run test:run   # one run
```

Playwright scenarios live under `src/test/e2e`; their directory is configured in `playwright.config.ts` and excluded from Vitest. They mock the API, so no backend is needed for the browser tests.

```bash
npm run test:e2e
```

## Design direction

The visual identity uses blue for primary actions and data, sunrise amber for secondary emphasis, and warm neutral surfaces. The implementation spec describes the next design-system pass: semantic design tokens mapped into MUI theme values and component variants, plus responsive search, cards, and charts.
