import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Button,
  Collapse,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AccessTime from '@mui/icons-material/AccessTime';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Suspense, useState } from 'react';
import { tokens } from '../../../css/tokens.ts';
import type { LiveCarPark } from '../types.ts';
import { LineBadge } from './LineBadge.tsx';
import { getAvailability } from '../utils/availability.ts';
import { formatSydneyTime } from '../utils/sydneyTime.ts';
import {
  useFacilityDailyMetrics,
  useFacilityRecentHistory,
} from '../api/useParkingQueries.ts';
import { DailyCommuterMetrics } from './DailyCommuterMetrics.tsx';
import { LazyECharts } from './LazyECharts.ts';
import { summarizeOccupancyHistory } from '../utils/chartSummary.ts';
import { getFacilityAccent } from '../utils/facilityAccent.ts';

export function FacilityCard({
  facility,
  title = facility.facilityName,
}: {
  facility: LiveCarPark;
  title?: string;
}) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const preview = useFacilityRecentHistory(facility.slug, 1, quickViewOpen);
  const commuterMetrics = useFacilityDailyMetrics(
    facility.slug,
    1,
    quickViewOpen
  );
  const percent = Math.round(facility.occupancyRate * 100);
  const occupancyColor =
    percent <= 50
      ? tokens.color.success
      : percent <= 80
        ? tokens.color.warning
        : tokens.color.error;

  const availability = getAvailability(facility.availability);

  const color = availability?.color ?? tokens.color.success;
  const Icon = availability?.icon;

  return (
    <Card
      data-testid="facility-card"
      sx={{ minHeight: 180, display: 'flex', flexDirection: 'column' }}
    >
      <CardActionArea
        component={RouterLink}
        to={`/facility/${encodeURIComponent(facility.slug)}`}
        aria-label={facility.ariaLabel || facility.facilityName}
        sx={{
          flex: 1,
          alignItems: 'stretch',
          '& .MuiCardActionArea-focusHighlight': { borderRadius: 2 },
        }}
      >
        <CardContent sx={{ pt: 1.5, pb: 0.5, '&:last-child': { pb: 0.5 } }}>
          {/* HEADER */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ flex: 1 }}>
              {title}
            </Typography>

            <LineBadge slug={facility.slug} />
          </Box>

          {/* STATS */}
          <Box sx={{ mt: 1.5 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: occupancyColor }}
            >
              {facility.occupancy} / {facility.spots} ({percent}%)
            </Typography>

            <Box
              role="progressbar"
              aria-label={`${title} occupancy`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.max(0, Math.min(100, percent))}
              aria-valuetext={`${facility.occupancy} of ${facility.spots} spaces occupied (${percent}% full)`}
              sx={{
                mt: 1,
                height: 6,
                borderRadius: 999,
                backgroundColor: tokens.color.border,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  width: `${percent}%`,
                  backgroundColor: color,
                  transition: 'width 0.3s ease',
                }}
              />
            </Box>
          </Box>

          {/* FOOTER */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mt: 1.5,
              flexWrap: 'wrap',
            }}
          >
            <AccessTime
              aria-hidden="true"
              style={{
                fontSize: 14,
                color: tokens.color.textMuted,
              }}
            />

            <Typography
              variant="caption"
              sx={{ color: tokens.color.textMuted }}
            >
              Updated{' '}
              {formatSydneyTime(facility.timeMs, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Typography>

            <Box
              aria-hidden="true"
              sx={{ mx: 0.5, color: tokens.color.textMuted }}
            >
              ·
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {Icon && (
                <Icon
                  aria-hidden="true"
                  style={{
                    fontSize: 14,
                    color: color,
                  }}
                />
              )}

              <Typography
                variant="caption"
                sx={{ color: tokens.color.textMuted }}
              >
                {facility.availability}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <Button
        aria-expanded={quickViewOpen}
        aria-controls={`quick-view-${facility.slug}`}
        onClick={() => setQuickViewOpen((open) => !open)}
        endIcon={
          <ExpandMore
            sx={{
              transform: quickViewOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 180ms ease',
            }}
          />
        }
        sx={{
          justifyContent: 'space-between',
          mx: 1,
          mb: 0.25,
          px: 1.5,
          py: 0.5,
          minHeight: 36,
          textTransform: 'none',
          color: 'text.secondary',
        }}
      >
        Quick view
      </Button>
      <Collapse in={quickViewOpen} timeout="auto" unmountOnExit>
        <Box id={`quick-view-${facility.slug}`} sx={{ px: 2, pb: 2 }}>
          <DailyCommuterMetrics
            metrics={commuterMetrics.data}
            facilitySlug={facility.slug}
            isLoading={commuterMetrics.isLoading}
            isError={commuterMetrics.isError}
          />
          <Typography variant="caption" color="text.secondary">
            Today&apos;s occupancy | 10-minute detail
          </Typography>
          {preview.isLoading ? (
            <Box sx={{ height: 180, display: 'grid', placeItems: 'center' }}>
              <CircularProgress size={24} aria-label="Loading quick view" />
            </Box>
          ) : preview.data?.points.length ? (
            <>
              <Typography
                id={`quick-view-summary-${facility.slug}`}
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
                {summarizeOccupancyHistory(preview.data.points)}
              </Typography>
              <Suspense
                fallback={
                  <Skeleton variant="rounded" width="100%" height={180} />
                }
              >
                <LazyECharts
                  option={buildQuickViewOption(
                    preview.data.points,
                    facility.slug
                  )}
                  role="img"
                  aria-describedby={`quick-view-summary-${facility.slug}`}
                  style={{ height: 180, width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                  notMerge
                  lazyUpdate
                  autoResize
                  aria-label={`${facility.facilityName} today's occupancy quick view`}
                />
              </Suspense>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
              {preview.isError
                ? 'Could not load the occupancy preview.'
                : 'No 10-minute occupancy samples are available for these days yet.'}
            </Typography>
          )}
        </Box>
      </Collapse>
    </Card>
  );
}

function buildQuickViewOption(
  points: [number, number, number][],
  facilitySlug: string
) {
  const lineColor = getFacilityAccent(facilitySlug).background;
  return {
    grid: { left: 36, right: 8, top: 12, bottom: 26, containLabel: true },
    tooltip: {
      trigger: 'axis',
      formatter: (params: { value: [number, number] }[]) => {
        const [timeMs, percent] = params[0].value;
        return `${formatSydneyTime(timeMs, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}<br/>${percent.toFixed(1)}% occupied`;
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        color: tokens.color.textMuted,
        hideOverlap: true,
        formatter: (value: number) =>
          `${formatSydneyTime(value, { weekday: 'short' })}\n${formatSydneyTime(value, { hour: 'numeric' })}`,
      },
      axisLine: { lineStyle: { color: tokens.color.border } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 105,
      axisLabel: { color: tokens.color.textMuted, formatter: '{value}%' },
      splitLine: { lineStyle: { color: tokens.color.border } },
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        data: points.map(([timeMs, rate]) => [timeMs, rate * 100]),
        lineStyle: { width: 2, color: lineColor },
        areaStyle: { color: `${lineColor}22` },
      },
    ],
  };
}
