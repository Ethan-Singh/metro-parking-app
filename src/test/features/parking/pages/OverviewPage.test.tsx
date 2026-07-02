import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OverviewPage from '../../../../main/features/parking/pages/OverviewPage';
import * as hooks from '../../../../main/features/parking/api/useParkingQueries';
import * as search from '../../../../main/features/parking/search/useSearch';
import type { ReactNode } from 'react';

type Facility = {
  slug: string;
  facilityName: string;
};

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

const mockData: Facility[] = [
  {
    slug: 'park-ride-ashfield',
    facilityName: 'Ashfield Parking',
  },
  {
    slug: 'park-ride-bella-vista',
    facilityName: 'Bella Vista Parking',
  },
];

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
});
