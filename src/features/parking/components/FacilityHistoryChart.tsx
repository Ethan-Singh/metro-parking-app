import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

export function FacilityHistoryChart({ data }: { data: any[] }) {
    const chartData = data.map((d) => ({
        time: new Date(d.timestamp).toLocaleString(),
        occupancyRate: +(d.occupancyRate * 100).toFixed(2),
    }));

    return (
        <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Occupancy Trend (Last 7 Days)
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                Percentage of occupied spaces over time (10-minute intervals)
            </Typography>

            <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="occupancyRate"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
}