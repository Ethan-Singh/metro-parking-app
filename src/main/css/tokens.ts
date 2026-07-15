export const tokens = {
  color: {
    primary: '#0084D1',
    secondary: '#D97706',
    success: '#16A34A',
    warning: '#EA580C',
    error: '#9B1C1C',

    text: '#1F2937',
    textMuted: '#6B7280',

    bg: '#FFF3ED',
    surface: 'rgba(255, 255, 255, 0.75)',
    border: 'rgba(217, 119, 6, 0.08)',
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
