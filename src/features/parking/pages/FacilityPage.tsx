import { useParams, useNavigate } from "react-router-dom";
import {
    Typography,
    Stack,
    Alert,
    Box,
    Card,
    CardContent,
    alpha,
    useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { semantic } from "../../../design-tokens/semantic";
import { useFacilityOverview } from "../hooks/useFacilityOverview";
import { useFacilityHistory } from "../hooks/useFacilityHistory";
import { FacilityHistoryChart } from "../components/FacilityHistoryChart";

function getOccupancyColor(rate: number) {
    if (rate >= 0.9) return semantic.color.error;
    if (rate >= 0.75) return semantic.color.warning;
    return semantic.color.success;
}

export default function FacilityPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const overview = useFacilityOverview(slug!);
    const history = useFacilityHistory(slug!);

    if (overview.isError || history.isError) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
                Failed to load facility data
            </Alert>
        );
    }

    const facility = overview.data;
    const percent = facility
        ? Math.round(facility.occupancyRate * 100)
        : 0;

    const isLowAvailability =
        facility?.status === "ALMOST_FULL";

    const color = facility
        ? getOccupancyColor(facility.occupancyRate)
        : semantic.color.primary;

    return (
        <Stack spacing={3}>

            {/* HEADER */}
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    onClick={() => navigate("/")}
                    sx={{
                        cursor: "pointer",
                        p: 1,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        transition: "all 0.2s ease",
                        "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            transform: "translateX(-2px)",
                        },
                    }}
                >
                    <ArrowBack sx={{ color: "text.secondary" }} />
                </Box>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 700,
                        letterSpacing: "-0.02em",
                    }}
                >
                    {facility?.facilityName || "Loading..."}
                </Typography>
            </Box>

            {/* METRICS CARD */}
            {facility && (
                <Card className="glass-card">
                    <CardContent>
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(auto-fit, minmax(160px, 1fr))"
                            gap={4}
                        >

                            {/* OCCUPANCY */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        fontSize: "0.65rem",
                                    }}
                                >
                                    Occupancy
                                </Typography>

                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color,
                                    }}
                                >
                                    {percent}%
                                </Typography>
                            </Box>

                            {/* AVAILABLE */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        fontSize: "0.65rem",
                                    }}
                                >
                                    Available Spots
                                </Typography>

                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                    <Box
                                        component="span"
                                        sx={{ color }}
                                    >
                                        {facility.available}
                                    </Box>

                                    <Box
                                        component="span"
                                        sx={{
                                            color: "text.secondary",
                                            fontWeight: 400,
                                            fontSize: "1rem",
                                            ml: 0.5,
                                        }}
                                    >
                                        / {facility.spots}
                                    </Box>
                                </Typography>
                            </Box>

                            {/* UPDATED */}
                            <Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontWeight: 600,
                                        letterSpacing: "0.05em",
                                        textTransform: "uppercase",
                                        fontSize: "0.65rem",
                                    }}
                                >
                                    Last Updated
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500, mt: 0.5 }}
                                >
                                    {new Date(facility.asOf).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* CHART */}
            {history.data && (
                <Card className="glass-card">
                    <CardContent>
                        <FacilityHistoryChart
                            data={history.data.dataPoints}
                        />
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}