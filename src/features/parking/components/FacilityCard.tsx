import { Card, CardActionArea, CardContent, Typography, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Facility } from "../types";

// Capacity bar colour thresholds
function getCapacityColor(rate: number): string {
    if (rate >= 0.9) return "#C53030"; // critical — red
    if (rate >= 0.75) return "#B45309"; // almost full — amber
    return "#0D7A6E"; // available — civic teal
}

// Inline status badge — no MUI Chip, full control
function StatusBadge({ status, label }: { status: Facility["status"]; label: string }) {
    const isWarn = status === "ALMOST_FULL";
    return (
        <Box
            component="span"
            sx={{
                display: "inline-block",
                px: "6px",
                py: "2px",
                borderRadius: "4px",
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                backgroundColor: isWarn ? "#FEF3C7" : "#D1FAE5",
                color: isWarn ? "#92400E" : "#065F46",
                border: isWarn ? "1px solid #FDE68A" : "1px solid #A7F3D0",
                lineHeight: 1.4,
            }}
        >
            {label}
        </Box>
    );
}

export function FacilityCard({ facility }: { facility: Facility }) {
    const navigate = useNavigate();
    const percent = Math.round(facility.occupancyRate * 100);
    const capacityColor = getCapacityColor(facility.occupancyRate);

    return (
        <Card
            sx={{
                height: "100%",
                transition: "box-shadow 150ms ease, transform 150ms ease",
                "&:hover": {
                    boxShadow: "0 4px 16px rgba(15,25,36,0.10), 0 2px 6px rgba(15,25,36,0.06)",
                    transform: "translateY(-1px)",
                },
            }}
        >
            <CardActionArea
                onClick={() => navigate(`/facility/${facility.slug}`)}
                aria-label={facility.ariaLabel}
                sx={{
                    height: "100%",
                    borderRadius: "inherit",
                    // Override MUI hover overlay — card handles hover itself
                    "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
                }}
            >
                <CardContent
                    sx={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "stretch",
                        p: "1rem 1.125rem !important",
                    }}
                >
                    {/*
           * SIGNATURE ELEMENT: vertical capacity bar
           * A narrow 4px bar that fills proportionally to occupancy.
           * Across a grid these bars form a scannable "skyline" of the network.
           */}
                    <Box
                        aria-hidden="true"
                        sx={{
                            width: 4,
                            borderRadius: 99,
                            flexShrink: 0,
                            backgroundColor: "rgba(15,25,36,0.08)",
                            position: "relative",
                            overflow: "hidden",
                            alignSelf: "stretch",
                            minHeight: 72,
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: `${percent}%`,
                                backgroundColor: capacityColor,
                                borderRadius: 99,
                                transition: "height 400ms ease",
                            }}
                        />
                    </Box>

                    {/* Main content */}
                    <Stack spacing="6px" sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                lineHeight: 1.3,
                                // Truncate long names gracefully
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {facility.facilityName}
                        </Typography>

                        <StatusBadge status={facility.status} label={facility.statusLabel} />

                        {/* Availability numbers — tabular-nums keeps them from jittering */}
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <Typography
                                component="span"
                                sx={{
                                    fontSize: "1.25rem",
                                    fontWeight: 700,
                                    color: capacityColor,
                                    fontVariantNumeric: "tabular-nums",
                                    lineHeight: 1,
                                }}
                            >
                                {facility.available}
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                sx={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                / {facility.spots} spots
                            </Typography>
                        </Box>

                        {/* Occupancy percentage */}
                        <Typography
                            variant="caption"
                            sx={{ display: "block", color: "text.secondary" }}
                        >
                            {percent}% occupied · updated{" "}
                            {new Date(facility.asOf).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}