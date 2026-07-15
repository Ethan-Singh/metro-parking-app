import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../../../../main/features/parking/components/Footer';

describe('Footer', () => {
  it('renders about section content', () => {
    render(<Footer />);

    expect(screen.getByText('About')).toBeInTheDocument();

    expect(
      screen.getByText(
        /Live and historical availability across Sydney's Park&Ride car parks/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/This is a side project of mine/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Data powered by Transport for NSW/i)
    ).toBeInTheDocument();
  });

  it('renders resources links', () => {
    render(<Footer />);

    expect(screen.getByText('Resources')).toBeInTheDocument();

    const transportLink = screen.getByRole('link', {
      name: 'Transport NSW',
    });

    expect(transportLink).toBeInTheDocument();
    expect(transportLink).toHaveAttribute(
      'href',
      'https://www.transport.nsw.gov.au/'
    );
  });

  it('renders legal links', () => {
    render(<Footer />);

    expect(screen.getByText('Legal')).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Privacy Policy' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Terms of Service' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Disclaimer' })
    ).toBeInTheDocument();
  });

  it('renders the current year copyright text', () => {
    render(<Footer />);

    const year = new Date().getFullYear();

    expect(
      screen.getByText(`© ${year} A Metro Parking App. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('renders update frequency information', () => {
    render(<Footer />);

    expect(
      screen.getByText('Data fetched every 30 seconds')
    ).toBeInTheDocument();
  });
});
