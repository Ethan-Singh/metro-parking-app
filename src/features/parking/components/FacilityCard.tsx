import { Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocalParking, AccessTime } from "@mui/icons-material";
import {tokens} from "../../../css/tokens.ts";
import type {ParkingOverview} from "../services/parking.ts";

const occupancyColor = (rate: number) =>
    rate >= 0.9
        ? tokens.color.error
        : rate >= 0.75
            ? tokens.color.warning
            : tokens.color.success;

export function FacilityCard({ facility }: { facility: ParkingOverview }) {
    const navigate = useNavigate();
    const percent  = Math.round(facility.occupancyRate * 100);
    const color    = occupancyColor(facility.occupancyRate);

    return (
        <Card className="card-container" onClick={() => navigate(`/facility/${facility.slug}`)}>
            <CardContent>
                <div className="card-header">
                    <div className="card-icon" style={{ backgroundColor: color }}>
                        <LocalParking sx={{ fontSize: 20 }} />
                    </div>
                    <Typography variant="h6" className="card-name">
                        {facility.facilityName}
                    </Typography>
                </div>

                <div style={{ marginTop: tokens.space.lg }}>
                    <div className="card-stats">
                        <Typography variant="body2" color="textSecondary">
                            Available
                        </Typography>
                        <Typography variant="body2" className="card-stat-value" style={{ color }}>
                            {facility.available} / {facility.spots}
                        </Typography>
                    </div>
                    <div className="card-progress-bar" style={{ backgroundColor: tokens.color.border }}>
                        <div
                            className="card-progress-fill"
                            style={{ width: `${percent}%`, backgroundColor: color }}
                        />
                    </div>
                </div>

                {/* statusLabel comes straight from the backend — no need to re-derive it */}
                <div className="card-footer" style={{ marginTop: tokens.space.lg }}>
                    <AccessTime sx={{ fontSize: 14, color: "textSecondary" }} />
                    <Typography variant="caption" color="textSecondary">
                        {new Date(facility.asOf).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                        · {facility.statusLabel}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
}