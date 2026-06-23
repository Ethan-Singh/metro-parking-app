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
import { semantic } from "../../../design-tokens/semantic";

// ── helpers ────────────────────────────────────────────────

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

// ── tooltip ────────────────────────────────────────────────

function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;

    const d = payload[0].payload;

    return (
        <Box
            sx={{
                background: "rgba(12, 28, 46, 0.92)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                borderRadius: (t) => t.shape.borderRadius,
                px: 1.5,
                py: 1,
                fontSize: "0.75rem",
                lineHeight: 1.5,
                pointerEvents: "none",
                boxShadow: (t) => t.shadows[4],
                border: "1px solid rgba(255,255,255,0.15)",
            }}
        >
            <Box sx={{ opacity: 0.7, mb: 0.5, fontSize: "0.7rem" }}>
                {d.time}
            </Box>

            <Box sx={{ fontWeight: 600 }}>
                {d.occupancyRate}%
                <Box component="span" sx={{ fontWeight: 400, opacity: 0.7 }}>
                    {" "}occupied
                </Box>
            </Box>
        </Box>
    );
}

// ── tick ───────────────────────────────────────────────────

function DayTick({ x, y, payload, data }: any) {
    const index = data.findIndex((d: any) => d.day === payload.value);

    if (index > 0 && data[index - 1]?.day === payload.value) return null;

    return (
        <text
            x={x}
            y={y + 12}
            textAnchor="middle"
            fill={semantic.color.text.muted}
            fontSize={11}
            fontFamily="Inter, system-ui, sans-serif"
        >
            {payload.value}
        </text>
    );
}

// ── main component ─────────────────────────────────────────

export function FacilityHistoryChart({
                                         data,
                                     }: {
    data: FacilityHistoryPoint[];
}) {
    const theme = useTheme();
    const chartData = buildChartData(data);

    const currentRate = chartData.at(-1)?.occupancyRate ?? 0;

    const avgRate =
        chartData.reduce((acc, d) => acc + d.occupancyRate, 0) /
        (chartData.length || 1);

    const maxRate = Math.max(...chartData.map((d) => d.occupancyRate), 0);

    const gradientColor = theme.palette.primary.main;
    const accentColor = theme.palette.secondary.main;

    return (
        <Box>
            {/* Header */}
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

            {/* Chart */}
            <Box
                sx={{ width: "100%", height: 320 }}
                role="img"
                aria-label="Line chart showing occupancy percentage over the last 7 days"
            >
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                        <defs>
                            <linearGradient id="aeroGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={accentColor} stopOpacity={0.01} />
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
                            tick={(props) => <DayTick {...props} data={chartData} />}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            domain={[0, 100]}
                            tickFormatter={(v) => `${v}%`}
                            tick={{
                                fill: semantic.color.text.muted,
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
                            stroke={theme.palette.primary.main}
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{
                                r: 6,
                                fill: theme.palette.primary.main,
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