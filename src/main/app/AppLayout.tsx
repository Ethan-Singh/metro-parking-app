import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { SearchBar } from '../features/parking/search/SearchBar.tsx';
import Footer from '../features/parking/components/Footer.tsx';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* HEADER */}
      <Box sx={{ flex: 0 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: 3,
                }}
              >
                {/* LEFT: BRAND */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    component="img"
                    src={Logo}
                    alt="Logo"
                    sx={{
                      width: 44,
                      height: 44,
                      display: 'block',
                    }}
                  />

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      A Metro Parking App
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Live and historical availability across Sydney's Park&Ride
                      car parks
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* SEARCH */}
              <Box sx={{ mt: 2 }}>
                <SearchBar />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
}
