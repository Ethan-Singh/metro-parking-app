import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FacilityHistoryChart } from '../../../../main/features/parking/components/FacilityHistoryChart';
import type { DataPoint } from '../../../../main/features/parking/types';

// mock echarts
vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="echarts" />,
}));

// mock tokens
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
  it('shows empty state when no data', () => {
    render(<FacilityHistoryChart dataPoints={[]} />);

    expect(
      screen.getByText('No historical data available')
    ).toBeInTheDocument();
  });

  it('renders chart and summary chips when data exists', () => {
    const data: DataPoint[] = [
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

    expect(screen.getByTestId('echarts')).toBeInTheDocument();

    expect(screen.getByText(/7 am:/i)).toBeInTheDocument();
    expect(screen.getByText(/8 am:/i)).toBeInTheDocument();
    expect(screen.getByText(/50% full/i)).toBeInTheDocument();
    expect(screen.getByText(/75% full/i)).toBeInTheDocument();
    expect(screen.getByText(/90% full/i)).toBeInTheDocument();
  });
});
