import Grid from "@mui/material/Grid";
import {
    Typography,
    Alert,
    Box,
} from "@mui/material";
import {
    LocalParking,
    CheckCircle,
    Train,
} from "@mui/icons-material";

import { semantic } from "../../../design-tokens/semantic";
import { useFacilities } from "../hooks/useFacilities";
import { FacilityCard } from "../components/FacilityCard";
import { StatsCard } from "../components/StatsCard";
import { FacilityCardSkeleton } from "../components/FacilityCardSkeleton";

export default function OverviewPage() {
    const { data, isLoading, isError } = useFacilities();

    const stats = {
        total: data?.length || 0,
        available: data?.reduce((acc, f) => acc + f.available, 0) || 0,
        totalSpots: data?.reduce((acc, f) => acc + f.spots, 0) || 0,
        avgOccupancy: data
            ? Math.round(
                (data.reduce((acc, f) => acc + f.occupancyRate, 0) /
                    data.length) *
                100
            )
            : 0,
    };

    return (
        <Box>

            {/* HEADER */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        mb: 0.5,
                        color: semantic.color.text.primary,
                    }}
                >
                    Network Overview
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Monitor all parking facilities in real-time
                </Typography>
            </Box>

            {/* ERROR */}
            {isError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                >
                    Failed to load parking data. Please try again.
                </Alert>
            )}

            {/* STATS */}
            {!isLoading && data && (
                <Grid container spacing={2.5} sx={{ mb: 4 }}>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<Train sx={{ fontSize: 22 }} />}
                            label="Total Facilities"
                            value={stats.total}
                            variant="primary"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<CheckCircle sx={{ fontSize: 22 }} />}
                            label="Available Spots"
                            value={stats.available}
                            variant="success"
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<LocalParking sx={{ fontSize: 22 }} />}
                            label="Total Capacity"
                            value={stats.totalSpots}
                            variant="primary"
                        />
                    </Grid>
                </Grid>
            )}

            {/* FACILITIES HEADER */}
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 600,
                    mb: 2.5,
                    letterSpacing: "-0.01em",
                }}
            >
                Facilities
            </Typography>

            {/* GRID */}
            <Grid container spacing={2.5}>
                {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <Grid
                            key={i}
                            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                        >
                            <FacilityCardSkeleton />
                        </Grid>
                    ))}

                {data?.map((facility) => (
                    <Grid
                        key={facility.slug}
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    >
                        <FacilityCard facility={facility} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}