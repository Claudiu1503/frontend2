import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import authService from '../../services/authService';
import UserType from '../../utils/userTypes';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const UserDetails = () => {
  const { id } = useParams();
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
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await authService.getUserById(id);
        setUser(data);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${user.username}"? This action cannot be undone.`)) {
      try {
        setDeleteLoading(true);
        await authService.deleteUser(id);
        navigate('/admin/users');
      } catch (err) {
        console.error('Error deleting user:', err);
        setError('Failed to delete user. Please try again.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
          sx={{ mb: 2 }}
        >
          Back to Users
        </Button>
        <Alert severity="warning">User not found</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with navigation and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/users')}
        >
          Back to Users
        </Button>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/admin/users/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Box>
      </Box>

      {/* User details */}
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* User header */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
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
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user.username}
                </Typography>
                <Chip 
                  label={user.type} 
                  color={
                    user.type === UserType.ADMIN 
                      ? 'error' 
                      : user.type === UserType.MANAGER 
                        ? 'warning' 
                        : 'primary'
                  } 
                />
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* User details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              User Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="User ID" 
                  secondary={user.id} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Username" 
                  secondary={user.username} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="User Type" 
                  secondary={user.type} 
                />
              </ListItem>
            </List>
          </Grid>

          {/* Contact information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <List>
              <ListItem>
                <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <ListItemText 
                  primary="Email" 
                  secondary={user.email || 'Not provided'} 
                />
              </ListItem>
              <ListItem>
                <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                <ListItemText 
                  primary="Phone" 
                  secondary={user.phone || 'Not provided'} 
                />
              </ListItem>
            </List>
          </Grid>

          {/* Actions */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                component={Link}
                to={`/admin/users/edit/${id}`}
                sx={{ mr: 1 }}
              >
                Edit User
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete User
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default UserDetails;