import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

export function DepartureClock({ departureAt }: { departureAt: string }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const theme = useTheme();
  const blue = theme.palette.primary.main;
  const ink = theme.palette.text.primary;
  const muted = theme.palette.text.secondary;
  const scheduledTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date(departureAt));
  const scheduledPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(scheduledTime.find((part) => part.type === type)?.value ?? 0);
  const departureHour = scheduledPart('hour');
  const departureMinute = scheduledPart('minute');
  const departureSecond = scheduledPart('second');
  const departureLabel = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(departureAt));
  const remaining = Math.max(
    0,
    Math.ceil((new Date(departureAt).getTime() - now) / 1000)
  );
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const countdown = hours
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
      >
        Next train
      </Typography>
      <Box
        component="svg"
        viewBox="0 0 160 160"
        role="img"
        aria-label={`Train departs at ${departureLabel}. ${hours ? `${hours} hours, ` : ''}${minutes} minutes and ${seconds} seconds remaining`}
        sx={{
          display: 'block',
          width: '100%',
          maxWidth: 158,
          height: 'auto',
          mx: 'auto',
          my: 1.5,
        }}
      >
        <circle
          cx="80"
          cy="80"
          r="76"
          fill={theme.palette.common.white}
          stroke={alpha(blue, 0.28)}
          strokeWidth="2"
        />
        {Array.from({ length: 60 }, (_, i) => (
          <line
            key={`tick-${i}`}
            x1="80"
            y1={i % 5 === 0 ? 11 : 13}
            x2="80"
            y2={i % 5 === 0 ? 19 : 16}
            stroke={alpha(ink, i % 5 === 0 ? 0.7 : 0.35)}
            strokeWidth={i % 5 === 0 ? 2 : 1}
            transform={`rotate(${i * 6} 80 80)`}
          />
        ))}
        {Array.from({ length: 12 }, (_, i) => {
          const number = i + 1;
          const angle = (number * Math.PI) / 6;
          return (
            <text
              key={number}
              x={80 + 54 * Math.sin(angle)}
              y={80 - 54 * Math.cos(angle)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={muted}
              fontSize="11"
              fontFamily={theme.typography.fontFamily}
            >
              {number}
            </text>
          );
        })}
        <line
          x1="80"
          y1="86"
          x2="80"
          y2="43"
          stroke={ink}
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${(departureHour % 12) * 30 + departureMinute * 0.5 + departureSecond / 120} 80 80)`}
        />
        <line
          x1="80"
          y1="89"
          x2="80"
          y2="25"
          stroke={blue}
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${departureMinute * 6 + departureSecond * 0.1} 80 80)`}
        />
        <line
          x1="80"
          y1="92"
          x2="80"
          y2="17"
          stroke={alpha(ink, 0.55)}
          strokeWidth="1.5"
          strokeLinecap="round"
          transform={`rotate(${departureSecond * 6} 80 80)`}
        />
        <circle cx="80" cy="80" r="4" fill={blue} />
      </Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}
      >
        {countdown}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {remaining <= 0 ? 'Due now' : 'Until departure'}
      </Typography>
    </Box>
  );
}
