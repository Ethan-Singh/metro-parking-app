import Grid from "@mui/material/Grid";
import {
    Typography,
    Alert,
    Card,
    CardContent,
    Skeleton,
    Box,
} from "@mui/material";
import { useParkingQueries } from "../api/useParkingQueries.ts";
import { FacilityCard } from "../components/FacilityCard.tsx";

export default function OverviewPage() {
    const { data, isLoading, isError } = useParkingQueries();

    return (
        <Box>
            {/* HEADER */}
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Network
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                {data?.length || 0} parkings
            </Typography>

            {/* ERROR */}
            {isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Failed to load data
                </Alert>
            )}

            {/* GRID */}
            <Grid container spacing={2} sx={{ width: "100%" }}>
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <Grid
                            key={i}
                            size={{ xs: 12, sm: 6, md: 4 }}
                        >
                            <Card>
                                <CardContent>
                                    <Skeleton height={200} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                    : data?.map((f) => (
                        <Grid
                            key={f.slug}
                            size={{ xs: 12, sm: 6, md: 4 }}
                        >
                            <FacilityCard facility={f} />
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
}