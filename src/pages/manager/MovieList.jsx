import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import filmService from '../../services/filmService';
import UserType from '../../utils/userTypes';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar
} from '@mui/material';
import {
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Visibility as VisibilityIcon,
  Movie as MovieIcon,
  BrokenImage as BrokenImageIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';

// Film type and category enums
import { Type, Category } from '../../utils/filmEnums';

const ManagerMovieList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentUser, hasRole } = useAuth();
  
  // Redirect if not a manager
  useEffect(() => {
    if (currentUser && !hasRole(UserType.MANAGER)) {
      navigate('/manager');
    }
  }, [currentUser, hasRole, navigate]);

  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View mode state (list or grid)
  const [viewMode, setViewMode] = useState('grid');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(viewMode === 'grid' ? 12 : 10);

  // Filtering state
  const [filters, setFilters] = useState({
    title: '',
    year: '',
    type: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Image error handling
  const [imgErrors, setImgErrors] = useState({});

  // Load films on component mount and when filters change
  useEffect(() => {
    fetchFilms();
  }, []);

  const fetchFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await filmService.getAllFilms();
      setFilms(data);
    } catch (err) {
      console.error('Error fetching films:', err);
      setError('Failed to load films. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter films based on current filters
  const filteredFilms = films.filter(film => {
    return (
      (filters.title === '' || film.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (filters.year === '' || film.year.toString() === filters.year) &&
      (filters.type === '' || film.type === filters.type) &&
      (filters.category === '' || film.category === filters.category)
    );
  });

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      title: '',
      year: '',
      type: '',
      category: ''
    });
  };

  // View mode handlers
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      // Adjust rows per page based on view mode
      setRowsPerPage(newMode === 'grid' ? 12 : 10);
      setPage(0);
    }
  };

  // Image error handler
  const handleImageError = (filmId, imageIndex) => {
    setImgErrors(prev => ({
      ...prev,
      [`${filmId}-${imageIndex}`]: true
    }));
  };

  // Get the best available image for a film
  const getBestImage = (film) => {
    if (film.image1 && !imgErrors[`${film.id}-1`]) return film.image1;
    if (film.image2 && !imgErrors[`${film.id}-2`]) return film.image2;
    if (film.image3 && !imgErrors[`${film.id}-3`]) return film.image3;
    return null;
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && films.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Movies</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/manager')}
            sx={{ mr: 1 }}
          >
            Back to Dashboard
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            onClick={() => navigate('/movies/export')}
            sx={{ mr: 1 }}
          >
            Export
          </Button>

          {/* View mode toggle */}
          <Tabs 
            value={viewMode} 
            onChange={handleViewModeChange}
            sx={{ 
              display: 'inline-flex',
              minHeight: 'auto',
              '.MuiTabs-indicator': { display: 'none' }
            }}
          >
            <Tab 
              icon={<ViewListIcon />} 
              value="list" 
              sx={{ 
                minWidth: 'auto', 
                px: 1,
                minHeight: 'auto',
                borderRadius: '4px 0 0 4px',
                border: 1,
                borderColor: 'divider',
                bgcolor: viewMode === 'list' ? 'primary.main' : 'background.paper',
                color: viewMode === 'list' ? 'primary.contrastText' : 'text.primary',
              }}
              aria-label="List view"
            />
            <Tab 
              icon={<ViewModuleIcon />} 
              value="grid" 
              sx={{ 
                minWidth: 'auto', 
                px: 1,
                minHeight: 'auto',
                borderRadius: '0 4px 4px 0',
                border: 1,
                borderColor: 'divider',
                borderLeft: 0,
                bgcolor: viewMode === 'grid' ? 'primary.main' : 'background.paper',
                color: viewMode === 'grid' ? 'primary.contrastText' : 'text.primary',
              }}
              aria-label="Grid view"
            />
          </Tabs>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchFilms}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={filters.title}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.title ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, title: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Year"
                name="year"
                type="number"
                value={filters.year}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.year ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, year: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.values(Type).map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.values(Category).map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={clearFilters} 
                  startIcon={<ClearIcon />}
                >
                  Clear Filters
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Movies display - conditional rendering based on view mode */}
      {filteredFilms.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress size={40} sx={{ my: 2 }} />
          ) : (
            <Typography variant="h6" color="text.secondary">
              No movies found
            </Typography>
          )}
        </Paper>
      ) : viewMode === 'list' ? (
        /* List View (Table) */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFilms
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((film) => (
                  <TableRow key={film.id}>
                    <TableCell>{film.id}</TableCell>
                    <TableCell>{film.title}</TableCell>
                    <TableCell>{film.year}</TableCell>
                    <TableCell>
                      {film.type && (
                        <Chip 
                          label={film.type} 
                          color={film.type === 'ARTISTIC' ? 'primary' : 'secondary'} 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {film.category && (
                        <Chip 
                          label={film.category} 
                          variant="outlined" 
                          size="small" 
                        />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          component={Link} 
                          to={`/movies/view/${film.id}`}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredFilms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      ) : (
        /* Grid View (Cards) */
        <Box>
          <Grid container spacing={3}>
            {filteredFilms
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((film) => {
                const imageUrl = getBestImage(film);

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={film.id}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6
                        }
                      }}
                    >
                      {/* Card Media (Image) */}
                      <CardMedia
                        component="img"
                        height="200"
                        image={imageUrl || ''}
                        alt={film.title}
                        onError={() => {
                          if (film.image1 && !imgErrors[`${film.id}-1`]) {
                            handleImageError(film.id, 1);
                          } else if (film.image2 && !imgErrors[`${film.id}-2`]) {
                            handleImageError(film.id, 2);
                          } else if (film.image3 && !imgErrors[`${film.id}-3`]) {
                            handleImageError(film.id, 3);
                          }
                        }}
                        sx={{
                          objectFit: 'cover',
                          bgcolor: 'action.hover'
                        }}
                      />

                      {/* Fallback if no valid image */}
                      {!imageUrl && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            height: 200, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: 'action.hover'
                          }}
                        >
                          <BrokenImageIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                        </Box>
                      )}

                      {/* Card Content */}
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom noWrap>
                          {film.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MovieIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {film.year}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          {film.type && (
                            <Chip 
                              label={film.type} 
                              color={film.type === 'ARTISTIC' ? 'primary' : 'secondary'} 
                              size="small" 
                            />
                          )}
                          {film.category && (
                            <Chip 
                              label={film.category} 
                              variant="outlined" 
                              size="small" 
                            />
                          )}
                        </Box>
                      </CardContent>

                      {/* Card Actions */}
                      <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
                        <Button 
                          size="small" 
                          component={Link} 
                          to={`/movies/view/${film.id}`}
                          startIcon={<VisibilityIcon />}
                          variant="outlined"
                          color="info"
                          fullWidth
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>

          <TablePagination
            rowsPerPageOptions={[12, 24, 36]}
            component="div"
            count={filteredFilms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default ManagerMovieList;