import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container, Grid, useTheme, useMediaQuery, Paper, Fade } from '@mui/material';

// Layout component that wraps all pages with a consistent structure
const Layout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default
      }}
    >
      {/* Navigation bar */}
      <Navbar />

      {/* Main content */}
      <Box 
        component="main" 
        className="animate-fade-in"
        sx={{ 
          flexGrow: 1, 
          transition: 'all var(--animation-duration) var(--animation-timing)'
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <Fade in={true} timeout={500}>
            <Box>
              <Outlet />
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center' }}>
            <p>© {new Date().getFullYear()} Movie Management System</p>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
