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
                    <Typography variant="h6">Historical Occupancy</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Past 7-days
                    </Typography>
                </div>

                <div className="chart-chips">
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