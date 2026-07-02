import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FacilityPage from '../../../../main/features/parking/pages/FacilityPage';
import * as router from 'react-router-dom';
import * as hooks from '../../../../main/features/parking/api/useParkingQueries';
import type { NavigateFunction } from 'react-router-dom';
import React from 'react';
import type {
  ParkingOverview,
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
  useFacilityOverview: vi.fn(),
  useFacilityHistory: vi.fn(),
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

const mockOverview: ParkingOverview = {
  slug: 'park-ride-ashfield',
  facilityName: 'Ashfield',
  spots: 100,
  occupancy: 50,
  available: 10,
  occupancyRate: 0.5,
  availability: 'AVAILABLE',
  timestamp: '2026-01-01T10:00:00Z',
  ariaLabel: '',
};

const mockHistory: ParkingHistory = {
  slug: 'park-ride-ashfield',
  date: '2026-06-24',
  granularity: 'TEN_MINUTE',
  dataPoints: [
    {
      timestamp: '2026-06-24T00:00:00Z',
      occupancy: 50,
      available: 50,
      occupancyRate: 0.5,
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(router.useNavigate).mockReturnValue(navigateMock);

  vi.mocked(router.useParams).mockReturnValue({
    slug: 'park-ride-ashfield',
  });

  vi.mocked(hooks.useFacilityOverview).mockReturnValue({
    data: mockOverview,
    isLoading: false,
    isError: false,
  } as unknown as UseQueryResult<typeof mockOverview, Error>);

  vi.mocked(hooks.useFacilityHistory).mockReturnValue({
    data: mockHistory,
    isLoading: false,
    isError: false,
  } as unknown as UseQueryResult<typeof mockHistory, Error>);
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
  });

  it('renders chart', () => {
    render(<FacilityPage />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
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
