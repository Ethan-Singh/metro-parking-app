import { Box } from '@mui/material';
import { lineBadge } from '../../../css/lineBadge.ts';
import { routeBrandColor } from '../routeBrandColor.ts';

/** Route identity stays data driven: the published package supplies name and colour. */
export function RouteBadge({ label, color }: { label: string; color: string }) {
  const isOutOfService =
    /out[\s-]?of[\s-]?service|not[\s-]?in[\s-]?service|\bOOS\b/i.test(label);
  const isEmptyTrain = /empty train|\bET\b/i.test(label);
  const isNonRevenue = isEmptyTrain || /non[\s-]?revenue|\bNR\b/i.test(label);
  if (isOutOfService || isNonRevenue) {
    const statusLabel = isOutOfService
      ? label
      : isEmptyTrain
        ? 'Empty Train'
        : 'NR';
    return (
      <Box
        component="span"
        role="img"
        aria-label={
          isOutOfService
            ? 'Out of service'
            : isEmptyTrain
              ? 'Empty train'
              : 'Non-revenue'
        }
        title={
          isOutOfService
            ? 'Out of service'
            : isEmptyTrain
              ? 'Empty train'
              : 'Non revenue'
        }
        sx={{
          ...(isOutOfService
            ? { px: 1, py: 0.5 }
            : isEmptyTrain
              ? {
                  minWidth: 76,
                  height: 32,
                  px: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              : {
                  width: 32,
                  height: 32,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }),
          borderRadius: 1,
          bgcolor: '#ECEFF1',
          color: '#6B7280',
          fontSize: '0.75rem',
          fontWeight: 600,
          lineHeight: 1.2,
          whiteSpace: 'nowrap',
        }}
      >
        {statusLabel}
      </Box>
    );
  }
  const brandColor = routeBrandColor(label, color);
  const config =
    lineBadge.map[label.trim().toUpperCase() as keyof typeof lineBadge.map];
  if (config && 'asset' in config)
    return (
      <Box
        component="img"
        src={config.asset}
        alt={`${label} line`}
        sx={{ width: 32, height: 32, objectFit: 'contain', flex: '0 0 auto' }}
      />
    );
  return (
    <Box
      component="svg"
      viewBox="0 0 56 36"
      role="img"
      aria-label={`${label} line`}
      sx={{ width: 46, height: 30, flex: '0 0 auto' }}
    >
      <rect x="1" y="1" width="54" height="34" rx="8" fill={brandColor} />
      <text
        x="28"
        y="19"
        textAnchor="middle"
        dominantBaseline="central"
        fill="#000000"
        fontSize={label.length > 3 ? 13 : 16}
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </Box>
  );
}
