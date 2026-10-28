# Metro Parking App: repository instructions

Use this file as persistent context for implementation and review. Keep it focused on stable architecture and product decisions. [`docs/implementation-spec.md`](../docs/implementation-spec.md) is the current product and acceptance reference; [`docs/planned-work-spec.md`](../docs/planned-work-spec.md) holds future proposals; [`README.md`](../README.md) explains setup and user-facing behavior.

## Project snapshot

Metro Parking App is a mobile-first dashboard for commuters checking Transport for NSW Park&Ride availability. It currently lists facilities, shows live occupancy and daily commuter metrics, and provides selectable historical occupancy charts. The backend service is a separate repository; this repo owns the browser UI and its API client.

| Area                        | Technology / location                                  |
| --------------------------- | ------------------------------------------------------ |
| UI                          | React 19, TypeScript, Vite, MUI                        |
| Routing and server state    | React Router, TanStack Query                           |
| Historical charts           | Apache ECharts, loaded lazily                          |
| App code                    | `src/main`                                             |
| Unit/component tests        | `src/test` with Vitest and Testing Library             |
| Browser tests               | `src/test/e2e` with Playwright                         |
| Design tokens and MUI theme | `src/main/css/tokens.ts`, `src/main/css/theme.ts`      |
| Parking API and query hooks | `src/main/features/parking/api`                        |
| Generated OpenAPI types     | `src/main/features/parking/api/openapi.generated.d.ts` |

## Main routes and data flow

| Route             | Purpose                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `/`               | Searchable facility overview. Each card links to facility detail and has an independently expandable Quick View. |
| `/facility/:slug` | Facility details, current occupancy, Daily metrics, and one historical occupancy chart.                          |

- Keep API calls in the parking API/query modules and use TanStack Query hooks from pages/components. Query keys must include every input that changes a response, including slug, date range, and requested interval.
- The app uses a shared two-minute polling cadence for live, current-day history, and daily metrics. This is a client refresh policy, not a promise that every facility has a new backend sample every two minutes. Avoid aggressive retries; the backend rate limit is 60 requests per minute per client IP.
- Facility pages request up to three Sydney dates of daily metrics. Quick Views request one date and fetch history separately for the chart. Keep daily metrics independent of the chart range and resolution.
- Keep query date calculations in `Australia/Sydney`; format timestamps in that timezone even when the browser is configured elsewhere.

## Backend contract and data semantics

- The backend publishes OpenAPI at `Ethan-Singh/Metro-Parking-Web-Service/docs/apis/metro-parking-api-v1.yaml`. `npm run api:sync` regenerates the checked-in TypeScript types from the backend's `main` branch; it requires network access.
- Never edit generated types by hand. Use the aliases in `src/main/features/parking/types.ts`; do not create duplicate handwritten DTOs. After syncing, review the generated diff and update API mapping/tests for contract changes.
- Current endpoints are `GET /api/v1/parking`, `GET /api/v1/parking/{slug}/live`, `GET /api/v1/parking/{slug}/history`, and `GET /api/v1/parking/{slug}/metrics/daily`.
- History points are `[timeMs, occupancyRate, available]`. The API may return a coarser actual resolution than requested and caps history responses at 200 points. Use the response's actual resolution in the chart label; keep unsupported interval options disabled for the selected period.
- `timeMs` is the upstream source event time in Unix epoch milliseconds, not the browser fetch time. Preserve source values, including occupancy above 100%; do not clamp counts or rates to capacity.
- The backend may legitimately return an empty history `points` array for a selected date, especially early in the current Sydney day. This means there are no samples for that query, not that the facility has no historical data. Keep chart period/interval controls visible; tell users to expand the date range when appropriate. Changing interval cannot create samples that do not exist.
- Use `VITE_API_BASE` only for the public API base URL. Vite variables are shipped to the browser and must never contain secrets. The default local Vite setup proxies `/api` to the local backend.

## Settled UI and design decisions

- Default facility history to one Sydney day at 10-minute detail. Offer 1, 7, 14, and 31 day ranges and `AUTO`, 10-minute, 1-hour, 6-hour, 12-hour, and 24-hour intervals, subject to the 200-point cap.
- Show the backend's actual interval in the history chart. If a range has no returned points, keep the heading, range, actual interval, and both selectors visible. For an empty current-day-only query, say no samples have been recorded today yet; for other empty ranges, suggest expanding the date range.
- Show the facility's occupancy as a percentage and available spaces as a count. Label total capacity “Parking spaces.” On overview cards, show occupied / total spaces and the percentage in parentheses. Use semantic success/warning/error colors without relying on color alone.
- The **Daily metrics** card uses a 24-hour timeline for 50%, 90%, and full milestones, with each time labeled below the track. Keep 7 AM and 8 AM expected-free counts as callouts. Missing day metrics stay unavailable; never carry milestones between dates.
- Infer chart and Daily metrics accent colors through existing transit badge/facility accent helpers. Keep weekend/today indicators and older-day styling legible on small screens.
- Quick View expands inside its own facility card; it should not push neighboring cards or misalign their Quick View buttons. Preserve the semantic facility link and separate Quick View button.
- The sunrise identity uses the existing sky, sunrise, grassy, and semantic palette tokens. Reuse tokens and MUI theme values for colors, spacing, radii, and shadows. Avoid adding one-off colors or hard-coded design values when an existing token fits.

## Accessibility and responsive behavior

- Design mobile-first and avoid horizontal overflow. Use semantic links/buttons, visible focus, keyboard support, comfortable touch targets, and meaningful accessible names.
- Pair color with readable status text/icons. Give charts an accessible name and a concise text equivalent; expose empty history as a status message.
- Keep a single page-level `h1`, route-specific metadata, skip navigation, and header/main/footer landmarks. Do not make essential interaction hover-only.

## Verification and repository workflow

| Command            | Use                                                      |
| ------------------ | -------------------------------------------------------- |
| `npm run test:run` | Full Vitest/unit suite                                   |
| `npm run test:e2e` | Playwright suite across configured browsers              |
| `npm run lint`     | ESLint                                                   |
| `npm run build`    | TypeScript project checks and production bundle          |
| `npm run api:sync` | Regenerate OpenAPI types after a backend contract change |

- Put component and unit tests under `src/test`, not `src/test/e2e`. Put user-flow/browser coverage in Playwright under `src/test/e2e`.
- Update tests and `docs/implementation-spec.md` when changing user-visible behavior, API interpretation, accessibility, or design-system conventions.
- Keep credentials out of source, fixtures, logs, and `VITE_*` variables. Gitleaks config and the pinned pre-commit hook are in `.gitleaks.toml` and `.pre-commit-config.yaml`; setup and redacted scan commands are in [`docs/security/gitleaks.md`](../docs/security/gitleaks.md). Do not suppress findings without understanding the match or add broad allowlists.
- Use Conventional Commit subjects such as `feat: ...`, `fix: ...`, `perf: ...`, `refactor: ...`, `test: ...`, `docs: ...`, and `chore: ...`. Keep commits focused; do not commit or push unless the user asks.

## Future work

Check [`docs/planned-work-spec.md`](../docs/planned-work-spec.md) before starting deferred stale-sample, trip-planner, or forecast work. These proposals are not implied requirements for unrelated changes.
