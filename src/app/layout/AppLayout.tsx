import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            {/*
       * app-bar class in global.css applies:
       *   - glass background + backdrop blur
       *   - azure top accent stripe (Frutiger Aero chrome)
       *   - subtle shadow
       * MUI AppBar handles sticky + elevation reset.
       */}
            <AppBar position="sticky" className="app-bar">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "primary.main", letterSpacing: "-0.3px" }}
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