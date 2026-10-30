import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AppLayout from '../../main/app/AppLayout.tsx';

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
      screen.getByText(/Live parking and Sydney public transport timetables/i)
    ).toBeInTheDocument();
  });

  it('renders the Parking and Timetables mode switch', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: 'Parking' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Timetables' })
    ).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderLayout();

    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    renderLayout();

    expect(screen.getByText('A Metro Parking App')).toBeInTheDocument();
    expect(document.querySelector('header img')).toHaveAttribute('alt', '');
  });

  it('provides skip navigation and page landmarks', () => {
    renderLayout();

    expect(
      screen.getByRole('link', { name: 'Skip to main content' })
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
