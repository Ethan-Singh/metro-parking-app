import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const setQuery = (value: string) => {
  query = value;
  listeners.forEach((listener) => listener());
};

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom'
    );

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

      React.useEffect(() => {
        const listener = () => forceUpdate((x) => x + 1);

        listeners.push(listener);

        return () => {
          listeners = listeners.filter((l) => l !== listener);
        };
      }, []);

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

  it('updates the search query', async () => {
    const user = userEvent.setup();

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search facilities...');

    await user.click(input);
    await user.type(input, 'Ash');

    expect(query).toBe('Ash');
  });

  it('shows matching facility results', async () => {
    const user = userEvent.setup();

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search facilities...');

    await user.click(input);
    await user.type(input, 'ash');

    await waitFor(() => {
      expect(screen.getByText('Ashfield')).toBeInTheDocument();
    });

    expect(screen.getByText('42 spots available')).toBeInTheDocument();
  });

  it('navigates when a result is selected', async () => {
    const user = userEvent.setup();

    render(<SearchBar />);

    const input = screen.getByPlaceholderText('Search facilities...');

    await user.click(input);
    await user.type(input, 'ash');

    const result = await screen.findByText('Ashfield');

    await user.click(result);

    expect(clear).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/facility/park-ride-ashfield');
  });
});
