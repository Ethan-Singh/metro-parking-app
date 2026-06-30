import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccessTime } from "@mui/icons-material";
import { tokens } from "../../../css/tokens.ts";
import type { ParkingOverview } from "../types.ts";
import { LineBadge } from "./LineBadge.tsx";
import { getAvailability } from "../utils/availability.ts";

export function FacilityCard({ facility }: { facility: ParkingOverview }) {
    const navigate = useNavigate();
    const percent = Math.round(facility.occupancyRate * 100);

    const availability = getAvailability(facility.availability);

    const color = availability?.color ?? tokens.color.success;
    const Icon = availability?.icon;

    return (
        <Card
            sx={{ cursor: "pointer", height: "100%" }}
            onClick={() => navigate(`/facility/${facility.slug}`)}
        >
            <CardContent>

                {/* HEADER */}
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                }}>
                    <Typography variant="h6" sx={{ flex: 1 }}>
                        {facility.facilityName}
                    </Typography>

                    <LineBadge slug={facility.slug} />
                </Box>

                {/* STATS */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color }}>
                        {facility.occupancy} / {facility.spots}
                    </Typography>

                    <Box sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 999,
                        backgroundColor: tokens.color.border,
                        overflow: "hidden",
                    }}>
                        <Box
                            sx={{
                                height: "100%",
                                width: `${percent}%`,
                                backgroundColor: color,
                                transition: "width 0.3s ease",
                            }}
                        />
                    </Box>
                </Box>

                {/* FOOTER */}
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 2,
                    flexWrap: "wrap",
                }}>
                    <AccessTime
                        style={{
                            fontSize: 14,
                            color: tokens.color.textMuted,
                        }}
                    />

                    <Typography variant="caption" sx={{ color: tokens.color.textMuted }}>
                        Updated{" "}
                        {new Date(facility.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>

                    <Box sx={{ mx: 0.5, color: tokens.color.textMuted }}>·</Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {Icon && (
                            <Icon
                                style={{
                                    fontSize: 14,
                                    color: color,
                                }}
                            />
                        )}

                        <Typography variant="caption" sx={{ color: tokens.color.textMuted }}>
                            {facility.availability}
                        </Typography>
                    </Box>
                </Box>

            </CardContent>
        </Card>
    );
}