import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "white",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "primary.main",
                            letterSpacing: "-0.3px",
                        }}
                    >
                        Parking Operations Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 3 }}>
                <Outlet />
            </Box>
        </Box>
    );
}