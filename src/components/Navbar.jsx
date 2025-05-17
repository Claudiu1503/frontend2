import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserType from '../utils/userTypes';

// Material UI imports
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Container,
  Tooltip,
  Fade,
  Chip
} from '@mui/material';
import {
  AccountCircle,
  Movie as MovieIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  GetApp as ExportIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  TheaterComedy as CastIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get current active path
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  const handleProfile = () => {
    // Navigate to profile page (to be implemented)
    handleClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    if (!currentUser) return '/login';

    switch (currentUser.type) {
      case UserType.EMPLOYEE:
        return '/employee';
      case UserType.MANAGER:
        return '/manager';
      case UserType.ADMIN:
        return '/admin'; // Admin has its own dashboard
      default:
        return '/login';
    }
  };

  // Navigation items based on user role
  const getNavItems = () => {
    if (!currentUser) return [];

    const dashboardPath = getDashboardPath();

    const commonItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: dashboardPath,
        active: isActive(dashboardPath)
      }
    ];

    switch (currentUser.type) {
      case UserType.EMPLOYEE:
        return [
          ...commonItems,
          {
            text: 'Movies',
            icon: <MovieIcon />,
            path: '/movies',
            active: isActive('/movies')
          },
          {
            text: 'Add Movie',
            icon: <AddIcon />,
            path: '/movies/new',
            active: isActive('/movies/new')
          },
          {
            text: 'Casts',
            icon: <CastIcon />,
            path: '/casts',
            active: isActive('/casts')
          },
          {
            text: 'Export',
            icon: <ExportIcon />,
            path: '/movies/export',
            active: isActive('/movies/export')
          }
        ];
      case UserType.MANAGER:
        return [
          ...commonItems,
          {
            text: 'Movies',
            icon: <MovieIcon />,
            path: '/manager/movies',
            active: isActive('/manager/movies')
          },
          {
            text: 'Members',
            icon: <PersonIcon />,
            path: '/members',
            active: isActive('/members')
          },
          {
            text: 'Casts',
            icon: <CastIcon />,
            path: '/casts',
            active: isActive('/casts')
          },
          {
            text: 'Statistics',
            icon: <BarChartIcon />,
            path: '/manager/stats',
            active: isActive('/manager/stats')
          },
          {
            text: 'Export',
            icon: <ExportIcon />,
            path: '/movies/export',
            active: isActive('/movies/export')
          }
        ];
      case UserType.ADMIN:
        return [
          ...commonItems,
          {
            text: 'Users',
            icon: <PeopleIcon />,
            path: '/admin/users',
            active: isActive('/admin/users')
          },
          {
            text: 'Add User',
            icon: <AddIcon />,
            path: '/admin/users/new',
            active: isActive('/admin/users/new')
          }
        ];
      default:
        return commonItems;
    }
  };

  // Drawer content
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: 2,
          bgcolor: theme.palette.primary.main,
          color: 'white'
        }}
      >
        <Typography variant="h6" noWrap component="div">
          Menu
        </Typography>
        <IconButton color="inherit" onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {getNavItems().map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              bgcolor: item.active ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              borderLeft: item.active ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.08)',
                borderLeft: `4px solid ${theme.palette.primary.light}`
              }
            }}
          >
            <ListItemIcon sx={{ color: item.active ? theme.palette.primary.main : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={4}
        sx={{ 
          bgcolor: theme.palette.primary.main,
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile menu button */}
            {currentUser && !isDesktop && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo and title */}
            <IconButton
              size="large"
              edge={!currentUser || isDesktop ? "start" : false}
              color="inherit"
              aria-label="menu"
              sx={{ 
                mr: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
              component={Link}
              to="/"
            >
              <MovieIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 'bold',
                letterSpacing: '0.5px'
              }}
            >
              Movie Management System
            </Typography>

            {/* Desktop navigation links */}
            {currentUser && isDesktop && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getNavItems().map((item) => (
                  <Button 
                    key={item.text}
                    color="inherit" 
                    component={Link} 
                    to={item.path}
                    sx={{ 
                      mx: 0.5,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      bgcolor: item.active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.25)'
                      },
                      '&::after': item.active ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '25%',
                        width: '50%',
                        height: '3px',
                        bgcolor: 'white',
                        borderRadius: '3px 3px 0 0'
                      } : {}
                    }}
                  >
                    {item.icon}
                    <Box component="span" sx={{ ml: 1 }}>
                      {item.text}
                    </Box>
                  </Button>
                ))}
              </Box>
            )}

            {/* User menu */}
            {currentUser && (
              <Box sx={{ ml: 2 }}>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleMenu}
                    size="small"
                    sx={{ 
                      ml: 2,
                      border: '2px solid white',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.2)'
                      }
                    }}
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: 'primary.dark',
                        color: 'white'
                      }}
                    >
                      {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {currentUser.username}
                    </Typography>
                    <Chip 
                      label={currentUser.type} 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <AccountCircle fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            )}

            {/* Login button for unauthenticated users */}
            {!currentUser && (
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                variant="outlined"
                sx={{ 
                  borderColor: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }}
              >
                Login
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile drawer */}
      {currentUser && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      )}
    </>
  );
};

export default Navbar;
