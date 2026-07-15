import { Cancel, CheckCircle, WarningAmber } from '@mui/icons-material';
import { tokens } from './tokens.ts';

export const availabilityConfig = {
  AVAILABLE: {
    color: tokens.color.success,
    icon: CheckCircle,
  },
  ALMOST_FULL: {
    color: tokens.color.warning,
    icon: WarningAmber,
  },
  FULL: {
    color: tokens.color.error,
    icon: Cancel,
  },
} as const;
