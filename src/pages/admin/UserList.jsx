import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
  Card,
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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const UserList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentUser, hasRole } = useAuth();
  
  // Redirect if not an admin
  useEffect(() => {
    if (currentUser && !hasRole(UserType.ADMIN)) {
      navigate('/admin');
    }
  }, [currentUser, hasRole, navigate]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View mode state (list or grid)
  const [viewMode, setViewMode] = useState('list');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filtering state
  const [filters, setFilters] = useState({
    username: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on current filters
  const filteredUsers = users.filter(user => {
    return (
      (filters.username === '' || user.username.toLowerCase().includes(filters.username.toLowerCase())) &&
      (filters.type === '' || user.type === filters.type)
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
      username: '',
      type: ''
    });
  };

  // View mode handlers
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
      setPage(0);
    }
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
  const openDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      await authService.deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      closeDeleteDialog();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/admin/users/new"
            sx={{ mr: 1 }}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ mr: 1 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
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
            <Button color="inherit" size="small" onClick={fetchUsers}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.username ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, username: '' }))}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Type"
                >
                  <MenuItem value="">All</MenuItem>
                  {Object.values(UserType).map(type => (
                    <MenuItem key={type} value={type} sx={{ width: '100%', whiteSpace: 'normal' }}>{type}</MenuItem>
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

      {/* Users display - conditional rendering based on view mode */}
      {filteredUsers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress size={40} sx={{ my: 2 }} />
          ) : (
            <Typography variant="h6" color="text.secondary">
              No users found
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
                <TableCell>Username</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.type} 
                        color={
                          user.type === UserType.ADMIN 
                            ? 'error' 
                            : user.type === UserType.MANAGER 
                              ? 'warning' 
                              : 'primary'
                        } 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          component={Link} 
                          to={`/admin/users/view/${user.id}`}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          component={Link} 
                          to={`/admin/users/edit/${user.id}`}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          onClick={() => openDeleteDialog(user)}
                        >
                          <DeleteIcon />
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
            count={filteredUsers.length}
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
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
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
                    {/* Card Content */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 
                              user.type === UserType.ADMIN 
                                ? theme.palette.error.main 
                                : user.type === UserType.MANAGER 
                                  ? theme.palette.warning.main 
                                  : theme.palette.primary.main,
                            mr: 2
                          }}
                        >
                          {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <Typography variant="h6" component="div" noWrap>
                          {user.username}
                        </Typography>
                      </Box>

                      <Chip 
                        label={user.type} 
                        color={
                          user.type === UserType.ADMIN 
                            ? 'error' 
                            : user.type === UserType.MANAGER 
                              ? 'warning' 
                              : 'primary'
                        } 
                        size="small" 
                        sx={{ mb: 2 }}
                      />

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ID: {user.id}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email: {user.email || 'N/A'}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Phone: {user.phone || 'N/A'}
                      </Typography>
                    </CardContent>

                    {/* Card Actions */}
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button 
                        size="small" 
                        component={Link} 
                        to={`/admin/users/view/${user.id}`}
                        startIcon={<VisibilityIcon />}
                      >
                        View
                      </Button>
                      <Box>
                        <IconButton 
                          size="small"
                          component={Link} 
                          to={`/admin/users/edit/${user.id}`}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error" 
                          onClick={() => openDeleteDialog(user)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>

          <TablePagination
            rowsPerPageOptions={[12, 24, 36]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{userToDelete?.username}"? This action cannot be undone.
          </DialogContentText>
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
    </Box>
  );
};

export default UserList;