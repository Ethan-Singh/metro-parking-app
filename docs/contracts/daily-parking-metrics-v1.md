# Proposed daily parking metrics API

This portable proposal restores the useful 7 AM and 8 AM expected-free counts and provides per-day occupancy milestones. It is not in the published backend OpenAPI contract yet. Once implemented in the backend, the frontend should consume this endpoint instead of deriving commuter metrics from chart samples.

## Endpoint

```http
GET /api/v1/parking/{slug}/metrics/daily?from=YYYY-MM-DD&to=YYYY-MM-DD
```

`from` and `to` are inclusive Sydney calendar dates. Use the same configured history window and maximum range bounds as the history endpoint. Return one object per requested date, ordered by date ascending. Keep dates with no observations and return `null` for unsupported metrics so gaps remain visible.

The frontend should request the most recent three Sydney dates for the facility page and the most recent Sydney date for facility-card Quick view. The metric request is independent of the chart's selected period and resolution, so changing chart controls does not remove or recalculate this card.

## Response shape

```json
{
  "from": "2026-10-25",
  "to": "2026-10-27",
  "timeZone": "Australia/Sydney",
  "days": [
    {
      "date": "2026-10-25",
      "expectedFreeAt7am": 179,
      "expectedFreeAt8am": 136,
      "crossed50AtMs": 1792964400000,
      "crossed90AtMs": null,
      "fullAtMs": null
    },
    {
      "date": "2026-10-26",
      "expectedFreeAt7am": 163,
      "expectedFreeAt8am": 121,
      "crossed50AtMs": 1793051400000,
      "crossed90AtMs": 1793062200000,
      "fullAtMs": 1793065800000
    },
    {
      "date": "2026-10-27",
      "expectedFreeAt7am": null,
      "expectedFreeAt8am": null,
      "crossed50AtMs": null,
      "crossed90AtMs": null,
      "fullAtMs": null
    }
  ]
}
```

All metrics may be `null` when the day's observations cannot support the calculation. Milestone times are Unix epoch milliseconds. `fullAtMs` means the first sample at or above 100% occupancy; preserve upstream over-capacity values, so this may occur before a reported occupancy rate exceeds 100%.

## Calculation rules

- Use each stored sample's Sydney local event time and available spaces (`max(0, spots - occupancy)`).
- For expected free at 7 AM or 8 AM, select that date's closest sample within 20 minutes of the target time. Return `null` when no sample is within that window. These are historical point estimates, not guaranteed forecasts.
- `crossed50AtMs` is the first sample for that date with occupancy rate at or above 50%.
- `crossed90AtMs` is the first sample for that date with occupancy rate at or above 90%.
- `fullAtMs` is the first sample for that date with occupancy rate at or above 100%.
- Compute each date independently. A later date that does not reach a milestone must return `null`, even if an earlier date did.
- Return null metrics for requested dates with missing observations.

This endpoint keeps the daily commuter card stable while chart history independently uses the selected resolution and period.
