import Box from '@mui/material/Box';
import { facilityLines } from '../config/lineConfig';
import { lineBadge } from '../../../css/lineBadge.ts';
import TrainModeSymbol from '../../../assets/TrainModeSymbol.png';
import MetroModeSymbol from '../../../assets/MetroModeSymbol.png';

const modeSymbols = {
  T: { src: TrainModeSymbol, alt: 'Sydney Trains' },
  M: { src: MetroModeSymbol, alt: 'Sydney Metro' },
} as const;

type Line = keyof typeof lineBadge.map;

export function LineBadge({ slug }: { slug: string }) {
  const lines =
    (facilityLines as Record<string, readonly Line[] | undefined>)[slug] ?? [];

  if (!lines.length) return null;

  return (
    <Box sx={{ display: 'flex', gap: 0.5 }}>
      {lines.map((line) => {
        const config = lineBadge.map[line];
        const modeSymbol =
          line in modeSymbols
            ? modeSymbols[line as keyof typeof modeSymbols]
            : undefined;

        if (!config) return null;

        if (modeSymbol) {
          return (
            <Box
              key={line}
              component="img"
              src={modeSymbol.src}
              alt={modeSymbol.alt}
              sx={{
                width: lineBadge.size,
                height: lineBadge.size,
                display: 'block',
                borderRadius: '50%',
                border: `${lineBadge.border}px solid #fff`,
                boxShadow:
                  '0 0 0 1px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.15)',
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
              border: `${lineBadge.border}px solid #fff`,
              boxShadow:
                '0 0 0 1px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.15)',
              color: '#fff',
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
