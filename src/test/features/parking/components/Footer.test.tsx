import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('renders legal buttons', () => {
    render(<Footer />);

    expect(screen.getByText('Legal')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Privacy Policy' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Terms of Service' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Disclaimer' })
    ).toBeInTheDocument();
  });

  it('opens privacy policy dialog', () => {
    render(<Footer />);

    fireEvent.click(screen.getByRole('button', { name: 'Privacy Policy' }));

    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Privacy Policy' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/does not collect or store personal information/i)
    ).toBeInTheDocument();
  });

  it('opens terms of service dialog', () => {
    render(<Footer />);

    fireEvent.click(screen.getByRole('button', { name: 'Terms of Service' }));

    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Terms of Service' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/provided as a free community project/i)
    ).toBeInTheDocument();
  });

  it('opens disclaimer dialog', () => {
    render(<Footer />);

    fireEvent.click(screen.getByRole('button', { name: 'Disclaimer' }));

    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Disclaimer' })
    ).toBeInTheDocument();

    expect(screen.getByText(/independent project/i)).toBeInTheDocument();
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
