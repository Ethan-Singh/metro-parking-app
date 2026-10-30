import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FacilityHistoryChart } from '../../../../main/features/parking/components/FacilityHistoryChart.tsx';
import type { ParkingHistory } from '../../../../main/features/parking/types.ts';
import { sydneyDate } from '../../../../main/features/parking/utils/sydneyTime.ts';

vi.mock('../../../../main/features/parking/components/LazyECharts.ts', () => ({
  LazyECharts: ({
    option,
  }: {
    option: { series: { lineStyle: { color: string } }[] };
  }) => (
    <div
      data-testid="echarts"
      data-line-color={option.series[0].lineStyle.color}
    />
  ),
}));
vi.mock('../../../../main/css/tokens.ts', () => ({
  tokens: {
    color: {
      border: '#000',
      textMuted: '#666',
      primary: '#00f',
      error: '#f00',
      warning: '#ff0',
      grassDark: '#3F7047',
    },
    radius: { primary: 14, secondary: 0.5 },
  },
}));

describe('FacilityHistoryChart', () => {
  const handlers = {
    rangeDays: 7 as const,
    resolution: 'AUTO' as const,
    onRangeDaysChange: vi.fn(),
    onResolutionChange: vi.fn(),
  };

  it('keeps query controls visible and suggests a longer range for an empty historical period', () => {
    const onRangeDaysChange = vi.fn();
    render(
      <FacilityHistoryChart
        {...handlers}
        onRangeDaysChange={onRangeDaysChange}
        history={{
          from: '2026-01-01',
          to: '2026-01-07',
          resolution: 'ONE_HOUR',
          points: [],
        }}
      />
    );

    expect(
      screen.getByText('No samples found for this period.')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Try a longer date range to view earlier occupancy.')
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'History period' })).toBeVisible();
    expect(
      screen.getByRole('group', { name: 'History point interval' })
    ).toBeVisible();
    expect(screen.getByText('Each point: 1 hour')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Past 14 days' }));
    expect(onRangeDaysChange).toHaveBeenCalledWith(14);
  });

  it('explains an empty current-day query without hiding the interval controls', () => {
    render(
      <FacilityHistoryChart
        {...handlers}
        rangeDays={1}
        resolution="TEN_MINUTE"
        history={{
          from: sydneyDate(),
          to: sydneyDate(),
          resolution: 'TEN_MINUTE',
          points: [],
        }}
      />
    );

    expect(
      screen.getByText('No samples recorded for today yet.')
    ).toBeVisible();
    expect(
      screen.getByText(
        'Occupancy history will appear after samples are recorded.'
      )
    ).toBeVisible();
    expect(
      screen.getByRole('group', { name: 'History point interval' })
    ).toBeVisible();
  });

  it('renders a single chart for ten minute data', async () => {
    const history: ParkingHistory = {
      from: '2026-01-01',
      to: '2026-01-07',
      resolution: 'TEN_MINUTE',
      points: [
        [1767225600000, 0.5, 50],
        [1767229200000, 0.75, 25],
      ],
    };
    render(
      <FacilityHistoryChart
        {...handlers}
        facilitySlug="park-ride-ashfield"
        history={history}
      />
    );
    expect(await screen.findAllByTestId('echarts')).toHaveLength(1);
    expect(screen.getByTestId('echarts')).toHaveAttribute(
      'data-line-color',
      '#EC6606'
    );
    expect(
      screen.getByText('2026-01-01 – 2026-01-07 · Sydney time')
    ).toBeInTheDocument();
    expect(screen.getByText('Each point: 10 min')).toBeInTheDocument();
  });

  it('lets the user choose a history period and point interval', () => {
    const onRangeDaysChange = vi.fn();
    const onResolutionChange = vi.fn();
    render(
      <FacilityHistoryChart
        {...handlers}
        onRangeDaysChange={onRangeDaysChange}
        onResolutionChange={onResolutionChange}
        history={{
          from: '2026-01-01',
          to: '2026-01-07',
          resolution: 'SIX_HOUR',
          points: [[1767225600000, 0.5, 50]],
        }}
      />
    );
    expect(screen.queryByText(/7 AM expected free:/i)).not.toBeInTheDocument();
    expect(screen.getByText('Each point: 6 hours')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Past 14 days' }));
    fireEvent.click(screen.getByRole('button', { name: '1 hour interval' }));
    expect(onRangeDaysChange).toHaveBeenCalledWith(14);
    expect(onResolutionChange).toHaveBeenCalledWith('ONE_HOUR');
  });

  it('disables over-limit intervals and moves to a supported interval when the range grows', () => {
    const onRangeDaysChange = vi.fn();
    const onResolutionChange = vi.fn();
    render(
      <FacilityHistoryChart
        {...handlers}
        rangeDays={7}
        resolution="ONE_HOUR"
        onRangeDaysChange={onRangeDaysChange}
        onResolutionChange={onResolutionChange}
        history={{
          from: '2026-01-01',
          to: '2026-01-07',
          resolution: 'ONE_HOUR',
          points: [[1767225600000, 0.5, 50]],
        }}
      />
    );

    expect(
      screen.getByRole('button', { name: '10 min interval' })
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '1 hour interval' })
    ).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Past 14 days' }));

    expect(onRangeDaysChange).toHaveBeenCalledWith(14);
    expect(onResolutionChange).toHaveBeenCalledWith('SIX_HOUR');
  });
});
