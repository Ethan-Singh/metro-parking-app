import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    Stack,
    Alert,
    Card,
    CardContent,
    Button,
    Box,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { FacilityHistoryChart } from "../components/FacilityHistoryChart.tsx";
import {
    useFacilityHistory,
    useFacilityOverview,
} from "../api/useParkingQueries.ts";

export default function FacilityPage() {
    const { slug } = useParams();
    const navigate = useNavigate();

    const overview = useFacilityOverview(slug!);
    const history = useFacilityHistory(slug!);

    if (overview.isError) {
        return <Alert severity="error">Failed to load</Alert>;
    }

    const f = overview.data;
    const percent = f ? Math.round(f.occupancyRate * 100) : 0;

    return (
        <Stack spacing={3}>

            {/* HEADER */}
            <Box sx={{ mb: 1 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/")}
                    sx={{
                        textTransform: "none",
                        mb: 2,
                    }}
                >
                    Back
                </Button>

                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {f?.facilityName}
                </Typography>
            </Box>

            {/* METRICS */}
            {f && (
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
                            {/* Occupancy */}
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    Current Occupancy
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {percent}%
                                </Typography>
                            </Box>

                            {/* Available */}
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    Current Available
                                </Typography>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 700,
                                        color: "success.main",
                                    }}
                                >
                                    {f.available}
                                </Typography>
                            </Box>

                            {/* Total */}
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ mb: 0.5 }}
                                >
                                    Current Total
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                    {f.spots}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* CHART */}
            {history.data && (
                <Card>
                    <CardContent>
                        <FacilityHistoryChart
                            dataPoints={history.data.dataPoints}
                        />
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}