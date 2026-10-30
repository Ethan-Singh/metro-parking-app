import Box from '@mui/material/Box';
import { facilityLines } from '../config/lineConfig';
import { lineBadge } from '../../../css/lineBadge.ts';

type Line = keyof typeof lineBadge.map;

export function LineBadge({ slug }: { slug: string }) {
  const lines =
    (facilityLines as Record<string, readonly Line[] | undefined>)[slug] ?? [];

  if (!lines.length) return null;

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {lines.map((line) => {
        const config = lineBadge.map[line];

        if (!config) return null;

        if ('asset' in config) {
          return (
            <Box
              component="img"
              key={line}
              src={config.asset}
              alt={`${line} transit line`}
              sx={{
                width: lineBadge.size,
                height: lineBadge.size,
                display: 'block',
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />
          );
        }

        return (
          <Box
            key={line}
            sx={{
              width: lineBadge.size,
              height: lineBadge.size,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: config.color,
              color: 'textColor' in config ? String(config.textColor) : '#fff',
              fontSize: lineBadge.fontSize,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              flexShrink: 0,
            }}
          >
            {line}
          </Box>
        );
      })}
    </Box>
  );
}
