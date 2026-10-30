import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LineBadge } from '../../../../main/features/parking/components/LineBadge';

vi.mock('../../../../main/features/parking/config/lineConfig', () => ({
  facilityLines: {
    'park-ride-ashfield': ['T1', 'T2'],
    'park-ride-metro-train': ['M', 'T'],
    'park-ride-bus': ['B'],
    'park-ride-empty': [],
  },
}));

vi.mock('../../../../main/css/lineBadge', () => ({
  lineBadge: {
    size: 20,
    border: 1,
    fontSize: 12,
    map: {
      T1: { color: 'red' },
      T2: { color: 'blue' },
      M: { color: 'teal', asset: 'metro.webp' },
      T: { color: 'orange', asset: 'train.webp' },
      B: { color: 'blue', asset: 'bus.webp' },
    },
  },
}));

describe('LineBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no lines exist', () => {
    const { container } = render(<LineBadge slug="unknown" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders line badges for a facility', () => {
    render(<LineBadge slug="park-ride-ashfield" />);

    expect(screen.getByText('T1')).toBeInTheDocument();
    expect(screen.getByText('T2')).toBeInTheDocument();
  });

  it('renders correct number of badges', () => {
    render(<LineBadge slug="park-ride-ashfield" />);

    const badges = screen.getAllByText(/T1|T2/);
    expect(badges).toHaveLength(2);
  });

  it('uses the official Transport pictograms for Metro and Sydney Trains', () => {
    render(<LineBadge slug="park-ride-metro-train" />);

    expect(
      screen.getByRole('img', { name: 'M transit line' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'T transit line' })
    ).toBeInTheDocument();
  });

  it('uses the official Bus pictogram for bus services', () => {
    render(<LineBadge slug="park-ride-bus" />);

    expect(
      screen.getByRole('img', { name: 'B transit line' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
});
