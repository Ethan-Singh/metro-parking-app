import Box from '@mui/material/Box';
import { facilityLines } from '../config/lineConfig';
import { lineBadge } from '../../../css/lineBadge.ts';
import TrainModeSymbol from '../../../assets/TrainModeSymbol.png';
import MetroModeSymbol from '../../../assets/MetroModeSymbol.png';
import BusModeSymbol from '../../../assets/BusModeSymbol.png';

const modeSymbols = {
  T: { src: TrainModeSymbol, alt: 'Sydney Trains', scale: 1.15 },
  M: { src: MetroModeSymbol, alt: 'Sydney Metro', scale: 1 },
  B: { src: BusModeSymbol, alt: 'Bus service', scale: 1.15 },
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
              role="img"
              aria-label={modeSymbol.alt}
              sx={{
                width: lineBadge.size,
                height: lineBadge.size,
                position: 'relative',
                display: 'block',
                overflow: 'hidden',
                borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow:
                  '0 0 0 1px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.15)',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={modeSymbol.src}
                alt=""
                sx={{
                  position: 'absolute',
                  width: `${modeSymbol.scale * 100}%`,
                  height: `${modeSymbol.scale * 100}%`,
                  maxWidth: 'none',
                  top: `${((1 - modeSymbol.scale) / 2) * 100}%`,
                  left: `${((1 - modeSymbol.scale) / 2) * 100}%`,
                }}
              />
            </Box>
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
              color: 'textColor' in config ? config.textColor : '#fff',
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
