import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Paper, Typography, Box } from "@mui/material";

const CIVIC_BLUE = "#1A56DB";
const CIVIC_BLUE_FILL = "rgba(26,86,219,0.08)";
const INK_MUTED = "#4A5568";
const BORDER = "rgba(15,25,36,0.08)";

// Format timestamp → "Mon 14" day label, deduplicating across data
function buildChartData(raw: any[]) {
    return raw.map((d) => {
        const date = new Date(d.timestamp);
        return {
            // Day label for X axis — only show once per day (handled by tick logic)
            day: date.toLocaleDateString([], { weekday: "short", day: "numeric" }),
            // Full timestamp for tooltip
            time: date.toLocaleString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }),
            // Raw epoch ms — used to detect day boundaries
            ts: date.getTime(),
            occupancyRate: +(d.occupancyRate * 100).toFixed(1),
        };
    });
}

// Custom tooltip — clean, no MUI dependency
function ChartTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <Box
            sx={{
                backgroundColor: "#0F1924",
                color: "#FFFFFF",
                borderRadius: "6px",
                px: "10px",
                py: "7px",
                fontSize: "0.75rem",
                lineHeight: 1.5,
                pointerEvents: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            }}
        >
            <Box sx={{ color: "rgba(255,255,255,0.6)", mb: "2px" }}>{d.time}</Box>
            <Box sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {d.occupancyRate}%{" "}
                <Box component="span" sx={{ fontWeight: 400, opacity: 0.7 }}>
                    occupied
                </Box>
            </Box>
        </Box>
    );
}

// Only render the day label at the first point of each calendar day
function DayTick({ x, y, payload, data }: any) {
    const index = data.findIndex((d: any) => d.day === payload.value && d.ts === payload.ts);
    // Suppress if this isn't the first occurrence of this day
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

export function FacilityHistoryChart({ data }: { data: any[] }) {
    const chartData = buildChartData(data);

    // Build an array of every "first-of-day" index for X axis ticks
    const dayTicks: string[] = [];
    let lastDay = "";
    chartData.forEach((d) => {
        if (d.day !== lastDay) {
            dayTicks.push(d.day);
            lastDay = d.day;
        }
    });

    return (
        <Paper
            variant="outlined"
            sx={{
                p: "1.25rem",
                borderRadius: "12px",
                border: `1px solid ${BORDER}`,
            }}
        >
            {/* Header */}
            <Box sx={{ mb: "1.25rem" }}>
                <Typography variant="h6" sx={{ mb: "2px" }}>
                    Occupancy trend
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Percentage of occupied spaces · 10-minute intervals · last 7 days
                </Typography>
            </Box>

            {/* Chart */}
            <Box
                sx={{ width: "100%", height: 280 }}
                role="img"
                aria-label="Line chart showing occupancy percentage over the last 7 days"
            >
                <ResponsiveContainer>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 8, right: 4, left: -16, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="civicFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CIVIC_BLUE} stopOpacity={0.12} />
                                <stop offset="95%" stopColor={CIVIC_BLUE} stopOpacity={0.01} />
                            </linearGradient>
                        </defs>

                        {/* Dashed horizontal gridlines — civic, not decorative */}
                        <CartesianGrid
                            horizontal
                            vertical={false}
                            stroke="rgba(15,25,36,0.07)"
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

                        <Area
                            type="monotone"
                            dataKey="occupancyRate"
                            stroke={CIVIC_BLUE}
                            strokeWidth={2}
                            fill="url(#civicFill)"
                            dot={false}
                            activeDot={{ r: 4, fill: CIVIC_BLUE, stroke: "#fff", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}