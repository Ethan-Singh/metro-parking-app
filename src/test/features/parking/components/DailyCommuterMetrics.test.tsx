import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { DailyCommuterMetrics } from '../../../../main/features/parking/components/DailyCommuterMetrics';
import type { DailyParkingMetrics } from '../../../../main/features/parking/types';

const metrics: DailyParkingMetrics = {
  from: '2026-10-26',
  to: '2026-10-26',
  timeZone: 'Australia/Sydney',
  days: [
    {
      date: '2026-10-26',
      expectedFreeAt7am: 179,
      expectedFreeAt8am: 136,
      crossed50AtMs: Date.parse('2026-10-26T09:51:00+11:00'),
      crossed90AtMs: Date.parse('2026-10-26T12:38:00+11:00'),
      fullAtMs: Date.parse('2026-10-26T15:10:00+11:00'),
    },
  ],
};

describe('DailyCommuterMetrics', () => {
  it('shows the 7 AM and 8 AM free-space callouts and a milestone timeline', () => {
    render(
      <DailyCommuterMetrics
        metrics={metrics}
        facilitySlug="park-ride-ashfield"
      />
    );

    expect(screen.getByText('7 AM free: 179 spaces')).toBeInTheDocument();
    expect(screen.getByText('8 AM free: 136 spaces')).toBeInTheDocument();

    const timeline = screen.getByRole('img', {
      name: /Daily occupancy milestones: 50% full .* 90% full .* Full/,
    });
    expect(timeline).toBeInTheDocument();
    const markers = within(timeline).getAllByTitle(/full:|Full:/);
    expect(markers).toHaveLength(3);
    expect(markers[0]).toHaveStyle({ backgroundColor: '#16A34A' });
    expect(markers[1]).toHaveStyle({ backgroundColor: '#EA580C' });
    expect(markers[2]).toHaveStyle({ backgroundColor: '#9B1C1C' });
  });

  it('labels the milestone time annotations and keeps missing times unavailable', () => {
    const missingMilestones: DailyParkingMetrics = {
      ...metrics,
      days: [{ ...metrics.days[0], crossed50AtMs: null, fullAtMs: null }],
    };
    render(<DailyCommuterMetrics metrics={missingMilestones} />);

    expect(screen.getByText('50% full')).toBeInTheDocument();
    expect(screen.getByText('90% full')).toBeInTheDocument();
    expect(screen.getByText('Full')).toBeInTheDocument();
    expect(screen.getAllByText('—')).toHaveLength(2);
  });
});
