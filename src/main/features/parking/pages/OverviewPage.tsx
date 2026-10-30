import Grid from '@mui/material/Grid';
import {
  Typography,
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ParkRideLogo from '../../../assets/Park&Ride.webp';
import { tokens } from '../../../css/tokens.ts';
import { useParkingQueries } from '../api/useParkingQueries.ts';
import { FacilityCard } from '../components/FacilityCard.tsx';
import { QueryBoundary } from '../components/QueryBoundary.tsx';
import { useSearch } from '../search/useSearch.tsx';
import { DataCredits } from '../components/DataCredits.tsx';
import { SearchBarEmpty } from '../search/SearchBarEmpty.tsx';
import { SearchBar } from '../search/SearchBar.tsx';
import type { LiveCarPark } from '../types.ts';
import { PageMetadata } from '../../../app/PageMetadata.tsx';

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

  // Get the most recent source sample timestamp from all facilities.
  const lastUpdated =
    data && data.length > 0
      ? data.reduce((latest, facility) =>
          facility.timeMs > latest.timeMs ? facility : latest
        ).timeMs
      : undefined;

  const hasSearchQuery = q.length > 0;
  const isEmpty = results.length === 0 && hasSearchQuery;
  const parkAndRide = results.filter((facility) =>
    isParkAndRide(facility.facilityName)
  );
  const others = results.filter(
    (facility) => !isParkAndRide(facility.facilityName)
  );

  return (
    <Stack spacing={3}>
      <PageMetadata
        title="Sydney Metro Parking Availability | A Metro Parking App"
        description="Check live parking availability and historical occupancy at Sydney Metro Park&Ride facilities. Plan your commute with daily parking metrics and interactive charts."
        path="/"
      />
      {/* HEADER */}
      <Box>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
          Parkings
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {isLoading
            ? 'Loading...'
            : `${results.length} parking facilit${results.length === 1 ? 'y' : 'ies'}`}
        </Typography>
      </Box>

      <Card role="search" aria-label="Search parking facilities">
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <SearchBar label="Find parking" />
        </CardContent>
      </Card>

      {/* DATA CREDITS */}
      <DataCredits lastUpdated={lastUpdated} isLoading={isLoading} />

      {/* CONTENT */}
      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        loading={<FacilityListLoading />}
      >
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
          <Stack spacing={2} sx={{ width: '100%' }}>
            {parkAndRide.length > 0 && (
              <Accordion
                defaultExpanded
                disableGutters
                sx={{
                  overflow: 'hidden',
                  borderRadius: `${tokens.radius.primary}px`,
                  border: `1px solid ${tokens.color.primaryBorder}`,
                  backgroundColor: 'transparent',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: 'common.white' }} />}
                  aria-label="Park & Ride facilities"
                  sx={{
                    minHeight: 56,
                    bgcolor: tokens.color.primary,
                    color: 'common.white',
                    '&.Mui-expanded': { minHeight: 56 },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      pr: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src={ParkRideLogo}
                      alt="Park & Ride"
                      width={600}
                      height={149}
                      sx={{
                        display: 'block',
                        width: { xs: 142, sm: 170 },
                        height: 'auto',
                        borderRadius: `${tokens.radius.primary * tokens.radius.secondary}px`,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: 'common.white', fontWeight: 600 }}
                    >
                      {parkAndRide.length}{' '}
                      {parkAndRide.length === 1 ? 'facility' : 'facilities'}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                  <FacilityGrid facilities={parkAndRide} />
                </AccordionDetails>
              </Accordion>
            )}

            {others.length > 0 && (
              <Accordion
                disableGutters
                sx={{
                  borderRadius: `${tokens.radius.primary}px`,
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-label="Other facilities"
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Others ({others.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                  <FacilityGrid facilities={others} />
                </AccordionDetails>
              </Accordion>
            )}
          </Stack>
        )}
      </QueryBoundary>
    </Stack>
  );
}

function FacilityGrid({ facilities }: { facilities: LiveCarPark[] }) {
  return (
    <Grid container spacing={2} sx={{ width: '100%', alignItems: 'start' }}>
      {facilities.map((facility) => (
        <Grid key={facility.slug} size={{ xs: 12, sm: 6, md: 4 }}>
          <FacilityCard
            facility={facility}
            title={cardTitle(facility.facilityName)}
          />
        </Grid>
      ))}
    </Grid>
  );
}

function FacilityListLoading() {
  return (
    <Box
      role="status"
      aria-label="Loading parking facilities"
      aria-busy="true"
      sx={{
        overflow: 'hidden',
        borderRadius: `${tokens.radius.primary}px`,
        border: `1px solid ${tokens.color.primaryBorder}`,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          minHeight: 56,
          bgcolor: tokens.color.primary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          px: 2,
        }}
      >
        <Box
          component="img"
          src={ParkRideLogo}
          alt=""
          width={600}
          height={149}
          sx={{
            display: 'block',
            width: { xs: 142, sm: 170 },
            height: 'auto',
            borderRadius: `${tokens.radius.primary * tokens.radius.secondary}px`,
          }}
        />
        <Typography
          variant="body2"
          sx={{ color: 'common.white', fontWeight: 600 }}
        >
          Loading facilities
        </Typography>
      </Box>
      <Box aria-hidden="true" sx={{ pt: 2 }}>
        <Grid container spacing={2} sx={{ width: '100%', alignItems: 'start' }}>
          {Array.from({ length: 41 }, (_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={180} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

function isParkAndRide(name: string) {
  const normalized = name.toLowerCase().replace(/[\s&-]/g, '');
  return normalized.includes('parkride') || normalized.includes('parkandride');
}

function cardTitle(name: string) {
  return name.replace(/^\s*park\s*(?:&|and)\s*ride\s*(?:[-:]\s*)?/i, '').trim();
}
