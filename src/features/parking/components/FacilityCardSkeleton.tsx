import { Card, CardContent, Skeleton, Stack } from "@mui/material";

export function FacilityCardSkeleton() {
    return (
        <Card variant="outlined">
            <CardContent>
                <Stack spacing={1}>
                    <Skeleton variant="text" height={28} />
                    <Skeleton variant="rounded" height={24} width={120} />
                    <Skeleton variant="text" />
                    <Skeleton variant="rectangular" height={10} />
                    <Skeleton variant="text" width="60%" />
                </Stack>
            </CardContent>
        </Card>
    );
}