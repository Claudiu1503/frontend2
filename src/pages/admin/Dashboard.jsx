import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import UserType from '../../utils/userTypes';

// Material UI imports
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  Dashboard as DashboardIcon,
  SupervisorAccount as AdminIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Redirect if not an admin
  useEffect(() => {
    if (currentUser && !hasRole(UserType.ADMIN)) {
      navigate('/login');
    }
  }, [currentUser, hasRole, navigate]);

  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    managerUsers: 0,
    employeeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all users to calculate stats
        const users = await authService.getAllUsers();
        
        // Calculate stats
        const adminUsers = users.filter(user => user.type === UserType.ADMIN).length;
        const managerUsers = users.filter(user => user.type === UserType.MANAGER).length;
        const employeeUsers = users.filter(user => user.type === UserType.EMPLOYEE).length;
        
        setStats({
          totalUsers: users.length,
          adminUsers,
          managerUsers,
          employeeUsers
        });
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isDesktop ? 'row' : 'column',
        justifyContent: 'space-between', 
        alignItems: isDesktop ? 'center' : 'flex-start',
        mb: 3 
      }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Welcome back, {currentUser.username}!
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2,
          mt: isDesktop ? 0 : 2,
          mb: isDesktop ? 0 : 2
        }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/users"
            startIcon={<PeopleIcon />}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)'
              }
            }}
          >
            Manage Users
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/admin/users/new"
            startIcon={<PersonAddIcon />}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)'
              }
            }}
          >
            Add New User
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 2 }}>
                  <DashboardIcon />
                </Avatar>
                <Typography variant="h6">
                  User Management Summary
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Total Users: <strong>{stats.totalUsers}</strong>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Admin Users: <strong>{stats.adminUsers}</strong>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Manager Users: <strong>{stats.managerUsers}</strong>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Employee Users: <strong>{stats.employeeUsers}</strong>
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    component={Link} 
                    to="/admin/users"
                    sx={{ mb: 1 }}
                  >
                    View All Users
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    component={Link} 
                    to="/admin/users/new"
                  >
                    Add New User
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Quick Actions Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            height: '100%',
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 6
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Typography variant="h6">
                  Quick Actions
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem button component={Link} to="/admin/users" sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                  <ListItemIcon>
                    <PeopleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="View All Users" />
                </ListItem>
                
                <ListItem button component={Link} to="/admin/users/new" sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                  <ListItemIcon>
                    <PersonAddIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText primary="Add New User" />
                </ListItem>
                
                <ListItem button sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                  <ListItemIcon>
                    <AdminIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Filter Admin Users" />
                  <Chip 
                    label={stats.adminUsers} 
                    color="error" 
                    size="small" 
                  />
                </ListItem>
                
                <ListItem button sx={{ borderRadius: 1, mb: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                  <ListItemIcon>
                    <BusinessIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary="Filter Manager Users" />
                  <Chip 
                    label={stats.managerUsers} 
                    color="warning" 
                    size="small" 
                  />
                </ListItem>
                
                <ListItem button sx={{ borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                  <ListItemIcon>
                    <PersonIcon color="info" />
                  </ListItemIcon>
                  <ListItemText primary="Filter Employee Users" />
                  <Chip 
                    label={stats.employeeUsers} 
                    color="primary" 
                    size="small" 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;