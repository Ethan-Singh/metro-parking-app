import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Logo from '../assets/Logo.svg';
import { AppModeSwitch } from './AppModeSwitch.tsx';
import { SearchBar } from '../features/parking/search/SearchBar.tsx';
import Footer from '../features/parking/components/Footer.tsx';

export default function AppLayout() {
  const location = useLocation();
  const isTimetable = location.pathname.startsWith('/timetable');
  const isFacilityPage = location.pathname.startsWith('/facility');
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
        <Container maxWidth="lg" sx={{ py: { xs: 1, sm: 2, md: 4 } }}>
          <Card sx={{ mb: { xs: 1.5, sm: 3 } }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                }}
              >
                <Box
                  aria-label="A Metro Parking App"
                  sx={{
                    display: 'flex',
                    gap: { xs: 1, sm: 2 },
                    minWidth: 0,
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
                      flexShrink: 0,
                      width: { xs: 36, sm: 44 },
                      height: { xs: 36, sm: 44 },
                      display: 'block',
                    }}
                  />

                  <Box>
                    <Typography
                      component="span"
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1rem', sm: '1.5rem' },
                        lineHeight: 1.2,
                      }}
                    >
                      A Metro Parking App
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                      Live parking and Sydney public transport timetables
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: { xs: 1.5, sm: 2 } }}
              >
                {isTimetable ? 'Timetable planner' : 'Parking availability'}
              </Typography>

              {isFacilityPage && (
                <Box
                  role="search"
                  aria-label="Search parking facilities"
                  sx={{ mt: 2 }}
                >
                  <SearchBar />
                </Box>
              )}

              <Box sx={{ mt: 2 }}>
                <AppModeSwitch />
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
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Container>
      </Box>

      {/* FOOTER */}
      <Footer />
    </Box>
  );
}
