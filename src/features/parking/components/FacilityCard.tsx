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
        <Card variant="outlined">
            <CardActionArea
                onClick={() => navigate(`/facility/${facility.slug}`)}
                aria-label={facility.ariaLabel}
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