import { describe, expect, it } from 'vitest';
import { summarizeOccupancyHistory } from '../../../../main/features/parking/utils/chartSummary.ts';

describe('summarizeOccupancyHistory', () => {
  it('summarizes the sample range and latest Sydney-local observation', () => {
    const first = Date.parse('2026-10-27T00:00:00Z');
    const summary = summarizeOccupancyHistory([
      [first, 0.25, 75],
      [first + 60_000, 1.12, 0],
    ]);

    expect(summary).toContain('2 samples');
    expect(summary).toContain('25.0% to 112.0%');
    expect(summary).toContain('112.0% occupied');
    expect(summary).toContain('27 Oct');
  });

  it('describes an empty series', () => {
    expect(summarizeOccupancyHistory([])).toBe(
      'No occupancy samples are available.'
    );
  });
});
