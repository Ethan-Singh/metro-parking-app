import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Typography, Chip } from "@mui/material";
import type {DataPoint} from "../services/parking.ts";
import {tokens} from "../../../css/tokens.ts";
import { Skeleton } from "@mui/material";

interface Props {
    dataPoints: DataPoint[]; // matches ParkingHistory.dataPoints exactly
}

export function FacilityHistoryChart({ dataPoints }: Props) {
    if (!dataPoints) {
        return <Skeleton variant="rectangular" height={280} />;
    }

    const chartData = dataPoints.map((d) => ({
        time: new Date(d.timestamp).toLocaleDateString(),
        rate: +(d.occupancyRate * 100).toFixed(1),
    }));

    const current = chartData[chartData.length - 1]?.rate ?? 0;
    const avg =
        chartData.length > 0
            ? (chartData.reduce((sum, d) => sum + d.rate, 0) / chartData.length).toFixed(1)
            : "—";

    return (
        <div>
            <div className="chart-header">
                <div>
                    <Typography variant="h6">Occupancy</Typography>
                    <Typography variant="body2" color="textSecondary">
                        7-day trend
                    </Typography>
                </div>
                <div className="chart-chips">
                    <Chip label={`Current: ${current}%`} variant="outlined" size="small" />
                    <Chip label={`Avg: ${avg}%`} variant="outlined" size="small" />
                </div>
            </div>

            <div className="chart-container">
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(value) => `${value}%`}/>
                        <Line
                            type="monotone"
                            dataKey="rate"
                            stroke={tokens.color.secondary}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}