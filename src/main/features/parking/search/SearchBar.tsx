import {
  List,
  ListItemButton,
  ListItemText,
  Box,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  Paper,
  Popper,
  IconButton,
} from '@mui/material';
import Search from '@mui/icons-material/Search';
import Close from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useParkingQueries } from '../api/useParkingQueries';
import { useSearchMode } from './useSearchMode';
import { useMemo, useState } from 'react';
import { useSearch } from './useSearch.tsx';
import Fuse from 'fuse.js';

export function SearchBar({
  label = 'Search parking facilities',
}: {
  label?: string;
}) {
  const { query, setQuery, clear } = useSearch();
  const navigate = useNavigate();
  const { isFacilityPage } = useSearchMode();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);
  const [suggestionsDismissed, setSuggestionsDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data } = useParkingQueries(focused);

  const fuse = useMemo(
    () =>
      new Fuse(data ?? [], {
        keys: ['facilityName', 'slug'],
        threshold: 0.3,
      }),
    [data]
  );

  const q = query.trim();

  const results = q ? fuse.search(q).map((result) => result.item) : [];
  const visibleResults = results.slice(0, 3);

  const show =
    isFacilityPage && focused && q.length > 0 && !suggestionsDismissed;
  const suggestionsOpen = show && visibleResults.length > 0;
  const activeOptionIndex = suggestionsOpen
    ? activeIndex % visibleResults.length
    : -1;
  const activeOption =
    activeOptionIndex >= 0 ? visibleResults[activeOptionIndex] : undefined;

  const handleSelect = (slug: string) => {
    clear();
    navigate(`/facility/${encodeURIComponent(slug)}`);
  };

  return (
    <Box>
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="parking-facility-search">{label}</InputLabel>
        <OutlinedInput
          id="parking-facility-search"
          label={label}
          inputProps={{
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-haspopup': 'listbox',
            'aria-expanded': suggestionsOpen,
            'aria-controls': suggestionsOpen
              ? 'facility-search-results'
              : undefined,
            'aria-activedescendant': activeOption
              ? `facility-search-option-${activeIndex}`
              : undefined,
            autoComplete: 'off',
          }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setSuggestionsDismissed(false);
          }}
          onFocus={() => {
            setFocused(true);
            setSuggestionsDismissed(false);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && suggestionsOpen) {
              event.preventDefault();
              setActiveIndex((index) => (index + 1) % visibleResults.length);
            }
            if (event.key === 'ArrowUp' && suggestionsOpen) {
              event.preventDefault();
              setActiveIndex(
                (index) =>
                  (index - 1 + visibleResults.length) % visibleResults.length
              );
            }
            if (event.key === 'Enter' && activeOption) {
              event.preventDefault();
              handleSelect(activeOption.slug);
            }
            if (event.key === 'Escape' && show) {
              event.preventDefault();
              setSuggestionsDismissed(true);
            }
          }}
          placeholder="Search facilities..."
          inputRef={setAnchorEl}
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
          endAdornment={
            query ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Clear search"
                  size="small"
                  onClick={clear}
                >
                  <Close fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }
        />
      </FormControl>

      <Popper
        open={suggestionsOpen}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{
          zIndex: 2000,
        }}
      >
        <Paper
          sx={{
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            boxShadow: 4,
            borderRadius: 2,
            mt: 1,
            width: anchorEl?.clientWidth ?? '100%',
            maxHeight: 'min(60vh, 24rem)',
            overflowY: 'auto',
          }}
        >
          <List
            dense
            id="facility-search-results"
            role="listbox"
            disablePadding
          >
            {visibleResults.map((f, index) => (
              <ListItemButton
                key={f.slug}
                id={`facility-search-option-${index}`}
                role="option"
                aria-selected={activeOptionIndex === index}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelect(f.slug)}
              >
                <ListItemText
                  primary={f.facilityName}
                  secondary={`${f.available} spots available`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Popper>
      {show && results.length === 0 && (
        <Box role="status" aria-live="polite" sx={{ mt: 1 }}>
          No matching facilities.
        </Box>
      )}
    </Box>
  );
}
