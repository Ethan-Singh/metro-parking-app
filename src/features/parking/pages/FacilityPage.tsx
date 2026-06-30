import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    Stack,
    Alert,
    Card,
    CardContent,
    Button,
    Box,
    Skeleton,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { FacilityHistoryChart } from "../components/FacilityHistoryChart.tsx";
import {
    useFacilityHistory,
    useFacilityOverview,
} from "../api/useParkingQueries.ts";
import {QueryBoundary} from "../components/QueryBoundary.tsx";
import type {FacilitySlug} from "../types.ts";

export default function FacilityPage() {
    const navigate = useNavigate();

    const params = useParams<{ slug: string }>();
    const slug = params.slug;
    if (!slug) {
        return <Alert severity="error">Missing facility slug</Alert>;
    }
    const safeSlug = slug as FacilitySlug;

    const overview = useFacilityOverview(safeSlug);
    const history = useFacilityHistory(safeSlug);

    const f = overview.data;
    const percent = f ? Math.round(f.occupancyRate * 100) : 0;

    return (
        <Stack spacing={3}>

            {/* HEADER */}
            <QueryBoundary
                isLoading={overview.isLoading}
                isError={overview.isError}
                loading={<Skeleton height={60} />}
            >
                <Box sx={{ mb: 1 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={() => navigate("/")}
                        sx={{ textTransform: "none", mb: 2 }}
                    >
                        Back
                    </Button>

                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {f?.facilityName}
                    </Typography>
                </Box>
            </QueryBoundary>

            {/* METRICS */}
            <QueryBoundary
                isLoading={overview.isLoading}
                isError={overview.isError}
                loading={<Skeleton height={120} />}
            >
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(120px, 1fr))",
                                gap: 3,
                            }}
                        >
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Current Occupancy
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {percent}%
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Current Available
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: "success.main" }}>
                                    {f?.available ?? 0}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="caption" color="text.secondary">
                                    Current Total
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {f?.spots ?? 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </QueryBoundary>

            {/* CHART */}
            <QueryBoundary
                isLoading={history.isLoading}
                isError={history.isError}
                loading={<Skeleton height={280} />}
            >
                <Card>
                    <CardContent>
                        <FacilityHistoryChart
                            dataPoints={history.data?.dataPoints ?? []}
                        />
                    </CardContent>
                </Card>
            </QueryBoundary>

        </Stack>
    );
}