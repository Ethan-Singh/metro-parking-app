import ReactECharts from "echarts-for-react";
import { Typography, Chip, Box } from "@mui/material";
import type { DataPoint } from "../types.ts";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { tokens } from "../../../css/tokens.ts";
import type { CallbackDataParams } from "echarts/types/dist/shared";

interface Props {
    dataPoints: DataPoint[];
}

export function FacilityHistoryChart({ dataPoints }: Props) {
    if (!dataPoints?.length) {
        return <LoadingSkeleton height={280} />;
    }

    const values = dataPoints.map((d) => d.occupancyRate * 100);

    const average =
        values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;

    const sevenAmValues = Object.values(
        dataPoints.reduce<Record<string, DataPoint>>((acc, point) => {
            const date = new Date(point.timestamp);
            const dayKey = date.toISOString().slice(0, 10);

            if (
                date.getHours() >= 7 &&
                (!acc[dayKey] ||
                    new Date(point.timestamp) < new Date(acc[dayKey].timestamp))
            ) {
                acc[dayKey] = point;
            }

            return acc;
        }, {})
    ).map((p) => p.occupancyRate * 100);

    const sevenAmAverage =
        sevenAmValues.length > 0
            ? sevenAmValues.reduce((a, b) => a + b, 0) / sevenAmValues.length
            : 0;

    const option = {
        grid: {
            left: 40,
            right: 20,
            top: 40,
            bottom: 30,
        },

        tooltip: {
            trigger: "axis",
            triggerOn: "mousemove",
            formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
                const p = Array.isArray(params) ? params[0] : params;
                const [x, y] = p.value as [number, number];

                const date = new Date(x);

                const day = date.toLocaleDateString("en-AU", {
                    weekday: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                });

                return `${day}<br/>${Number(y).toFixed(1)}%`;
            },
        },

        dataZoom: [{ type: "inside" }],

        xAxis: {
            type: "time",
            axisLine: {
                lineStyle: { color: tokens.color.border },
            },
            axisLabel: {
                color: tokens.color.textMuted,
                hideOverlap: true,
                formatter: (value: number) => {
                    const date = new Date(value);
                    return date.toLocaleString(["en-AU"], {
                        weekday: "short",
                        day: "2-digit",
                        month: "2-digit",
                    });
                },
            },
        },

        yAxis: {
            type: "value",
            min: (v: { min: number }) => Math.round(Math.min(0, v.min) - 5),
            max: (v: { max: number }) => Math.round(Math.max(100, v.max) + 5),

            axisLine: {
                lineStyle: { color: tokens.color.border },
            },

            axisLabel: {
                color: tokens.color.textMuted,
                formatter: "{value}%",
            },

            splitLine: {
                lineStyle: { color: tokens.color.border },
            },
        },

        series: [
            {
                type: "line",
                showSymbol: false,

                data: dataPoints.map((d) => [
                    d.timestamp,
                    d.occupancyRate * 100,
                ]),

                lineStyle: {
                    width: 2,
                    color: tokens.color.secondary,
                },

                areaStyle: {
                    color: `${tokens.color.secondary}22`,
                },

                markLine: {
                    symbol: "none",
                    lineStyle: {
                        type: "dashed",
                        color: tokens.color.error,
                        opacity: 0.9,
                    },
                    label: { show: false },
                    data: [{ yAxis: 100 }],
                },

                markArea: {
                    itemStyle: {
                        color: `${tokens.color.warning}1A`,
                    },
                    label: {
                        position: "inside",
                        color: tokens.color.warning,
                    },
                    data: [[{ yAxis: 85 }, { yAxis: 100 }]],
                },
            },
        ],
    };

    return (
        <Box>
            {/* HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                    flexWrap: "wrap",
                    gap: 1,
                }}
            >
                <Box>
                    <Typography variant="h6">
                        Historical Occupancy
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Past 7-days
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                        size="small"
                        label={`7AM Avg: ${sevenAmAverage.toFixed(1)}%`}
                    />
                    <Chip
                        size="small"
                        label={`7-day Avg: ${average.toFixed(1)}%`}
                    />
                </Box>
            </Box>

            {/* CHART */}
            <Box sx={{ width: "100%", height: 280 }}>
                <ReactECharts
                    option={option}
                    style={{ width: "100%", height: 280 }}
                    notMerge
                    lazyUpdate
                />
            </Box>
        </Box>
    );
}