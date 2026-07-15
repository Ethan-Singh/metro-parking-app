import Grid from '@mui/material/Grid';
import { Typography, Box, Stack } from '@mui/material';
import { useParkingQueries } from '../api/useParkingQueries.ts';
import { FacilityCard } from '../components/FacilityCard.tsx';
import { QueryBoundary } from '../components/QueryBoundary.tsx';
import { useSearch } from '../search/useSearch.tsx';
import { DataCredits } from '../components/DataCredits.tsx';
import { SearchBarEmpty } from '../search/SearchBarEmpty.tsx';

export default function OverviewPage() {
  const { data, isLoading, isError } = useParkingQueries();
  const { query, clear } = useSearch();

  const q = query.trim().toLowerCase();

  const results =
    data?.filter(
      (f) =>
        f.facilityName.toLowerCase().includes(q) ||
        f.slug.toLowerCase().includes(q)
    ) ?? [];

  // Get the most recent timestamp from all facilities
  const lastUpdated = data?.[0]?.timestamp;
  const hasSearchQuery = q.length > 0;
  const isEmpty = results.length === 0 && hasSearchQuery;

  return (
    <Stack spacing={3}>
      {/* HEADER */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Overview
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isLoading
            ? 'Loading...'
            : `${results.length} parking facilit${results.length === 1 ? 'y' : 'ies'}`}
        </Typography>
      </Box>

      {/* DATA CREDITS */}
      <DataCredits
        lastUpdated={lastUpdated}
        isFresh={true}
        isLoading={isLoading}
      />

      {/* CONTENT */}
      <QueryBoundary isLoading={isLoading} isError={isError}>
        {isEmpty ? (
          <SearchBarEmpty
            title="No facilities match your search"
            description={`We couldn't find any parking facilities matching "${q}". Try a different search term.`}
            action={{
              label: 'Clear search',
              onClick: clear,
            }}
          />
        ) : (
          <Grid container spacing={2} sx={{ width: '100%' }}>
            {results.map((f) => (
              <Grid key={f.slug} size={{ xs: 12, sm: 6, md: 4 }}>
                <FacilityCard facility={f} />
              </Grid>
            ))}
          </Grid>
        )}
      </QueryBoundary>
    </Stack>
  );
}
