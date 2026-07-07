import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { ArrowBack } from '@mui/icons-material';
import { FacilityHistoryChart } from '../components/FacilityHistoryChart.tsx';
import {
  useFacilityHistory,
  useFacilityOverview,
} from '../api/useParkingQueries.ts';
import { QueryBoundary } from '../components/QueryBoundary.tsx';
import type { FacilitySlug } from '../types.ts';

export default function FacilityPage() {
  const navigate = useNavigate();

  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const safeSlug = slug as FacilitySlug | undefined;

  const overview = useFacilityOverview(safeSlug as FacilitySlug);
  const history = useFacilityHistory(safeSlug as FacilitySlug);

  if (!slug) {
    return <Alert severity="error">Missing facility slug</Alert>;
  }

  const f = overview.data;
  const percent = f ? Math.round(f.occupancyRate * 100) : 0;

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <QueryBoundary
        isLoading={overview.isLoading}
        isError={overview.isError}
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

          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {f?.facilityName}
          </Typography>
        </Box>
      </QueryBoundary>

      {/* METRICS */}
      <QueryBoundary
        isLoading={overview.isLoading}
        isError={overview.isError}
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
                  sx={{ fontWeight: 700 }}
                >
                  {percent}%
                </Typography>
              </Box>

              {/* AVAILABLE */}
              <Box data-testid="metric-available">
                <Typography variant="caption" color="text.secondary">
                  Current Available
                </Typography>
                <Typography
                  data-testid="metric-available-value"
                  variant="h4"
                  sx={{ fontWeight: 700, color: 'success.main' }}
                >
                  {f?.available ?? 0}
                </Typography>
              </Box>

              {/* TOTAL */}
              <Box data-testid="metric-total">
                <Typography variant="caption" color="text.secondary">
                  Current Total
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

      {/* CHART */}
      <QueryBoundary
        isLoading={history.isLoading}
        isError={history.isError}
        loading={<Skeleton height={280} />}
      >
        <Card>
          <CardContent>
            <FacilityHistoryChart dataPoints={history.data?.dataPoints ?? []} />
          </CardContent>
        </Card>
      </QueryBoundary>
    </Stack>
  );
}
