import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, Container, Paper, useTheme, useMediaQuery } from '@mui/material';

// Layout component that wraps all pages with a consistent structure
const Layout = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Navigation bar */}
      <Navbar />

      {/* Main content */}
      <Container 
        component="main" 
        maxWidth={isDesktop ? "xl" : "lg"}
        sx={{ 
          flexGrow: 1, 
          py: 3,
          px: isDesktop ? 4 : 2
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: isDesktop ? 4 : 3,
            borderRadius: 2,
            boxShadow: isDesktop ? '0 8px 24px rgba(0, 0, 0, 0.12)' : 3
          }}
        >
          <Outlet />
        </Paper>
      </Container>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: 'background.paper', 
          mt: 'auto',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth={isDesktop ? "xl" : "lg"}>
          <Box sx={{ textAlign: 'center' }}>
            <p>© {new Date().getFullYear()} Movie Management System</p>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
