import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../main/services/httpClient.ts', () => ({
  httpGet: vi.fn(),
}));

import type {
  ParkingHistory,
  ParkingOverview,
} from '../../../../main/features/parking/types.ts';
import { httpGet } from '../../../../main/services/httpClient.ts';
import { parkingApi } from '../../../../main/features/parking/api/parkingApi.ts';

const mockedHttpGet = vi.mocked(httpGet);

describe('parkingApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAll calls the correct endpoint and strips the Park&Ride prefix', async () => {
    mockedHttpGet.mockResolvedValue([
      {
        slug: 'park-ride-ashfield',
        facilityName: 'Park&Ride - Ashfield',
        spots: 100,
        occupancy: 40,
        available: 60,
        occupancyRate: 0.4,
        availability: 'AVAILABLE',
        timestamp: '2026-01-01T00:00:00Z',
        ariaLabel: '',
      },
    ] satisfies ParkingOverview[]);

    const result = await parkingApi.getAll();

    expect(httpGet).toHaveBeenCalledWith('/api/v1/parking');

    expect(result[0].facilityName).toBe('Ashfield');
  });

  it('getOverview calls the correct endpoint and transforms the facility name', async () => {
    mockedHttpGet.mockResolvedValue({
      slug: 'park-ride-ashfield',
      facilityName: 'Park&Ride - Ashfield',
      spots: 100,
      occupancy: 40,
      available: 60,
      occupancyRate: 0.4,
      availability: 'AVAILABLE',
      timestamp: '2026-01-01T00:00:00Z',
      ariaLabel: '',
    } satisfies ParkingOverview);

    const result = await parkingApi.getOverview('park-ride-ashfield' as never);

    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/overview'
    );

    expect(result.facilityName).toBe('Ashfield');
  });

  it('getHistory builds the correct query string', async () => {
    mockedHttpGet.mockResolvedValue({
      slug: 'park-ride-ashfield',
      date: '2026-01-01',
      granularity: 'TEN_MINUTE',
      dataPoints: [],
    } satisfies ParkingHistory);

    await parkingApi.getHistory(
      'park-ride-ashfield' as never,
      '2026-01-01',
      '2026-01-07'
    );

    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/history?from=2026-01-01&to=2026-01-07&granularity=TEN_MINUTE'
    );
  });

  it('uses the supplied granularity', async () => {
    mockedHttpGet.mockResolvedValue({} as ParkingHistory);

    await parkingApi.getHistory(
      'park-ride-ashfield' as never,
      '2026-01-01',
      '2026-01-07',
      'DAILY'
    );

    expect(httpGet).toHaveBeenCalledWith(
      '/api/v1/parking/park-ride-ashfield/history?from=2026-01-01&to=2026-01-07&granularity=DAILY'
    );
  });
});
