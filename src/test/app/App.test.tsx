import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../main/app/App.tsx';

vi.mock('../../main/features/parking/pages/OverviewPage.tsx', () => ({
  default: () => <div>Overview Page</div>,
}));

vi.mock('../../main/features/parking/pages/FacilityPage.tsx', () => ({
  default: () => <div>Facility Page</div>,
}));

vi.mock('../../main/app/AppLayout.tsx', () => ({
  default: () => <div>App Layout</div>,
}));

describe('App', () => {
  it('renders the router', () => {
    render(<App />);

    expect(screen.getByText('App Layout')).toBeInTheDocument();
  });
});
