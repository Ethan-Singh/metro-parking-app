import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LocalParking } from "@mui/icons-material";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            {/*
       * app-bar class in global.css applies:
       *   - glass background + backdrop blur
       *   - azure top accent stripe (Frutiger Aero chrome)
       *   - subtle shadow
       */}
            <AppBar position="sticky" className="app-bar">
                <Toolbar>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #0A4FA6 0%, #0097B8 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            mr: 1.5,
                        }}
                    >
                        <LocalParking sx={{ fontSize: 22 }} />
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: 700, color: "primary.main", letterSpacing: "-0.02em" }}
                    >
                        Metro Parking App
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
}