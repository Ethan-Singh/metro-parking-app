import { tokens } from "./tokens";

export const chartTheme = {
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

    xAxis: {
        type: "category",
        axisLine: {
            lineStyle: { color: tokens.color.border },
        },
        axisLabel: {
            color: tokens.color.textMuted,
        },
    },

    yAxis: {
        type: "value",
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