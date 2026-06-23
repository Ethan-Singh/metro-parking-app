// LineBadge.tsx
import { Box } from "@mui/material";
import {LINE_COLOURS, type LineKey} from "../../../design-tokens/transportLines.ts";

function Chip({
                  label,
                  color,
              }: {
    label: string;
    color: string;
}) {
    return (
        <Box
            sx={{
                px: 1,
                py: 0.4,
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.06em",
                color: "#fff",
                background: color,
                borderRadius: "999px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                lineHeight: 1,
            }}
        >
            {label}
        </Box>
    );
}

export function LineBadge({
                              lines,
                          }: {
    lines: LineKey[];
}) {
    if (!lines || lines.length === 0) {
        return (
            <Chip label="UNK" color="#9e9e9e" />
        );
    }

    // single line
    if (lines.length === 1) {
        const line = lines[0];
        return (
            <Chip
                label={line}
                color={LINE_COLOURS[line]}
            />
        );
    }

    // dual / interchange
    return (
        <Box
            sx={{
                display: "inline-flex",
                borderRadius: "999px",
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.18)",
            }}
        >
            {lines.slice(0, 2).map((line) => (
                <Box
                    key={line}
                    sx={{
                        px: 1,
                        py: 0.4,
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        color: "#fff",
                        background: LINE_COLOURS[line] ?? "#ccc",
                        lineHeight: 1,
                    }}
                >
                    {line}
                </Box>
            ))}
        </Box>
    );
}