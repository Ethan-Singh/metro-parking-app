import {
  List,
  ListItemButton,
  ListItemText,
  Box,
  OutlinedInput,
  InputAdornment,
  Paper,
  Popper,
  IconButton,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useParkingQueries } from '../api/useParkingQueries';
import { useSearchMode } from './useSearchMode';
import { useMemo, useState } from 'react';
import { useSearch } from './useSearch.tsx';
import Fuse from 'fuse.js';

export function SearchBar() {
  const { query, setQuery, clear } = useSearch();
  const navigate = useNavigate();
  const { isFacilityPage } = useSearchMode();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [focused, setFocused] = useState(false);

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

  const show = isFacilityPage && focused && q.length > 0;

  const handleSelect = (slug: string) => {
    clear();
    navigate(`/facility/${encodeURIComponent(slug)}`);
  };

  return (
    <Box>
      <OutlinedInput
        fullWidth
        inputProps={{
          'aria-label': 'Search parking facilities',
          role: 'combobox',
          'aria-expanded': show && results.length > 0,
          'aria-controls': 'facility-search-results',
          autoComplete: 'off',
        }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && results[0]) {
            event.preventDefault();
            handleSelect(results[0].slug);
          }
          if (event.key === 'Escape') clear();
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

      <Popper
        open={show && results.length > 0}
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
          <List dense id="facility-search-results" role="listbox" disablePadding>
            {results.slice(0, 3).map((f) => (
              <ListItemButton
                key={f.slug}
                role="option"
                aria-selected={false}
                onMouseDown={(event) => event.preventDefault()}
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
    </Box>
  );
}
