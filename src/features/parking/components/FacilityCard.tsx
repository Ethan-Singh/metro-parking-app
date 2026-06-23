import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalParking, AccessTime } from "@mui/icons-material";
import type { Facility } from "../types";
import { semantic } from "../../../design-tokens/semantic";
import {StatusBadge} from "./StatusBadge.tsx";

function getCapacityState(rate: number) {
    if (rate >= 0.9) return "critical";
    if (rate >= 0.75) return "warning";
    return "success";
}

function getCapacityGradient(rate: number) {
    const state = getCapacityState(rate);

    switch (state) {
        case "critical":
            return `linear-gradient(135deg, ${semantic.color.error}, #FF6B6B)`;
        case "warning":
            return `linear-gradient(135deg, ${semantic.color.warning}, #FDCB6E)`;
        default:
            return `linear-gradient(135deg, ${semantic.color.success}, #00B894)`;
    }
}

function getCapacityColor(rate: number) {
    const state = getCapacityState(rate);

    switch (state) {
        case "critical":
            return semantic.color.error;
        case "warning":
            return semantic.color.warning;
        default:
            return semantic.color.success;
    }
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

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
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
                    "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
                }}
            >
                <CardContent sx={{ pt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>

                    {/* Header */}
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: (t) => t.shape.borderRadius,
                                background: gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                flexShrink: 0,
                                boxShadow: theme.shadows[2],
                            }}
                        >
                            <LocalParking sx={{ fontSize: 20 }} />
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{
                                lineHeight: 1.3,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                color: (t) => t.palette.text.primary,
                            }}
                        >
                            {facility.facilityName}
                        </Typography>
                    </Box>

                    <StatusBadge status={facility.status} />

                    {/* Availability */}
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 0.75,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Available spots
                            </Typography>

                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                <Box component="span" sx={{ color: solidColor }}>
                                    {facility.available}
                                </Box>
                                <Box component="span" color="text.secondary">
                                    {" "} / {facility.spots}
                                </Box>
                            </Typography>
                        </Box>

                        {/* Capacity bar */}
                        <Box
                            sx={{
                                height: 6,
                                borderRadius: (t) => t.shape.borderRadius,
                                backgroundColor: "rgba(0,0,0,0.04)",
                                overflow: "hidden",
                            }}
                        >
                            <Box
                                sx={{
                                    height: "100%",
                                    width: `${percent}%`,
                                    borderRadius: (t) => t.shape.borderRadius,
                                    background: gradient,
                                    transition: "width 400ms ease",
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Footer */}
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