import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../main/services/httpClient.ts', () => ({
  httpGet: vi.fn(),
}));

import type {
  DailyParkingMetrics,
  LiveCarPark,
  ParkingHistory,
} from '../../../../main/features/parking/types.ts';
import { httpGet } from '../../../../main/services/httpClient.ts';
import { parkingApi } from '../../../../main/features/parking/api/parkingApi.ts';

const mockedHttpGet = vi.mocked(httpGet);
const live: LiveCarPark = {
  slug: 'park-ride-ashfield',
  facilityName: 'Ashfield',
  spots: 100,
  occupancy: 40,
  available: 60,
  occupancyRate: 0.4,
  availability: 'AVAILABLE',
  timeMs: 1767225600000,
  ariaLabel: 'Ashfield, 60 of 100 spots available',
};

describe('parkingApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches the live list using the wire DTO without mutating fields', async () => {
    mockedHttpGet.mockResolvedValue([live]);
    await expect(parkingApi.getAll()).resolves.toEqual([live]);
    expect(httpGet).toHaveBeenCalledWith('/api/v1/parking');
  });

  it('uses the live endpoint and encodes the slug', async () => {
    mockedHttpGet.mockResolvedValue(live);
    await parkingApi.getLive('park-ride-ashfield');
    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/live'
    );
  });

  it('requests daily metrics with the requested date range', async () => {
    const metrics: DailyParkingMetrics = {
      from: '2026-10-25',
      to: '2026-10-27',
      timeZone: 'Australia/Sydney',
      days: [
        {
          date: '2026-10-27',
          expectedFreeAt7am: 179,
          expectedFreeAt8am: 136,
          crossed50AtMs: 1793019600000,
          crossed90AtMs: null,
          fullAtMs: null,
        },
      ],
    };
    mockedHttpGet.mockResolvedValue(metrics);

    await expect(
      parkingApi.getDailyMetrics(
        'park-ride-ashfield',
        '2026-10-25',
        '2026-10-27'
      )
    ).resolves.toEqual(metrics);
    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/metrics/daily?from=2026-10-25&to=2026-10-27'
    );
  });

  it('requests history with the contract resolution parameter', async () => {
    mockedHttpGet.mockResolvedValue({
      from: '2026-01-01',
      to: '2026-01-07',
      resolution: 'TEN_MINUTE',
      points: [[1767225600000, 0.4, 60]],
    } satisfies ParkingHistory);

    await parkingApi.getHistory(
      'park-ride-ashfield',
      '2026-01-01',
      '2026-01-07'
    );
    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/history?from=2026-01-01&to=2026-01-07&resolution=AUTO'
    );
  });

  it('uses the selected resolution', async () => {
    mockedHttpGet.mockResolvedValue({} as ParkingHistory);
    await parkingApi.getHistory(
      'park-ride-ashfield',
      '2026-01-01',
      '2026-01-07',
      'SIX_HOUR'
    );
    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/history?from=2026-01-01&to=2026-01-07&resolution=SIX_HOUR'
    );
  });
});
