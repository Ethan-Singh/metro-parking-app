import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FacilityCard } from '../../../../main/features/parking/components/FacilityCard';
import * as router from 'react-router-dom';
import * as availabilityUtil from '../../../../main/features/parking/utils/availability';
import type { NavigateFunction } from 'react-router-dom';
import type { ParkingOverview } from '../../../../main/features/parking/types';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof router>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('../../../../main/features/parking/utils/availability', () => ({
  getAvailability: vi.fn(),
}));

const navigateMock: NavigateFunction = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(router.useNavigate).mockReturnValue(navigateMock);

  vi.mocked(availabilityUtil.getAvailability).mockReturnValue({
    color: 'green',
    icon: () => null,
  } as unknown as ReturnType<typeof availabilityUtil.getAvailability>);
});

const mockFacility: ParkingOverview = {
  slug: 'park-ride-ashfield',
  facilityName: 'Ashfield Parking',
  spots: 100,
  occupancy: 40,
  available: 60,
  occupancyRate: 0.4,
  availability: 'AVAILABLE',
  timestamp: '2026-01-01T10:00:00Z',
  ariaLabel: '',
};

describe('FacilityCard', () => {
  it('renders facility name and occupancy', () => {
    render(<FacilityCard facility={mockFacility} />);

    expect(screen.getByText('Ashfield Parking')).toBeInTheDocument();
    expect(screen.getByText('40 / 100')).toBeInTheDocument();
  });

  it('navigates when clicked', () => {
    render(<FacilityCard facility={mockFacility} />);

    fireEvent.click(screen.getByText('Ashfield Parking'));

    expect(navigateMock).toHaveBeenCalledWith('/facility/park-ride-ashfield');
  });

  it('renders availability label', () => {
    render(<FacilityCard facility={mockFacility} />);

    expect(screen.getByText('AVAILABLE')).toBeInTheDocument();
  });
});
