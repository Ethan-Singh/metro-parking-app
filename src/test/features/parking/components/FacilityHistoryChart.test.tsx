import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FacilityHistoryChart } from '../../../../main/features/parking/components/FacilityHistoryChart.tsx';
import type { ParkingHistory } from '../../../../main/features/parking/types.ts';

vi.mock('echarts-for-react', () => ({ default: () => <div data-testid="echarts" /> }));
vi.mock('../../../../main/css/tokens.ts', () => ({ tokens: { color: {
  border: '#000', textMuted: '#666', primary: '#00f', error: '#f00', warning: '#ff0',
}, radius: { primary: 14, secondary: 0.5 } } }));

describe('FacilityHistoryChart', () => {
  const handlers = {
    rangeDays: 7 as const,
    resolution: 'AUTO' as const,
    onRangeDaysChange: vi.fn(),
    onResolutionChange: vi.fn(),
  };

  it('shows an empty state when the returned point list is empty', () => {
    render(<FacilityHistoryChart {...handlers} history={{ from: '2026-01-01', to: '2026-01-07', resolution: 'ONE_HOUR', points: [] }} />);
    expect(screen.getByText('No historical data available')).toBeInTheDocument();
  });

  it('renders a single chart for ten minute data', () => {
    const history: ParkingHistory = {
      from: '2026-01-01', to: '2026-01-07', resolution: 'TEN_MINUTE',
      points: [[1767225600000, 0.5, 50], [1767229200000, 0.75, 25]],
    };
    render(<FacilityHistoryChart {...handlers} history={history} />);
    expect(screen.getAllByTestId('echarts')).toHaveLength(1);
    expect(screen.getByText('2026-01-01 – 2026-01-07 · Sydney time')).toBeInTheDocument();
    expect(screen.getByText('Each point: 10 min')).toBeInTheDocument();
  });

  it('lets the user choose a history period and point interval', () => {
    const onRangeDaysChange = vi.fn();
    const onResolutionChange = vi.fn();
    render(<FacilityHistoryChart {...handlers} onRangeDaysChange={onRangeDaysChange} onResolutionChange={onResolutionChange} history={{
      from: '2026-01-01', to: '2026-01-07', resolution: 'SIX_HOUR',
      points: [[1767225600000, 0.5, 50]],
    }} />);
    expect(screen.queryByText(/7 AM expected free:/i)).not.toBeInTheDocument();
    expect(screen.getByText('Each point: 6 hours')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Past 14 days' }));
    fireEvent.click(screen.getByRole('button', { name: '1 hour interval' }));
    expect(onRangeDaysChange).toHaveBeenCalledWith(14);
    expect(onResolutionChange).toHaveBeenCalledWith('ONE_HOUR');
  });
});
