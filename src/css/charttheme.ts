import { tokens } from "./tokens";

export const chartTheme = {
    animation: false,

    grid: {
        left: 40,
        right: 20,
        top: 40,
        bottom: 30,
    },

    tooltip: {
        trigger: "axis",
        axisPointer: { type: "line" },
    },

    dataZoom: [
        {
            type: "inside",
            throttle: 50,
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

                const isSameDay =
                    new Date().toDateString() === date.toDateString();

                if (!isSameDay) {
                    return date.toLocaleDateString();
                }

                return date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
        },
    },

    yAxis: {
        min: 0,
        max: 100,
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
} as const;