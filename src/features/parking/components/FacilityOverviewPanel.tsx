import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";
import type {Facility} from "../types";

export function FacilityOverviewPanel({ facility }: { facility: Facility }) {
  const percent = Math.round(facility.occupancyRate * 100);

  return (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h5">
              {facility.facilityName}
            </Typography>

            <Chip
                label={facility.statusLabel}
                color={facility.status === "ALMOST_FULL" ? "warning" : "success"}
                variant="outlined"
            />

            <Typography>
              {facility.available} / {facility.spots} available
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Occupancy: {percent}%
            </Typography>

            <Typography variant="caption">
              Updated {new Date(facility.asOf).toLocaleString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
  );
}