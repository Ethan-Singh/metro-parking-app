import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { Typography, Box } from "@mui/material";
import type { FacilityHistoryPoint } from "../types";

// Frutiger Aero aqua — 4.6:1 on white ✓ WCAG AA
const AQUA      = "#0097B8";
const INK_MUTED = "#3D5166";

function buildChartData(raw: FacilityHistoryPoint[]) {
    return raw.map((d) => {
        const date = new Date(d.timestamp);
        return {
            day: date.toLocaleDateString([], { weekday: "short", day: "numeric" }),
            time: date.toLocaleString([], {
                weekday: "short", month: "short", day: "numeric",
                hour: "2-digit", minute: "2-digit",
            }),
            ts:           date.getTime(),
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
                // Glass tooltip — Aero style
                background:    "rgba(12, 28, 46, 0.88)",
                backdropFilter: "blur(8px)",
                color:         "#FFFFFF",
                borderRadius:  "8px",
                px:            "10px",
                py:            "8px",
                fontSize:      "0.75rem",
                lineHeight:    1.5,
                pointerEvents: "none",
                boxShadow:     "0 4px 16px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)",
                border:        "1px solid rgba(255,255,255,0.10)",
            }}
        >
            <Box sx={{ color: "rgba(255,255,255,0.55)", mb: "2px" }}>{d.time}</Box>
            <Box sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                {d.occupancyRate}%{" "}
                <Box component="span" sx={{ fontWeight: 400, opacity: 0.65 }}>occupied</Box>
            </Box>
        </Box>
    );
}

function DayTick({ x, y, payload, data }: any) {
    const index = data.findIndex((d: any) => d.day === payload.value && d.ts === payload.ts);
    if (index > 0 && data[index - 1].day === payload.value) return null;
    return (
        <text x={x} y={y + 12} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontFamily="Inter, system-ui, sans-serif">
            {payload.value}
        </text>
    );
}

export function FacilityHistoryChart({ data }: { data: FacilityHistoryPoint[] }) {
    const chartData = buildChartData(data);

    const dayTicks: string[] = [];
    let lastDay = "";
    chartData.forEach((d) => {
        if (d.day !== lastDay) { dayTicks.push(d.day); lastDay = d.day; }
    });

    return (
        /*
         * chart-paper class lives in global.css — applies glass bg,
         * border, shadow, and the top shine line via ::before.
         */
        <div className="chart-paper">
            <Box sx={{ mb: "1.25rem" }}>
                <Typography variant="h6" sx={{ mb: "2px" }}>Occupancy trend</Typography>
                <Typography variant="body2" color="text.secondary">
                    Percentage of occupied spaces · 10-minute intervals · last 7 days
                </Typography>
            </Box>

            <Box
                sx={{ width: "100%", height: 280 }}
                role="img"
                aria-label="Line chart showing occupancy percentage over the last 7 days"
            >
                <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                        <defs>
                            {/* Aero aqua gradient fill */}
                            <linearGradient id="aeroFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor={AQUA} stopOpacity={0.22} />
                                <stop offset="95%" stopColor={AQUA} stopOpacity={0.01} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            horizontal vertical={false}
                            stroke="rgba(10,79,166,0.07)"
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
                            tick={{ fill: INK_MUTED, fontSize: 11, fontFamily: "Inter, system-ui, sans-serif" }}
                            axisLine={false}
                            tickLine={false}
                            tickCount={5}
                        />

                        <Tooltip content={<ChartTooltip />} />

                        <Area
                            type="monotone"
                            dataKey="occupancyRate"
                            stroke={AQUA}
                            strokeWidth={2.5}
                            fill="url(#aeroFill)"
                            dot={false}
                            activeDot={{ r: 5, fill: AQUA, stroke: "#fff", strokeWidth: 2.5 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </div>
    );
}