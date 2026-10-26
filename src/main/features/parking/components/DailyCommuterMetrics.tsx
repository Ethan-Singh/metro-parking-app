import { Box, Chip, Paper, Typography } from '@mui/material';
import Weekend from '@mui/icons-material/Weekend';
import type { ParkingHistory } from '../types.ts';
import { buildDailyHistoryMetrics, type DailyHistoryMetrics } from '../utils/historySummary.ts';
import { formatSydneyTime, sydneyDate } from '../utils/sydneyTime.ts';
import { tokens } from '../../../css/tokens.ts';

interface Props {
  history?: ParkingHistory;
  isLoading?: boolean;
  isError?: boolean;
}

export function DailyCommuterMetrics({ history, isLoading = false, isError = false }: Props) {
  const days = history?.resolution === 'TEN_MINUTE'
    ? buildDailyHistoryMetrics(history.points, history.from, history.to).slice(-3).reverse()
    : [];
  const today = sydneyDate();
  const periodLabel = history?.from === history?.to ? 'Most recent day' : 'Most recent 3 days';

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Daily commuter metrics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {periodLabel}
      </Typography>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">Loading commuter metrics...</Typography>
      ) : isError ? (
        <Typography variant="body2" color="text.secondary">Could not load commuter metrics.</Typography>
      ) : days.length ? (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {days.map((day) => <DailyMetricsDay key={day.date} day={day} isToday={day.date === today} />)}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {history && history.resolution !== 'TEN_MINUTE'
            ? `The API returned ${history.resolution.replaceAll('_', ' ').toLowerCase()} samples; exact commuter metrics need 10-minute data.`
            : 'No 10-minute commuter samples are available for these days yet.'}
        </Typography>
      )}
    </Box>
  );
}

function DailyMetricsDay({ day, isToday }: { day: DailyHistoryMetrics; isToday: boolean }) {
  const dateMs = Date.parse(`${day.date}T12:00:00Z`);
  const isWeekend = [0, 6].includes(new Date(dateMs).getUTCDay());

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        borderColor: !isToday
          ? tokens.color.primaryBorderSubtle
          : isWeekend
            ? tokens.color.primaryBorderStrong
            : tokens.color.primaryBorder,
        borderRadius: `${tokens.radius.primary}px`,
        background: !isToday
          ? tokens.gradient.commuterMetricsPast
          : isWeekend
            ? tokens.gradient.commuterMetricsWeekend
            : tokens.gradient.commuterMetrics,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1, mb: 0.75 }}>
        {isWeekend && (
          <Chip
            size="small"
            color="primary"
            icon={<Weekend sx={{ fontSize: 16 }} />}
            aria-label="Weekend"
            title="Weekend"
            sx={{
              width: 24,
              height: 24,
              '& .MuiChip-icon': { color: 'common.white', ml: 0, mr: 0 },
              '& .MuiChip-label': { display: 'none' },
            }}
          />
        )}
        <Typography variant="subtitle2" sx={{ color: isToday ? tokens.color.primary : 'text.secondary', fontWeight: 700 }}>
          {formatSydneyTime(dateMs, { weekday: 'short', day: 'numeric', month: 'short' })}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(5, minmax(0, 1fr))' }, gap: 1 }}>
        <MetricValue label="7 AM free" value={day.expectedFreeAt7am ?? '\u2014'} />
        <MetricValue label="8 AM free" value={day.expectedFreeAt8am ?? '\u2014'} />
        <MetricValue label="50% full" value={formatMetricTime(day.crossed50AtMs)} />
        <MetricValue label="90% full" value={formatMetricTime(day.crossed90AtMs)} />
        <MetricValue label="Full by" value={formatMetricTime(day.fullAtMs)} />
      </Box>
    </Paper>
  );
}

function formatMetricTime(timeMs: number | null) {
  return timeMs === null ? '\u2014' : formatSydneyTime(timeMs, { hour: 'numeric', minute: '2-digit' });
}

function MetricValue({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ minWidth: 0, px: 1, py: 0.75, borderRadius: `${tokens.radius.primary * tokens.radius.secondary}px`, bgcolor: tokens.color.surfaceRaised }}>
      <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</Typography>
    </Box>
  );
}
