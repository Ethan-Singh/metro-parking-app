# Frontend models

These models describe how the React app consumes the Metro Parking Web Service.
The backend's [OpenAPI contract](https://github.com/Ethan-Singh/Metro-Parking-Web-Service/blob/main/docs/apis/metro-parking-api-v1.yaml)
defines the wire format; generated TypeScript types live with the API adapter.

- [Frontend data flow](frontend-data-flow.puml) — routes, queries, adapter, and API boundary
- [Implementation spec](../../docs/implementation-spec.md) — frontend contract, responsive UX, and design system plan

Regenerate API types with `npm run api:sync` after backend contract changes and review the generated diff.
