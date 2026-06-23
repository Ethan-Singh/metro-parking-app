import { Card, CardContent, Typography, Box, alpha, useTheme } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface StatsCard {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: number;
    subtitle?: string;
    gradient?: string;
}

export function StatsCard({
                                     icon,
                                     label,
                                     value,
                                     trend,
                                     subtitle,
                                     gradient = "linear-gradient(135deg, #0A4FA6 0%, #0097B8 100%)",
                                 }: StatsCard) {
    const theme = useTheme();
    const isPositive = trend && trend > 0;

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
                    top: -1,
                    left: -1,
                    right: -1,
                    height: 3,
                    background: gradient,
                    borderRadius: "14px 14px 0 0",
                },
            }}
        >
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
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
                                background: gradient,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "12px",
                            background: gradient,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            flexShrink: 0,
                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
                {trend !== undefined && (
                    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 1.5 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                color: isPositive ? "success.main" : "error.main",
                                bgcolor: isPositive
                                    ? alpha(theme.palette.success.main, 0.1)
                                    : alpha(theme.palette.error.main, 0.1),
                                borderRadius: "6px",
                                px: 0.75,
                                py: 0.25,
                            }}
                        >
                            {isPositive ? (
                                <TrendingUp sx={{ fontSize: 14 }} />
                            ) : (
                                <TrendingDown sx={{ fontSize: 14 }} />
                            )}
                            <Typography variant="caption" fontWeight={600} sx={{ ml: 0.25 }}>
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