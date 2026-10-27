import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { FacilityCard } from '../../../../main/features/parking/components/FacilityCard';
import { MemoryRouter } from 'react-router-dom';
import * as availabilityUtil from '../../../../main/features/parking/utils/availability';
import type { LiveCarPark } from '../../../../main/features/parking/types';

vi.mock('../../../../main/features/parking/utils/availability', () => ({
  getAvailability: vi.fn(),
}));
vi.mock('../../../../main/features/parking/api/useParkingQueries.ts', () => ({
  useFacilityRecentHistory: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
  useFacilityDailyMetrics: () => ({
    data: undefined,
    isLoading: false,
    isError: false,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(availabilityUtil.getAvailability).mockReturnValue({
    color: 'green',
    icon: () => null,
  } as unknown as ReturnType<typeof availabilityUtil.getAvailability>);
});

const mockFacility: LiveCarPark = {
  slug: 'park-ride-ashfield',
  facilityName: 'Ashfield Parking',
  spots: 100,
  occupancy: 40,
  available: 60,
  occupancyRate: 0.4,
  availability: 'AVAILABLE',
  timeMs: 1767261600000,
  ariaLabel: '',
};

describe('FacilityCard', () => {
  it('renders facility name and occupancy', () => {
    render(
      <MemoryRouter>
        <FacilityCard facility={mockFacility} />
      </MemoryRouter>
    );

    expect(screen.getByText('Ashfield Parking')).toBeInTheDocument();
    expect(screen.getByText('40 / 100')).toBeInTheDocument();
  });

  it('exposes facility navigation as a semantic link', () => {
    render(
      <MemoryRouter>
        <FacilityCard facility={mockFacility} />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('link', { name: 'Ashfield Parking' })
    ).toHaveAttribute('href', '/facility/park-ride-ashfield');
  });

  it('renders availability label', () => {
    render(
      <MemoryRouter>
        <FacilityCard facility={mockFacility} />
      </MemoryRouter>
    );

    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });

  it('exposes occupancy as a labelled progress indicator', () => {
    render(
      <MemoryRouter>
        <FacilityCard facility={mockFacility} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('progressbar', { name: 'Ashfield Parking occupancy' })
    ).toHaveAttribute('aria-valuenow', '40');
    expect(
      screen.getByRole('progressbar', { name: 'Ashfield Parking occupancy' })
    ).toHaveAttribute('aria-valuetext', '40 of 100 spaces occupied (40% full)');
  });

  it('opens quick view independently from facility navigation', () => {
    render(
      <MemoryRouter>
        <FacilityCard facility={mockFacility} />
      </MemoryRouter>
    );

    const quickView = screen.getByRole('button', { name: /quick view/i });
    fireEvent.click(quickView);

    expect(quickView).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Daily commuter metrics')).toBeInTheDocument();
    expect(
      screen.getByText(/No commuter metrics are available/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No 10-minute occupancy samples are available/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Ashfield Parking' })
    ).toHaveAttribute('href', '/facility/park-ride-ashfield');
  });
});
