import {Skeleton, type SxProps, type Theme} from "@mui/material";
import { tokens } from "../../../css/tokens.ts";

interface Props {
    height?: number;
    sx?: SxProps<Theme>;
}

export function LoadingSkeleton({ height = tokens.grid.skeletonHeight, sx }: Props) {
    return (
        <Skeleton
            variant="rectangular"
            height={height}
            sx={sx}
        />
    );
}