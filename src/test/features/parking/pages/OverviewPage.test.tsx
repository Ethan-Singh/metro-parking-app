import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OverviewPage from '../../../../main/features/parking/pages/OverviewPage';
import * as hooks from '../../../../main/features/parking/api/useParkingQueries';
import * as search from '../../../../main/features/parking/search/useSearch';
import type { ReactNode } from 'react';

type Facility = {
  slug: string;
  facilityName: string;
  timestamp: string;
};

const mockData: Facility[] = [
  {
    slug: 'park-ride-ashfield',
    facilityName: 'Ashfield Parking',
    timestamp: '2026-07-29T08:30:00',
  },
  {
    slug: 'park-ride-bella-vista',
    facilityName: 'Bella Vista Parking',
    timestamp: '2026-07-29T08:35:00',
  },
];

vi.mock('../../../../main/features/parking/components/FacilityCard', () => ({
  FacilityCard: ({ facility }: { facility: Facility }) => (
    <div data-testid="facility-card">{facility.facilityName}</div>
  ),
}));

vi.mock('../../../../main/features/parking/components/QueryBoundary', () => ({
  QueryBoundary: ({
    children,
  }: {
    children: ReactNode;
    isLoading: boolean;
    isError: boolean;
  }) => <>{children}</>,
}));

vi.mock('../../../../main/features/parking/components/DataCredits', () => ({
  DataCredits: ({ lastUpdated }: { lastUpdated?: string }) => (
    <div data-testid="last-updated">{lastUpdated}</div>
  ),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OverviewPage', () => {
  it('shows loading state', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    } as unknown as ReturnType<typeof hooks.useParkingQueries>);

    vi.spyOn(search, 'useSearch').mockReturnValue({
      query: '',
    } as ReturnType<typeof search.useSearch>);

    render(<OverviewPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders all facilities when no search query', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof hooks.useParkingQueries>);

    vi.spyOn(search, 'useSearch').mockReturnValue({
      query: '',
    } as ReturnType<typeof search.useSearch>);

    render(<OverviewPage />);

    expect(screen.getAllByTestId('facility-card')).toHaveLength(2);
  });

  it('filters by facility name', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof hooks.useParkingQueries>);

    vi.spyOn(search, 'useSearch').mockReturnValue({
      query: 'ashfield',
    } as ReturnType<typeof search.useSearch>);

    render(<OverviewPage />);

    expect(screen.getAllByTestId('facility-card')).toHaveLength(1);
    expect(screen.getByText('Ashfield Parking')).toBeInTheDocument();
  });

  it('filters by slug', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof hooks.useParkingQueries>);

    vi.spyOn(search, 'useSearch').mockReturnValue({
      query: 'bella-vista',
    } as ReturnType<typeof search.useSearch>);

    render(<OverviewPage />);

    expect(screen.getAllByTestId('facility-card')).toHaveLength(1);
    expect(screen.getByText('Bella Vista Parking')).toBeInTheDocument();
  });

  it('uses the most recent facility timestamp for data credits', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof hooks.useParkingQueries>);

    vi.spyOn(search, 'useSearch').mockReturnValue({
      query: '',
    } as ReturnType<typeof search.useSearch>);

    render(<OverviewPage />);

    expect(screen.getByTestId('last-updated')).toHaveTextContent(
      '2026-07-29T08:35:00'
    );
  });
});
