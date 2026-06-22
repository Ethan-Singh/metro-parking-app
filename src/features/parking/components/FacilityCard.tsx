import {
    Card,
    CardContent,
    Typography,
    Chip,
    Stack,
    LinearProgress,
    CardActionArea,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type {Facility} from "../types";

export function FacilityCard({ facility }: { facility: Facility }) {
    const navigate = useNavigate();

    const percent = Math.round(facility.occupancyRate * 100);

    return (
        <Card
            variant="outlined"
            sx={{
                borderRadius: 3,
                transition: "all 150ms ease",
                "&:hover": {
                    boxShadow: "0 6px 18px rgba(16,24,40,0.12)",
                },
            }}
        >
            <CardActionArea
                onClick={() => navigate(`/facility/${facility.slug}`)}
                aria-label={facility.ariaLabel}
                sx={{
                    borderRadius: 2,
                    "&:hover": {
                        transform: "translateY(-2px)",
                        transition: "all 150ms ease",
                    },
                }}
            >
                <CardContent>
                    <Stack spacing={1.2}>
                        <Typography variant="h6">
                            {facility.facilityName}
                        </Typography>

                        <Chip
                            label={facility.statusLabel}
                            color={facility.status === "ALMOST_FULL" ? "warning" : "success"}
                            variant="outlined"
                            size="small"
                        />

                        <Typography variant="body2">
                            {facility.available} of {facility.spots} spots available
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={percent}
                            aria-label={`Occupancy ${percent}%`}
                        />

                        <Typography variant="caption" color="text.secondary">
                            Updated {new Date(facility.asOf).toLocaleString()}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}