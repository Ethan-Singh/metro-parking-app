import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const theme = createTheme({
  palette: {
    primary: { main: tokens.color.primary },
    secondary: { main: tokens.color.secondary },
    success: { main: tokens.color.success },
    warning: { main: tokens.color.warning },
    error: { main: tokens.color.error },

    text: {
      primary: tokens.color.text,
      secondary: tokens.color.textMuted,
    },

    background: {
      default: tokens.color.bg,
      paper: tokens.color.surface,
    },

    divider: tokens.color.border,
  },

  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },

  shape: {
    borderRadius: tokens.radius,
  },

  spacing: 4,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'linear-gradient(180deg, #C8E8F8 0%, #DCF0FA 35%, #EAF5FC 100%)',
          backgroundAttachment: 'fixed',
          fontVariantNumeric: 'tabular-nums',
        },
      },
    },

    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          background: tokens.color.surface,
          border: '1px solid rgba(255, 255, 255, 0.90)',
          boxShadow: tokens.shadow.base,
          transition: `transform ${tokens.motion.hoverTransitionMs}ms ease, box-shadow ${tokens.motion.hoverTransitionMs}ms ease`,

          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: tokens.shadow.hover,
          },
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,
          '&:last-child': {
            paddingBottom: 16,
          },
        },
      },
    },
  },
});
