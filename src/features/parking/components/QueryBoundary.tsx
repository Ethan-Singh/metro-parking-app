import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  isLoading: boolean;
  isError: boolean;

  isEmpty?: boolean;

  children: ReactNode;

  loading?: ReactNode;
  empty?: ReactNode;

  errorMessage?: string;
  emptyMessage?: string;
}

export function QueryBoundary({
  isLoading,
  isError,
  isEmpty = false,
  children,
  loading,
  empty,
  errorMessage = 'Failed to load data',
  emptyMessage = 'No data available',
}: Props) {
  if (isLoading) {
    return (
      loading ?? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {errorMessage}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      empty ?? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      )
    );
  }

  return <>{children}</>;
}
