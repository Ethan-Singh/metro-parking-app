export const tokens = {
  color: {
    primary: '#0A4FA6',
    secondary: '#0097B8',
    success: '#007D66',
    warning: '#92610A',
    error: '#9B1C1C',

    text: '#0C1C2E',
    textMuted: '#3D5166',

    bg: '#DCF0FA',
    surface: 'rgba(255, 255, 255, 0.80)',
    border: 'rgba(10, 79, 166, 0.10)',
  },

  radius: 14,

  shadow: {
    base: '0 4px 12px rgba(10,79,166,0.08)',
    hover: '0 12px 32px rgba(10,79,166,0.12)',
  },

  motion: {
    hoverTransitionMs: 300,
  },
} as const;
