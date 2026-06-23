import { Card, CardContent, Typography, Stack, Box, LinearProgress } from "@mui/material";
import type { Facility } from "../types";

function getStatusBadgeClass(status: Facility["status"]) {
  if (status === "ALMOST_FULL") return "status-badge status-badge--warn";
  if (status === "FULL")        return "status-badge status-badge--full";
  return                               "status-badge status-badge--available";
}

function getProgressColor(rate: number): "success" | "warning" | "error" {
  if (rate >= 0.9) return "error";
  if (rate >= 0.75) return "warning";
  return "success";
}

export function FacilityOverviewPanel({ facility }: { facility: Facility }) {
  const percent = Math.round(facility.occupancyRate * 100);

  return (
      <Card className="glass-card">
        <CardContent>
          <Stack spacing={1.5}>
            <Typography variant="h5">{facility.facilityName}</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <span className={getStatusBadgeClass(facility.status)}>
              {facility.statusLabel}
            </span>
              <Typography variant="caption">{facility.approximation}</Typography>
            </Box>

            {/* Occupancy bar — Aero gloss via MUI LinearProgress + theme overrides */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                <Typography variant="body2">{facility.available} of {facility.spots} spots available</Typography>
                <Typography variant="body2" fontWeight={600}>{percent}%</Typography>
              </Box>
              <LinearProgress
                  variant="determinate"
                  value={percent}
                  color={getProgressColor(facility.occupancyRate)}
                  sx={{
                    height: 8,
                    // Aero gloss overlay on the bar
                    "& .MuiLinearProgress-bar": {
                      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 60%)",
                    },
                  }}
              />
            </Box>

            <Typography variant="caption">
              Updated {new Date(facility.asOf).toLocaleString()}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
  );
}