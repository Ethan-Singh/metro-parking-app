import { Suspense } from 'react';
import {
  Typography,
  Chip,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
} from '@mui/material';
import type {
  HistoryRangeDays,
  ParkingHistory,
  RequestedHistoryResolution,
} from '../types.ts';
import { LoadingSkeleton } from './LoadingSkeleton.tsx';
import { tokens } from '../../../css/tokens.ts';
import type { CallbackDataParams } from 'echarts/types/dist/shared';
import { formatSydneyTime } from '../utils/sydneyTime.ts';
import {
  supportedHistoryResolutionOrFallback,
  supportsHistoryResolution,
} from '../utils/historyResolution.ts';
import { LazyECharts } from './LazyECharts.ts';
import { summarizeOccupancyHistory } from '../utils/chartSummary.ts';
import { getFacilityAccent } from '../utils/facilityAccent.ts';

interface Props {
  history?: ParkingHistory;
  facilitySlug?: string;
  rangeDays: HistoryRangeDays;
  resolution: RequestedHistoryResolution;
  onRangeDaysChange: (days: HistoryRangeDays) => void;
  onResolutionChange: (resolution: RequestedHistoryResolution) => void;
}

const resolutionLabel: Record<RequestedHistoryResolution, string> = {
  AUTO: 'Auto',
  TEN_MINUTE: '10 min',
  ONE_HOUR: '1 hour',
  SIX_HOUR: '6 hours',
  TWELVE_HOUR: '12 hours',
  TWENTY_FOUR_HOUR: '24 hours',
};

export function FacilityHistoryChart({
  history,
  facilitySlug,
  rangeDays,
  resolution,
  onRangeDaysChange,
  onResolutionChange,
}: Props) {
  const points = history?.points ?? [];
  const lineColor = getFacilityAccent(facilitySlug).background;

  if (!history) return <LoadingSkeleton height={300} />;

  if (points.length === 0) {
    return (
      <Box sx={{ minHeight: 280, display: 'grid', placeItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No historical data available
        </Typography>
      </Box>
    );
  }

  const seriesData = points.map(([timeMs, rate]) => [timeMs, rate * 100]);
  const maxRate = Math.max(100, ...points.map(([, rate]) => rate * 100));

  const option = {
    grid: {
      left: 38,
      right: 12,
      top: 18,
      bottom: history.from === history.to ? 34 : 48,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: CallbackDataParams | CallbackDataParams[]) => {
        const p = Array.isArray(params) ? params[0] : params;
        const [x, y] = p.value as [number, number];
        return `${formatSydneyTime(x, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}<br/>${Number(y).toFixed(1)}% occupied`;
      },
    },
    dataZoom: [
      {
        type: 'inside',
        zoomOnMouseWheel: false,
        moveOnMouseMove: false,
        moveOnMouseWheel: true,
      },
    ],
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: tokens.color.border } },
      axisLabel: {
        color: tokens.color.textMuted,
        hideOverlap: true,
        hideOverlapMinSpan: 35,
        formatter: (value: number) =>
          history.from === history.to
            ? formatSydneyTime(value, { hour: 'numeric' })
            : `${formatSydneyTime(value, { weekday: 'short' })}\n${formatSydneyTime(value, { hour: 'numeric' })}`,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: Math.ceil(maxRate / 10) * 10 + 5,
      axisLine: { lineStyle: { color: tokens.color.border } },
      axisLabel: { color: tokens.color.textMuted, formatter: '{value}%' },
      splitLine: { lineStyle: { color: tokens.color.border } },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: seriesData,
        lineStyle: { width: 2, color: lineColor },
        areaStyle: { color: `${lineColor}22` },
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
          itemStyle: { color: `${tokens.color.warning}1A` },
          label: { show: false },
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
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Box>
          <Typography variant="h6">Historical Occupancy</Typography>
          <Typography variant="body2" color="text.secondary">
            {history.from} – {history.to} · Sydney time
          </Typography>
        </Box>
        <Chip
          size="small"
          color="secondary"
          variant="outlined"
          label={`Each point: ${resolutionLabel[history.resolution]}`}
        />
      </Box>

      <Stack spacing={1.25} sx={{ mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ minWidth: 48 }}
          >
            Period
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={rangeDays}
            aria-label="History period"
            onChange={(_, value: HistoryRangeDays | null) => {
              if (!value) return;
              onRangeDaysChange(value);
              onResolutionChange(
                supportedHistoryResolutionOrFallback(value, resolution)
              );
            }}
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.5,
                py: 0.5,
                textTransform: 'none',
              },
            }}
          >
            {([1, 7, 14, 31] as const).map((days) => (
              <ToggleButton
                key={days}
                value={days}
                aria-label={`Past ${days} ${days === 1 ? 'day' : 'days'}`}
              >
                {days === 1 ? '1D' : `${days}D`}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            minWidth: 0,
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ minWidth: 48 }}
          >
            Interval
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={resolution}
            aria-label="History point interval"
            onChange={(_, value: RequestedHistoryResolution | null) =>
              value && onResolutionChange(value)
            }
            sx={{
              maxWidth: '100%',
              overflowX: 'auto',
              '& .MuiToggleButton-root': {
                px: 1.25,
                py: 0.5,
                textTransform: 'none',
                whiteSpace: 'nowrap',
              },
            }}
          >
            {(
              [
                'AUTO',
                'TEN_MINUTE',
                'ONE_HOUR',
                'SIX_HOUR',
                'TWELVE_HOUR',
                'TWENTY_FOUR_HOUR',
              ] as const
            ).map((value) => (
              <ToggleButton
                key={value}
                value={value}
                disabled={!supportsHistoryResolution(rangeDays, value)}
                aria-label={`${resolutionLabel[value]} interval`}
              >
                {resolutionLabel[value]}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Stack>

      <Box sx={{ width: '100%', height: { xs: 280, sm: 320 }, minWidth: 0 }}>
        <Typography
          id="history-chart-summary"
          sx={{
            position: 'absolute',
            width: 1,
            height: 1,
            p: 0,
            m: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        >
          {summarizeOccupancyHistory(points)}
        </Typography>
        <Suspense
          fallback={<Skeleton variant="rounded" width="100%" height="100%" />}
        >
          <LazyECharts
            option={option}
            role="img"
            aria-describedby="history-chart-summary"
            style={{ width: '100%', height: '100%' }}
            opts={{ renderer: 'canvas' }}
            notMerge
            lazyUpdate
            autoResize
            aria-label="Historical parking occupancy chart"
          />
        </Suspense>
      </Box>
    </Box>
  );
}
