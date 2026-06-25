import { tokens } from "./tokens";
import type {CallbackDataParams} from "echarts/types/dist/shared";

export const chartTheme = {
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

    dataZoom: [
        {
            type: "inside",
        },
    ],

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

    series: {
        type: "line",
        showSymbol: false,

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
            label: {
                show: false,
            },
            data: [{ yAxis: 100 }],
        },

        markArea: {
            itemStyle: {
                color: `${tokens.color.warning}1A`,
            },
            label: {
                position: "inside",
                color: tokens.color.warning,
                formatter: "ALMOST FULL",
            },
            data: [[{ yAxis: 85 }, { yAxis: 100 }]],
        },
    },
} as const;