import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../../../../main/features/parking/search/SearchBar';

const navigate = vi.fn();
const clear = vi.fn();
const setQuery = vi.fn();

const searchState = {
  query: '',
  setQuery,
  clear,
};

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

vi.mock('../../../../main/features/parking/search/useSearch', () => ({
  useSearch: () => searchState,
}));

vi.mock('../../../../main/features/parking/search/useSearchMode', () => ({
  useSearchMode: () => ({
    isFacilityPage: true,
  }),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchState.query = '';
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

    expect(setQuery).toHaveBeenCalledWith('Ash');
  });

  it('shows matching facility results', () => {
    searchState.query = 'ash';

    render(<SearchBar />);

    expect(screen.getByText('Ashfield')).toBeInTheDocument();
    expect(screen.getByText('42 spots available')).toBeInTheDocument();
  });

  it('clears the search when clear button is clicked', () => {
    searchState.query = 'ash';

    render(<SearchBar />);

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(setQuery).toHaveBeenCalledWith('');
  });

  it('navigates when a result is selected', () => {
    searchState.query = 'ash';

    render(<SearchBar />);

    fireEvent.click(screen.getByText('Ashfield'));

    expect(clear).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/facility/park-ride-ashfield');
  });
});
