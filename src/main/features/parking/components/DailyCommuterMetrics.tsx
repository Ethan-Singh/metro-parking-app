import { Box, Paper, Typography } from '@mui/material';
import type { ParkingHistory } from '../types.ts';
import { buildDailyHistoryMetrics } from '../utils/historySummary.ts';
import { formatSydneyTime } from '../utils/sydneyTime.ts';
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
  const periodLabel = history?.from === history?.to ? 'most recent day' : 'most recent 3 days';

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 0.5 }}>Daily commuter metrics</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        10-minute observations · Sydney time · {periodLabel}
      </Typography>
      {isLoading ? (
        <Typography variant="body2" color="text.secondary">Loading commuter metrics…</Typography>
      ) : isError ? (
        <Typography variant="body2" color="text.secondary">Could not load commuter metrics.</Typography>
      ) : days.length ? (
        <Box sx={{ display: 'grid', gap: 1 }}>
          {days.map((day) => (
            <Paper
              key={day.date}
              variant="outlined"
              sx={{
                p: 1.5,
                borderColor: 'rgba(217, 119, 6, 0.2)',
                borderRadius: `${tokens.radius.primary}px`,
                background: 'linear-gradient(125deg, rgba(255, 243, 237, 0.95), rgba(255, 255, 255, 0.94) 58%, rgba(255, 224, 190, 0.4))',
              }}
            >
              <Typography variant="subtitle2" sx={{ color: 'warning.dark', fontWeight: 700, mb: 0.75 }}>
                {formatSydneyTime(Date.parse(`${day.date}T12:00:00Z`), { weekday: 'short', day: 'numeric', month: 'short' })}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(5, minmax(0, 1fr))' }, gap: 1 }}>
                <MetricValue label="7 AM free" value={day.expectedFreeAt7am ?? '—'} />
                <MetricValue label="8 AM free" value={day.expectedFreeAt8am ?? '—'} />
                <MetricValue label="50% full" value={formatMetricTime(day.crossed50AtMs)} />
                <MetricValue label="90% full" value={formatMetricTime(day.crossed90AtMs)} />
                <MetricValue label="Full by" value={formatMetricTime(day.fullAtMs)} />
              </Box>
            </Paper>
          ))}
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

function formatMetricTime(timeMs: number | null) {
  return timeMs === null ? '—' : formatSydneyTime(timeMs, { hour: 'numeric', minute: '2-digit' });
}

function MetricValue({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ minWidth: 0, px: 1, py: 0.75, borderRadius: `${tokens.radius.primary * tokens.radius.secondary}px`, bgcolor: 'rgba(255,255,255,0.68)' }}>
      <Typography variant="caption" color="text.secondary" noWrap>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{value}</Typography>
    </Box>
  );
}
