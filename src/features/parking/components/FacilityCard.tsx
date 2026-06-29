import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccessTime } from "@mui/icons-material";
import { tokens, occupancyColors } from "../../../css/tokens.ts";
import type { ParkingOverview } from "../types.ts";
import {getAvailabilityIcon} from "../utils.tsx";
import {LineBadge} from "./LineBadge.tsx";

export function FacilityCard({ facility }: { facility: ParkingOverview }) {
    const navigate = useNavigate();
    const percent = Math.round(facility.occupancyRate * 100);

    const color =
        occupancyColors[facility.availability as keyof typeof occupancyColors] ??
        tokens.color.success;

    return (
        <Card
            className="card-container"
            onClick={() => navigate(`/facility/${facility.slug}`)}
        >
            <CardContent>
                <div className="card-header">
                    <Typography variant="h6" className="card-name">
                        {facility.facilityName}
                    </Typography>

                    <LineBadge slug={facility.slug} />
                </div>

                <div style={{ marginTop: tokens.space.lg }}>
                    <div className="card-stats">
                        <Typography
                            variant="body2"
                            className="card-stat-value"
                            style={{ color }}
                        >
                            {facility.occupancy} / {facility.spots}
                        </Typography>
                    </div>

                    <div
                        className="card-progress-bar"
                        style={{ backgroundColor: tokens.color.border }}
                    >
                        <div
                            className="card-progress-fill"
                            style={{
                                width: `${percent}%`,
                                backgroundColor: color,
                            }}
                        />
                    </div>
                </div>

                <div className="card-footer">
                    <AccessTime style={tokens.metaFooter.icon} />

                    <Typography variant="caption" style={tokens.metaFooter.text}>
                        Updated{" "}
                        {new Date(facility.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>

                    <span style={tokens.metaFooter.separator}>·</span>

                    <span style={tokens.metaFooter.item}>
                        {getAvailabilityIcon(facility.availability)}
                                        <Typography variant="caption" style={tokens.metaFooter.text}>
                            {facility.availability}
                        </Typography>
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}