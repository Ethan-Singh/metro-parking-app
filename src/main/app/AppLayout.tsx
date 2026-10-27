import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { SearchBar } from '../features/parking/search/SearchBar.tsx';
import Footer from '../features/parking/components/Footer.tsx';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: 'fixed',
          top: 1,
          left: 1,
          zIndex: 'tooltip',
          px: 2,
          py: 1,
          color: 'primary.contrastText',
          bgcolor: 'primary.dark',
          borderRadius: 1,
          transform: 'translateY(-150%)',
          '&:focus-visible': {
            transform: 'translateY(0)',
            outline: '3px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        Skip to main content
      </Box>
      {/* HEADER */}
      <Box component="header" sx={{ flex: 0 }}>
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
                <Box
                  component={RouterLink}
                  to="/"
                  aria-label="A Metro Parking App home"
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    color: 'inherit',
                    textDecoration: 'none',
                    borderRadius: 1,
                    '&:focus-visible': {
                      outline: '3px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 3,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={Logo}
                    alt=""
                    sx={{
                      width: 44,
                      height: 44,
                      display: 'block',
                    }}
                  />

                  <Box>
                    <Typography
                      component="span"
                      variant="h5"
                      sx={{ fontWeight: 700 }}
                    >
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
              <Box
                component="div"
                role="search"
                aria-label="Find a parking facility"
                sx={{ mt: 2 }}
              >
                <SearchBar />
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          flex: 1,
          '&:focus': {
            outline: '1px solid',
            outlineColor: 'rgba(0, 132, 209, 0.12)',
            outlineOffset: 0,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Outlet />
        </Container>
      </Box>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
}
