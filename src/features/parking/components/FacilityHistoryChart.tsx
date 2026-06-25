import ReactECharts from "echarts-for-react";
import { Typography, Chip } from "@mui/material";
import type { DataPoint } from "../services/parking";
import { LoadingSkeleton } from "./LoadingSkeleton";
import {chartTheme} from "../../../css/chartTheme.ts";

interface Props {
    dataPoints: DataPoint[];
}

export function FacilityHistoryChart({ dataPoints }: Props) {
    if (!dataPoints?.length) {
        return <LoadingSkeleton height={280} />;
    }

    const values = dataPoints.map((d) => d.occupancyRate * 100);

    const current = values.at(-1) ?? 0;

    const average = values.reduce((a, b) => a + b, 0) / values.length;

    const option = {
        ...chartTheme,

        series: [
            {
                ...chartTheme.series,
                data: dataPoints.map((d) => [
                    d.timestamp,
                    d.occupancyRate * 100,
                ]),
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
                    <Chip label={`Current: ${current.toFixed(1)}%`} size="small" />
                    <Chip label={`Average: ${average.toFixed(1)}%`} size="small" />
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