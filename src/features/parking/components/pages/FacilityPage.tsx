import { useParams, useNavigate } from "react-router-dom";
import { Typography, Stack, Alert, Card, CardContent, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useFacilityOverview } from "../../hooks/useFacilityOverview";
import { useFacilityHistory } from "../../hooks/useFacilityHistory";
import { FacilityHistoryChart } from "../FacilityHistoryChart";

export default function FacilityPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const overview = useFacilityOverview(slug!);
    const history = useFacilityHistory(slug!);

    if (overview.isError) return <Alert severity="error">Failed to load</Alert>;

    const f = overview.data;
    const percent = f ? Math.round(f.occupancyRate * 100) : 0;

    return (
        <Stack spacing={3}>
            <div className="page-header">
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/")}
                    className="back-button"
                >
                    Back
                </Button>
                <Typography variant="h4" style={{ fontWeight: 700 }}>
                    {f?.facilityName}
                </Typography>
            </div>

            {f && (
                <Card>
                    <CardContent>
                        <div className="metrics-grid">
                            <div className="metric-box">
                                <Typography variant="caption" color="textSecondary" className="metric-label">
                                    Occupancy
                                </Typography>
                                <Typography variant="h4" className="metric-value">
                                    {percent}%
                                </Typography>
                            </div>
                            <div className="metric-box">
                                <Typography variant="caption" color="textSecondary" className="metric-label">
                                    Available
                                </Typography>
                                <Typography variant="h4" className="metric-value" style={{ color: "rgb(0, 125, 102)" }}>
                                    {f.available}
                                </Typography>
                            </div>
                            <div className="metric-box">
                                <Typography variant="caption" color="textSecondary" className="metric-label">
                                    Total
                                </Typography>
                                <Typography variant="h4" className="metric-value">
                                    {f.spots}
                                </Typography>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {history.data && (
                <Card>
                    <CardContent>
                        <FacilityHistoryChart data={history.data.dataPoints} />
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
}