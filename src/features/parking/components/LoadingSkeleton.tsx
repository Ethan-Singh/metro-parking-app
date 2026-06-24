import { Skeleton } from "@mui/material";
import {tokens} from "../../../css/tokens.ts";

interface Props {
    height?: number;
}

export function LoadingSkeleton({ height = tokens.grid.skeletonHeight }: Props) {
    return <Skeleton variant="rectangular" height={height} />;
}