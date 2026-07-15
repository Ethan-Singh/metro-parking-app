import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBarEmpty } from '../../../../main/features/parking/search/SearchBarEmpty';

describe('SearchBarEmpty', () => {
  it('renders default title and description', () => {
    render(<SearchBarEmpty />);

    expect(screen.getByText('No results found')).toBeInTheDocument();
    expect(
      screen.getByText('Try adjusting your search or browse all facilities')
    ).toBeInTheDocument();
  });

  it('renders custom title and description', () => {
    render(
      <SearchBarEmpty title="Nothing here" description="Try another search." />
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Try another search.')).toBeInTheDocument();
  });

  it('does not render an action button by default', () => {
    render(<SearchBarEmpty />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders an action button when provided', () => {
    render(
      <SearchBarEmpty
        action={{
          label: 'Clear search',
          onClick: vi.fn(),
        }}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Clear search' })
    ).toBeInTheDocument();
  });

  it('calls the action callback when the button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <SearchBarEmpty
        action={{
          label: 'Clear search',
          onClick,
        }}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
