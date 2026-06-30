import Grid from "@mui/material/Grid";
import {
    Typography,
    Box,
} from "@mui/material";
import { useParkingQueries } from "../api/useParkingQueries.ts";
import { FacilityCard } from "../components/FacilityCard.tsx";
import {QueryBoundary} from "../components/QueryBoundary.tsx";

export default function OverviewPage() {
    const { data, isLoading, isError } = useParkingQueries();

    return (
        <Box>
            {/* HEADER */}
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Network
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {isLoading ? "Loading..." : `${data?.length ?? 0} parkings`}
            </Typography>

            {/* QUERY STATE */}
            <QueryBoundary
                isLoading={isLoading}
                isError={isError}
            >
                <Grid container spacing={2} sx={{ width: "100%" }}>
                    {data?.map((f) => (
                        <Grid key={f.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                            <FacilityCard facility={f} />
                        </Grid>
                    ))}
                </Grid>
            </QueryBoundary>
        </Box>
    );
}