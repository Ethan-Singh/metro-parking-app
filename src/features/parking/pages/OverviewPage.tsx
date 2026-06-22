import Grid from "@mui/material/Grid";
import { Typography, Alert } from "@mui/material";
import { useFacilities } from "../hooks/useFacilities";
import { FacilityCard } from "../components/FacilityCard";
import { FacilityCardSkeleton } from "../components/FacilityCardSkeleton";

export default function OverviewPage() {
    const { data, isLoading, isError } = useFacilities();

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Parking Overview
            </Typography>

            {isError && (
                <Alert severity="error">
                    Failed to load parking data. Please try again.
                </Alert>
            )}

            <Grid container spacing={2} sx={{ width: "100%" }}>
                {/* Loading */}
                {isLoading &&
                    Array.from({ length: 8 }).map((_, i) => (
                        <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FacilityCardSkeleton />
                        </Grid>
                    ))}

                {/* Data */}
                {data?.map((facility) => (
                    <Grid
                        key={facility.slug}
                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                    >
                        <FacilityCard facility={facility} />
                    </Grid>
                ))}
            </Grid>
        </>
    );
}