import { Card, CardActionArea, CardContent, Typography, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Facility } from "../types";

// Maps occupancy to CSS class names defined in global.css
function getCapacityClass(rate: number) {
    if (rate >= 0.9) return { text: "capacity-critical", bar: "capacity-bar-critical" };
    if (rate >= 0.75) return { text: "capacity-warn",     bar: "capacity-bar-warn" };
    return              { text: "capacity-available",      bar: "capacity-bar-available" };
}

function getStatusBadgeClass(status: Facility["status"]) {
    if (status === "ALMOST_FULL") return "status-badge status-badge--warn";
    if (status === "FULL")        return "status-badge status-badge--full";
    return                               "status-badge status-badge--available";
}

export function FacilityCard({ facility }: { facility: Facility }) {
    const navigate  = useNavigate();
    const percent   = Math.round(facility.occupancyRate * 100);
    const classes   = getCapacityClass(facility.occupancyRate);

    return (
        /*
         * We keep the MUI Card for semantic structure and CardActionArea for
         * keyboard/a11y, but override visual styling via className + global.css
         * rather than inline sx on every property.
         */
        <Card
            className="glass-card"
            sx={{
                height: "100%",
                transition: "box-shadow 180ms ease, transform 180ms ease",
                // glass-card::before shine line needs overflow:hidden on the Card root
                overflow: "hidden",
            }}
        >
            <CardActionArea
                onClick={() => navigate(`/facility/${facility.slug}`)}
                aria-label={facility.ariaLabel}
                sx={{
                    height: "100%",
                    borderRadius: "inherit",
                    // Suppress MUI's own hover overlay — the card handles hover
                    "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
                }}
            >
                <CardContent sx={{ display: "flex", gap: "12px", alignItems: "stretch", p: "1rem 1.125rem !important" }}>
                    {/*
           * SIGNATURE: vertical capacity bar
           * Across a grid these form a scannable "skyline" of the network.
           * The Aero twist: the filled bar has a soft inner glow.
           */}
                    <Box
                        aria-hidden="true"
                        sx={{
                            width: 4,
                            borderRadius: 99,
                            flexShrink: 0,
                            backgroundColor: "rgba(10,79,166,0.08)",
                            position: "relative",
                            overflow: "hidden",
                            alignSelf: "stretch",
                            minHeight: 72,
                        }}
                    >
                        <Box
                            className={classes.bar}
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: `${percent}%`,
                                borderRadius: 99,
                                transition: "height 400ms ease",
                                // Aero gloss: lighter stripe at top of filled bar
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: 99,
                                    background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
                                    pointerEvents: "none",
                                },
                            }}
                        />
                    </Box>

                    {/* Main content */}
                    <Stack spacing="6px" sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                lineHeight: 1.3,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {facility.facilityName}
                        </Typography>

                        <span className={getStatusBadgeClass(facility.status)}>
              {facility.statusLabel}
            </span>

                        {/* Availability numbers */}
                        <Box sx={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                            <Typography
                                component="span"
                                className={classes.text}
                                sx={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1 }}
                            >
                                {facility.available}
                            </Typography>
                            <Typography component="span" variant="body2">
                                / {facility.spots} spots
                            </Typography>
                        </Box>

                        <Typography variant="caption" sx={{ display: "block" }}>
                            {percent}% occupied · updated{" "}
                            {new Date(facility.asOf).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}