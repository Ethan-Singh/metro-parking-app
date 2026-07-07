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
              border: `${lineBadge.border}px solid #fff`,
              boxShadow:
                '0 0 0 1px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.15)',
              color: '#fff',
              fontSize: lineBadge.fontSize,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif',
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
