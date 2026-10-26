import { describe, it, expect } from 'vitest';
import { parkingKeys } from '../../../../main/features/parking/api/useParkingQueries';

describe('parkingKeys', () => {
  it('creates the root key', () => {
    expect(parkingKeys.all()).toEqual(['parking']);
  });

  it('creates the list key', () => {
    expect(parkingKeys.list()).toEqual(['parking', 'list']);
  });

  it('creates the facility live key', () => {
    expect(parkingKeys.live('park-ride-ashfield')).toEqual([
      'parking',
      'live',
      'park-ride-ashfield',
    ]);
  });

  it('creates the history key', () => {
    expect(
      parkingKeys.history('park-ride-ashfield', '2026-01-01', '2026-01-07', 7, 'AUTO')
    ).toEqual([
      'parking',
      'history',
      'park-ride-ashfield',
      '2026-01-01',
      '2026-01-07',
      7,
      'AUTO',
    ]);
  });
});
