import {
    Box,
    Card,
    CardContent,
    Container,
    OutlinedInput,
    InputAdornment,
    Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import {
    Search,
    LocalParking,
} from "@mui/icons-material";

import { tokens, header } from "../css/tokens";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: tokens.space.xl }}>

                <Card className="app-header">
                    <CardContent>

                        <div className="app-header-top">

                            <div className="app-brand">

                                <Box
                                    className="app-brand-icon"
                                    sx={{
                                        width: header.icon.size,
                                        height: header.icon.size,
                                        borderRadius: header.icon.radius,
                                        bgcolor: "primary.main",
                                    }}
                                >
                                    <LocalParking />
                                </Box>

                                <div className="app-brand-text">

                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 700 }}
                                    >
                                        Sydney Park & Ride
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Live parking availability across the
                                        Transport for NSW network
                                    </Typography>

                                </div>

                            </div>

                            <div className="app-attribution">

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Data supplied by
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                >
                                    Transport for NSW
                                </Typography>

                            </div>

                        </div>

                        <div className="app-search">

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

                        </div>

                    </CardContent>
                </Card>

                <Outlet />

            </Container>
        </Box>
    );
}