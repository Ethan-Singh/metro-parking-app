import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { FacilityHistoryChart } from '../components/FacilityHistoryChart.tsx';
import { DailyCommuterMetrics } from '../components/DailyCommuterMetrics.tsx';
import { DataCredits } from '../components/DataCredits.tsx';
import {
  useFacilityHistory,
  useFacilityLive,
  useFacilityDailyMetrics,
} from '../api/useParkingQueries.ts';
import { QueryBoundary } from '../components/QueryBoundary.tsx';
import type { FacilitySlug } from '../types.ts';
import type { HistoryRangeDays, RequestedHistoryResolution } from '../types.ts';
import { useState } from 'react';
import { PageMetadata } from '../../../app/PageMetadata.tsx';
import { tokens } from '../../../css/tokens.ts';

function occupancyColor(percent: number) {
  if (percent <= 50) return tokens.color.success;
  if (percent <= 80) return tokens.color.warning;
  return tokens.color.error;
}

function availabilityColor(available: number, spaces: number) {
  const percentAvailable = spaces > 0 ? (available / spaces) * 100 : 0;
  if (percentAvailable >= 50) return tokens.color.success;
  if (percentAvailable >= 20) return tokens.color.warning;
  return tokens.color.error;
}

export default function FacilityPage() {
  const navigate = useNavigate();

  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [rangeDays, setRangeDays] = useState<HistoryRangeDays>(1);
  const [resolution, setResolution] =
    useState<RequestedHistoryResolution>('TEN_MINUTE');

  const safeSlug = slug as FacilitySlug | undefined;

  const live = useFacilityLive(safeSlug);
  const history = useFacilityHistory(safeSlug, rangeDays, resolution);
  const commuterMetrics = useFacilityDailyMetrics(safeSlug, 3, Boolean(slug));

  if (!slug) {
    return <Alert severity="error">Missing facility slug</Alert>;
  }

  const f = live.data;
  const percent = f ? Math.round(f.occupancyRate * 100) : 0;
  const occupancyValueColor = occupancyColor(percent);
  const availableValueColor = availabilityColor(
    f?.available ?? 0,
    f?.spots ?? 0
  );
  const facilityName = f?.facilityName ?? 'Parking facility';

  return (
    <Stack spacing={3}>
      <PageMetadata
        title={`${facilityName} Availability | A Metro Parking App`}
        description={`Check live parking availability, daily commuter metrics, and historical occupancy for ${facilityName} in Sydney.`}
        path={`/facility/${encodeURIComponent(slug)}`}
      />
      {/* HEADER */}
      <QueryBoundary
        isLoading={live.isLoading}
        isError={live.isError}
        loading={<Skeleton height={60} />}
      >
        <Box sx={{ mb: 1 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/')}
            sx={{ textTransform: 'none', mb: 2 }}
          >
            Back
          </Button>

          <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
            {f?.facilityName}
          </Typography>
        </Box>
      </QueryBoundary>

      {/* DATA CREDITS */}
      <QueryBoundary isLoading={live.isLoading} isError={live.isError}>
        <DataCredits lastUpdated={f?.timeMs} isLoading={live.isLoading} />
      </QueryBoundary>

      {/* METRICS */}
      <QueryBoundary
        isLoading={live.isLoading}
        isError={live.isError}
        loading={<Skeleton height={120} />}
      >
        <Card data-testid="parking-metrics">
          <CardContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: 3,
              }}
            >
              {/* OCCUPANCY */}
              <Box data-testid="metric-occupancy">
                <Typography variant="caption" color="text.secondary">
                  Current Occupancy
                </Typography>
                <Typography
                  data-testid="metric-occupancy-value"
                  variant="h4"
                  sx={{ fontWeight: 700, color: occupancyValueColor }}
                >
                  {percent}%
                </Typography>
              </Box>

              {/* AVAILABLE */}
              <Box data-testid="metric-available">
                <Typography variant="caption" color="text.secondary">
                  Available spaces
                </Typography>
                <Typography
                  data-testid="metric-available-value"
                  variant="h4"
                  sx={{ fontWeight: 700, color: availableValueColor }}
                >
                  {f?.available ?? 0}
                </Typography>
              </Box>

              {/* TOTAL */}
              <Box data-testid="metric-total">
                <Typography variant="caption" color="text.secondary">
                  Parking spaces
                </Typography>
                <Typography
                  data-testid="metric-total-value"
                  variant="h4"
                  sx={{ fontWeight: 700 }}
                >
                  {f?.spots ?? 0}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </QueryBoundary>

      {/* DAILY COMMUTER METRICS */}
      <Card data-testid="daily-commuter-metrics-card">
        <CardContent>
          <DailyCommuterMetrics
            metrics={commuterMetrics.data}
            facilitySlug={slug}
            isLoading={commuterMetrics.isLoading}
            isError={commuterMetrics.isError}
          />
        </CardContent>
      </Card>

      {/* CHART */}
      <QueryBoundary
        isLoading={history.isLoading}
        isError={history.isError}
        loading={<Skeleton height={280} />}
      >
        <Card>
          <CardContent>
            <FacilityHistoryChart
              history={history.data}
              facilitySlug={slug}
              rangeDays={rangeDays}
              resolution={resolution}
              onRangeDaysChange={setRangeDays}
              onResolutionChange={setResolution}
            />
          </CardContent>
        </Card>
      </QueryBoundary>
    </Stack>
  );
}
