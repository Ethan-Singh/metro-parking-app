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

    const average =
        values.length > 0
            ? values.reduce((a, b) => a + b, 0) / values.length
            : 0;

    const sevenAmValues = Object.values(
        dataPoints.reduce<Record<string, DataPoint>>((acc, point) => {
            const date = new Date(point.timestamp);

            const dayKey = date.toISOString().slice(0, 10);

            // First point at or after 07:00 for this day
            if (
                date.getHours() >= 7 &&
                (!acc[dayKey] ||
                    new Date(point.timestamp) <
                    new Date(acc[dayKey].timestamp))
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
                    <Typography variant="h6">Historical Occupancy</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Past 7-days
                    </Typography>
                </div>

                <div className="chart-chips">
                    <Chip label={`7AM Average: ${sevenAmAverage.toFixed(1)}%`} size="small" />
                    <Chip label={`7-day Average: ${average.toFixed(1)}%`} size="small" />
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