import { describe, expect, it } from 'vitest';
import { getFacilityAccent } from '../../../../main/features/parking/utils/facilityAccent.ts';

describe('getFacilityAccent', () => {
  it('uses the Sydney Trains badge color for train facilities', () => {
    expect(getFacilityAccent('park-ride-ashfield')).toEqual({
      background: '#EC6606',
      foreground: '#fff',
      icon: '#fff',
      heading: '#fff',
    });
  });

  it('prioritizes Metro over a connected bus service', () => {
    expect(getFacilityAccent('park-ride-bella-vista')).toEqual({
      background: '#168388',
      foreground: '#fff',
      icon: '#fff',
      heading: '#fff',
    });
  });

  it('uses the bus badge color when the facility has no rail connection', () => {
    expect(getFacilityAccent('park-ride-brookvale')).toEqual({
      background: '#009ED7',
      foreground: '#fff',
      icon: '#fff',
      heading: '#fff',
    });
  });

  it('uses the app green for facilities without a mapped service', () => {
    expect(getFacilityAccent('unmapped-facility')).toEqual({
      background: '#3F7047',
      foreground: '#fff',
      icon: '#fff',
      heading: '#fff',
    });
  });
});
