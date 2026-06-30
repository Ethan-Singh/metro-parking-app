import {
    OutlinedInput,
    InputAdornment,
    Box,
} from "@mui/material";
import { Search } from "@mui/icons-material";

interface Props {
    value: string;
    onChange: (v: string) => void;
}

export function FacilitySearchBar({ value, onChange }: Props) {
    return (
        <Box>
            <OutlinedInput
                fullWidth
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search for a station..."
                startAdornment={
                    <InputAdornment position="start">
                        <Search />
                    </InputAdornment>
                }
            />
        </Box>
    );
}