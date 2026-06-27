import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import {Train} from "@mui/icons-material";
import {tokens} from "../css/tokens.ts";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: tokens.color.surface,
                    borderBottom: `1px solid ${tokens.color.border}`,
                    backdropFilter: "blur(12px)",
                }}
            >
                <Toolbar>
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: tokens.radius,
                            bgcolor: tokens.color.primary,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                        }}
                    >
                        <Train sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                        Metro Parking App
                    </Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: tokens.space.xl }}>
                <Outlet />
            </Container>
        </Box>
    );
}