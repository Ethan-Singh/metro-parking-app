import {
  Box,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DepartureClock } from './DepartureClock.tsx';
import MetroModeSymbol from '../../../assets/MetroModeSymbol.png';
import TrainModeSymbol from '../../../assets/TrainModeSymbol.png';
import { RouteBadge } from './RouteBadge.tsx';

export interface DepartureService {
  kind: 'REGULAR' | 'NON_REVENUE' | 'EMPTY_TRAIN';
  mode: 'METRO' | 'TRAIN' | 'OTHER';
  line: string;
  lineColor: string;
  destination: string;
  platform: string;
  departureAt: string;
  stops: string[];
  following: { destination: string; minutes: number };
}

function DepartureBoard({ service }: { service: DepartureService }) {
  const outOfServicePattern =
    /out[\s-]?of[\s-]?service|not[\s-]?in[\s-]?service|\bOOS\b/i;
  const isOutOfService = outOfServicePattern.test(
    `${service.line} ${service.destination}`
  );
  const statusLabel = isOutOfService
    ? 'Out of service'
    : service.kind === 'EMPTY_TRAIN'
      ? 'Empty Train'
      : service.kind === 'NON_REVENUE'
        ? 'NR'
        : undefined;
  const showDestination =
    service.kind === 'REGULAR' ||
    (isOutOfService && !outOfServicePattern.test(service.destination));
  return (
    <Box>
      <Card
        sx={{
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': { transform: 'none' },
        }}
      >
        <DepartureClock departureAt={service.departureAt} />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ textAlign: 'center', mt: -1 }}
        >
          Departs{' '}
          {new Intl.DateTimeFormat('en-AU', {
            timeZone: 'Australia/Sydney',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date(service.departureAt))}
        </Typography>
        <CardContent sx={{ p: 2, flex: 1 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {service.kind === 'REGULAR' && service.mode !== 'OTHER' && (
              <Box
                component="img"
                src={
                  service.mode === 'METRO' ? MetroModeSymbol : TrainModeSymbol
                }
                alt={service.mode === 'METRO' ? 'Metro' : 'Train'}
                sx={{ width: 28, height: 28, objectFit: 'contain' }}
              />
            )}
            <RouteBadge
              label={statusLabel ?? service.line}
              color={service.lineColor}
            />
            {showDestination && (
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {service.destination}
              </Typography>
            )}
          </Stack>
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              my: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary">
                Platform
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {service.platform}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Stopping at
          </Typography>
          <List disablePadding sx={{ mt: 1 }}>
            {service.stops.map((stop, index) => (
              <ListItem
                key={`${stop}-${index}`}
                disableGutters
                sx={{
                  pl: 2,
                  py: 0.75,
                  borderLeft: '2px solid',
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -4,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  },
                }}
              >
                <Typography variant="body2">{stop}</Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
        <Divider />
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            Following service
          </Typography>
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between' }}
            spacing={1}
          >
            <Typography variant="body2">
              {service.following.destination}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {service.following.minutes} min
            </Typography>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}

export function DepartureGrid({ services }: { services: DepartureService[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
        gap: 2,
      }}
    >
      {services.map((service, index) => (
        <DepartureBoard
          key={`${service.line}-${service.destination}-${index}`}
          service={service}
        />
      ))}
    </Box>
  );
}
