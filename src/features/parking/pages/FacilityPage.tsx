import { useParams } from "react-router-dom";
import { Typography, Stack, Alert } from "@mui/material";

import { useFacilityOverview } from "../hooks/useFacilityOverview";
import { useFacilityHistory } from "../hooks/useFacilityHistory";

import { FacilityOverviewPanel } from "../components/FacilityOverviewPanel";
import { FacilityHistoryChart } from "../components/FacilityHistoryChart";

export default function FacilityPage() {
    const { slug } = useParams();

    const overview = useFacilityOverview(slug!);
    const history = useFacilityHistory(slug!);

    if (overview.isError || history.isError) {
        return <Alert severity="error">Failed to load facility data</Alert>;
    }

    return (
        <Stack spacing={3}>
            <Typography variant="h4">Facility Details</Typography>

            {overview.data && (
                <FacilityOverviewPanel facility={overview.data} />
            )}

            {history.data && (
                <FacilityHistoryChart data={history.data.dataPoints} />
            )}
        </Stack>
    );
}