import { Skeleton, type SxProps, type Theme } from '@mui/material';

interface Props {
  height?: number;
  sx?: SxProps<Theme>;
}

export function LoadingSkeleton({ height = 200, sx }: Props) {
  return (
    <Skeleton
      variant="rectangular"
      height={height}
      sx={sx}
      data-testid="loading-skeleton"
    />
  );
}
