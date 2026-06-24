import Grid from "@mui/material/Grid";
import { Typography, Alert, Card, CardContent, Skeleton } from "@mui/material";
import { useFacilities } from "../../hooks/useFacilities.ts";
import { FacilityCard } from "../FacilityCard.tsx";
import {tokens} from "../../../../css/tokens.ts";

export default function OverviewPage() {
    const { data, isLoading, isError } = useFacilities();

    return (
        <div>
            <Typography variant="h4" className="page-title">
                Network Overview
            </Typography>
            <Typography variant="body2" color="textSecondary" className="page-subtitle">
                {data?.length || 0} facilities
            </Typography>

            {isError && <Alert severity="error" style={{ marginBottom: 24 }}>Failed to load data</Alert>}

            <Grid container spacing={tokens.grid.gap} className="facilities-grid">
                {isLoading
                    ? Array.from({ length: 8 }).map((_, i) => (
                        <Grid key={i} size={tokens.grid.cardSize}>
                            <Card>
                                <CardContent>
                                    <Skeleton height={tokens.grid.skeletonHeight} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                    : data?.map((f) => (
                        <Grid key={f.slug} size={tokens.grid.cardSize}>
                            <FacilityCard facility={f} />
                        </Grid>
                    ))}
            </Grid>
        </div>
    );
}

