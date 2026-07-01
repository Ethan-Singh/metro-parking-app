import Grid from '@mui/material/Grid';
import { Typography, Box } from '@mui/material';
import { useParkingQueries } from '../api/useParkingQueries.ts';
import { FacilityCard } from '../components/FacilityCard.tsx';
import { QueryBoundary } from '../components/QueryBoundary.tsx';
import { useSearch } from '../search/useSearch.tsx';

export default function OverviewPage() {
  const { data, isLoading, isError } = useParkingQueries();
  const { query } = useSearch();

  const q = query.trim().toLowerCase();

  const results =
    data?.filter(
      (f) =>
        f.facilityName.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q)
    ) ?? [];

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Overview
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {isLoading ? 'Loading...' : `${results.length} parkings`}
      </Typography>

      <QueryBoundary isLoading={isLoading} isError={isError}>
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {results.map((f) => (
            <Grid key={f.slug} size={{ xs: 12, sm: 6, md: 4 }}>
              <FacilityCard facility={f} />
            </Grid>
          ))}
        </Grid>
      </QueryBoundary>
    </Box>
  );
}
