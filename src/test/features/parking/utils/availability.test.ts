import { describe, it, expect } from 'vitest';
import CheckCircle from '@mui/icons-material/CheckCircle';
import WarningAmber from '@mui/icons-material/WarningAmber';
import Cancel from '@mui/icons-material/Cancel';
import { getAvailability } from '../../../../main/features/parking/utils/availability.ts';

describe('getAvailability', () => {
  it('returns AVAILABLE config', () => {
    const result = getAvailability('AVAILABLE');

    expect(result.color).toBe('#16A34A');
    expect(result.icon).toBe(CheckCircle);
  });

  it('returns ALMOST_FULL config', () => {
    const result = getAvailability('ALMOST_FULL');

    expect(result.color).toBe('#EA580C');
    expect(result.icon).toBe(WarningAmber);
  });

  it('returns FULL config', () => {
    const result = getAvailability('FULL');

    expect(result.color).toBe('#9B1C1C');
    expect(result.icon).toBe(Cancel);
  });
});
