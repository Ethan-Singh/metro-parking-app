import { Card, CardContent, Skeleton, Stack, Box } from "@mui/material";

export function FacilityCardSkeleton() {
    return (
        <Card
            className="glass-card"
            sx={{
                overflow: "hidden",
                position: "relative",
            }}
        >
            {/* subtle top shimmer bar (matches real card accent) */}
            <Box
                sx={{
                    height: 4,
                    width: "100%",
                    backgroundColor: "rgba(10,79,166,0.06)",
                }}
            />

            <CardContent
                sx={{
                    pt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                {/* Header */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                    <Skeleton
                        variant="rounded"
                        width={40}
                        height={40}
                        sx={{
                            borderRadius: (t) => t.shape.borderRadius,
                        }}
                    />

                    <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Skeleton variant="text" height={24} />
                        <Skeleton variant="text" height={20} width="70%" />
                    </Stack>
                </Box>

                {/* Status badge */}
                <Skeleton
                    variant="rounded"
                    width={90}
                    height={22}
                    sx={{
                        borderRadius: (t) => t.shape.borderRadius,
                        backgroundColor: "rgba(10,79,166,0.06)",
                    }}
                />

                {/* Stats */}
                <Stack spacing={0.75}>
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Skeleton variant="text" width="40%" height={18} />
                        <Skeleton variant="text" width="30%" height={18} />
                    </Box>

                    <Skeleton
                        variant="rounded"
                        height={6}
                        sx={{
                            borderRadius: 99,
                            backgroundColor: "rgba(10,79,166,0.06)",
                        }}
                    />
                </Stack>

                {/* Footer */}
                <Skeleton variant="text" width="60%" height={16} />
            </CardContent>
        </Card>
    );
}