import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import FacilityPage from '../../../../main/features/parking/pages/FacilityPage';
import * as router from 'react-router-dom';
import * as hooks from '../../../../main/features/parking/api/useParkingQueries';
import type { NavigateFunction } from 'react-router-dom';
import React from 'react';
import type {
  DailyParkingMetrics,
  LiveCarPark,
  ParkingHistory,
} from '../../../../main/features/parking/types';
import type { UseQueryResult } from '@tanstack/react-query';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof router>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

vi.mock('../../../../main/features/parking/api/useParkingQueries', () => ({
  useFacilityLive: vi.fn(),
  useFacilityHistory: vi.fn(),
  useFacilityRecentHistory: vi.fn(),
  useFacilityDailyMetrics: vi.fn(),
}));

vi.mock(
  '../../../../main/features/parking/components/FacilityHistoryChart',
  () => ({
    FacilityHistoryChart: () =>
      React.createElement('div', { 'data-testid': 'chart' }),
  })
);

vi.mock('../../../../main/features/parking/components/QueryBoundary', () => ({
  QueryBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

const navigateMock: NavigateFunction = vi.fn();

const mockOverview: LiveCarPark = {
  slug: 'park-ride-ashfield',
  facilityName: 'Ashfield',
  spots: 100,
  occupancy: 50,
  available: 10,
  occupancyRate: 0.5,
  availability: 'AVAILABLE',
  timeMs: 1767261600000,
  ariaLabel: '',
};

const mockHistory: ParkingHistory = {
  from: '2026-06-24',
  to: '2026-06-30',
  resolution: 'TEN_MINUTE',
  points: [[1782230400000, 0.5, 50]],
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(router.useNavigate).mockReturnValue(navigateMock);

  vi.mocked(router.useParams).mockReturnValue({
    slug: 'park-ride-ashfield',
  });

  vi.mocked(hooks.useFacilityLive).mockReturnValue({
    data: mockOverview,
    isLoading: false,
    isError: false,
  } as unknown as UseQueryResult<typeof mockOverview, Error>);

  vi.mocked(hooks.useFacilityHistory).mockReturnValue({
    data: mockHistory,
    isLoading: false,
    isError: false,
  } as unknown as UseQueryResult<typeof mockHistory, Error>);

  vi.mocked(hooks.useFacilityRecentHistory).mockReturnValue({
    data: mockHistory,
    isLoading: false,
    isError: false,
  } as unknown as UseQueryResult<typeof mockHistory, Error>);

  vi.mocked(hooks.useFacilityDailyMetrics).mockReturnValue({
    data: {
      from: '2026-06-28',
      to: '2026-06-30',
      timeZone: 'Australia/Sydney',
      days: [
        {
          date: '2026-06-28',
          expectedFreeAt7am: 40,
          expectedFreeAt8am: 30,
          crossed50AtMs: null,
          crossed90AtMs: null,
          fullAtMs: null,
        },
      ],
    },
    isLoading: false,
    isError: false,
  } as unknown as UseQueryResult<DailyParkingMetrics, Error>);
});

describe('FacilityPage', () => {
  it('renders facility name', () => {
    render(<FacilityPage />);
    expect(screen.getByText('Ashfield')).toBeInTheDocument();
  });

  it('renders metrics correctly', () => {
    render(<FacilityPage />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('Available spaces')).toBeInTheDocument();
    expect(screen.getByText('Parking spaces')).toBeInTheDocument();
    expect(screen.queryByText('50% occupied')).not.toBeInTheDocument();
  });

  it('renders chart', () => {
    render(<FacilityPage />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(hooks.useFacilityHistory).toHaveBeenCalledWith(
      'park-ride-ashfield',
      1,
      'TEN_MINUTE'
    );
  });

  it('keeps commuter metrics in their own card above the historical chart', () => {
    render(<FacilityPage />);
    const metricsCard = screen.getByTestId('daily-commuter-metrics-card');
    const chart = screen.getByTestId('chart');
    expect(metricsCard).toBeInTheDocument();
    expect(within(metricsCard).getByLabelText('Weekend')).toBeInTheDocument();
    expect(
      metricsCard.compareDocumentPosition(chart) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('navigates back on click', () => {
    render(<FacilityPage />);

    fireEvent.click(screen.getByText('Back'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('shows error when slug missing', () => {
    vi.mocked(router.useParams).mockReturnValueOnce({
      slug: undefined,
    });

    render(<FacilityPage />);

    expect(screen.getByText(/missing facility slug/i)).toBeInTheDocument();
  });
});
