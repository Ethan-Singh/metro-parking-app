import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FacilityHistoryChart } from '../../../../main/features/parking/components/FacilityHistoryChart';

// mock echarts (avoid canvas issues)
vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="echarts" />,
}));

// mock tokens so test is stable
vi.mock('../../../../main/css/tokens', () => ({
  tokens: {
    color: {
      border: '#000',
      textMuted: '#666',
      secondary: '#00f',
      error: '#f00',
      warning: '#ff0',
    },
  },
}));

describe('FacilityHistoryChart', () => {
  it('shows loading skeleton when dataPoints is undefined', () => {
    render(<FacilityHistoryChart dataPoints={undefined as any} />);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(<FacilityHistoryChart dataPoints={[]} />);

    expect(
      screen.getByText('No historical data available')
    ).toBeInTheDocument();
  });

  it('renders chart and summary chips when data exists', () => {
    const data = [
      {
        timestamp: '2026-01-01T07:00:00Z',
        occupancy: 50,
        available: 50,
        occupancyRate: 0.5,
      },
      {
        timestamp: '2026-01-01T08:00:00Z',
        occupancy: 70,
        available: 30,
        occupancyRate: 0.7,
      },
    ];

    render(<FacilityHistoryChart dataPoints={data} />);

    // chart rendered (mocked)
    expect(screen.getByTestId('echarts')).toBeInTheDocument();

    // summary chips exist
    expect(screen.getByText(/7 am:/i)).toBeInTheDocument();
    expect(screen.getByText(/8 am:/i)).toBeInTheDocument();
    expect(screen.getByText(/50% full/i)).toBeInTheDocument();
    expect(screen.getByText(/75% full/i)).toBeInTheDocument();
    expect(screen.getByText(/90% full/i)).toBeInTheDocument();
  });
});
