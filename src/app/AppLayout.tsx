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
import { Search, LocalParking } from "@mui/icons-material";
import TFNSWLogo from "../../public/assets/TFNSW.png";

export default function AppLayout() {
    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* HEADER */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>

                        {/* top row */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
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
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
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
                                        A Metro Parking App
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Live parking availability across the Transport for NSW network
                                    </Typography>
                                </Box>
                            </Box>

                            {/* right side: search + attribution */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    gap: 1.5,
                                    minWidth: 320,
                                }}
                            >
                                {/* search */}
                                <OutlinedInput
                                    placeholder="Search for a station..."
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    }
                                    sx={{
                                        width: 320,
                                    }}
                                />

                                {/* attribution */}
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
                                        Data supplied by
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Transport for NSW
                                    </Typography>

                                    <Box
                                        component="img"
                                        src={TFNSWLogo}
                                        alt="Transport for NSW"
                                        sx={{
                                            height: 40,
                                            width: "auto",
                                            mt: 0.5,
                                            opacity: 0.95,
                                        }}
                                    />
                                </Box>
                            </Box>

                        </Box>

                    </CardContent>
                </Card>

                <Outlet />
            </Container>
        </Box>
    );
}