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
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  shape: {
    borderRadius: tokens.radius.primary,
  },

  spacing: 4,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: tokens.gradient.app,
          backgroundAttachment: 'fixed',
          fontVariantNumeric: 'tabular-nums',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            scrollBehavior: 'auto !important',
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
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

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backgroundImage: 'none',
          boxShadow: tokens.shadow.base,
        },
      },
    },
  },
});
