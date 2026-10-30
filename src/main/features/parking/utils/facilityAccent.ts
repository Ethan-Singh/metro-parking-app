import { tokens } from '../../../css/tokens.ts';
import { lineBadge } from '../../../css/lineBadge.ts';
import { facilityLines } from '../config/lineConfig.ts';

interface Accent {
  background: string;
  foreground: string;
  icon: string;
  heading: string;
}

/** Match facility highlights to its primary transit mode, favoring rail over bus. */
export function getFacilityAccent(slug?: string): Accent {
  const lines = slug
    ? facilityLines[slug as keyof typeof facilityLines]
    : undefined;
  const primaryLine =
    lines?.find((line) => line === 'T' || line === 'M') ?? lines?.[0];
  const config = primaryLine ? lineBadge.map[primaryLine] : undefined;

  if (config) {
    const isTrain = primaryLine === 'T';
    return {
      background:
        'accentColor' in config ? String(config.accentColor) : config.color,
      foreground: 'textColor' in config ? config.textColor : '#fff',
      icon:
        isTrain || primaryLine === 'B'
          ? '#fff'
          : 'textColor' in config
            ? config.textColor
            : '#fff',
      heading:
        isTrain || primaryLine === 'B'
          ? '#fff'
          : 'textColor' in config
            ? config.textColor
            : '#fff',
    };
  }

  return {
    background: tokens.color.grassDark,
    foreground: '#fff',
    icon: '#fff',
    heading: '#fff',
  };
}
