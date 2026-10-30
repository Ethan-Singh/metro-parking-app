import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import type { RealtimeOverlay, TimetableTrip } from '../api/types.ts';
import type { TimetableOption } from '../utils/searchTimetables.ts';
import { RouteBadge } from './RouteBadge.tsx';

type Props = {
  option: TimetableOption;
  from: string;
  to: string;
  routeNames: Map<string, string>;
  routeColors: Map<string, string>;
  minutesUntil: number;
  durationMinutes: number;
  now: number;
  stops: Map<string, string>;
  trips: Map<string, TimetableTrip>;
  realtime?: RealtimeOverlay;
};

const dt = (value: string) =>
  new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export function TimetableOptionRow({
  option,
  from,
  to,
  routeNames,
  routeColors,
  minutesUntil,
  durationMinutes,
  now,
  stops,
  trips,
  realtime,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const routeTrips = [
    ...new Set(option.calls.map((call) => call.tripId)),
  ].flatMap((id) => {
    const trip = trips.get(id);
    return trip ? [trip] : [];
  });
  const routeIds = [...new Set(routeTrips.map((trip) => trip.routeId))];
  const routeColor = routeColors.get(option.trip.routeId) ?? '#0084D1';
  const realtimeAge = realtime
    ? now - new Date(realtime.generatedAt).getTime()
    : Number.POSITIVE_INFINITY;
  const realtimeFresh = Boolean(
    realtime && realtimeAge >= 0 && realtimeAge <= 5 * 60_000
  );
  const activeRealtime = realtimeFresh ? realtime : undefined;
  const serviceAlerts =
    activeRealtime?.alerts.filter((alert) =>
      alert.informedEntities.some(
        (entity) =>
          entity.matchStatus === 'MATCHED' &&
          entity.feedKey === alert.feedKey &&
          routeTrips.some(
            (trip) =>
              trip.id.split(':')[0] === entity.feedKey &&
              ((Boolean(entity.tripId) &&
                (entity.tripId === trip.providerId ||
                  entity.tripId === trip.id)) ||
                (Boolean(entity.routeId) && entity.routeId === trip.routeId))
          )
      )
    ) ?? [];
  const realtimeUpdates = option.calls.map((call) => {
    const tripUpdate = activeRealtime?.tripUpdates.find(
      (update) =>
        update.matchStatus === 'MATCHED' &&
        update.scheduleTripId === call.tripId
    );
    return tripUpdate?.stopUpdates?.find(
      (update) =>
        update.matchStatus === 'MATCHED' &&
        update.scheduleStopId === call.stopId &&
        update.stopSequence === call.sequence
    );
  });
  const isLive = realtimeUpdates.some(Boolean);
  const delaySeconds = Math.max(
    0,
    ...realtimeUpdates.map((update) => update?.departureDelaySeconds ?? 0)
  );
  const serviceStatus =
    isLive && delaySeconds >= 60
      ? `${Math.ceil(delaySeconds / 60)} min delayed`
      : isLive
        ? 'Live'
        : 'Scheduled';

  return (
    <Accordion
      disableGutters
      expanded={expanded}
      onChange={(_, open) => setExpanded(open)}
      sx={{
        overflow: 'hidden',
        borderLeft: `5px solid ${routeColor}`,
        '&::before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          px: 2,
          '& .MuiAccordionSummary-content': {
            display: 'block',
            my: 1.5,
            minWidth: 0,
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '52px minmax(0, 1fr) minmax(0, 1fr)',
              sm: '76px minmax(0, 1fr) minmax(0, 1fr) 110px',
            },
            gap: { xs: 1, sm: 1.5 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {minutesUntil <= 0 ? 'Due' : minutesUntil}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {minutesUntil <= 0 ? 'now' : 'min away'}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {from}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                fontWeight: 650,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {dt(option.departure)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Platform {option.calls[0]?.platform ?? 'TBA'}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" noWrap>
              {to}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: '1.2rem', sm: '1.5rem' },
                fontWeight: 650,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {dt(option.arrival)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Arrival
            </Typography>
          </Box>
          <Box
            sx={{
              gridColumn: { xs: '2 / 4', sm: 'auto' },
              textAlign: { xs: 'left', sm: 'right' },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 650 }}>
              {durationMinutes} min
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.transfers === 0
                ? 'Direct · No changes'
                : `${option.transfers} change${option.transfers === 1 ? '' : 's'}`}
            </Typography>
          </Box>
        </Box>

        <Stack
          direction="row"
          useFlexGap
          sx={{
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
            mt: 1.25,
            ml: { xs: '60px', sm: '88px' },
          }}
        >
          {routeIds.map((routeId) => (
            <RouteBadge
              key={routeId}
              label={routeNames.get(routeId) ?? routeId}
              color={routeColors.get(routeId) ?? routeColor}
            />
          ))}
          <Typography
            variant="caption"
            color={delaySeconds >= 60 ? 'warning.main' : 'text.secondary'}
          >
            {serviceStatus}
          </Typography>
          {serviceAlerts.length > 0 && (
            <Tooltip
              title={serviceAlerts
                .map((alert) => alert.header ?? alert.effect)
                .join(' · ')}
              describeChild
            >
              <Stack
                component="span"
                direction="row"
                spacing={0.5}
                sx={{ alignItems: 'center', color: 'warning.main' }}
              >
                <WarningAmberIcon sx={{ fontSize: 16 }} />
                <Typography variant="caption">
                  {serviceAlerts.length} alert
                  {serviceAlerts.length === 1 ? '' : 's'}
                </Typography>
              </Stack>
            </Tooltip>
          )}
          <Typography
            variant="caption"
            color="primary.main"
            sx={{ ml: 'auto' }}
          >
            Stops & details
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pb: 2 }}>
        <Stack spacing={1.25}>
          {serviceAlerts.map((alert) => (
            <Alert
              key={alert.id}
              severity={
                alert.severity === 'SEVERE'
                  ? 'error'
                  : alert.severity === 'WARNING'
                    ? 'warning'
                    : 'info'
              }
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {alert.header ?? alert.effect}
              </Typography>
              {alert.description && (
                <Typography variant="body2">{alert.description}</Typography>
              )}
            </Alert>
          ))}
          <Box
            component="ol"
            sx={{
              listStyle: 'none',
              m: 0,
              ml: { xs: 0.5, sm: '88px' },
              pl: 2,
              borderLeft: `3px solid ${routeColor}`,
            }}
          >
            {option.calls.map((call, index) => {
              const update = realtimeUpdates[index];
              return (
                <Box
                  component="li"
                  key={`${call.tripId}-${call.sequence}-${index}`}
                  sx={{
                    position: 'relative',
                    pb: index === option.calls.length - 1 ? 0 : 1.5,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: '-22px',
                      top: '5px',
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      bgcolor: 'background.paper',
                      border: `2px solid ${routeColor}`,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}
                    spacing={1.5}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {stops.get(call.stopId) ?? call.stopId}
                        {call.platform ? ` · Platform ${call.platform}` : ''}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {index === 0
                          ? 'Depart'
                          : index === option.calls.length - 1
                            ? 'Arrive'
                            : 'Stop'}{' '}
                        · {dt(call.arrival)}
                        {call.departure !== call.arrival
                          ? ` / ${dt(call.departure)}`
                          : ''}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 650 }}>
                        {dt(call.departure)}
                      </Typography>
                      {update?.departurePrediction && (
                        <Typography variant="caption" color="primary.main">
                          Live {dt(update.departurePrediction)}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
