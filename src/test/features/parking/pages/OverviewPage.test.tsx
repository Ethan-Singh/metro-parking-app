import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OverviewPage from '../../../../main/features/parking/pages/OverviewPage';
import * as hooks from '../../../../main/features/parking/api/useParkingQueries';
import * as search from '../../../../main/features/parking/search/useSearch';
import type { ReactNode } from 'react';

type Facility = {
  slug: string;
  facilityName: string;
  timeMs: number;
};

const mockData: Facility[] = [
  {
    slug: 'park-ride-ashfield',
    facilityName: 'Park&Ride - Ashfield Parking',
    timeMs: 1785313800000,
  },
  {
    slug: 'park-ride-bella-vista',
    facilityName: 'Park&Ride - Bella Vista Parking',
    timeMs: 1785314100000,
  },
];

vi.mock('../../../../main/features/parking/components/FacilityCard', () => ({
  FacilityCard: ({
    facility,
    title,
  }: {
    facility: Facility;
    title?: string;
  }) => <div data-testid="facility-card">{title ?? facility.facilityName}</div>,
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
  DataCredits: ({ lastUpdated }: { lastUpdated?: number }) => (
    <div data-testid="last-updated">{lastUpdated}</div>
  ),
}));

vi.mock('../../../../main/features/parking/search/SearchBar', () => ({
  SearchBar: ({ label }: { label: string }) => <input aria-label={label} />,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('OverviewPage', () => {
  it('shows Parkings and facility count above its dedicated labeled search box', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof hooks.useParkingQueries>);
    vi.spyOn(search, 'useSearch').mockReturnValue({
      query: '',
    } as ReturnType<typeof search.useSearch>);

    render(<OverviewPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Parkings' })
    ).toBeInTheDocument();
    expect(screen.getByText('2 parking facilities')).toBeInTheDocument();
    expect(
      screen.getByRole('search', { name: 'Search parking facilities' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Find parking' })
    ).toBeInTheDocument();
  });

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
    expect(
      screen.getByRole('button', { name: 'Park & Ride facilities' })
    ).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.queryByRole('button', { name: 'Other facilities' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('Ashfield Parking')).toBeInTheDocument();
    expect(screen.queryByText(/^Park&Ride/)).not.toBeInTheDocument();
  });

  it('shows a collapsed Others group only when a facility is not Park & Ride', () => {
    vi.spyOn(hooks, 'useParkingQueries').mockReturnValue({
      data: [
        ...mockData,
        {
          slug: 'central-station',
          facilityName: 'Central Station',
          timeMs: 1785314400000,
        },
      ],
      isLoading: false,
      isError: false,
    } as unknown as ReturnType<typeof hooks.useParkingQueries>);
    vi.spyOn(search, 'useSearch').mockReturnValue({ query: '' } as ReturnType<
      typeof search.useSearch
    >);

    render(<OverviewPage />);

    expect(
      screen.getByRole('button', { name: 'Other facilities' })
    ).toHaveAttribute('aria-expanded', 'false');
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
      '1785314100000'
    );
  });
});
