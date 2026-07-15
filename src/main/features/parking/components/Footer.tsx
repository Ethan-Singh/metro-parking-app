import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import { useState } from 'react';
import { tokens } from '../../../css/tokens.ts';
import LegalDialog from './LegalDialog.tsx';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [legalOpen, setLegalOpen] = useState<string | null>(null);

  const closeLegal = () => {
    setLegalOpen(null);
  };

  const getLegalTitle = () => {
    switch (legalOpen) {
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms of Service';
      case 'disclaimer':
        return 'Disclaimer';
      default:
        return '';
    }
  };

  const getLegalContent = () => {
    switch (legalOpen) {
      case 'privacy':
        return `This website does not collect or store personal information from users.

        Basic technical information may be processed by hosting providers
        and infrastructure services to keep the application running,
        improve reliability, and protect against abuse.`;

      case 'terms':
        return `A Metro Parking App is provided as a free community project.

        Parking availability information is provided for convenience only
        and should not be considered guaranteed. Users should verify
        availability before making travel decisions.

        By using this application, you acknowledge that information may
        occasionally be delayed, unavailable, or inaccurate.`;

      case 'disclaimer':
        return `A Metro Parking App is an independent project and is not
        affiliated with Transport for NSW.

        Data is sourced from publicly available Transport for NSW services
        and may occasionally contain delays, missing information, or errors.

        This application is provided without warranties or guarantees
        regarding accuracy or availability.`;

      default:
        return '';
    }
  };

  return (
    <>
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
                  This is a side project of mine (not an official app), I'll
                  periodically check on it and update if there are any issues.
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

              {/* RESOURCES */}
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
                    component="button"
                    variant="caption"
                    onClick={() => setLegalOpen('privacy')}
                    sx={{
                      color: tokens.color.primary,
                      textDecoration: 'none',
                      textAlign: 'left',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Privacy Policy
                  </Link>

                  <Link
                    component="button"
                    variant="caption"
                    onClick={() => setLegalOpen('terms')}
                    sx={{
                      color: tokens.color.primary,
                      textDecoration: 'none',
                      textAlign: 'left',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Terms of Service
                  </Link>

                  <Link
                    component="button"
                    variant="caption"
                    onClick={() => setLegalOpen('disclaimer')}
                    sx={{
                      color: tokens.color.primary,
                      textDecoration: 'none',
                      textAlign: 'left',
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
                Data fetched every 30 seconds
              </Typography>
            </Box>
          </Stack>
        </Container>
      </Box>

      <LegalDialog
        open={legalOpen !== null}
        title={getLegalTitle()}
        onClose={closeLegal}
      >
        {getLegalContent()}
      </LegalDialog>
    </>
  );
}
