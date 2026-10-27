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
  const gridColor = isToday
    ? tokens.color.railBoardGrid
    : tokens.color.railBoardPastGrid;
  const expectedFree = [
    { label: '7 AM free', value: day.expectedFreeAt7am },
    { label: '8 AM free', value: day.expectedFreeAt8am },
  ];
  const milestones = [
    { label: '50% full', value: day.crossed50AtMs },
    { label: '90% full', value: day.crossed90AtMs },
    { label: 'Full', value: day.fullAtMs },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 0,
        borderColor: isToday
          ? tokens.color.railBoardGrid
          : tokens.color.railBoardPastBorder,
        borderRadius: `${tokens.radius.primary}px`,
        overflow: 'hidden',
        backgroundColor: tokens.color.railBoardSurface,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 0.9,
          color: isToday ? accent.heading : tokens.color.textMuted,
          bgcolor: isToday ? accent.background : tokens.color.railBoardPast,
        }}
      >
        {isWeekend && (
          <Chip
            size="small"
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
            color: isToday ? accent.heading : tokens.color.textMuted,
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

      <MilestoneTimeline
        expectedFree={expectedFree}
        milestones={milestones}
        gridColor={gridColor}
      />
    </Paper>
  );
}

function MilestoneTimeline({
  expectedFree,
  milestones,
  gridColor,
}: {
  expectedFree: { label: string; value: number | null }[];
  milestones: { label: string; value: number | null }[];
  gridColor: string;
}) {
  const present = milestones.filter((item) => item.value !== null);

  return (
    <Box sx={{ px: 1.5, py: 1.5, borderTop: `1px solid ${gridColor}` }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 0.75,
          mb: 1.5,
        }}
      >
        {expectedFree.map(({ label, value }) => (
          <Chip
            key={label}
            size="small"
            variant="outlined"
            label={`${label}: ${value ?? '—'} spaces`}
            sx={{ borderColor: gridColor, fontWeight: 600 }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption">12 AM</Typography>
        <Typography variant="caption">6 AM</Typography>
        <Typography variant="caption">12 PM</Typography>
        <Typography variant="caption">6 PM</Typography>
        <Typography variant="caption">12 AM</Typography>
      </Box>
      <Box
        role="img"
        aria-label={`Daily occupancy milestones: ${milestones.map(({ label, value }) => `${label} ${formatMetricTime(value)}`).join(', ')}`}
        sx={{
          position: 'relative',
          height: 16,
          mb: 1.5,
          borderRadius: 99,
          bgcolor: gridColor,
        }}
      >
        {present.map((item) => {
          const left = Math.min(
            100,
            Math.max(0, (sydneyHour(item.value!) / 24) * 100)
          );
          return (
            <Box
              key={item.label}
              title={`${item.label}: ${formatMetricTime(item.value)}`}
              sx={{
                position: 'absolute',
                left: `${left}%`,
                top: -3,
                width: 4,
                height: 22,
                borderRadius: 99,
                bgcolor: milestoneColor(item.label),
                transform: 'translateX(-50%)',
              }}
            />
          );
        })}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 0.75,
        }}
      >
        {milestones.map((item) => (
          <Box key={item.label} sx={{ minWidth: 0, textAlign: 'center' }}>
            <Typography
              variant="caption"
              noWrap
              sx={{
                display: 'block',
                fontWeight: 700,
                color: milestoneColor(item.label),
              }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
            >
              {formatMetricTime(item.value)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function milestoneColor(label: string) {
  if (label === '50% full') return tokens.color.success;
  if (label === '90% full') return tokens.color.warning;
  return tokens.color.error;
}

function sydneyHour(timeMs: number) {
  const parts = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(timeMs);
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0);
  const minute = Number(
    parts.find((part) => part.type === 'minute')?.value ?? 0
  );
  return hour + minute / 60;
}

function formatMetricTime(timeMs: number | null) {
  return timeMs === null
    ? '\u2014'
    : formatSydneyTime(timeMs, { hour: 'numeric', minute: '2-digit' });
}
