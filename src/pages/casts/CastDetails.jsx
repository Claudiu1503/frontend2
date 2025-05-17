import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import castService from '../../services/castService';
import UserType from '../../utils/userTypes';

// Material UI imports
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Movie as MovieIcon,
  Person as PersonIcon,
  TheaterComedy as RoleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const CastDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { currentUser, hasRole } = useAuth();
  
  // Check if user is employee (can perform CRUD operations)
  const isEmployee = hasRole(UserType.EMPLOYEE);
  
  const [cast, setCast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch cast data
  useEffect(() => {
    const fetchCast = async () => {
      try {
        setLoading(true);
        const data = await castService.getCastById(id);
        setCast(data);
      } catch (err) {
        console.error('Error fetching cast:', err);
        setError('Failed to load cast details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCast();
  }, [id]);

  // Handle delete
  const handleDelete = async () => {
    if (!isEmployee) return;
    
    if (window.confirm('Are you sure you want to delete this cast entry? This action cannot be undone.')) {
      try {
        setDeleteLoading(true);
        await castService.deleteCast(id);
        navigate('/casts');
      } catch (err) {
        console.error('Error deleting cast:', err);
        setError('Failed to delete cast. Please try again.');
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
          onClick={() => navigate('/casts')}
          sx={{ mb: 2 }}
        >
          Back to Casts
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!cast) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/casts')}
          sx={{ mb: 2 }}
        >
          Back to Casts
        </Button>
        <Alert severity="warning">Cast not found</Alert>
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
          onClick={() => navigate('/casts')}
        >
          Back to Casts
        </Button>
        <Box>
          {isEmployee && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                component={Link}
                to={`/casts/edit/${id}`}
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
            </>
          )}
        </Box>
      </Box>

      {/* Cast details */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Cast Details
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <InfoIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Cast ID" 
                  secondary={cast.id} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <MovieIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Film ID" 
                  secondary={cast.filmId} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PersonIcon color="secondary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Actor ID" 
                  secondary={cast.actorId} 
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <RoleIcon color="info" />
                </ListItemIcon>
                <ListItemText 
                  primary="Role" 
                  secondary={cast.role || 'Not specified'} 
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Related Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                This cast entry connects Film ID {cast.filmId} with Actor ID {cast.actorId}
                {cast.role ? ` for the role of "${cast.role}"` : ''}.
              </Typography>
              
              <Typography variant="body2">
                To view the film details, navigate to the Movies section and search for Film ID {cast.filmId}.
              </Typography>
              
              <Typography variant="body2">
                To view the actor details, navigate to the Members section and search for Actor ID {cast.actorId}.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Actions */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/casts')}
            sx={{ mr: 1 }}
          >
            Back to Casts
          </Button>
          
          {isEmployee && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                component={Link}
                to={`/casts/edit/${id}`}
                sx={{ mr: 1 }}
              >
                Edit Cast
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete Cast
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CastDetails;