import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import memberService from '../../services/memberService';
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
  useMediaQuery
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const MemberDetails = () => {
  const { id } = useParams();
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
  
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Fetch member data
  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        const data = await memberService.getMemberById(id);
        setMember(data);
      } catch (err) {
        console.error('Error fetching member:', err);
        setError('Failed to load member details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${member.name}"? This action cannot be undone.`)) {
      try {
        await memberService.deleteMember(id);
        navigate('/members');
      } catch (err) {
        console.error('Error deleting member:', err);
        setError('Failed to delete member. Please try again.');
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
          onClick={() => navigate('/members')}
          sx={{ mb: 2 }}
        >
          Back to Members
        </Button>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!member) {
    return (
      <Box>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/members')}
          sx={{ mb: 2 }}
        >
          Back to Members
        </Button>
        <Alert severity="warning">Member not found</Alert>
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
          onClick={() => navigate('/members')}
        >
          Back to Members
        </Button>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/members/edit/${id}`}
            sx={{ mr: 1 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* Member details */}
      <Grid container spacing={4}>
        {/* Left column - Image */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box 
              sx={{ 
                width: '100%', 
                height: 400, 
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'action.hover'
              }}
            >
              {member.image && !imageError ? (
                <Box
                  component="img"
                  src={member.image}
                  alt={member.name}
                  onError={handleImageError}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center'
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No image available
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right column - Details */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {member.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={member.type} 
                color="primary" 
                sx={{ mr: 2 }}
              />
              <Typography variant="body1" color="text.secondary">
                ID: {member.id}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Birthday
                </Typography>
                <Typography variant="body1">
                  {formatDate(member.birthday)}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Associated Movies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This feature will be implemented in a future update.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDetails;