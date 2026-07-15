import ReactECharts from 'echarts-for-react';
import { Typography, Chip, Box } from '@mui/material';
import type { DataPoint } from '../types.ts';
import { LoadingSkeleton } from './LoadingSkeleton';
import { tokens } from '../../../css/tokens.ts';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { useMemo } from 'react';
import { buildHistorySummary } from '../utils/historySummary';

interface Props {
  dataPoints: DataPoint[];
}

export function FacilityHistoryChart({ dataPoints }: Props) {
  const summary = useMemo(() => {
    const safeData = dataPoints ?? [];
    return buildHistorySummary(safeData);
  }, [dataPoints]);

  if (!dataPoints) {
    return <LoadingSkeleton height={280} />;
  }

  if (dataPoints.length === 0) {
    return (
      <Box
        sx={{
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No historical data available
        </Typography>
      </Box>
    );
  }

  const seriesData = dataPoints.map((d) => [
    d.timestamp,
    d.occupancyRate * 100,
  ]);

  const option = {
    grid: {
      left: 40,
      right: 20,
      top: 40,
      bottom: 30,
    },

    tooltip: {
      trigger: 'axis',
      triggerOn: 'mousemove',
      formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
        const p = Array.isArray(params) ? params[0] : params;
        const [x, y] = p.value as [number, number];

        const date = new Date(x);

        return `${date.toLocaleDateString('en-AU', {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}<br/>${Number(y).toFixed(1)}%`;
      },
    },

    dataZoom: [{ type: 'inside' }],

    xAxis: {
      type: 'time',
      axisLine: {
        lineStyle: { color: tokens.color.border },
      },
      axisLabel: {
        color: tokens.color.textMuted,
        hideOverlap: true,
        formatter: (value: number) =>
          new Date(value).toLocaleDateString('en-AU', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
          }),
      },
    },

    yAxis: {
      type: 'value',
      min: (v: { min: number }) => Math.round(Math.min(0, v.min) - 5),
      max: (v: { max: number }) => Math.round(Math.max(100, v.max) + 5),

      axisLine: {
        lineStyle: { color: tokens.color.border },
      },

      axisLabel: {
        color: tokens.color.textMuted,
        formatter: '{value}%',
      },

      splitLine: {
        lineStyle: { color: tokens.color.border },
      },
    },

    series: [
      {
        type: 'line',
        showSymbol: false,
        data: seriesData,

        lineStyle: {
          width: 2,
          color: tokens.color.primary, // #47A9FF
        },

        areaStyle: {
          color: `${tokens.color.primary}22`, // Transparent blue
        },

        markLine: {
          symbol: 'none',
          lineStyle: {
            type: 'dashed',
            color: tokens.color.error,
            opacity: 0.9,
          },
          label: { show: false },
          data: [{ yAxis: 100 }],
        },

        markArea: {
          itemStyle: {
            color: `${tokens.color.warning}1A`, // #FF9447 with transparency
          },
          label: {
            position: 'inside',
            color: tokens.color.warning,
          },
          data: [[{ yAxis: 85 }, { yAxis: 100 }]],
        },
      },
    ],
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h6">Historical Occupancy</Typography>
          <Typography variant="body2" color="text.secondary">
            Past 7 days
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            label={`7 am: ${summary.availableAt7am ?? '-'} available`}
          />
          <Chip
            size="small"
            label={`8 am: ${summary.availableAt8am ?? '-'} available`}
          />
          <Chip
            size="small"
            label={`50% full: ${
              summary.halfFullTime
                ? summary.halfFullTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '-'
            }`}
          />
          <Chip
            size="small"
            label={`75% full: ${
              summary.threeQuarterFullTime
                ? summary.threeQuarterFullTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '-'
            }`}
          />
          <Chip
            size="small"
            label={`90% full: ${
              summary.ninetyPercentTime
                ? summary.ninetyPercentTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })
                : '-'
            }`}
          />
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 280 }}>
        <ReactECharts
          option={option}
          style={{ width: '100%', height: 280 }}
          notMerge
          lazyUpdate
        />
      </Box>
    </Box>
  );
}
