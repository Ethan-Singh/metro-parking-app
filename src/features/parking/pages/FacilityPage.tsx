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
import { useFacilityOverview } from "../hooks/useFacilityOverview";
import { useFacilityHistory } from "../hooks/useFacilityHistory";
import { FacilityHistoryChart } from "../components/FacilityHistoryChart";

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
    const percent = facility ? Math.round(facility.occupancyRate * 100) : 0;
    const isFull = facility?.status === "ALMOST_FULL";

    const getGradient = (rate: number) => {
        if (rate >= 0.9) return "linear-gradient(135deg, #9B1C1C 0%, #FF6B6B 100%)";
        if (rate >= 0.75) return "linear-gradient(135deg, #92610A 0%, #FDCB6E 100%)";
        return "linear-gradient(135deg, #007D66 0%, #00B894 100%)";
    };

    const gradient = facility ? getGradient(facility.occupancyRate) : "";

    return (
        <Stack spacing={3}>
            {/* Back button and header */}
            <Box display="flex" alignItems="center" gap={2}>
                <Box
                    onClick={() => navigate("/")}
                    sx={{
                        cursor: "pointer",
                        p: 1,
                        borderRadius: "12px",
                        bgcolor: alpha(theme.palette.primary.main, 0.06),
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                            transform: "translateX(-2px)",
                        },
                    }}
                >
                    <ArrowBack sx={{ color: "text.secondary" }} />
                </Box>
                <Box flex={1}>
                    <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {facility?.facilityName || "Loading..."}
                    </Typography>
                </Box>
            </Box>

            {/* Key metrics cards */}
            {facility && (
                <Card className="glass-card">
                    <CardContent>
                        <Box
                            display="grid"
                            gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
                            gap={4}
                        >
                            {/* Occupancy metric */}
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
                                        background: gradient,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {percent}%
                                </Typography>
                            </Box>

                            {/* Available spots metric */}
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
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700,
                                        color: isFull ? "warning.main" : "success.main",
                                    }}
                                >
                                    {facility.available}
                                    <Typography
                                        component="span"
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ fontWeight: 400, ml: 0.5 }}
                                    >
                                        / {facility.spots}
                                    </Typography>
                                </Typography>
                            </Box>

                            {/* Last updated metric */}
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
                                <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                                    {new Date(facility.asOf).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            )}

            {/* Occupancy chart */}
            {history.data && (
                <Card className="glass-card">
                    <CardContent>
                        <FacilityHistoryChart data={history.data.dataPoints} />
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}