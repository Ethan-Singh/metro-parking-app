import Grid from "@mui/material/Grid";
import { Typography, Alert, Box } from "@mui/material";
import { LocalParking, CheckCircle, TrendingUp, Train } from "@mui/icons-material";
import { useFacilities } from "../hooks/useFacilities";
import { FacilityCard } from "../components/FacilityCard";
import { StatsCard } from "../components/StatsCard.tsx";
import { FacilityCardSkeleton } from "../components/FacilityCardSkeleton";

export default function OverviewPage() {
    const { data, isLoading, isError } = useFacilities();

    const stats = {
        total: data?.length || 0,
        available: data?.reduce((acc, f) => acc + f.available, 0) || 0,
        totalSpots: data?.reduce((acc, f) => acc + f.spots, 0) || 0,
        avgOccupancy: data
            ? Math.round((data.reduce((acc, f) => acc + f.occupancyRate, 0) / data.length) * 100)
            : 0,
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                        mb: 0.5,
                        background: "linear-gradient(135deg, #0A4FA6 0%, #0097B8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Network Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor all parking facilities in real-time
                </Typography>
            </Box>

            {/* Error state */}
            {isError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    Failed to load parking data. Please try again.
                </Alert>
            )}

            {/* Summary stats */}
            {!isLoading && data && (
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<Train sx={{ fontSize: 22 }} />}
                            label="Total Facilities"
                            value={stats.total}
                            trend={5}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<CheckCircle sx={{ fontSize: 22 }} />}
                            label="Available Spots"
                            value={stats.available}
                            trend={-2}
                            gradient="linear-gradient(135deg, #007D66 0%, #00B894 100%)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<LocalParking sx={{ fontSize: 22 }} />}
                            label="Total Capacity"
                            value={stats.totalSpots}
                            gradient="linear-gradient(135deg, #0A4FA6 0%, #1A6CC8 100%)"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StatsCard
                            icon={<TrendingUp sx={{ fontSize: 22 }} />}
                            label="Avg Occupancy"
                            value={`${stats.avgOccupancy}%`}
                            trend={3}
                            gradient="linear-gradient(135deg, #92610A 0%, #FDCB6E 100%)"
                        />
                    </Grid>
                </Grid>
            )}

            {/* Facilities section header */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5, letterSpacing: "-0.01em" }}>
                Facilities
            </Typography>

            {/* Facilities grid */}
            <Grid container spacing={2.5}>
                {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FacilityCardSkeleton />
                        </Grid>
                    ))}
                {data?.map((facility) => (
                    <Grid key={facility.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <FacilityCard facility={facility} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}