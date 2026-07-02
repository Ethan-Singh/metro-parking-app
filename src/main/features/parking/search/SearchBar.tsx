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
import { useState } from 'react';
import { useSearch } from './useSearch.tsx';

export function SearchBar() {
  const { query, setQuery, clear } = useSearch();
  const { data } = useParkingQueries();
  const navigate = useNavigate();
  const { isFacilityPage } = useSearchMode();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const q = query.trim().toLowerCase();

  const results =
    data?.filter((f) => {
      const name = f.facilityName.toLowerCase();
      const slug = f.slug.toLowerCase();
      return name.includes(q) || slug.includes(q);
    }) ?? [];

  const show = isFacilityPage && q.length > 0;

  const handleSelect = (slug: string) => {
    clear();
    navigate(`/facility/${slug}`);
  };

  return (
    <Box>
      <OutlinedInput
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
                onClick={() => setQuery('')}
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
            bgcolor: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
            borderRadius: 2,
            mt: 1,
            width: anchorEl?.clientWidth ?? 'auto',
          }}
        >
          <List dense>
            {results.slice(0, 8).map((f) => (
              <ListItemButton key={f.slug} onClick={() => handleSelect(f.slug)}>
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
