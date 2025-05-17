import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
import MemberType from '../../utils/memberTypes';
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
  Person as PersonIcon,
  BrokenImage as BrokenImageIcon
} from '@mui/icons-material';

const MemberList = () => {
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

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View mode state (list or grid)
  const [viewMode, setViewMode] = useState('grid');

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(viewMode === 'grid' ? 12 : 10);

  // Filtering state
  const [filters, setFilters] = useState({
    name: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Image error handling
  const [imgErrors, setImgErrors] = useState({});

  // Load members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on current filters
  const filteredMembers = members.filter(member => {
    return (
      (filters.name === '' || member.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.type === '' || member.type === filters.type)
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
      name: '',
      type: ''
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
  const handleImageError = (memberId) => {
    setImgErrors(prev => ({
      ...prev,
      [memberId]: true
    }));
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
  const openDeleteDialog = (member) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      setDeleteLoading(true);
      await memberService.deleteMember(memberToDelete.id);
      setMembers(members.filter(member => member.id !== memberToDelete.id));
      closeDeleteDialog();
    } catch (err) {
      console.error('Error deleting member:', err);
      setError('Failed to delete member. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading && members.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Members</Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/members/new"
            sx={{ mr: 1 }}
          >
            Add Member
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
            <Button color="inherit" size="small" onClick={fetchMembers}>
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
                label="Name"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                InputProps={{
                  endAdornment: filters.name ? (
                    <IconButton size="small" onClick={() => setFilters(prev => ({ ...prev, name: '' }))}>
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
                  {Object.values(MemberType).map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
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

      {/* Members display - conditional rendering based on view mode */}
      {filteredMembers.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          {loading ? (
            <CircularProgress size={40} sx={{ my: 2 }} />
          ) : (
            <Typography variant="h6" color="text.secondary">
              No members found
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
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Birthday</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Chip 
                        label={member.type} 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>{formatDate(member.birthday)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Details">
                        <IconButton 
                          component={Link} 
                          to={`/members/view/${member.id}`}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton 
                          component={Link} 
                          to={`/members/edit/${member.id}`}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          color="error" 
                          onClick={() => openDeleteDialog(member)}
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
            count={filteredMembers.length}
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
            {filteredMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={member.id}>
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
                      image={member.image || ''}
                      alt={member.name}
                      onError={() => handleImageError(member.id)}
                      sx={{
                        objectFit: 'cover',
                        bgcolor: 'action.hover'
                      }}
                    />

                    {/* Fallback if no valid image */}
                    {(!member.image || imgErrors[member.id]) && (
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
                        <PersonIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                      </Box>
                    )}

                    {/* Card Content */}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom noWrap>
                        {member.name}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Chip 
                          label={member.type} 
                          color="primary" 
                          size="small" 
                          sx={{ mr: 1 }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary">
                        ID: {member.id}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Birthday: {formatDate(member.birthday)}
                      </Typography>
                    </CardContent>

                    {/* Card Actions */}
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button 
                        size="small" 
                        component={Link} 
                        to={`/members/view/${member.id}`}
                        startIcon={<VisibilityIcon />}
                      >
                        View
                      </Button>
                      <Box>
                        <IconButton 
                          size="small"
                          component={Link} 
                          to={`/members/edit/${member.id}`}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          size="small"
                          color="error" 
                          onClick={() => openDeleteDialog(member)}
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
            count={filteredMembers.length}
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
            Are you sure you want to delete the member "{memberToDelete?.name}"? This action cannot be undone.
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

export default MemberList;