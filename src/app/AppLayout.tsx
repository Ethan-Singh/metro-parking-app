import {
    Box,
    Card,
    CardContent,
    Container,
    Typography,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { LocalParking } from "@mui/icons-material";
import TFNSWLogo from "../../public/assets/TFNSW.png";
import { FacilitySearchBar } from "../features/parking/components/FacilitySearchBar";
import { useSearch } from "../features/parking/search/SearchContext";

export default function AppLayout() {
    const { query, setQuery } = useSearch();

    return (
        <Box sx={{ minHeight: "100vh" }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>

                <Card sx={{ mb: 3 }}>
                    <CardContent>

                        {/* TOP ROW */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 3,
                                flexWrap: "wrap",
                            }}
                        >
                            {/* BRAND */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

                                <Box>
                                    <Typography variant="h4">
                                        Sydney Park & Ride
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary">
                                        Live parking availability across NSW
                                    </Typography>
                                </Box>
                            </Box>

                            {/* LOGO */}
                            <Box
                                component="img"
                                src={TFNSWLogo}
                                alt="Transport for NSW"
                                sx={{ height: 40, opacity: 0.95 }}
                            />
                        </Box>

                        {/* SEARCH */}
                        <Box sx={{ mt: 2 }}>
                            <FacilitySearchBar
                                value={query}
                                onChange={setQuery}
                            />
                        </Box>

                    </CardContent>
                </Card>

                {/* NO CONTEXT PASSED, NO FILTERING HERE */}
                <Outlet />

            </Container>
        </Box>
    );
}
