import { Card, CardContent, Skeleton, Stack, Box } from "@mui/material";

export function FacilityCardSkeleton() {
    return (
        /*
         * glass-card class from global.css handles the glass background,
         * border, and top shine line — consistent with loaded FacilityCard.
         */
        <Card className="glass-card">
            <CardContent>
                <Box sx={{ display: "flex", gap: "12px", alignItems: "stretch" }}>
                    {/* Capacity bar placeholder */}
                    <Box
                        className="skeleton"
                        sx={{ width: 4, minHeight: 88, borderRadius: 99, flexShrink: 0 }}
                    />

                    <Stack spacing={1} sx={{ flex: 1 }}>
                        <Skeleton variant="text"      height={28} />
                        <Skeleton variant="rounded"   height={20} width={100} />
                        <Skeleton variant="text"      height={32} width="55%" />
                        <Skeleton variant="text"      height={18} width="70%" />
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
}