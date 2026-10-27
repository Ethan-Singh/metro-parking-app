import { Box, Chip, Paper, Typography } from '@mui/material';
import Weekend from '@mui/icons-material/Weekend';
import LocalParkingOutlined from '@mui/icons-material/LocalParkingOutlined';
import type { DailyParkingMetric, DailyParkingMetrics } from '../types.ts';
import { formatSydneyTime, sydneyDate } from '../utils/sydneyTime.ts';
import { tokens } from '../../../css/tokens.ts';
import { getFacilityAccent } from '../utils/facilityAccent.ts';

interface Props {
  metrics?: DailyParkingMetrics;
  facilitySlug?: string;
  isLoading?: boolean;
  isError?: boolean;
}

export function DailyCommuterMetrics({
  metrics,
  facilitySlug,
  isLoading = false,
  isError = false,
}: Props) {
  const days = metrics?.days.slice(-3).reverse() ?? [];
  const today = sydneyDate();
  const periodLabel =
    metrics?.from === metrics?.to ? 'Most recent day' : 'Most recent 3 days';
  const accent = getFacilityAccent(facilitySlug);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          p: 1.5,
          mb: 1.5,
          borderRadius: `${tokens.radius.primary}px`,
          color: 'common.white',
          bgcolor: accent.background,
        }}
      >
        <LocalParkingOutlined
          aria-hidden="true"
          sx={{ color: accent.icon, fontSize: 34, flex: '0 0 auto' }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: accent.heading, fontWeight: 700, lineHeight: 1.2 }}
          >
            Daily commuter metrics
          </Typography>
          <Typography variant="body2" sx={{ color: accent.heading }}>
            {periodLabel}
          </Typography>
        </Box>
      </Box>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">
          Loading commuter metrics...
        </Typography>
      ) : isError ? (
        <Typography variant="body2" color="text.secondary">
          Could not load commuter metrics.
        </Typography>
      ) : days.length ? (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {days.map((day) => (
            <DailyMetricsDay
              key={day.date}
              day={day}
              isToday={day.date === today}
              accent={accent}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No commuter metrics are available for these days yet.
        </Typography>
      )}
    </Box>
  );
}

function DailyMetricsDay({
  day,
  isToday,
  accent,
}: {
  day: DailyParkingMetric;
  isToday: boolean;
  accent: ReturnType<typeof getFacilityAccent>;
}) {
  const dateMs = Date.parse(`${day.date}T12:00:00Z`);
  const isWeekend = [0, 6].includes(new Date(dateMs).getUTCDay());

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderColor: tokens.color.railBoardGrid,
        borderRadius: `${tokens.radius.primary}px`,
        overflow: 'hidden',
        backgroundColor: tokens.color.railBoardSurface,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1,
          px: 1.5,
          py: 0.9,
          mb: 0,
          color: 'common.white',
          bgcolor: isToday ? accent.background : tokens.color.railBoardMuted,
        }}
      >
        {isWeekend && (
          <Chip
            size="small"
            color="primary"
            icon={<Weekend sx={{ fontSize: 16 }} />}
            aria-label="Weekend"
            title="Weekend"
            sx={{
              width: 22,
              height: 22,
              bgcolor: 'common.white',
              '& .MuiChip-icon': {
                color: accent.background,
                ml: 0,
                mr: 0,
              },
              '& .MuiChip-label': { display: 'none' },
            }}
          />
        )}
        {isToday && (
          <Chip
            size="small"
            label="Today"
            sx={{
              height: 22,
              bgcolor: 'common.white',
              color: accent.background,
              fontWeight: 700,
              '& .MuiChip-label': { px: 1 },
            }}
          />
        )}
        <Typography
          variant="subtitle2"
          sx={{
            color: 'common.white',
            fontWeight: 700,
          }}
        >
          {formatSydneyTime(dateMs, {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(5, minmax(0, 1fr))',
          },
          gap: 0,
          borderTop: `1px solid ${tokens.color.railBoardGrid}`,
          '& > :last-child:nth-of-type(odd)': {
            gridColumn: { xs: '1 / -1', sm: 'auto' },
          },
        }}
      >
        <MetricValue
          label="7 AM free"
          value={day.expectedFreeAt7am ?? '\u2014'}
          accent={accent.background}
        />
        <MetricValue
          label="8 AM free"
          value={day.expectedFreeAt8am ?? '\u2014'}
          accent={accent.background}
        />
        <MetricValue
          label="50% full"
          value={formatMetricTime(day.crossed50AtMs)}
          accent={accent.background}
        />
        <MetricValue
          label="90% full"
          value={formatMetricTime(day.crossed90AtMs)}
          accent={accent.background}
        />
        <MetricValue
          label="Full by"
          value={formatMetricTime(day.fullAtMs)}
          accent={accent.background}
        />
      </Box>
    </Paper>
  );
}

function formatMetricTime(timeMs: number | null) {
  return timeMs === null
    ? '\u2014'
    : formatSydneyTime(timeMs, { hour: 'numeric', minute: '2-digit' });
}

function MetricValue({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: 1,
        py: 1,
        minHeight: 64,
        borderRight: `1px solid ${tokens.color.railBoardGrid}`,
        borderBottom: `1px solid ${tokens.color.railBoardGrid}`,
        bgcolor: 'common.white',
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        noWrap
        sx={{ display: 'block', fontWeight: 600 }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: accent,
          fontWeight: 700,
          fontSize: '1.05rem',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
