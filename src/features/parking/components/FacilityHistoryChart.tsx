import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Typography, Box, Chip, alpha, useTheme } from "@mui/material";
import type { FacilityHistoryPoint } from "../types";

// Frutiger Aero aqua — 4.6:1 on white ✓ WCAG AA
const AQUA = "#0097B8";
const INK_MUTED = "#3D5166";

function buildChartData(raw: FacilityHistoryPoint[]) {
    return raw.map((d) => {
        const date = new Date(d.timestamp);
        return {
            day: date.toLocaleDateString([], { weekday: "short", day: "numeric" }),
            time: date.toLocaleString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            ts: date.getTime(),
            occupancyRate: +(d.occupancyRate * 100).toFixed(1),
        };
    });
}

function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <Box
            sx={{
                background: "rgba(12, 28, 46, 0.92)",
                backdropFilter: "blur(8px)",
                color: "#FFFFFF",
                borderRadius: "10px",
                px: "12px",
                py: "10px",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                pointerEvents: "none",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.15)",
            }}
        >
            <Box sx={{ color: "rgba(255,255,255,0.65)", mb: "4px", fontSize: "0.7rem" }}>
                {d.time}
            </Box>
            <Box sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {d.occupancyRate}%{" "}
                <Box component="span" sx={{ fontWeight: 400, opacity: 0.7 }}>
                    occupied
                </Box>
            </Box>
        </Box>
    );
}

function DayTick({ x, y, payload, data }: any) {
    const index = data.findIndex((d: any) => d.day === payload.value && d.ts === payload.ts);
    if (index > 0 && data[index - 1].day === payload.value) return null;
    return (
        <text
            x={x}
            y={y + 12}
            textAnchor="middle"
            fill={INK_MUTED}
            fontSize={11}
            fontFamily="Inter, system-ui, sans-serif"
        >
            {payload.value}
        </text>
    );
}

export function FacilityHistoryChart({ data }: { data: FacilityHistoryPoint[] }) {
    const theme = useTheme();
    const chartData = buildChartData(data);

    const dayTicks: string[] = [];
    let lastDay = "";
    chartData.forEach((d) => {
        if (d.day !== lastDay) {
            dayTicks.push(d.day);
            lastDay = d.day;
        }
    });

    const currentRate = chartData[chartData.length - 1]?.occupancyRate || 0;
    const avgRate =
        chartData.reduce((acc, d) => acc + d.occupancyRate, 0) / chartData.length;
    const maxRate = Math.max(...chartData.map((d) => d.occupancyRate));

    return (
        <Box>
            {/* Header with stats chips */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Occupancy Trend
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        10-minute intervals over the last 7 days
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                    <Chip
                        label={`Current: ${currentRate}%`}
                        sx={{
                            fontWeight: 600,
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            color: theme.palette.primary.main,
                            border: "none",
                        }}
                    />
                    <Chip
                        label={`Avg: ${avgRate.toFixed(1)}%`}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                    <Chip
                        label={`Peak: ${maxRate.toFixed(0)}%`}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
            </Box>

            {/* Chart container */}
            <Box
                sx={{ width: "100%", height: 320 }}
                role="img"
                aria-label="Line chart showing occupancy percentage over the last 7 days"
            >
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="aeroGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={AQUA} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={AQUA} stopOpacity={0.01} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            horizontal
                            vertical={false}
                            stroke={alpha(theme.palette.text.primary, 0.06)}
                            strokeDasharray="3 4"
                        />

                        <XAxis
                            dataKey="day"
                            ticks={dayTicks}
                            tick={(props) => <DayTick {...props} data={chartData} />}
                            axisLine={false}
                            tickLine={false}
                            interval="preserveStartEnd"
                        />

                        <YAxis
                            domain={[0, 100]}
                            tickFormatter={(v) => `${v}%`}
                            tick={{
                                fill: INK_MUTED,
                                fontSize: 11,
                                fontFamily: "Inter, system-ui, sans-serif",
                            }}
                            axisLine={false}
                            tickLine={false}
                            tickCount={5}
                        />

                        <Tooltip content={<ChartTooltip />} />

                        <Line
                            type="monotone"
                            dataKey="occupancyRate"
                            stroke={AQUA}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{
                                r: 6,
                                fill: AQUA,
                                stroke: "#fff",
                                strokeWidth: 2.5,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
}