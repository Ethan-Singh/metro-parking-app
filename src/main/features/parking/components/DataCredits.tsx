import { Box, Chip, Typography, Stack, Skeleton } from '@mui/material';
import { Info, CheckCircle } from '@mui/icons-material';
import { tokens } from '../../../css/tokens.ts';
import TFNSWLogo from '../../../assets/TFNSW.png';

interface Props {
  lastUpdated?: string;
  isFresh?: boolean;
  isLoading?: boolean;
}

export function DataCredits({
  lastUpdated,
  isFresh = true,
  isLoading = false,
}: Props) {
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return 'Just now';
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          px: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: tokens.radius,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Stack spacing={0.5} sx={{ flex: 1, minWidth: 200 }}>
          <Skeleton variant="text" width="60%" height={16} />
          <Skeleton variant="text" width="40%" height={12} />
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Skeleton variant="rounded" width={28} height={28} />
          <Skeleton variant="rounded" width={100} height={32} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 3,
        px: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: tokens.radius,
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info fontSize="small" sx={{ color: tokens.color.primary }} />
          <Typography variant="caption" color="text.secondary">
            Data provided by Transport for NSW
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: tokens.color.textMuted, fontSize: '0.7rem' }}
        >
          Last updated: {lastUpdated ? getTimeAgo(lastUpdated) : 'Never'}
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isFresh && (
          <Chip
            icon={
              <CheckCircle
                sx={{
                  color: `${tokens.color.success} !important`,
                }}
              />
            }
            label="Live Data"
            size="small"
            sx={{
              backgroundColor: `${tokens.color.success}15`,
              color: tokens.color.success,
              fontWeight: 600,
            }}
          />
        )}
        <Box
          component="img"
          src={TFNSWLogo}
          alt="Transport for NSW"
          sx={{
            height: 28,
            width: 'auto',
          }}
        />
      </Box>
    </Box>
  );
}
