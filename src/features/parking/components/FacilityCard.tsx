import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    alpha,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalParking, AccessTime } from "@mui/icons-material";
import type { Facility } from "../types";

function getCapacityGradient(rate: number) {
    if (rate >= 0.9) return "linear-gradient(135deg, #9B1C1C 0%, #FF6B6B 100%)";
    if (rate >= 0.75) return "linear-gradient(135deg, #92610A 0%, #FDCB6E 100%)";
    return "linear-gradient(135deg, #007D66 0%, #00B894 100%)";
}

function getCapacityColor(rate: number) {
    if (rate >= 0.9) return "#9B1C1C";
    if (rate >= 0.75) return "#92610A";
    return "#007D66";
}

function getStatusBadgeClass(status: Facility["status"]) {
    if (status === "ALMOST_FULL") return "status-badge status-badge--warn";
    if (status === "FULL") return "status-badge status-badge--full";
    return "status-badge status-badge--available";
}

export function FacilityCard({ facility }: { facility: Facility }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const percent = Math.round(facility.occupancyRate * 100);
    const gradient = getCapacityGradient(facility.occupancyRate);
    const solidColor = getCapacityColor(facility.occupancyRate);

    return (
        <Card
            className="glass-card"
            sx={{
                height: "100%",
                overflow: "hidden",
                // Premium gradient accent bar
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -1,
                    left: -1,
                    right: -1,
                    height: 4,
                    background: gradient,
                    borderRadius: "14px 14px 0 0",
                },
            }}
        >
            <CardActionArea
                onClick={() => navigate(`/facility/${facility.slug}`)}
                aria-label={facility.ariaLabel}
                sx={{
                    height: "100%",
                    borderRadius: "inherit",
                    "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
                }}
            >
                <CardContent sx={{ pt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {/* Header with icon and name */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "12px",
                                background: gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                flexShrink: 0,
                            }}
                        >
                            <LocalParking sx={{ fontSize: 20 }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
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
                        </Box>
                    </Box>

                    {/* Status badge */}
                    <span className={getStatusBadgeClass(facility.status)}>
            {facility.statusLabel}
          </span>

                    {/* Availability metric */}
                    <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.75 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                Available spots
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                <Box
                                    component="span"
                                    sx={{
                                        color: solidColor,
                                    }}
                                >
                                    {facility.available}
                                </Box>
                                <Box component="span" color="text.secondary" sx={{ fontWeight: 400 }}>
                                    {" "}/ {facility.spots}
                                </Box>
                            </Typography>
                        </Box>
                        {/* Capacity bar */}
                        <Box
                            sx={{
                                height: 6,
                                borderRadius: 99,
                                backgroundColor: alpha(theme.palette.text.primary, 0.06),
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    height: "100%",
                                    width: `${percent}%`,
                                    borderRadius: 99,
                                    background: gradient,
                                    transition: "width 400ms ease",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Footer with timestamp */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
                        <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                            {new Date(facility.asOf).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}