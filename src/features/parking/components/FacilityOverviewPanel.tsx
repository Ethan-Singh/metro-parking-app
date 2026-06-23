import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  LinearProgress,
} from "@mui/material";
import type { Facility } from "../types";
import { semantic } from "../../../design-tokens/semantic";
import {StatusBadge} from "./StatusBadge.tsx";

function getProgressState(rate: number): "success" | "warning" | "error" {
  if (rate >= 0.9) return "error";
  if (rate >= 0.75) return "warning";
  return "success";
}

function getProgressColor(rate: number) {
  const state = getProgressState(rate);

  switch (state) {
    case "error":
      return semantic.color.error;
    case "warning":
      return semantic.color.warning;
    default:
      return semantic.color.success;
  }
}

export function FacilityOverviewPanel({
                                        facility,
                                      }: {
  facility: Facility;
}) {
  const percent = Math.round(facility.occupancyRate * 100);
  const progressColor = getProgressColor(facility.occupancyRate);

  return (
      <Card className="glass-card">
        <CardContent>
          <Stack spacing={1.5}>

            {/* Title */}
            <Typography variant="h5">
              {facility.facilityName}
            </Typography>

            {/* Status row */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <StatusBadge status={facility.status} />

              <Typography variant="caption" color="text.secondary">
                {facility.approximation}
              </Typography>
            </Box>

            {/* Occupancy */}
            <Box>
              <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
              >
                <Typography variant="body2" color="text.secondary">
                  {facility.available} of {facility.spots} spots available
                </Typography>

                <Typography variant="body2">
                  {percent}%
                </Typography>
              </Box>

              <LinearProgress
                  variant="determinate"
                  value={percent}
                  sx={{
                    height: 8,
                    borderRadius: 99,
                    backgroundColor: "rgba(10,79,166,0.08)",

                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      backgroundColor: progressColor,
                      backgroundImage:
                          "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)",
                    },
                  }}
              />
            </Box>

            {/* Timestamp */}
            <Typography variant="caption" color="text.secondary">
              Updated{" "}
              {new Date(facility.asOf).toLocaleString()}
            </Typography>

          </Stack>
        </CardContent>
      </Card>
  );
}