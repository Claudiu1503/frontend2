import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import filmService from '../../services/filmService';
import UserType from '../../utils/userTypes';

// Recharts imports
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Movie as MovieIcon
} from '@mui/icons-material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

const MovieStats = () => {
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
  const [chartType, setChartType] = useState('bar');

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

  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  // Format data for charts
  const categoryData = Object.entries(stats.byCategory).map(([name, value]) => ({ name, value }));
  const yearData = Object.entries(stats.byYear)
    .sort((a, b) => a[0] - b[0]) // Sort by year ascending
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Movie Statistics</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Total Movies: <strong>{stats.totalMovies}</strong>
          </Typography>
          
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            aria-label="chart type"
          >
            <ToggleButton value="bar" aria-label="bar chart">
              <BarChartIcon sx={{ mr: 1 }} />
              Bar Chart
            </ToggleButton>
            <ToggleButton value="pie" aria-label="pie chart">
              <PieChartIcon sx={{ mr: 1 }} />
              Pie Chart
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          {/* Category Statistics */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Movies by Category
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart
                        data={categoryData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          angle={-45} 
                          textAnchor="end" 
                          height={70}
                          interval={0}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} movies`, 'Count']}
                          labelFormatter={(label) => `Category: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Movies" 
                          fill={theme.palette.primary.main}
                          animationDuration={1500}
                        />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          animationDuration={1500}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} movies`, 'Count']}
                          labelFormatter={(label) => `Category: ${label}`}
                        />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Year Statistics */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Movies by Year
                </Typography>
                <Box sx={{ height: 400, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart
                        data={yearData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} movies`, 'Count']}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                        <Bar 
                          dataKey="value" 
                          name="Movies" 
                          fill={theme.palette.secondary.main}
                          animationDuration={1500}
                        />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie
                          data={yearData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          animationDuration={1500}
                        >
                          {yearData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} movies`, 'Count']}
                          labelFormatter={(label) => `Year: ${label}`}
                        />
                        <Legend />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MovieStats;