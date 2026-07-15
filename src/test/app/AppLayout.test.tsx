import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AppLayout from '../../main/app/AppLayout.tsx';

vi.mock('../../main/features/parking/search/SearchBar.tsx', () => ({
  SearchBar: () => <div>Search Bar</div>,
}));

vi.mock('../../main/features/parking/components/Footer.tsx', () => ({
  default: () => <footer>Footer</footer>,
}));

vi.mock('../../main/assets/Logo.svg', () => ({
  default: 'Logo.svg',
}));

const renderLayout = () =>
  render(
    <MemoryRouter>
      <AppLayout />
    </MemoryRouter>
  );

describe('AppLayout', () => {
  it('renders app title', () => {
    renderLayout();

    expect(screen.getByText('A Metro Parking App')).toBeInTheDocument();
  });

  it('renders description text', () => {
    renderLayout();

    expect(
      screen.getByText(/Live and historical availability/i)
    ).toBeInTheDocument();
  });

  it('renders search bar', () => {
    renderLayout();

    expect(screen.getByText('Search Bar')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderLayout();

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    renderLayout();

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });
});
