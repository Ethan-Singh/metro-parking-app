import {
    Box,
    Card,
    CardContent,
    Container,
    OutlinedInput,
    InputAdornment, Typography
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { Search, LocalParking } from "@mui/icons-material";
import { tokens, header } from "../css/tokens";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: tokens.space.xl }}>

                {/* HEADER */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>

                        {/* top row */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 3,
                                flexWrap: "wrap",
                            }}
                        >

                            {/* brand */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    minWidth: 280,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: header.icon.size,
                                        height: header.icon.size,
                                        borderRadius: header.icon.radius,
                                        bgcolor: "primary.main",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                    }}
                                >
                                    <LocalParking />
                                </Box>

                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="h4">
                                        Sydney Park & Ride
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Live parking availability across the Transport for NSW network
                                    </Typography>
                                </Box>
                            </Box>

                            {/* attribution */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    Data supplied by
                                </Typography>

                                <Typography variant="body2">
                                    Transport for NSW
                                </Typography>
                            </Box>

                        </Box>

                        {/* search */}
                        <Box sx={{ mt: 2 }}>
                            <OutlinedInput
                                fullWidth
                                placeholder="Search for a station..."
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                                sx={{
                                    maxWidth: header.search.maxWidth,
                                }}
                            />
                        </Box>

                    </CardContent>
                </Card>

                <Outlet />
            </Container>
        </Box>
    );
}