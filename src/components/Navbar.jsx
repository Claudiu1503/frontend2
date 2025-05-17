import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Divider
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
  Person as PersonIcon
} from '@mui/icons-material';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

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

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo and title */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          component={Link}
          to="/"
        >
          <MovieIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Management System
        </Typography>

        {/* Navigation links based on user role */}
        {currentUser && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Dashboard link based on user role */}
            {currentUser.type === UserType.EMPLOYEE && (
              <Button color="inherit" component={Link} to="/employee">
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </Button>
            )}
            {currentUser.type === UserType.MANAGER && (
              <Button color="inherit" component={Link} to="/manager">
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </Button>
            )}
            {currentUser.type === UserType.ADMIN && (
              <Button color="inherit" component={Link} to="/employee">
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </Button>
            )}

            {/* Employee links */}
            {currentUser.type === UserType.EMPLOYEE && (
              <>
                <Button color="inherit" component={Link} to="/movies">
                  <MovieIcon sx={{ mr: 1 }} />
                  Movies
                </Button>
                <Button color="inherit" component={Link} to="/movies/new">
                  <AddIcon sx={{ mr: 1 }} />
                  Add Movie
                </Button>
                <Button color="inherit" component={Link} to="/movies/export">
                  <ExportIcon sx={{ mr: 1 }} />
                  Export
                </Button>
              </>
            )}

            {/* Manager links */}
            {currentUser.type === UserType.MANAGER && (
              <>
                <Button color="inherit" component={Link} to="/manager/movies">
                  <MovieIcon sx={{ mr: 1 }} />
                  Movies
                </Button>
                <Button color="inherit" component={Link} to="/members">
                  <PersonIcon sx={{ mr: 1 }} />
                  Members
                </Button>
                <Button color="inherit" component={Link} to="/manager/stats">
                  <BarChartIcon sx={{ mr: 1 }} />
                  Statistics
                </Button>
                <Button color="inherit" component={Link} to="/movies/export">
                  <ExportIcon sx={{ mr: 1 }} />
                  Export
                </Button>
              </>
            )}

            {/* Admin links */}
            {currentUser.type === UserType.ADMIN && (
              <>
                <Button color="inherit" component={Link} to="/movies">
                  <MovieIcon sx={{ mr: 1 }} />
                  Movies
                </Button>
                <Button color="inherit" component={Link} to="/movies/new">
                  <AddIcon sx={{ mr: 1 }} />
                  Add Movie
                </Button>
                <Button color="inherit" component={Link} to="/movies/export">
                  <ExportIcon sx={{ mr: 1 }} />
                  Export
                </Button>
                <Button color="inherit" component={Link} to="/users">
                  <PeopleIcon sx={{ mr: 1 }} />
                  Users
                </Button>
                <Button color="inherit" component={Link} to="/settings">
                  <SettingsIcon sx={{ mr: 1 }} />
                  Settings
                </Button>
              </>
            )}

            {/* User menu */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
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
            >
              <MenuItem disabled>
                <Typography variant="body2">
                  Signed in as <strong>{currentUser.username}</strong>
                </Typography>
              </MenuItem>
              <MenuItem disabled>
                <Typography variant="body2" color="textSecondary">
                  Role: {currentUser.type}
                </Typography>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}

        {/* Login button for unauthenticated users */}
        {!currentUser && (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
