import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '../../../../main/features/parking/search/SearchBar';

const navigate = vi.fn();
const clear = vi.fn();

const parkingData = [
  {
    slug: 'park-ride-ashfield',
    facilityName: 'Ashfield',
    available: 42,
  },
  {
    slug: 'park-ride-bella-vista',
    facilityName: 'Bella Vista',
    available: 10,
  },
];

let query = '';
let listeners: (() => void)[] = [];

const setQuery = (v: string) => {
  query = v;
  listeners.forEach((l) => l());
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../../../../main/features/parking/api/useParkingQueries', () => ({
  useParkingQueries: () => ({
    data: parkingData,
  }),
}));

vi.mock('../../../../main/features/parking/search/useSearch', async () => {
  const React = await vi.importActual<typeof import('react')>('react');

  return {
    useSearch: () => {
      const [, forceUpdate] = React.useState(0);

      // register re-render trigger
      if (!listeners.includes(() => forceUpdate((x) => x + 1))) {
        listeners.push(() => forceUpdate((x) => x + 1));
      }

      return {
        query,
        setQuery,
        clear: () => {
          clear();
          query = '';
        },
      };
    },
  };
});

vi.mock('../../../../main/features/parking/search/useSearchMode', () => ({
  useSearchMode: () => ({
    isFacilityPage: true,
  }),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    query = '';
    listeners = [];
  });

  it('renders the search input', () => {
    render(<SearchBar />);

    expect(
      screen.getByPlaceholderText('Search facilities...')
    ).toBeInTheDocument();
  });

  it('updates the search query', () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByPlaceholderText('Search facilities...'), {
      target: { value: 'Ash' },
    });

    expect(query).toBe('Ash');
  });

  it('shows matching facility results', async () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search facilities...');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ash' } });

    await waitFor(() => {
      expect(screen.getByText('Ashfield')).toBeInTheDocument();
    });

    expect(screen.getByText('42 spots available')).toBeInTheDocument();
  });

  it('navigates when a result is selected', async () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search facilities...');

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'ash' } });

    const result = await screen.findByText('Ashfield');

    fireEvent.click(result);

    expect(clear).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/facility/park-ride-ashfield');
  });
});
