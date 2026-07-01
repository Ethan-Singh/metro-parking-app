import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppLayout from './AppLayout';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../features/parking/search/SearchBar.tsx', () => ({
  SearchBar: () => <div>Search Bar</div>,
}));

vi.mock('../assets/Logo.svg', () => ({
  default: 'Logo.svg',
}));

vi.mock('../assets/TFNSW.png', () => ({
  default: 'TFNSW.png',
}));

describe('AppLayout', () => {
  it('renders app title', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('A Metro Parking App')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText(/Live parking availability/i)).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('Search Bar')).toBeInTheDocument();
  });

  it('renders TFNSW attribution text', () => {
    render(
      <MemoryRouter>
        <AppLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('Live data from')).toBeInTheDocument();
  });
});
