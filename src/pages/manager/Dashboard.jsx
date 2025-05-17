import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import filmService from '../../services/filmService';
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
  Avatar
} from '@mui/material';
import {
  Movie as MovieIcon,
  ViewList as ViewListIcon,
  BarChart as BarChartIcon,
  GetApp as DownloadIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

// Recharts imports for mini charts
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  // Redirect if not a manager
  useEffect(() => {
    if (currentUser && !hasRole(UserType.MANAGER)) {
      navigate('/employee');
    }
  }, [currentUser, hasRole, navigate]);

  const [stats, setStats] = useState({
    totalMovies: 0,
    byCategory: {},
    byYear: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get all films to count total
        const films = await filmService.getAllFilms();
        
        // Get statistics by category and year
        const categoryStats = await filmService.getFilmCountByCategory();
        const yearStats = await filmService.getFilmCountPerYear();
        
        setStats({
          totalMovies: films.length,
          byCategory: categoryStats,
          byYear: yearStats
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

  // Format data for mini charts
  const categoryData = Object.entries(stats.byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));
    
  const yearData = Object.entries(stats.byYear)
    .sort((a, b) => b[0] - a[0])
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

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
            Manager Dashboard
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
            to="/manager/movies"
            startIcon={<MovieIcon />}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)'
              }
            }}
          >
            View Movies
          </Button>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/manager/stats"
            startIcon={<BarChartIcon />}
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)'
              }
            }}
          >
            View Statistics
          </Button>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Summary Card */}
        <Grid item xs={12} md={4}>
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
                  Movie Collection Summary
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography variant="body1" gutterBottom>
                    Total Movies: <strong>{stats.totalMovies}</strong>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Categories: <strong>{Object.keys(stats.byCategory).length}</strong>
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Years Span: <strong>
                      {Object.keys(stats.byYear).length > 0 ? 
                        `${Math.min(...Object.keys(stats.byYear).map(Number))} - ${Math.max(...Object.keys(stats.byYear).map(Number))}` : 
                        'N/A'}
                    </strong>
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    component={Link} 
                    to="/manager/movies"
                    sx={{ mb: 1 }}
                  >
                    Browse Movies
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    component={Link} 
                    to="/movies/export"
                  >
                    Export Data
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Category Statistics Card */}
        <Grid item xs={12} md={4}>
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
                  <MovieIcon />
                </Avatar>
                <Typography variant="h6">
                  Top Categories
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 200, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              
              <List dense>
                {categoryData.map((item, index) => (
                  <ListItem key={item.name} disableGutters>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: COLORS[index % COLORS.length],
                        mr: 1
                      }} 
                    />
                    <ListItemText 
                      primary={`${item.name}: ${item.value} movies`} 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/manager/stats"
                sx={{ ml: 'auto' }}
              >
                View All Statistics
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Year Statistics Card */}
        <Grid item xs={12} md={4}>
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
                <Avatar sx={{ bgcolor: theme.palette.info.main, mr: 2 }}>
                  <BarChartIcon />
                </Avatar>
                <Typography variant="h6">
                  Recent Years
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ height: 200, mb: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearData}>
                    <Bar 
                      dataKey="value" 
                      fill={theme.palette.info.main} 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              
              <List dense>
                {yearData.map((item) => (
                  <ListItem key={item.name} disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <MovieIcon fontSize="small" color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${item.name}: ${item.value} movies`} 
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/manager/stats"
                sx={{ ml: 'auto' }}
              >
                View All Statistics
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ManagerDashboard;