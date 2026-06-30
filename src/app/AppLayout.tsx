import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import TFNSWLogo from "../../public/assets/TFNSW.png";
import Logo from "../../public/assets/Logo.svg";
import {SearchBar} from "../features/parking/search/SearchBar.tsx";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>

                <Card sx={{ mb: 3 }}>
                    <CardContent>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 3,
                            }}
                        >

                            {/* LEFT: BRAND */}
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                <Box
                                    component="img"
                                    src={Logo}
                                    alt="Logo"
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        display: "block",
                                    }}
                                />

                                <Box>
                                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                        A Metro Parking App
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Live parking availability across the Transport for NSW network
                                    </Typography>
                                </Box>
                            </Box>

                            {/* RIGHT: ATTRIBUTION */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    textAlign: "right",
                                    gap: 0.5,
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    Public data from
                                </Typography>

                                <Typography variant="body2" color="text.secondary">
                                    Transport for NSW
                                </Typography>

                                <Box
                                    component="img"
                                    src={TFNSWLogo}
                                    alt="Transport for NSW"
                                    sx={{
                                        height: 34,
                                        width: "auto",
                                        mt: 0.5,
                                    }}
                                />
                            </Box>

                        </Box>

                        {/* SEARCH */}
                        <Box sx={{ mt: 2 }}>
                            <SearchBar />
                        </Box>

                    </CardContent>
                </Card>

                <Outlet />

            </Container>
        </Box>
    );
}