import { Card, CardContent, Skeleton, Stack, Box } from "@mui/material";

export function FacilityCardSkeleton() {
    return (
        <Card className="glass-card" sx={{ overflow: "hidden" }}>
            <CardContent sx={{ pt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {/* Icon and title header */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Skeleton variant="rounded" width={40} height={40} sx={{ flexShrink: 0 }} />
                    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton variant="text" height={24} />
                        <Skeleton variant="text" height={20} width="70%" />
                    </Stack>
                </Box>

                {/* Badge */}
                <Skeleton variant="rounded" width={80} height={20} />

                {/* Stats and bar */}
                <Stack spacing={0.75}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Skeleton variant="text" width="40%" height={18} />
                        <Skeleton variant="text" width="30%" height={18} />
                    </Box>
                    <Skeleton variant="rounded" height={6} />
                </Stack>

                {/* Footer */}
                <Skeleton variant="text" width="60%" height={16} />
            </CardContent>
        </Card>
    );
}