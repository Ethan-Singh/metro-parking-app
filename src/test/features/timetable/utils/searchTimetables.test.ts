import { describe, expect, it } from 'vitest';
import type { TimetablePackage } from '../../../../main/features/timetable/api/types.ts';
import { findTimetableOptions } from '../../../../main/features/timetable/utils/searchTimetables.ts';

const day = '2026-10-31';
const at = (time: string) => `${day}T${time}:00+11:00`;

function packageFixture(): TimetablePackage {
  return {
    schemaVersion: '1',
    packageVersion: 'test',
    travelDate: day,
    timezone: 'Australia/Sydney',
    availability: 'AVAILABLE',
    offerings: ['SYDNEY_TRAINS'],
    offeringStatuses: [],
    stops: [
      {
        id: 'central',
        name: 'Central Station',
        kind: 'STATION',
        feedKey: 'trains',
        providerId: '1',
      },
      {
        id: 'redfern',
        name: 'Redfern Station',
        kind: 'STATION',
        feedKey: 'trains',
        providerId: '2',
      },
      {
        id: 'tallawong',
        name: 'Tallawong Station',
        kind: 'STATION',
        feedKey: 'metro',
        providerId: '3',
      },
    ],
    routes: [
      {
        id: 't1',
        offering: 'SYDNEY_TRAINS',
        feedKey: 'trains',
        providerId: 't1',
        shortName: 'T1',
        name: 'T1',
        mode: 'TRAIN',
        servicePurpose: 'REGULAR',
      },
      {
        id: 'metro',
        offering: 'SYDNEY_METRO',
        feedKey: 'metro',
        providerId: 'metro',
        shortName: 'M',
        name: 'Metro',
        mode: 'METRO',
        servicePurpose: 'REGULAR',
      },
    ],
    trips: [
      {
        id: 'trains:direct',
        routeId: 't1',
        serviceDate: day,
        headsign: 'Tallawong',
        servicePurpose: 'REGULAR',
        stopCallStart: 0,
        stopCallCount: 2,
      },
      {
        id: 'trains:empty',
        routeId: 't1',
        serviceDate: day,
        headsign: 'Empty Train',
        servicePurpose: 'REGULAR',
        stopCallStart: 2,
        stopCallCount: 2,
      },
      {
        id: 'trains:feeder',
        routeId: 't1',
        serviceDate: day,
        headsign: 'Redfern',
        servicePurpose: 'REGULAR',
        stopCallStart: 4,
        stopCallCount: 2,
      },
      {
        id: 'metro:connection',
        routeId: 'metro',
        serviceDate: day,
        headsign: 'Tallawong',
        servicePurpose: 'REGULAR',
        stopCallStart: 6,
        stopCallCount: 2,
      },
    ],
    calls: [
      {
        tripId: 'trains:direct',
        sequence: 1,
        stopId: 'central',
        arrival: at('12:00'),
        departure: at('12:00'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'trains:direct',
        sequence: 2,
        stopId: 'tallawong',
        arrival: at('12:40'),
        departure: at('12:40'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'trains:empty',
        sequence: 1,
        stopId: 'central',
        arrival: at('12:01'),
        departure: at('12:01'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'trains:empty',
        sequence: 2,
        stopId: 'tallawong',
        arrival: at('12:41'),
        departure: at('12:41'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'trains:feeder',
        sequence: 1,
        stopId: 'central',
        arrival: at('12:05'),
        departure: at('12:05'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'trains:feeder',
        sequence: 2,
        stopId: 'redfern',
        arrival: at('12:15'),
        departure: at('12:15'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'metro:connection',
        sequence: 1,
        stopId: 'redfern',
        arrival: at('12:18'),
        departure: at('12:18'),
        timezone: 'Australia/Sydney',
      },
      {
        tripId: 'metro:connection',
        sequence: 2,
        stopId: 'tallawong',
        arrival: at('12:50'),
        departure: at('12:50'),
        timezone: 'Australia/Sydney',
      },
    ],
  } as TimetablePackage;
}

describe('findTimetableOptions', () => {
  it('returns direct passenger services after the requested start time and excludes empty trains', () => {
    const options = findTimetableOptions(
      packageFixture(),
      'central',
      'tallawong',
      `${day}T12:00:00`,
      180
    );

    const direct = options.filter((option) => option.transfers === 0);
    expect(direct).toHaveLength(1);
    expect(direct[0]?.trip.id).toBe('trains:direct');
    expect(options.every((option) => option.trip.id !== 'trains:empty')).toBe(
      true
    );
  });

  it('finds a transfer when the connection meets the global minimum', () => {
    const options = findTimetableOptions(
      packageFixture(),
      'central',
      'tallawong',
      `${day}T12:04:00`,
      180
    );

    expect(options.some((option) => option.transfers === 1)).toBe(true);
    expect(
      options
        .find((option) => option.transfers === 1)
        ?.calls.map((call) => call.stopId)
    ).toEqual(['central', 'redfern', 'tallawong']);
  });

  it('returns no options for invalid or identical stops', () => {
    const pkg = packageFixture();

    expect(
      findTimetableOptions(pkg, 'central', 'central', `${day}T11:00:00`, 180)
    ).toEqual([]);
    expect(
      findTimetableOptions(pkg, 'missing', 'tallawong', `${day}T11:00:00`, 180)
    ).toEqual([]);
  });
});
