const palette = {
  // Core brand palette: sky blue, sunrise peach, grass green, and graph blue.
  sky: '#91CCFF',
  sunrise: '#FFE7D6',
  grass: '#CFE4C9',
  grassDark: '#3F7047',
  blue: '#0084D1',
} as const;

export const tokens = {
  color: {
    ...palette,
    primary: palette.blue,
    secondary: '#D97706',
    success: '#16A34A',
    warning: '#EA580C',
    error: '#9B1C1C',

    text: '#1F2937',
    textMuted: '#6B7280',

    bg: '#FFF3ED',
    surface: 'rgba(255, 255, 255, 0.75)',
    surfaceRaised: 'rgba(255, 255, 255, 0.68)',
    border: 'rgba(217, 119, 6, 0.08)',
    primaryBorder: 'rgba(0, 132, 209, 0.14)',
    primaryBorderStrong: 'rgba(0, 132, 209, 0.24)',
    primaryBorderSubtle: 'rgba(0, 132, 209, 0.08)',
    railBoardPast: '#F1F8FB',
    railBoardSurface: '#F3F6F8',
    railBoardGrid: '#D6E0E5',
    transparent: 'rgba(255, 255, 255, 0.3)',
  },

  gradient: {
    app: `linear-gradient(180deg, ${palette.sky} 0%, ${palette.sunrise} 35%, ${palette.grass} 100%)`,
  },

  radius: {
    primary: 14,
    secondary: 0.5,
  },

  shadow: {
    base: '0 4px 12px rgba(10,79,166,0.08)',
    hover: '0 12px 32px rgba(10,79,166,0.12)',
  },

  motion: {
    hoverTransitionMs: 300,
  },
} as const;
