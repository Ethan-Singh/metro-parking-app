import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography } from "@mui/material";

export function OccupancyChart({ data }: { data: any[] }) {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Occupancy Over Time
            </Typography>

            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <XAxis dataKey="timestamp" tick={false} />
                        <YAxis domain={[0, 1]} />
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