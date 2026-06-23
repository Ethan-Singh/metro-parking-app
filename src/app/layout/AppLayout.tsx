import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LocalParking } from "@mui/icons-material";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="sticky" className="app-bar">
                <Toolbar>

                    {/* Logo Container */}
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: (t) => t.shape.borderRadius,
                            background: (t) =>
                                `linear-gradient(135deg, ${t.palette.primary.main} 0%, ${t.palette.secondary.main} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            mr: 1.5,
                            boxShadow: (t) => t.shadows[2],
                        }}
                    >
                        <LocalParking sx={{ fontSize: 22 }} />
                    </Box>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: (t) => t.palette.primary.main,
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Metro Parking App
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container
                maxWidth="xl"
                sx={{
                    py: 4,
                    flex: 1,
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
}