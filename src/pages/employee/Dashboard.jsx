import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import filmService from '../../services/filmService';

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
  CircularProgress
} from '@mui/material';
import {
  Movie as MovieIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  BarChart as BarChartIcon,
  GetApp as DownloadIcon
} from '@mui/icons-material';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
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
      <Typography variant="h4" gutterBottom>
        Employee Dashboard
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        Welcome back, {currentUser.username}!
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Quick actions card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ViewListIcon />
                  </ListItemIcon>
                  <ListItemText primary="View all movies" />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    to="/movies"
                  >
                    View
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add new movie" />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    to="/movies/new"
                  >
                    Add
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="View statistics" />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    to="/movies/stats"
                  >
                    Stats
                  </Button>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DownloadIcon />
                  </ListItemIcon>
                  <ListItemText primary="Export movies" />
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    to="/movies/export"
                  >
                    Export
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Statistics card */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Movie Statistics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1">
                  Total Movies: <strong>{stats.totalMovies}</strong>
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                Top Categories:
              </Typography>
              <List dense>
                {Object.entries(stats.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <ListItem key={category}>
                      <ListItemIcon>
                        <MovieIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${category}: ${count} movies`} 
                      />
                    </ListItem>
                  ))}
              </List>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Recent Years:
              </Typography>
              <List dense>
                {Object.entries(stats.byYear)
                  .sort((a, b) => b[0] - a[0])
                  .slice(0, 5)
                  .map(([year, count]) => (
                    <ListItem key={year}>
                      <ListItemIcon>
                        <MovieIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={`${year}: ${count} movies`} 
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                component={Link} 
                to="/movies/stats"
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

export default EmployeeDashboard;