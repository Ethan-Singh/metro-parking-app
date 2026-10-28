# Metro Parking App planned work

This document captures future product ideas that are not part of the current implementation scope. Validate each proposal before treating it as committed product behavior.

## Suggested workflow for new features

The app can be frontend-first for product discovery while keeping the backend contract deliberate:

1. **Explore the user flow in the frontend.** Build a small prototype with local fixtures or a mock adapter. Write down assumptions about available data and keep prototype-only data clearly separated from production API models.
2. **Agree on behavior and acceptance criteria.** Cover loading, empty, error, stale, and success states, along with mobile and accessibility needs.
3. **Draft the API contract before production integration.** Define request parameters, response fields, timezone and timestamp semantics, missing-data behavior, limits, and errors. Review the draft against the UI needs and backend constraints.
4. **Make the backend OpenAPI document canonical.** Once agreed, implement/update the backend contract and service. Avoid maintaining a second hand-written frontend DTO as a competing source of truth.
5. **Generate frontend types and integrate.** Run `npm run api:sync`, review the generated diff, then replace or adapt the prototype mock behind the typed API/query layer.
6. **Verify both sides of the boundary.** Cover contract behavior in backend tests and UI behavior in frontend unit/Playwright tests. Update `docs/implementation-spec.md` when the feature becomes current implementation scope.

This sequence is useful when the user experience is uncertain. For small changes to an established API, update the contract first and then adapt the UI. A frontend prototype should not imply that guessed fields or mock data already exist in production.

## Deferred proposals

These items are intentionally deferred; they do not authorize implementation by themselves.

### Stale-sample indicator

- Show a visible stale state when a source sample's `timeMs` is more than one hour old.
- The frontend can calculate and present age from the source timestamp. The backend owns the timestamp's meaning and should document it.
- If freshness must be authoritative across clients, consider adding a server-calculated freshness field or server time to the API contract to reduce differences caused by client clock skew.

### Trip planner

- Explore a trip-planner flow in the frontend with clearly marked mock data before committing to backend behavior.
- Agree on the domain model, route/transport inputs, response shape, data provenance, and failure behavior before implementing the production API.
- Avoid inventing permanent frontend DTOs or implying that trip planning is available before the backend contract is agreed and implemented.

### Occupancy forecast

- Treat any forecast as experimental and distinguish it clearly from observed occupancy.
- Do not show a client-side trend unless enough recent 10-minute samples exist and the trend is stable; sparse or downsampled history can mislead.
- If forecasting becomes a product requirement, prefer a documented backend method with an uncertainty range and testable inputs over an unexplained client-side extrapolation.
