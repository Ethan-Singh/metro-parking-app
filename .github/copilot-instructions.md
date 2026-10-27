# Repository instructions

Use this file for stable project conventions. The detailed product and implementation plan lives in [`docs/implementation-spec.md`](../docs/implementation-spec.md); consult it when a task changes product behavior, API integration, or the design system.

## Stack and structure

- React 19, TypeScript, Vite, Material UI, TanStack Query, React Router, and Apache ECharts.
- Application code is under `src/main`; Vitest tests are under `src/test`; Playwright tests are under `src/test/e2e`.
- Keep UI mobile-first, accessible, and responsive. Preserve semantic HTML, keyboard behavior, visible focus, and text equivalents for charts and color-coded states.

## API and data

- The backend publishes the OpenAPI contract. Types in `src/main/features/parking/api/openapi.generated.d.ts` are generated with `npm run api:sync`; do not hand-edit generated types.
- Reuse the generated schema through the aliases in `src/main/features/parking/types.ts`. Avoid duplicate DTOs and keep HTTP access in the parking API/query modules.
- `timeMs` is a Unix epoch-millisecond source-event timestamp. Format user-facing dates and times in `Australia/Sydney`; calculate date-only query ranges in that timezone.
- Preserve upstream values, including occupancy rates above 100%. History points are compact tuples; use the generated contract types rather than assuming older response shapes.
- Keep query keys complete and polling conservative to respect the backend's per-IP rate limit. Follow existing TanStack Query defaults and API error handling.

## UI and design system

- Reuse the semantic palette and design tokens in `src/main/css/tokens.ts` and the MUI theme. Do not introduce one-off colors, radii, or shadows when an existing token fits.
- Use transit accents through the existing line-badge/facility-accent helpers. Keep status understandable without color alone.
- Prefer small, focused components and keep API/domain names distinct from concise user-facing labels.

## Verification

- Run unit tests with `npm run test:run` and browser tests with `npm run test:e2e` when relevant to the change.
- Run `npm run lint` or targeted ESLint for changed files; use `npm run build` to check TypeScript and the production bundle.
- Keep Vitest tests out of `src/test/e2e`; Playwright scenarios belong in that directory.
- Update `docs/implementation-spec.md` when a change alters product behavior, architecture, or acceptance expectations.

## Git conventions

- Use Conventional Commit subjects, for example `feat: ...`, `fix: ...`, `perf: ...`, `refactor: ...`, `test: ...`, `docs: ...`, and `chore: ...`.
- Keep commits focused. Do not commit or push unless the user asks.
