import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <>
            <AppBar position="sticky">
                <Toolbar>
                    <Typography variant="h6">Parking Dashboard</Typography>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </>
    );
}