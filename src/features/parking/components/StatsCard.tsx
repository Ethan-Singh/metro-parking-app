import {
    Card,
    CardContent,
    Typography,
    Box,
    alpha,
    useTheme,
} from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import { semantic } from "../../../design-tokens/semantic";
import React from "react";

interface StatsCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: number;
    subtitle?: string;
    variant?: "primary" | "success" | "warning" | "error";
}

function getGradient(variant: StatsCardProps["variant"] = "primary") {
    switch (variant) {
        case "success":
            return `linear-gradient(135deg, ${semantic.color.success}, #00B894)`;
        case "warning":
            return `linear-gradient(135deg, ${semantic.color.warning}, #FDCB6E)`;
        case "error":
            return `linear-gradient(135deg, ${semantic.color.error}, #FF6B6B)`;
        default:
            return `linear-gradient(135deg, ${semantic.color.primary}, ${semantic.color.info})`;
    }
}

export function StatsCard({
                              icon,
                              label,
                              value,
                              trend,
                              subtitle,
                              variant = "primary",
                          }: StatsCardProps) {
    const theme = useTheme();
    const isPositive = trend !== undefined && trend > 0;

    const gradient = getGradient(variant);

    return (
        <Card
            className="glass-card"
            sx={{
                height: "100%",
                position: "relative",
                overflow: "hidden",

                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: gradient,
                },
            }}
        >
            <CardContent>
                <Box>
                    {/* LEFT */}
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                fontSize: "0.65rem",
                            }}
                        >
                            {label}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                mt: 0.5,
                                color: semantic.color.text.primary,
                            }}
                        >
                            {value}
                        </Typography>

                        {subtitle && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mt: 0.5 }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {/* ICON */}
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: (t) => t.shape.borderRadius,
                            background: gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            flexShrink: 0,
                            boxShadow: theme.shadows[2],
                        }}
                    >
                        {icon}
                    </Box>
                </Box>

                {/* TREND */}
                {trend !== undefined && (
                    <Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: isPositive
                                    ? semantic.color.success
                                    : semantic.color.error,
                                bgcolor: isPositive
                                    ? alpha(theme.palette.success.main, 0.12)
                                    : alpha(theme.palette.error.main, 0.12),
                                borderRadius: 1,
                                px: 0.75,
                                py: 0.25,
                            }}
                        >
                            {isPositive ? (
                                <TrendingUp sx={{ fontSize: 14 }} />
                            ) : (
                                <TrendingDown sx={{ fontSize: 14 }} />
                            )}

                            <Typography variant="caption" sx={{ ml: 0.25 }}>
                                {isPositive ? "+" : ""}
                                {trend}%
                            </Typography>
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                            vs last week
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}