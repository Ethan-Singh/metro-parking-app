import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSkeleton } from '../../../../main/features/parking/components/LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders with default height', () => {
    render(<LoadingSkeleton />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    render(<LoadingSkeleton height={300} />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveStyle({ height: '300px' });
  });

  it('applies sx prop', () => {
    render(<LoadingSkeleton sx={{ marginTop: 2 }} />);

    const skeleton = screen.getByTestId('loading-skeleton');
    expect(skeleton).toBeInTheDocument();
  });
});
