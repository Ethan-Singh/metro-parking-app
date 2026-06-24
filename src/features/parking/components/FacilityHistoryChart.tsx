import ReactECharts from "echarts-for-react";
import { Typography, Chip } from "@mui/material";
import type { DataPoint } from "../services/parking";
import { tokens } from "../../../css/tokens";
import { LoadingSkeleton } from "./LoadingSkeleton";
import {chartTheme} from "../../../css/charttheme.ts";

interface Props {
    dataPoints: DataPoint[];
}

export function FacilityHistoryChart({ dataPoints }: Props) {
    if (!dataPoints?.length) {
        return <LoadingSkeleton height={280} />;
    }

    const values = dataPoints.map((d) => d.occupancyRate * 100);

    const current = values.at(-1) ?? 0;

    const avg =
        values.reduce((a, b) => a + b, 0) / values.length;

    const option = {
        ...chartTheme,

        tooltip: {
            ...chartTheme.tooltip,
            valueFormatter: (v: number) => `${v.toFixed(1)}%`,
        },

        series: [
            {
                type: "line",
                data: dataPoints.map((d) => [
                    d.timestamp,
                    d.occupancyRate * 100,
                ]),
                showSymbol: false,
                smooth: true,
                lineStyle: {
                    width: 2,
                    color: tokens.color.secondary,
                },
                areaStyle: {
                    color: `${tokens.color.secondary}22`,
                },
            },
        ],
    };

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
                    <Chip
                        label={`Current: ${current.toFixed(1)}%`}
                        size="small"
                    />
                    <Chip
                        label={`Avg: ${avg.toFixed(1)}%`}
                        size="small"
                    />
                </div>
            </div>

            <div className="chart-container">
                <ReactECharts
                    option={option}
                    style={{ width: "100%", height: 280 }}
                    notMerge
                    lazyUpdate
                />
            </div>
        </div>
    );
}