import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import castService from '../../services/castService';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as VisibilityIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  TheaterComedy as RoleIcon
} from '@mui/icons-material';

const CastList = () => {
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth();
  
  // State for casts data
  const [casts, setCasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filtering state
  const [filters, setFilters] = useState({
    filmId: '',
    actorId: '',
    role: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [castToDelete, setCastToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Check if user is employee (can perform CRUD operations)
  const isEmployee = hasRole(UserType.EMPLOYEE);

  // Load casts on component mount
  useEffect(() => {
    fetchCasts();
  }, []);

  const fetchCasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await castService.getAllCasts();
      setCasts(data);
    } catch (err) {
      console.error('Error fetching casts:', err);
      setError('Failed to load casts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter casts based on current filters
  const filteredCasts = casts.filter(cast => {
    return (
      (filters.filmId === '' || cast.filmId.toString() === filters.filmId) &&
      (filters.actorId === '' || cast.actorId.toString() === filters.actorId) &&
      (filters.role === '' || (cast.role && cast.role.toLowerCase().includes(filters.role.toLowerCase())))
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
      filmId: '',
      actorId: '',
      role: ''
    });
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Delete handlers
  const openDeleteDialog = (cast) => {
    setCastToDelete(cast);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCastToDelete(null);
  };

  const confirmDelete = async () => {
    if (!castToDelete) return;

    try {
      setDeleteLoading(true);
      await castService.deleteCast(castToDelete.id);
      setCasts(casts.filter(cast => cast.id !== castToDelete.id));
      closeDeleteDialog();
    } catch (err) {
      console.error('Error deleting cast:', err);
      setError('Failed to delete cast. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && casts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Cast Members</Typography>
        <Box>
          {isEmployee && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/casts/new"
              sx={{ mr: 1 }}
            >
              Add Cast
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchCasts}>
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
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Film ID"
                name="filmId"
                type="number"
                value={filters.filmId}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.filmId ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, filmId: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Actor ID"
                name="actorId"
                type="number"
                value={filters.actorId}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.actorId ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, actorId: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.role ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, role: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
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

      {/* Casts Table */}
      {filteredCasts.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress size={40} sx={{ my: 2 }} />
          ) : (
            <Typography variant="h6" color="text.secondary">
              No cast members found
            </Typography>
          )}
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Film ID</TableCell>
                <TableCell>Actor ID</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCasts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((cast) => (
                  <TableRow key={cast.id}>
                    <TableCell>{cast.id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MovieIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        {cast.filmId}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 1, color: 'secondary.main' }} />
                        {cast.actorId}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <RoleIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                        {cast.role || 'N/A'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          component={Link} 
                          to={`/casts/view/${cast.id}`}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      {isEmployee && (
                        <>
                          <Tooltip title="Edit">
                            <IconButton 
                              component={Link} 
                              to={`/casts/edit/${cast.id}`}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              color="error" 
                              onClick={() => openDeleteDialog(cast)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCasts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* Delete confirmation dialog */}
      {isEmployee && (
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this cast entry? This action cannot be undone.
            </DialogContentText>
            {castToDelete && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Details:</Typography>
                <Typography variant="body2">Film ID: {castToDelete.filmId}</Typography>
                <Typography variant="body2">Actor ID: {castToDelete.actorId}</Typography>
                <Typography variant="body2">Role: {castToDelete.role || 'N/A'}</Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete} 
              color="error" 
              disabled={deleteLoading}
              startIcon={deleteLoading ? <CircularProgress size={20} /> : null}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CastList;