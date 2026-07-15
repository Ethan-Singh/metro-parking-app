import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import { tokens } from '../../../css/tokens.ts';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        pt: 4,
        pb: 3,
        borderTop: `1px solid ${tokens.color.border}`,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* LINKS & INFO */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '1fr 1fr 1fr',
              },
              gap: 3,
            }}
          >
            {/* ABOUT */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                About
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Live and historical availability across Sydney's Park&Ride car
                parks.
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                This is a side project of mine, I'll periodically check on it
                and update if there are any issues.
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mb: 0.5 }}
              >
                Thanks for visiting! Feel free to share; the more people it
                helps, the better. I'm paying to host this, lols.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Data powered by Transport for NSW.
              </Typography>
            </Box>

            {/* QUICK LINKS */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Resources
              </Typography>
              <Stack spacing={0.5}>
                <Link
                  href="https://www.transport.nsw.gov.au/"
                  target="_blank"
                  rel="noopener"
                  variant="caption"
                  sx={{
                    color: tokens.color.primary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Transport NSW
                </Link>
              </Stack>
            </Box>

            {/* LEGAL */}
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Legal
              </Typography>
              <Stack spacing={0.5}>
                <Link
                  href="#"
                  variant="caption"
                  sx={{
                    color: tokens.color.primary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  variant="caption"
                  sx={{
                    color: tokens.color.primary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  variant="caption"
                  sx={{
                    color: tokens.color.primary,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Disclaimer
                </Link>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ borderColor: tokens.color.border }} />

          {/* BOTTOM */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © {currentYear} A Metro Parking App. All rights reserved.
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Data updates every 30 seconds
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
