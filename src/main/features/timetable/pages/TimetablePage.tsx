import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { alpha } from '@mui/material/styles';
import { PageMetadata } from '../../../app/PageMetadata.tsx';
import {
  useTimetableManifest,
  useSydneyNetworkPackage,
  useSydneyNetworkRealtime,
} from '../api/useTimetableQueries.ts';
import type { TimetableStop } from '../api/types.ts';
import {
  callsForTrip,
  findTimetableOptions,
} from '../utils/searchTimetables.ts';
import { useSydneyNetworkPackages } from '../api/useTimetableQueries.ts';
import { DepartureGrid } from '../components/DepartureGrid.tsx';
import { TimetableOptionRow } from '../components/TimetableOptionRow.tsx';
import { routeBrandColor } from '../routeBrandColor.ts';
import { DataCredits } from '../../parking/components/DataCredits.tsx';
import { getSydneyWeekDates } from '../utils/weekDates.ts';

const keyOf = (d: Date) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
const today = keyOf(new Date());
const dt = (value: string, opts: Intl.DateTimeFormatOptions = {}) =>
  new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    ...opts,
  }).format(new Date(value));
function CurrentSydneyClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);
  return (
    <Typography
      variant="h4"
      role="timer"
      aria-live="off"
      sx={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}
    >
      {new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Sydney',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date(now))}
    </Typography>
  );
}
const isEmptyTrainText = (value: string) => /empty train|\bET\b/i.test(value);
const isNonRevenueText = (value: string) =>
  /non[\s-]?revenue|\bNR\b/i.test(value);
const isOutOfServiceText = (value: string) =>
  /out[\s-]?of[\s-]?service|not[\s-]?in[\s-]?service|\bOOS\b/i.test(value);
const serviceKind = (headsign: string, routeLabel: string) => {
  const description = `${headsign} ${routeLabel}`;
  if (isEmptyTrainText(description)) return 'EMPTY_TRAIN' as const;
  if (isOutOfServiceText(description) || isNonRevenueText(description))
    return 'NON_REVENUE' as const;
  return 'REGULAR' as const;
};
const specialFilterSx = (active: boolean) => ({
  color: active ? '#fff' : '#6B7280',
  bgcolor: active ? '#6B7280' : '#fff',
  borderColor: active ? '#6B7280' : '#D6DDE3',
  '&:hover': { bgcolor: active ? '#56616B' : '#F4F6F8' },
});

function StopPicker({
  label,
  stops,
  value,
  onChange,
  onSearch,
  onClear,
  searchDisabled,
}: {
  label: string;
  stops: TimetableStop[];
  value: string;
  onChange: (id: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  searchDisabled?: boolean;
}) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(false);
  const selected = stops.find((stop) => stop.id === value);
  const matches = query.trim()
    ? stops
        .filter(
          (stop) =>
            [
              stop.name,
              stop.disassembledName,
              stop.locality?.name,
              ...(stop.aliases ?? []),
            ].some((s) => s?.toLowerCase().includes(query.toLowerCase())) &&
            ['STATION', 'WHARF', 'LOCALITY', 'SUBURB'].includes(stop.kind)
        )
        .slice(0, 8)
    : [];
  return (
    <Box sx={{ position: 'relative', flex: 1, minWidth: 220 }}>
      <TextField
        fullWidth
        label={label}
        value={editing ? query : (selected?.name ?? query)}
        placeholder="Search stations in this timetable"
        slotProps={{
          input: {
            startAdornment: !onSearch ? (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ) : undefined,
            endAdornment: onClear ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear timetable search"
                  onClick={onClear}
                  edge="end"
                >
                  <CloseRoundedIcon />
                </IconButton>
              </InputAdornment>
            ) : onSearch ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Search timetable"
                  disabled={searchDisabled}
                  onClick={onSearch}
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        onKeyDown={(event) => {
          if (
            event.key === 'Enter' &&
            event.target instanceof HTMLInputElement &&
            onSearch &&
            !searchDisabled
          ) {
            event.preventDefault();
            onSearch();
          }
        }}
        onChange={(e) => {
          if (selected) onChange('');
          setEditing(true);
          setQuery(e.target.value);
        }}
        onFocus={() => {
          setQuery('');
          setEditing(true);
        }}
        onBlur={() => {
          if (!query.trim()) setEditing(false);
        }}
      />
      {matches.length > 0 && (
        <Card
          sx={{
            position: 'absolute',
            zIndex: 3,
            top: '100%',
            left: 0,
            right: 0,
            mt: 0.5,
            maxHeight: 300,
            overflow: 'auto',
            bgcolor: 'background.paper',
          }}
        >
          {matches.map((stop) => (
            <Button
              key={stop.id}
              fullWidth
              onClick={() => {
                onChange(stop.id);
                setQuery('');
                setEditing(false);
              }}
              sx={{
                justifyContent: 'flex-start',
                color: 'text.primary',
                px: 2,
                py: 1.2,
                textTransform: 'none',
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                {stop.name}
                <Typography
                  variant="caption"
                  sx={{ display: 'block' }}
                  color="text.secondary"
                >
                  {stop.locality?.name ?? stop.kind.toLowerCase()}
                </Typography>
              </Box>
            </Button>
          ))}
        </Card>
      )}
    </Box>
  );
}

export default function TimetablePage() {
  const manifest = useTimetableManifest();
  const [date, setDate] = useState(today);
  const [weekOffset, setWeekOffset] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [boardStationId, setBoardStationId] = useState('');
  const [stationPickerAnchor, setStationPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [lineFilter, setLineFilter] = useState('All');
  const [showNonRevenue, setShowNonRevenue] = useState(false);
  const [showEmptyTrain, setShowEmptyTrain] = useState(false);
  const [minTransfer, setMinTransfer] = useState(3);
  const [routeFilter, setRouteFilter] = useState('all');
  const [searched, setSearched] = useState(false);
  const [searchStartedAt, setSearchStartedAt] = useState('');
  const [searchAnchorDate, setSearchAnchorDate] = useState('');
  const [resultStartIndex, setResultStartIndex] = useState(0);
  const [resultEndIndex, setResultEndIndex] = useState(0);
  const [hasScrolledResults, setHasScrolledResults] = useState(false);
  const upcomingSentinel = useRef<HTMLButtonElement>(null);
  const [clockNow, setClockNow] = useState(() => Date.now());
  const clockMinute = Math.floor(clockNow / 60_000) * 60_000;
  const currentSydneyTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(clockNow));
  const [selectedTime, setSelectedTime] = useState('');
  const time = selectedTime || currentSydneyTime;
  useEffect(() => {
    const interval = window.setInterval(() => setClockNow(Date.now()), 60_000);
    return () => window.clearInterval(interval);
  }, []);
  const networkOfferings = useMemo(
    () =>
      manifest.data?.offerings.filter(
        (o) =>
          ['SYDNEY_TRAINS', 'SYDNEY_METRO'].includes(o.key) &&
          o.state !== 'UNAVAILABLE' &&
          o.state !== 'NOT_CONFIGURED'
      ) ?? [],
    [manifest.data]
  );
  const dates = useMemo(
    () =>
      networkOfferings.length
        ? [...new Set(networkOfferings.flatMap((o) => o.coveredDates))].sort()
        : [],
    [networkOfferings]
  );
  const searchDates = useMemo(
    () => (searched ? dates.slice(resultStartIndex, resultEndIndex + 1) : []),
    [dates, searched, resultStartIndex, resultEndIndex]
  );
  const resultPackages = useSydneyNetworkPackages(searchDates);
  useEffect(() => {
    if (
      !searched ||
      !hasScrolledResults ||
      resultPackages.isLoading ||
      resultEndIndex >= dates.length - 1
    )
      return;
    const node = upcomingSentinel.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setResultEndIndex((index) => Math.min(index + 1, dates.length - 1));
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    searched,
    hasScrolledResults,
    resultPackages.isLoading,
    resultEndIndex,
    dates.length,
  ]);
  useEffect(() => {
    if (!searched) return;
    const onScroll = () => {
      if (window.scrollY > 0) setHasScrolledResults(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [searched]);
  const weekDates = getSydneyWeekDates(today, weekOffset);
  const pkg = useSydneyNetworkPackage(date);
  const realtime = useSydneyNetworkRealtime();
  const timetableUpdatedAt = [
    pkg.data?.generatedAt,
    ...resultPackages.data.map((item) => item.data?.generatedAt),
  ]
    .filter((value): value is string => Boolean(value))
    .map((value) => Date.parse(value))
    .filter(Number.isFinite)
    .reduce<number | undefined>(
      (latest, value) => Math.max(latest ?? value, value),
      undefined
    );
  const stops = useMemo(() => pkg.data?.stops ?? [], [pkg.data]);
  const names = useMemo(
    () => new Map(stops.map((stop) => [stop.id, stop.name])),
    [stops]
  );
  const central =
    stops.find(
      (stop) =>
        stop.name.toLowerCase() === 'central station' && stop.kind === 'STATION'
    ) ??
    stops.find(
      (stop) =>
        stop.name.toLowerCase().startsWith('central') && stop.kind === 'STATION'
    );
  const boardStation =
    stops.find((stop) => stop.id === boardStationId) ?? central;
  const selectedFrom = from;
  const optionEntries = useMemo(
    () =>
      selectedFrom && to && searched
        ? resultPackages.data.flatMap(({ date: packageDate, data }) =>
            data
              ? findTimetableOptions(
                  data,
                  selectedFrom,
                  to,
                  packageDate === searchAnchorDate
                    ? searchStartedAt
                    : `${packageDate}T00:00:00`,
                  minTransfer * 60,
                  realtime.data
                ).map((option) => ({ date: packageDate, data, option }))
              : []
          )
        : [],
    [
      selectedFrom,
      to,
      searched,
      searchStartedAt,
      searchAnchorDate,
      minTransfer,
      realtime.data,
      resultPackages.data,
    ]
  );
  const visibleOptionEntries = optionEntries.filter(
    ({ option }) => routeFilter === 'all' || option.transfers === 0
  );
  const resultNames = useMemo(
    () =>
      new Map(
        resultPackages.data.flatMap(
          ({ data }) =>
            data?.stops.map((stop) => [stop.id, stop.name] as const) ?? []
        )
      ),
    [resultPackages.data]
  );
  const resultRoutes = useMemo(
    () =>
      new Map(
        resultPackages.data.flatMap(
          ({ data }) =>
            data?.routes.map(
              (route) => [route.id, route.shortName || route.name] as const
            ) ?? []
        )
      ),
    [resultPackages.data]
  );
  const resultRouteColors = useMemo(
    () =>
      new Map(
        resultPackages.data.flatMap(
          ({ data }) =>
            data?.routes.map(
              (route) =>
                [
                  route.id,
                  routeBrandColor(route.shortName || route.name, route.color),
                ] as const
            ) ?? []
        )
      ),
    [resultPackages.data]
  );
  const centralDepartures = useMemo(() => {
    if (!pkg.data || !boardStation)
      return { regular: [], nonRevenue: [], emptyTrain: [] };
    const stationIds = new Set([
      boardStation.id,
      ...pkg.data.stops
        .filter((stop) => stop.parentStopId === boardStation.id)
        .map((stop) => stop.id),
    ]);
    const cutoff = date === today ? `${date}T${time}:00` : `${date}T00:00:00`;
    const upcoming = pkg.data.trips
      .flatMap((trip) => {
        const calls = callsForTrip(pkg.data!, trip);
        const callIndex = calls.findIndex(
          (item) => stationIds.has(item.stopId) && item.departure >= cutoff
        );
        if (callIndex < 0) return [];
        const call = calls[callIndex]!;
        const stop = pkg.data!.stops.find((item) => item.id === call.stopId);
        const route = pkg.data!.routes.find((item) => item.id === trip.routeId);
        return [{ trip, calls, call, callIndex, stop, route }];
      })
      .sort((a, b) => a.call.departure.localeCompare(b.call.departure));
    const departures = upcoming.map(
      ({ trip, calls, call, callIndex, stop, route }) => {
        const departureMs = new Date(call.departure).getTime();
        const headsign = trip.headsign.trim();
        const routeLabel = route?.shortName || route?.name || '';
        const kind = serviceKind(headsign, routeLabel);
        const description = `${headsign} ${routeLabel}`;
        const isEmptyTrain = isEmptyTrainText(description);
        const isOutOfService = isOutOfServiceText(description);
        const isNonRevenue = kind === 'NON_REVENUE';
        const following = upcoming.find(
          (entry) =>
            entry.trip.routeId === trip.routeId &&
            serviceKind(
              entry.trip.headsign,
              entry.route?.shortName || entry.route?.name || ''
            ) === 'REGULAR' &&
            entry.call.departure > call.departure
        );
        return {
          kind,
          mode:
            route?.mode.toLowerCase().includes('metro') ||
            route?.feedKey === 'metro'
              ? ('METRO' as const)
              : route?.mode.toLowerCase().includes('rail') ||
                  route?.mode.toLowerCase().includes('train')
                ? ('TRAIN' as const)
                : ('OTHER' as const),
          line: route?.shortName || route?.name || 'Service',
          lineColor: routeBrandColor(
            route?.shortName || route?.name || '',
            route?.color
          ),
          destination: isEmptyTrain
            ? 'ET'
            : isNonRevenue && !isOutOfService
              ? 'NR'
              : headsign,
          departureAt: call.departure,
          platform:
            stop?.platformCode ??
            call.platform ??
            stop?.name.match(/platform\s+([\w-]+)/i)?.[1] ??
            '—',
          minutes: Math.max(0, Math.ceil((departureMs - clockMinute) / 60_000)),
          stops: calls
            .slice(callIndex + 1, callIndex + 6)
            .map(
              (next) =>
                pkg.data!.stops.find((entry) => entry.id === next.stopId)
                  ?.name ?? next.stopId
            ),
          following: {
            destination: following?.trip.headsign ?? trip.headsign,
            minutes: following
              ? Math.max(
                  0,
                  Math.ceil(
                    (new Date(following.call.departure).getTime() -
                      clockMinute) /
                      60_000
                  )
                )
              : Math.max(
                  1,
                  Math.ceil((departureMs - clockMinute) / 60_000) + 10
                ),
          },
        };
      }
    );
    return {
      regular: departures
        .filter((service) => service.kind === 'REGULAR')
        .slice(0, 10),
      nonRevenue: departures.filter(
        (service) => service.kind === 'NON_REVENUE'
      ),
      emptyTrain: departures.filter(
        (service) => service.kind === 'EMPTY_TRAIN'
      ),
    };
  }, [pkg.data, boardStation, date, clockMinute, time]);
  const availableLines = [
    'All',
    ...new Set(
      (centralDepartures.regular ?? []).map((service) => service.line)
    ),
  ];
  const visibleDepartures =
    lineFilter === 'All'
      ? centralDepartures.regular
      : centralDepartures.regular.filter(
          (service) => service.line === lineFilter
        );
  const specialDepartures = [
    ...(showNonRevenue ? centralDepartures.nonRevenue : []),
    ...(showEmptyTrain ? centralDepartures.emptyTrain : []),
  ].filter((service) => lineFilter === 'All' || service.line === lineFilter);
  const displayedDepartures = [...visibleDepartures, ...specialDepartures].sort(
    (a, b) => a.departureAt.localeCompare(b.departureAt)
  );
  const searchTimetable = (destination = to) => {
    if (!from || !destination || destination === from) return;
    const currentDate = keyOf(new Date());
    const startIndex = dates.findIndex(
      (availableDate) => availableDate >= currentDate
    );
    const anchorIndex =
      startIndex >= 0 ? startIndex : Math.max(0, dates.length - 1);
    const currentTime = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Australia/Sydney',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
    setSearchStartedAt(`${currentDate}T${currentTime}`);
    setSearchAnchorDate(currentDate);
    setResultStartIndex(anchorIndex);
    setResultEndIndex(anchorIndex);
    setHasScrolledResults(false);
    setRouteFilter('all');
    setSearched(true);
  };
  const clearTimetableSearch = () => {
    setFrom('');
    setTo('');
    setDate(today);
    setBoardStationId('');
    setSelectedTime('');
    setSearched(false);
  };
  return (
    <>
      <PageMetadata
        title="Timetable planner | Metro Parking App"
        description="Search Sydney Trains and Metro timetables."
        path="/timetable"
      />
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
            Timetable
          </Typography>
          <Typography color="text.secondary">
            Sydney Trains and Metro Timetables
          </Typography>
        </Box>
        {manifest.isLoading && (
          <Alert severity="info">Loading timetable availability…</Alert>
        )}
        {manifest.isError && (
          <Alert severity="error">
            The timetable manifest could not be loaded. Please try again.
          </Alert>
        )}
        {manifest.data && (
          <>
            <Card>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stack spacing={2}>
                  {!searched && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        minWidth: 0,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        order: 4,
                      }}
                    >
                      {weekOffset > 0 && (
                        <IconButton
                          onClick={() => setWeekOffset((offset) => offset - 1)}
                          aria-label="Show previous week"
                          size="small"
                          sx={{ flexShrink: 0 }}
                        >
                          <ChevronLeftIcon />
                        </IconButton>
                      )}
                      <Box
                        sx={{
                          display: 'flex',
                          flex: '0 1 auto',
                          width: 'max-content',
                          maxWidth: '100%',
                          minWidth: 0,
                          gap: 1,
                          justifyContent: 'flex-start',
                          overflowX: 'auto',
                          py: 0.5,
                        }}
                        aria-label="Travel date"
                      >
                        {weekDates.map((day, dayIndex) => {
                          const active = day === date;
                          const isToday = day === today;
                          const weekdayPalette = [
                            'primary',
                            'secondary',
                            'success',
                            'info',
                            'warning',
                            'secondary',
                            'error',
                          ] as const;
                          const tint =
                            weekdayPalette[dayIndex % weekdayPalette.length];
                          return (
                            <Button
                              key={day}
                              disabled={!dates.includes(day)}
                              aria-label={`${dt(`${day}T12:00:00`, { weekday: 'long' })}${isToday ? ', today' : ''}`}
                              aria-pressed={active}
                              onClick={() => {
                                setDate(day);
                                setSearched(false);
                              }}
                              sx={{
                                minWidth: 36,
                                width: 36,
                                flexShrink: 0,
                                height: 36,
                                p: 0,
                                borderRadius: '50%',
                                border: '2px solid',
                                borderColor: active
                                  ? 'primary.main'
                                  : isToday
                                    ? 'secondary.main'
                                    : 'transparent',
                                bgcolor: (theme) =>
                                  !dates.includes(day)
                                    ? theme.palette.action.disabledBackground
                                    : active
                                      ? theme.palette.primary.main
                                      : alpha(theme.palette[tint].main, 0.12),
                                color: !dates.includes(day)
                                  ? 'text.secondary'
                                  : active
                                    ? 'primary.contrastText'
                                    : 'text.primary',
                                fontWeight: active || isToday ? 700 : 500,
                                transition:
                                  'background-color 160ms ease, transform 160ms ease',
                                '&:hover': {
                                  bgcolor: active
                                    ? 'primary.dark'
                                    : !dates.includes(day)
                                      ? 'action.disabledBackground'
                                      : (theme) =>
                                          alpha(theme.palette[tint].main, 0.22),
                                  transform: 'translateY(-1px)',
                                },
                              }}
                            >
                              {dt(`${day}T12:00:00`, { weekday: 'short' })
                                .slice(0, 1)
                                .toLowerCase()}
                            </Button>
                          );
                        })}
                      </Box>
                      <IconButton
                        onClick={() => setWeekOffset((offset) => offset + 1)}
                        aria-label="Show next week"
                        size="small"
                        sx={{ flexShrink: 0 }}
                      >
                        <ChevronRightIcon />
                      </IconButton>
                    </Stack>
                  )}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      order: 1,
                    }}
                  >
                    <StopPicker
                      label="From station"
                      stops={stops}
                      value={selectedFrom}
                      onChange={(stationId) => {
                        setFrom(stationId);
                        setTo('');
                        setSearched(false);
                      }}
                    />
                  </Box>
                  {from && (
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        order: 2,
                      }}
                    >
                      <StopPicker
                        label="To station"
                        stops={stops}
                        value={to}
                        onChange={(stationId) => {
                          setTo(stationId);
                          setSearched(false);
                          if (stationId) searchTimetable(stationId);
                        }}
                        onSearch={searchTimetable}
                        onClear={searched ? clearTimetableSearch : undefined}
                        searchDisabled={!to || to === from}
                      />
                      <IconButton
                        aria-label="Swap origin and destination"
                        disabled={!to}
                        onClick={() => {
                          setFrom(to);
                          setTo(from);
                          setSearched(false);
                        }}
                      >
                        <SwapHorizIcon />
                      </IconButton>
                    </Box>
                  )}
                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{
                      bgcolor: 'transparent',
                      order: 3,
                      '&::before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ px: 0 }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Connection time & route options
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: 'wrap' }}
                      >
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <InputLabel id="connection-label">
                            Connection time
                          </InputLabel>
                          <Select
                            labelId="connection-label"
                            label="Connection time"
                            value={minTransfer}
                            onChange={(e) =>
                              setMinTransfer(Number(e.target.value))
                            }
                          >
                            <MenuItem value={0}>0 minutes</MenuItem>
                            <MenuItem value={3}>3 minutes</MenuItem>
                            <MenuItem value={5}>5 minutes</MenuItem>
                            <MenuItem value={8}>8 minutes</MenuItem>
                            <MenuItem value={10}>10 minutes</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          select
                          size="small"
                          label="Routes"
                          value={routeFilter}
                          onChange={(event) =>
                            setRouteFilter(event.target.value)
                          }
                          sx={{ minWidth: 160 }}
                        >
                          <MenuItem value="all">All routes</MenuItem>
                          <MenuItem value="direct">Direct only</MenuItem>
                        </TextField>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </CardContent>
            </Card>
            <DataCredits
              lastUpdated={timetableUpdatedAt}
              isLoading={pkg.isLoading || resultPackages.isLoading}
            />
            {pkg.isLoading && (
              <Alert severity="info">
                Loading the{' '}
                {dt(`${date}T12:00:00`, {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })}{' '}
                timetable package…
              </Alert>
            )}
            {pkg.isError && (
              <Alert severity="error">
                Could not load this day’s timetable package.
              </Alert>
            )}
            {!searched && pkg.data && (
              <Box>
                <Card sx={{ mb: 2 }}>
                  <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      sx={{
                        alignItems: { sm: 'center' },
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Current Sydney time
                        </Typography>
                        <CurrentSydneyClock />
                      </Box>
                      <TextField
                        type="time"
                        size="small"
                        label="Departures after"
                        value={time}
                        onChange={(event) =>
                          setSelectedTime(event.target.value)
                        }
                        sx={{ minWidth: 180 }}
                      />
                    </Stack>
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      sx={{ mt: 2, justifyContent: 'space-between', gap: 1.5 }}
                    >
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Lines
                        </Typography>
                        {availableLines.map((line) => (
                          <Chip
                            key={line}
                            label={line === 'All' ? line : line}
                            clickable
                            aria-pressed={lineFilter === line}
                            color={lineFilter === line ? 'primary' : 'default'}
                            variant={
                              lineFilter === line ? 'filled' : 'outlined'
                            }
                            onClick={() => setLineFilter(line)}
                          />
                        ))}
                      </Stack>
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
                      >
                        <Chip
                          label="Non revenue"
                          title="Show non-revenue trips"
                          clickable
                          aria-pressed={showNonRevenue}
                          variant={showNonRevenue ? 'filled' : 'outlined'}
                          onClick={() => setShowNonRevenue((value) => !value)}
                          sx={specialFilterSx(showNonRevenue)}
                        />
                        <Chip
                          label="Empty Train"
                          title="Show empty-train trips"
                          clickable
                          aria-pressed={showEmptyTrain}
                          variant={showEmptyTrain ? 'filled' : 'outlined'}
                          onClick={() => setShowEmptyTrain((value) => !value)}
                          sx={specialFilterSx(showEmptyTrain)}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ mb: 1, alignItems: 'center' }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: 800 }}
                  >
                    Departures from
                  </Typography>
                  <Button
                    endIcon={<ExpandMoreIcon />}
                    aria-haspopup="dialog"
                    aria-expanded={Boolean(stationPickerAnchor)}
                    onClick={(event) =>
                      setStationPickerAnchor(event.currentTarget)
                    }
                    sx={{ fontSize: '1.25rem', fontWeight: 800 }}
                  >
                    {boardStation?.name ?? 'Central'}
                  </Button>
                </Stack>
                <Popover
                  open={Boolean(stationPickerAnchor)}
                  anchorEl={stationPickerAnchor}
                  onClose={() => setStationPickerAnchor(null)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  <Box
                    sx={{ p: 2, width: { xs: 320, sm: 380 }, maxWidth: '90vw' }}
                  >
                    <StopPicker
                      label="Search stations"
                      stops={stops.filter((stop) => stop.kind === 'STATION')}
                      value={boardStation?.id ?? ''}
                      onChange={(stationId) => {
                        setBoardStationId(stationId);
                        if (!stationId) return;
                        setStationPickerAnchor(null);
                        setLineFilter('All');
                      }}
                    />
                  </Box>
                </Popover>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1 }}
                >
                  Next 10 passenger services
                </Typography>
                <DepartureGrid services={displayedDepartures} />
                {!displayedDepartures.length && (
                  <Alert severity="info">
                    No departures from {boardStation?.name ?? 'Central'} remain
                    for this date.
                  </Alert>
                )}
              </Box>
            )}
            {searched &&
              (resultPackages.isLoading &&
              !resultPackages.data.some((item) => item.data) ? (
                <Alert severity="info">Loading timetable options…</Alert>
              ) : visibleOptionEntries.length ? (
                <>
                  <Box>
                    <Typography
                      variant="h5"
                      component="h2"
                      sx={{ fontWeight: 750 }}
                    >
                      Timetable options
                    </Typography>
                    <Typography color="text.secondary">
                      {names.get(selectedFrom)} to {names.get(to)} ·{' '}
                      {dt(searchStartedAt, {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    {visibleOptionEntries.map(
                      ({ option, date: serviceDate, data }, index) => {
                        const departureMs = new Date(
                          option.departure
                        ).getTime();
                        const arrivalMs = new Date(option.arrival).getTime();
                        return (
                          <TimetableOptionRow
                            key={`${serviceDate}-${option.trip.id}-${index}`}
                            option={option}
                            from={resultNames.get(selectedFrom) ?? 'Origin'}
                            to={resultNames.get(to) ?? 'Destination'}
                            routeNames={resultRoutes}
                            routeColors={resultRouteColors}
                            minutesUntil={Math.max(
                              0,
                              Math.ceil((departureMs - clockNow) / 60_000)
                            )}
                            durationMinutes={Math.max(
                              0,
                              Math.round((arrivalMs - departureMs) / 60_000)
                            )}
                            now={clockNow}
                            stops={
                              new Map(
                                data.stops.map((stop) => [stop.id, stop.name])
                              )
                            }
                            trips={
                              new Map(data.trips.map((trip) => [trip.id, trip]))
                            }
                            realtime={realtime.data}
                          />
                        );
                      }
                    )}
                  </Stack>
                  {resultEndIndex < dates.length - 1 && (
                    <Button
                      ref={upcomingSentinel}
                      onClick={() => setResultEndIndex((index) => index + 1)}
                      disabled={resultPackages.isLoading}
                      sx={{ alignSelf: 'center', textTransform: 'none' }}
                    >
                      Load more upcoming timetable data
                    </Button>
                  )}
                  {resultStartIndex > 0 && (
                    <Button
                      onClick={() => setResultStartIndex((index) => index - 1)}
                      disabled={resultPackages.isLoading}
                      sx={{ alignSelf: 'center', textTransform: 'none' }}
                    >
                      Load earlier timetable data
                    </Button>
                  )}
                  {realtime.isError && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Realtime is unavailable; scheduled times remain shown.
                    </Typography>
                  )}
                  {realtime.data && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      Realtime overlay updated{' '}
                      {dt(realtime.data.generatedAt, {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      .
                    </Typography>
                  )}{' '}
                </>
              ) : (
                <Stack spacing={1} sx={{ alignItems: 'center' }}>
                  <Alert severity="info" sx={{ width: '100%' }}>
                    No timetable options were found in this date range.
                  </Alert>
                  {resultStartIndex > 0 && (
                    <Button
                      onClick={() => setResultStartIndex((index) => index - 1)}
                      disabled={resultPackages.isLoading}
                      sx={{ textTransform: 'none' }}
                    >
                      Load earlier timetable data
                    </Button>
                  )}
                  {resultEndIndex < dates.length - 1 && (
                    <Button
                      ref={upcomingSentinel}
                      onClick={() => setResultEndIndex((index) => index + 1)}
                      disabled={resultPackages.isLoading}
                      sx={{ textTransform: 'none' }}
                    >
                      Load more upcoming timetable data
                    </Button>
                  )}
                </Stack>
              ))}
            {networkOfferings.length === 0 && (
              <Alert severity="warning">
                Sydney Trains and Metro timetables are unavailable.
              </Alert>
            )}
          </>
        )}
      </Stack>
    </>
  );
}
