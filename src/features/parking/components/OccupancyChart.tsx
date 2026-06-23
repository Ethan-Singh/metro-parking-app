import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";
import { semantic } from "../../../design-tokens/semantic";

export function OccupancyChart({ data }: { data: any[] }) {
    return (
        <Paper
            className="glass-card"
            sx={{
                p: 2,
                overflow: "hidden",
            }}
        >
            <Typography variant="h6" gutterBottom>
                Occupancy Over Time
            </Typography>

            <Box sx={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="timestamp"
                            tick={false}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, 1]}
                            tick={{
                                fill: semantic.color.text.muted,
                                fontSize: 11,
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="occupancyRate"
                            stroke={semantic.color.primary}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: semantic.color.primary,
                                stroke: "#fff",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}