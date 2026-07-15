import { Box, Typography, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import { tokens } from '../../../css/tokens.ts';

interface Props {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function SearchBarEmpty({
  title = 'No results found',
  description = 'Try adjusting your search or browse all facilities',
  action,
}: Props) {
  return (
    <Box
      sx={{
        py: 8,
        px: 4,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: `${tokens.color.primary}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <Search sx={{ fontSize: 40, color: tokens.color.primary }} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
        {description}
      </Typography>

      {action && (
        <Button variant="contained" onClick={action.onClick} sx={{ mt: 2 }}>
          {action.label}
        </Button>
      )}
    </Box>
  );
}
