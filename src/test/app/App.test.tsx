import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import AppLayout from '../../main/app/AppLayout.tsx';

vi.mock('../../main/features/parking/search/SearchBar.tsx', () => ({
  SearchBar: () => <div>Search Bar</div>,
}));

vi.mock('../../main/assets/Logo.svg', () => ({
  default: 'Logo.svg',
}));

vi.mock('../../main/assets/TFNSW.png', () => ({
  default: 'TFNSW.png',
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('AppLayout', () => {
  it('renders app title', () => {
    render(
      <Wrapper>
        <AppLayout />
      </Wrapper>
    );

    expect(screen.getByText('A Metro Parking App')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(
      <Wrapper>
        <AppLayout />
      </Wrapper>
    );

    expect(screen.getByText(/Live parking availability/i)).toBeInTheDocument();
  });

  it('renders search bar', () => {
    render(
      <Wrapper>
        <AppLayout />
      </Wrapper>
    );

    expect(screen.getByText('Search Bar')).toBeInTheDocument();
  });

  it('renders TFNSW attribution text', () => {
    render(
      <Wrapper>
        <AppLayout />
      </Wrapper>
    );

    expect(screen.getByText('Live data from')).toBeInTheDocument();
  });
});
